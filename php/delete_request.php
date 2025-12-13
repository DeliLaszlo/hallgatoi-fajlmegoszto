<?php
/**
 * Kérelem törlése API
 * 
 * Törli a megadott kérelmet. A felhasználó csak saját kérelmeit
 * törölheti, kivéve admin módban.
 * 
 * Metódus: POST
 * Paraméterek:
 *   - request_id (int): Kérelem azonosító
 *   - admin_mode (bool, opcionális): Admin mód
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

// Ellenőrizzük, hogy megkaptuk-e a kérelem ID-t
if (!isset($data['request_id']) || empty($data['request_id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Hiányzó kérelem azonosító!'
    ]);
    exit();
}

$request_id = $data['request_id'];
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
    
    // Admin módban bármely kérelmet törölhetjük, egyébként csak a sajátunkat
    if ($adminMode && $isAdmin) {
        $stmt = $pdo->prepare("
            SELECT request_id 
            FROM request 
            WHERE request_id = :request_id
        ");
        $stmt->execute([':request_id' => $request_id]);
    } else {
        // Ellenőrizzük, hogy a felhasználó hozta-e létre ezt a kérelmet
        $stmt = $pdo->prepare("
            SELECT request_id 
            FROM request 
            WHERE request_id = :request_id AND neptun_k = :neptun
        ");
        $stmt->execute([
            ':request_id' => $request_id,
            ':neptun' => $neptun
        ]);
    }
    
    $request = $stmt->fetch();
    
    if (!$request) {
        echo json_encode([
            'success' => false,
            'error' => $adminMode ? 'A kérelem nem létezik!' : 'Nem te hoztad létre ezt a kérelmet, vagy nem létezik!'
        ]);
        exit();
    }
    
    // Töröljük a kapcsolódó rekordokat az upload_request táblából
    $deleteUploadRequestStmt = $pdo->prepare("
        DELETE FROM upload_request 
        WHERE request_id = :request_id
    ");
    $deleteUploadRequestStmt->execute([':request_id' => $request_id]);
    
    // Töröljük a kapcsolódó jelentéseket a report táblából
    $deleteReportsStmt = $pdo->prepare("
        DELETE FROM report 
        WHERE reported_table = 'request' AND reported_id = :request_id
    ");
    $deleteReportsStmt->execute([':request_id' => $request_id]);
    
    // Töröljük a kérelmet a request táblából
    if ($adminMode && $isAdmin) {
        $deleteStmt = $pdo->prepare("
            DELETE FROM request 
            WHERE request_id = :request_id
        ");
        $deleteStmt->execute([':request_id' => $request_id]);
    } else {
        $deleteStmt = $pdo->prepare("
            DELETE FROM request 
            WHERE request_id = :request_id AND neptun_k = :neptun
        ");
        $deleteStmt->execute([
            ':request_id' => $request_id,
            ':neptun' => $neptun
        ]);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Kérelem sikeresen törölve!'
    ]);
    
} catch (PDOException $e) {
    error_log("Kérelem törlési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Adatbázis hiba történt!'
    ]);
}
?>
