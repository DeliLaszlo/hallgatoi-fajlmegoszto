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

// Ellenőrizzük, hogy megkaptuk-e a chatszoba ID-t
if (!isset($data['room_id']) || empty($data['room_id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Hiányzó chatszoba azonosító!'
    ]);
    exit();
}

$room_id = $data['room_id'];
$neptun = $_SESSION['user_neptun'];

try {
    require_once __DIR__ . '/../config.php';
    $pdo = getPdoConnection();
    
    // Ellenőrizzük, hogy a felhasználó követi-e ezt a chatszobát
    $stmt = $pdo->prepare("
        SELECT neptun, room_id 
        FROM room_access 
        WHERE room_id = :room_id AND neptun = :neptun
    ");
    $stmt->execute([
        ':room_id' => $room_id,
        ':neptun' => $neptun
    ]);
    
    $access = $stmt->fetch();
    
    if (!$access) {
        echo json_encode([
            'success' => false,
            'error' => 'Nem követed ezt a chatszobát!'
        ]);
        exit();
    }
    
    // Töröljük a követést a room_access táblából
    $deleteStmt = $pdo->prepare("
        DELETE FROM room_access 
        WHERE room_id = :room_id AND neptun = :neptun
    ");
    $deleteStmt->execute([
        ':room_id' => $room_id,
        ':neptun' => $neptun
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Chatszoba követése sikeresen megszüntetve!'
    ]);
    
} catch (PDOException $e) {
    error_log("Chatszoba követés megszüntetési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Adatbázis hiba történt!'
    ]);
}
?>
