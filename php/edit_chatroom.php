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

$neptun = $_SESSION['user_neptun'];

// Ellenőrizzük a kötelező mezőket
if (!isset($_POST['room_id']) || empty($_POST['room_id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Hiányzó chatszoba azonosító!'
    ]);
    exit();
}

if (!isset($_POST['chatroom_title']) || empty(trim($_POST['chatroom_title']))) {
    echo json_encode([
        'success' => false,
        'error' => 'A chatszoba címe kötelező!'
    ]);
    exit();
}

if (!isset($_POST['chatroom_description']) || empty(trim($_POST['chatroom_description']))) {
    echo json_encode([
        'success' => false,
        'error' => 'A leírás kötelező!'
    ]);
    exit();
}

$room_id = $_POST['room_id'];
$chatroom_title = trim($_POST['chatroom_title']);
$chatroom_description = trim($_POST['chatroom_description']);

try {
    require_once __DIR__ . '/../config.php';
    $pdo = getPdoConnection();
    
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
    
    $existingChatroom = $stmt->fetch();
    
    if (!$existingChatroom) {
        echo json_encode([
            'success' => false,
            'error' => 'Nem te hoztad létre ezt a chatszobát, vagy nem létezik!'
        ]);
        exit();
    }
    
    // Frissítjük az adatbázist
    $updateStmt = $pdo->prepare("
        UPDATE chatroom 
        SET title = :title, 
            description = :description
        WHERE room_id = :room_id AND creater_neptun = :neptun
    ");
    
    $updateStmt->execute([
        ':title' => $chatroom_title,
        ':description' => $chatroom_description,
        ':room_id' => $room_id,
        ':neptun' => $neptun
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Chatszoba sikeresen módosítva!'
    ]);
    
} catch (PDOException $e) {
    error_log("Chatszoba szerkesztési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Adatbázis hiba történt!'
    ]);
} catch (Exception $e) {
    error_log("Chatszoba szerkesztési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Hiba történt a chatszoba módosítása során!'
    ]);
}
?>
