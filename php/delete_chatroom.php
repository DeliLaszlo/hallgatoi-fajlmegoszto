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
    
    // Admin módban bármely chatszobát törölhetjük, egyébként csak a sajátunkat
    if ($adminMode && $isAdmin) {
        $stmt = $pdo->prepare("
            SELECT room_id 
            FROM chatroom 
            WHERE room_id = :room_id
        ");
        $stmt->execute([':room_id' => $room_id]);
    } else {
        // Ellenőrizzük, hogy a felhasználó hozta-e létre ezt a chatszobát
        $stmt = $pdo->prepare("
            SELECT room_id 
            FROM chatroom 
            WHERE room_id = :room_id AND creater_neptun = :neptun
        ");
        $stmt->execute([
            ':room_id' => $room_id,
            ':neptun' => $neptun
        ]);
    }
    
    $chatroom = $stmt->fetch();
    
    if (!$chatroom) {
        echo json_encode([
            'success' => false,
            'error' => $adminMode ? 'A chatszoba nem létezik!' : 'Nem te hoztad létre ezt a chatszobát, vagy nem létezik!'
        ]);
        exit();
    }
    
    // Töröljük a kapcsolódó üzeneteket a message táblából
    $deleteMessagesStmt = $pdo->prepare("
        DELETE FROM message 
        WHERE room_id = :room_id
    ");
    $deleteMessagesStmt->execute([':room_id' => $room_id]);
    
    // Töröljük a kapcsolódó hozzáféréseket a room_access táblából
    $deleteAccessStmt = $pdo->prepare("
        DELETE FROM room_access 
        WHERE room_id = :room_id
    ");
    $deleteAccessStmt->execute([':room_id' => $room_id]);
    
    // Töröljük a kapcsolódó jelentéseket a report táblából
    $deleteReportsStmt = $pdo->prepare("
        DELETE FROM report 
        WHERE reported_table = 'chatroom' AND reported_id = :room_id
    ");
    $deleteReportsStmt->execute([':room_id' => $room_id]);
    
    // Töröljük a chatszobát a chatroom táblából
    if ($adminMode && $isAdmin) {
        $deleteStmt = $pdo->prepare("
            DELETE FROM chatroom 
            WHERE room_id = :room_id
        ");
        $deleteStmt->execute([':room_id' => $room_id]);
    } else {
        $deleteStmt = $pdo->prepare("
            DELETE FROM chatroom 
            WHERE room_id = :room_id AND creater_neptun = :neptun
        ");
        $deleteStmt->execute([
            ':room_id' => $room_id,
            ':neptun' => $neptun
        ]);
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Chatszoba sikeresen törölve!'
    ]);
    
} catch (PDOException $e) {
    error_log("Chatszoba törlési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Adatbázis hiba történt!'
    ]);
}
?>
