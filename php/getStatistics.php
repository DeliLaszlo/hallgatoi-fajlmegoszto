<?php
session_start();
header('Content-Type: application/json');

// Felhasználó bejelentkezés ellenőrzése
if (!isset($_SESSION['user_neptun'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Nincs jogosultság']);
    exit();
}

// Admin jogosultság ellenőrzése
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    http_response_code(403);
    echo json_encode(['error' => 'Nincs admin jogosultság']);
    exit();
}

$neptun = $_SESSION['user_neptun'];
require_once __DIR__ . '/../config.php';
$conn = getMysqliConnection();

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Nem sikerült csatlakozni az adatbázishoz']);
    exit();
}
$conn->set_charset("utf8");

// Statisztikák lekérdezése
$statistics = [];

// Összes felhasználó
$sql = "SELECT COUNT(*) as total FROM user";
$result = $conn->query($sql);
if ($result) {
    $row = $result->fetch_assoc();
    $statistics['allUsers'] = $row['total'];
}

// Aktív tárgyak
$sql = "SELECT COUNT(*) as total FROM class";
$result = $conn->query($sql);
if ($result) {
    $row = $result->fetch_assoc();
    $statistics['allSubjects'] = $row['total'];
}

// Feltöltött fájlok
$sql = "SELECT COUNT(*) as total FROM upload";
$result = $conn->query($sql);
if ($result) {
    $row = $result->fetch_assoc();
    $statistics['allFiles'] = $row['total'];
}

// Függő kérelmek
$sql = "SELECT COUNT(*) as total FROM request r LEFT JOIN upload_request ur ON r.request_id = ur.request_id WHERE ur.status IS NULL OR ur.status = 'F'";
$result = $conn->query($sql);
if ($result) {
    $row = $result->fetch_assoc();
    $statistics['allRequests'] = $row['total'];
}

// Aktív chatszobák
$sql = "SELECT COUNT(*) as total FROM chatroom";
$result = $conn->query($sql);
if ($result) {
    $row = $result->fetch_assoc();
    $statistics['allChatrooms'] = $row['total'];
}

$conn->close();

echo json_encode($statistics);