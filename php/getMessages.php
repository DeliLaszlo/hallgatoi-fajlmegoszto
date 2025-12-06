<?php
session_start();
header('Content-Type: application/json');

require_once __DIR__ . '/../config.php';
$conn = getMysqliConnection();

// Ellenőrizzük, hogy be van-e jelentkezve a felhasználó
if (!isset($_SESSION['user_neptun'])) {
    echo json_encode(['success' => false, 'message' => 'Nincs bejelentkezve']);
    exit();
}

$user_neptun = $_SESSION['user_neptun'];
$room_id = $_GET['room_id'] ?? null;

$last_msg_id = isset($_GET['last_id']) ? intval($_GET['last_id']) : 0;

if (!$room_id) {
    echo json_encode(['success' => false, 'message' => 'Hiányzó room_id paraméter']);
    exit();
}

try {
    // Ellenőrizzük, hogy létezik-e a szoba
    $check_query = "SELECT room_id FROM chatroom WHERE room_id = ?";
    $stmt = $conn->prepare($check_query);
    $stmt->bind_param("i", $room_id);
    $stmt->execute();
    $check_result = $stmt->get_result();
    
    if ($check_result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'A szoba nem létezik']);
        exit();
    }
    
    // JAVÍTÁS: Csak az új üzeneteket kérjük le (m.msg_id > ?)
    $query = "SELECT 
                m.msg_id,
                m.sender_neptun,
                m.text,
                m.send_time,
                u.nickname as sender_nickname
              FROM message m
              LEFT JOIN user u ON m.sender_neptun = u.neptun_k
              WHERE m.room_id = ? AND m.msg_id > ?
              ORDER BY m.send_time ASC";
    
    $stmt = $conn->prepare($query);
    // Két paramétert kötünk be: room_id (i) és last_msg_id (i)
    $stmt->bind_param("ii", $room_id, $last_msg_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    $messages = [];
    while ($row = $result->fetch_assoc()) {
        $messages[] = [
            'msg_id' => $row['msg_id'],
            'sender_neptun' => $row['sender_neptun'],
            'sender_nickname' => $row['sender_nickname'],
            'text' => $row['text'], 
            'send_time' => $row['send_time'],
            'is_me' => ($row['sender_neptun'] === $user_neptun)
        ];
    }
    
    echo json_encode(['success' => true, 'messages' => $messages, 'has_messages' => count($messages) > 0]);
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Hiba történt: ' . $e->getMessage()]);
}

$conn->close();
?>