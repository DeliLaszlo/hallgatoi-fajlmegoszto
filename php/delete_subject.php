<?php
/**
 * Tárgy törlése/leadása API
 * 
 * Normál módban: A felhasználó leadja a tárgyat (eltávolítja a saját listájáról).
 * Admin módban: Teljesen törli a tárgyat a rendszerből minden kapcsolódó adattal.
 * 
 * Metódus: POST
 * Paraméterek:
 *   - class_code (string): Tárgy kódja
 *   - admin_mode (bool, opcionális): Admin mód (teljes törlés)
 * Válasz: JSON {success: bool, error?: string}
 * Szükséges: Bejelentkezés, Admin jogosultság (admin módhoz)
 */
session_start();
header('Content-Type: application/json');

// Ellenőrizzük, hogy be van-e jelentkezve
if (!isset($_SESSION['user_neptun'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Nincs bejelentkezve!'
    ]);
    exit();
}

// Csak POST kérést fogadunk el
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'error' => 'Hibás kérés!'
    ]);
    exit();
}

// JSON input beolvasása
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Ellenőrizzük, hogy megkaptuk-e a class_code-ot
if (!isset($data['class_code']) || empty($data['class_code'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Hiányzó tárgy kód!'
    ]);
    exit();
}

$class_code = $data['class_code'];
$neptun = $_SESSION['user_neptun'];
$isAdmin = isset($_SESSION['isAdmin']) && $_SESSION['isAdmin'] === true;
$adminMode = isset($data['admin_mode']) && $data['admin_mode'] === true;

// Ha admin módban akarunk törölni, ellenőrizzük az admin jogosultságot
if ($adminMode && !$isAdmin) {
    echo json_encode([
        'success' => false,
        'error' => 'Nincs admin jogosultság!'
    ]);
    exit();
}

