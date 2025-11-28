<?php
session_start();
header('Content-Type: application/json');

// Felhasználó bejelentkezés ellenőrzése
if (!isset($_SESSION['user_neptun'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Nincs jogosultság']);
    exit();
}

// Később admin ellenőrzés

$neptun = $_SESSION['user_neptun'];
require_once __DIR__ . '/../config.php';
$conn = getMysqliConnection();

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Nem sikerült csatlakozni az adatbázishoz']);
    exit();
}
$conn->set_charset("utf8");

$activities = [
    'files' => [],
    'requests' => [],
    'chatrooms' => []
];

// Legutóbbi 5 fájl feltöltés
$sql = "SELECT u.up_id, u.upload_title as title, u.comment as description, 
               usr.nickname as creator, u.upload_date as create_date
        FROM upload u
        JOIN user usr ON u.neptun = usr.neptun_k
        ORDER BY u.upload_date DESC
        LIMIT 5";

$result = $conn->query($sql);
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $activities['files'][] = [
            'id' => $row['up_id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'creator' => $row['creator'],
            'create_date' => $row['create_date']
        ];
    }
}

// Legutóbbi 5 kérelem
$sql = "SELECT r.request_id, r.request_name as title, r.description, 
               usr.nickname as creator, r.request_date as create_date
        FROM request r
        JOIN user usr ON r.neptun_k = usr.neptun_k
        ORDER BY r.request_date DESC
        LIMIT 5";

$result = $conn->query($sql);
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $activities['requests'][] = [
            'id' => $row['request_id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'creator' => $row['creator'],
            'create_date' => $row['create_date']
        ];
    }
}

// Legutóbbi 5 chatszoba
$sql = "SELECT c.room_id, c.title, c.description, 
               COALESCE(usr.nickname, 'Adminisztrátor') as creator, c.create_date
        FROM chatroom c
        LEFT JOIN user usr ON c.creater_neptun = usr.neptun_k
        ORDER BY c.create_date DESC
        LIMIT 5";

$result = $conn->query($sql);
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $activities['chatrooms'][] = [
            'id' => $row['room_id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'creator' => $row['creator'],
            'create_date' => $row['create_date']
        ];
    }
}

$conn->close();

echo json_encode($activities);
