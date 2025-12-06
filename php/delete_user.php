<?php
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

// Admin jogosultság ellenőrzése
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Nincs admin jogosultság!'
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

// Ellenőrizzük, hogy megkaptuk-e a neptun kódot
if (!isset($data['neptun']) || empty($data['neptun'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Hiányzó felhasználó azonosító (neptun)!'
    ]);
    exit();
}

$neptunToDelete = $data['neptun'];
$adminNeptun = $_SESSION['user_neptun'];

// Nem törölheti saját magát az admin
if (strtoupper($neptunToDelete) === strtoupper($adminNeptun)) {
    echo json_encode([
        'success' => false,
        'error' => 'Nem törölheted saját magad!'
    ]);
    exit();
}

try {
    require_once __DIR__ . '/../config.php';
    $pdo = getPdoConnection();
    
    // Ellenőrizzük, hogy létezik-e a felhasználó
    $checkStmt = $pdo->prepare("SELECT neptun_k FROM user WHERE neptun_k = :neptun");
    $checkStmt->execute([':neptun' => $neptunToDelete]);
    
    if (!$checkStmt->fetch()) {
        echo json_encode([
            'success' => false,
            'error' => 'A felhasználó nem létezik!'
        ]);
        exit();
    }
    
    // Tranzakció indítása
    $pdo->beginTransaction();
    
    // 1. Töröljük a felhasználó által beküldött jelentéseket
    $deleteReporterStmt = $pdo->prepare("
        DELETE FROM report 
        WHERE report_neptun = :neptun
    ");
    $deleteReporterStmt->execute([':neptun' => $neptunToDelete]);
    
    // 2. Töröljük a felhasználó tartalmaihoz kapcsolódó jelentéseket
    // Fájlok jelentései
    $deleteFileReportsStmt = $pdo->prepare("
        DELETE FROM report 
        WHERE reported_table = 'upload' AND reported_id IN (
            SELECT up_id FROM upload WHERE neptun = :neptun
        )
    ");
    $deleteFileReportsStmt->execute([':neptun' => $neptunToDelete]);
    
    // Kérelmek jelentései
    $deleteRequestReportsStmt = $pdo->prepare("
        DELETE FROM report 
        WHERE reported_table = 'request' AND reported_id IN (
            SELECT request_id FROM request WHERE neptun_k = :neptun
        )
    ");
    $deleteRequestReportsStmt->execute([':neptun' => $neptunToDelete]);
    
    // Chatszobák jelentései
    $deleteChatroomReportsStmt = $pdo->prepare("
        DELETE FROM report 
        WHERE reported_table = 'chatroom' AND reported_id IN (
            SELECT room_id FROM chatroom WHERE creater_neptun = :neptun
        )
    ");
    $deleteChatroomReportsStmt->execute([':neptun' => $neptunToDelete]);
    
    // 3. Töröljük a felhasználó szavazatait
    $deleteVotesStmt = $pdo->prepare("
        DELETE FROM user_votes 
        WHERE neptun_k = :neptun
    ");
    $deleteVotesStmt->execute([':neptun' => $neptunToDelete]);
    
    // 4. Töröljük a felhasználó fájljaihoz kapcsolódó szavazatokat
    $deleteFileVotesStmt = $pdo->prepare("
        DELETE FROM user_votes 
        WHERE upload_id IN (
            SELECT up_id FROM upload WHERE neptun = :neptun
        )
    ");
    $deleteFileVotesStmt->execute([':neptun' => $neptunToDelete]);
    
    // 5. Töröljük a felhasználó fájljaihoz kapcsolódó upload_request rekordokat
    $deleteUploadRequestsStmt = $pdo->prepare("
        DELETE FROM upload_request 
        WHERE upload_id IN (
            SELECT up_id FROM upload WHERE neptun = :neptun
        )
    ");
    $deleteUploadRequestsStmt->execute([':neptun' => $neptunToDelete]);
    
    // 6. Töröljük a felhasználó kérelmeihez kapcsolódó upload_request rekordokat
    $deleteRequestLinksStmt = $pdo->prepare("
        DELETE FROM upload_request 
        WHERE request_id IN (
            SELECT request_id FROM request WHERE neptun_k = :neptun
        )
    ");
    $deleteRequestLinksStmt->execute([':neptun' => $neptunToDelete]);
    
    // 7. Töröljük a felhasználó feltöltéseit (fizikai fájlok is)
    $getFilesStmt = $pdo->prepare("
        SELECT up_id, path_to_file, file_name 
        FROM upload 
        WHERE neptun = :neptun
    ");
    $getFilesStmt->execute([':neptun' => $neptunToDelete]);
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
        WHERE neptun = :neptun
    ");
    $deleteUploadsStmt->execute([':neptun' => $neptunToDelete]);
    
    // 8. Töröljük a felhasználó kérelmeit
    $deleteRequestsStmt = $pdo->prepare("
        DELETE FROM request 
        WHERE neptun_k = :neptun
    ");
    $deleteRequestsStmt->execute([':neptun' => $neptunToDelete]);
    
    // 9. Töröljük a felhasználó üzeneteit
    $deleteMessagesStmt = $pdo->prepare("
        DELETE FROM message 
        WHERE sender_neptun = :neptun
    ");
    $deleteMessagesStmt->execute([':neptun' => $neptunToDelete]);
    
    // 10. Töröljük a felhasználó chatszobáihoz tartozó üzeneteket
    $deleteChatroomMessagesStmt = $pdo->prepare("
        DELETE FROM message 
        WHERE room_id IN (
            SELECT room_id FROM chatroom WHERE creater_neptun = :neptun
        )
    ");
    $deleteChatroomMessagesStmt->execute([':neptun' => $neptunToDelete]);
    
    // 11. Töröljük a felhasználó chatszobáihoz tartozó room_access rekordokat
    $deleteChatroomAccessStmt = $pdo->prepare("
        DELETE FROM room_access 
        WHERE room_id IN (
            SELECT room_id FROM chatroom WHERE creater_neptun = :neptun
        )
    ");
    $deleteChatroomAccessStmt->execute([':neptun' => $neptunToDelete]);
    
    // 12. Töröljük a felhasználó room_access rekordjait
    $deleteRoomAccessStmt = $pdo->prepare("
        DELETE FROM room_access 
        WHERE neptun = :neptun
    ");
    $deleteRoomAccessStmt->execute([':neptun' => $neptunToDelete]);
    
    // 13. Töröljük a felhasználó chatszobáit
    $deleteChatroomsStmt = $pdo->prepare("
        DELETE FROM chatroom 
        WHERE creater_neptun = :neptun
    ");
    $deleteChatroomsStmt->execute([':neptun' => $neptunToDelete]);
    
    // 14. Töröljük a felhasználó tárgy felvételeit
    $deleteUserClassesStmt = $pdo->prepare("
        DELETE FROM user_classes 
        WHERE neptun = :neptun
    ");
    $deleteUserClassesStmt->execute([':neptun' => $neptunToDelete]);
    
    // 15. Végül töröljük magát a felhasználót
    $deleteUserStmt = $pdo->prepare("
        DELETE FROM user 
        WHERE neptun_k = :neptun
    ");
    $deleteUserStmt->execute([':neptun' => $neptunToDelete]);
    
    // Tranzakció véglegesítése
    $pdo->commit();
    
    echo json_encode([
        'success' => true,
        'message' => 'Felhasználó és összes kapcsolódó adat sikeresen törölve!'
    ]);
    
} catch (PDOException $e) {
    // Hiba esetén visszagörgetés
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("Felhasználó törlési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Adatbázis hiba történt!'
    ]);
}
?>
