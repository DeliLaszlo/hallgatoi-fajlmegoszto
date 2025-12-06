<?php
session_start();
require_once '../config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_neptun'])) {
    echo json_encode(['success' => false, 'error' => 'Nincs bejelentkezve!']);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

$room_id = $input['room_id'] ?? null;
$text = trim($input['text'] ?? '');
$sender = $_SESSION['user_neptun'];

if (!$room_id || empty($text)) {
    echo json_encode(['success' => false, 'error' => 'Üres üzenet vagy hiányzó szoba!']);
    exit();
}

try {
    $pdo = getPdoConnection();
    
    // Kézi ID generálás
    // Lekérjük a legnagyobb msg_id-t és hozzáadunk egyet
    $idQuery = $pdo->query("SELECT MAX(msg_id) FROM message");
    $maxId = $idQuery->fetchColumn();
    $nextId = $maxId ? ($maxId + 1) : 1; 

    // Üzenet mentése a generált ID-vel
    $stmt = $pdo->prepare("
        INSERT INTO message (msg_id, sender_neptun, room_id, text, send_time) 
        VALUES (:id, :sender, :room, :msg, NOW())
    ");
    
    $stmt->execute([
        ':id'     => $nextId,
        ':sender' => $sender,
        ':room'   => $room_id,
        ':msg'    => $text
    ]);

    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    // Részletes hibaüzenet a fejlesztéshez
    echo json_encode(['success' => false, 'error' => 'SQL Hiba: ' . $e->getMessage()]);
}
?>