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
    
    // Ellenőrizzük, hogy létezik-e a chatszoba
    $stmt = $pdo->prepare("
        SELECT room_id 
        FROM chatroom 
        WHERE room_id = :room_id
    ");
    $stmt->execute([':room_id' => $room_id]);
    
    $chatroom = $stmt->fetch();
    
    if (!$chatroom) {
        echo json_encode([
            'success' => false,
            'error' => 'A chatszoba nem létezik!'
        ]);
        exit();
    }
    
    // Ellenőrizzük, hogy a felhasználó már követi-e a chatszobát
    $checkStmt = $pdo->prepare("
        SELECT neptun, room_id 
        FROM room_access 
        WHERE room_id = :room_id AND neptun = :neptun
    ");
    $checkStmt->execute([
        ':room_id' => $room_id,
        ':neptun' => $neptun
    ]);
    
    $existingAccess = $checkStmt->fetch();
    
    if ($existingAccess) {
        // Ha már létezik a rekord, frissítjük az active státuszt
        $updateStmt = $pdo->prepare("
            UPDATE room_access 
            SET active = 1 
            WHERE room_id = :room_id AND neptun = :neptun
        ");
        $updateStmt->execute([
            ':room_id' => $room_id,
            ':neptun' => $neptun
        ]);
    } else {
        // Ha még nem létezik, beszúrjuk az új rekordot
        $insertStmt = $pdo->prepare("
            INSERT INTO room_access (neptun, room_id, active) 
            VALUES (:neptun, :room_id, 1)
        ");
        $insertStmt->execute([
            ':neptun' => $neptun,
            ':room_id' => $room_id
        ]);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Chatszoba sikeresen követve!'
    ]);
    
} catch (PDOException $e) {
    error_log("Chatszoba követési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Adatbázis hiba történt!'
    ]);
}
?>