try {
    require_once __DIR__ . '/../config.php';
    $pdo = getPdoConnection();
    
    // Admin módban a tárgyat magát töröljük (teljes törlés)
    if ($adminMode && $isAdmin) {
        // Ellenőrizzük, hogy létezik-e a tárgy
        $checkStmt = $pdo->prepare("SELECT class_code FROM class WHERE class_code = :class_code");
        $checkStmt->execute([':class_code' => $class_code]);
        
        if (!$checkStmt->fetch()) {
            echo json_encode([
                'success' => false,
                'error' => 'A tárgy nem létezik!'
            ]);
            exit();
        }
        
        // Tranzakció indítása
        $pdo->beginTransaction();
        
        // 1. Töröljük a tárgyhoz tartozó feltöltések jelentéseit
        $deleteUploadReportsStmt = $pdo->prepare("
            DELETE FROM report 
            WHERE reported_table = 'upload' AND reported_id IN (
                SELECT up_id FROM upload WHERE class_code = :class_code
            )
        ");
        $deleteUploadReportsStmt->execute([':class_code' => $class_code]);
        
        // 2. Töröljük a tárgyhoz tartozó kérelmek jelentéseit
        $deleteRequestReportsStmt = $pdo->prepare("
            DELETE FROM report 
            WHERE reported_table = 'request' AND reported_id IN (
                SELECT request_id FROM request WHERE class_code = :class_code
            )
        ");
        $deleteRequestReportsStmt->execute([':class_code' => $class_code]);
        
        // 3. Töröljük a tárgyhoz tartozó chatszobák jelentéseit
        $deleteChatroomReportsStmt = $pdo->prepare("
            DELETE FROM report 
            WHERE reported_table = 'chatroom' AND reported_id IN (
                SELECT room_id FROM chatroom WHERE class_code = :class_code
            )
        ");
        $deleteChatroomReportsStmt->execute([':class_code' => $class_code]);
        
        // 4. Töröljük a tárgyhoz tartozó feltöltések szavazatait
        $deleteVotesStmt = $pdo->prepare("
            DELETE FROM user_votes 
            WHERE upload_id IN (
                SELECT up_id FROM upload WHERE class_code = :class_code
            )
        ");
        $deleteVotesStmt->execute([':class_code' => $class_code]);
        
        // 5. Töröljük a tárgyhoz tartozó upload_request rekordokat (feltöltések oldaláról)
        $deleteUploadRequestsByUploadStmt = $pdo->prepare("
            DELETE FROM upload_request 
            WHERE upload_id IN (
                SELECT up_id FROM upload WHERE class_code = :class_code
            )
        ");
        $deleteUploadRequestsByUploadStmt->execute([':class_code' => $class_code]);
        
        // 6. Töröljük a tárgyhoz tartozó upload_request rekordokat (kérelmek oldaláról)
        $deleteUploadRequestsByRequestStmt = $pdo->prepare("
            DELETE FROM upload_request 
            WHERE request_id IN (
                SELECT request_id FROM request WHERE class_code = :class_code
            )
        ");
        $deleteUploadRequestsByRequestStmt->execute([':class_code' => $class_code]);
        
        // 7. Töröljük a tárgyhoz tartozó feltöltéseket (fizikai fájlok is)
        $getFilesStmt = $pdo->prepare("
            SELECT up_id, path_to_file, file_name 
            FROM upload 
            WHERE class_code = :class_code
        ");
        $getFilesStmt->execute([':class_code' => $class_code]);
        $files = $getFilesStmt->fetchAll();
        
        foreach ($files as $file) {
            $pathToFile = ltrim($file['path_to_file'], '/');
            $filePath = __DIR__ . '/../' . $pathToFile . $file['file_name'];
            if (file_exists($filePath)) {
                @unlink($filePath);
            }
        }
        
        $deleteUploadsStmt = $pdo->prepare("
            DELETE FROM upload 
            WHERE class_code = :class_code
        ");
        $deleteUploadsStmt->execute([':class_code' => $class_code]);
        
        // 8. Töröljük a tárgyhoz tartozó kérelmeket
        $deleteRequestsStmt = $pdo->prepare("
            DELETE FROM request 
            WHERE class_code = :class_code
        ");
        $deleteRequestsStmt->execute([':class_code' => $class_code]);
        
        // 9. Töröljük a tárgyhoz tartozó chatszobák üzeneteit
        $deleteChatroomMessagesStmt = $pdo->prepare("
            DELETE FROM message 
            WHERE room_id IN (
                SELECT room_id FROM chatroom WHERE class_code = :class_code
            )
        ");
        $deleteChatroomMessagesStmt->execute([':class_code' => $class_code]);
        
        // 10. Töröljük a tárgyhoz tartozó chatszobák room_access rekordjait
        $deleteRoomAccessStmt = $pdo->prepare("
            DELETE FROM room_access 
            WHERE room_id IN (
                SELECT room_id FROM chatroom WHERE class_code = :class_code
            )
        ");
        $deleteRoomAccessStmt->execute([':class_code' => $class_code]);
        
        // 11. Töröljük a tárgyhoz tartozó chatszobákat
        $deleteChatroomsStmt = $pdo->prepare("
            DELETE FROM chatroom 
            WHERE class_code = :class_code
        ");
        $deleteChatroomsStmt->execute([':class_code' => $class_code]);
        
        // 12. Töröljük a felhasználók tárgy felvételeit
        $deleteUserClassesStmt = $pdo->prepare("
            DELETE FROM user_classes 
            WHERE class_code = :class_code
        ");
        $deleteUserClassesStmt->execute([':class_code' => $class_code]);
        
        // 13. Végül töröljük magát a tárgyat
        $deleteClassStmt = $pdo->prepare("
            DELETE FROM class 
            WHERE class_code = :class_code
        ");
        $deleteClassStmt->execute([':class_code' => $class_code]);
        
        // Tranzakció véglegesítése
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Tárgy és összes kapcsolódó adat sikeresen törölve!'
        ]);
    } else {
        // Normál mód: csak a felhasználó tárgy felvételét töröljük
        // Ellenőrizzük, hogy a felhasználó felvette-e ezt a tárgyat
        $stmt = $pdo->prepare("
            SELECT class_code 
            FROM user_classes 
            WHERE neptun = :neptun AND class_code = :class_code
        ");
        $stmt->execute([
            ':neptun' => $neptun,
            ':class_code' => $class_code
        ]);
        
        if ($stmt->rowCount() === 0) {
            echo json_encode([
                'success' => false,
                'error' => 'Nem vetted fel ezt a tárgyat!'
            ]);
            exit();
        }
        
        // Töröljük a tárgyat a user_classes táblából
        $deleteStmt = $pdo->prepare("
            DELETE FROM user_classes 
            WHERE neptun = :neptun AND class_code = :class_code
        ");
        $deleteStmt->execute([
            ':neptun' => $neptun,
            ':class_code' => $class_code
        ]);
        
        echo json_encode([
            'success' => true,
            'message' => 'Tárgy sikeresen törölve!'
        ]);
    }
    
} catch (PDOException $e) {
    // Hiba esetén visszagörgetés
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Tárgy törlési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Adatbázis hiba történt!'
    ]);
}
?>