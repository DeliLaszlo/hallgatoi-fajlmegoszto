<?php
session_start();
header('Content-Type: application/json');

// Felhasználó bejelentkezés ellenőrzése
if (!isset($_SESSION['user_neptun'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Nincs jogosultság']);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);
if (!isset($data['class_code']) || empty($data['class_code'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Hiányzó class_code']);
    exit();
}

$neptun = $_SESSION['user_neptun'];
$class_code = $data['class_code'];

require_once __DIR__ . '/../config.php';
$conn = getMysqliConnection();

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Adatbázis kapcsolat sikertelen']);
    exit();
}
$conn->set_charset("utf8");

// Ellenőrzés: létezik-e a tárgy
$checkSql = "SELECT class_code FROM class WHERE class_code = ?";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("s", $class_code);
$checkStmt->execute();
$checkResult = $checkStmt->get_result();

if ($checkResult->num_rows === 0) {
    $checkStmt->close();
    $conn->close();
    http_response_code(404);
    echo json_encode(['error' => 'Tárgy nem található']);
    exit();
}
$checkStmt->close();

// Ellenőrzés: már felvette-e a felhasználó
$checkUserSql = "SELECT class_code FROM user_classes WHERE neptun = ? AND class_code = ?";
$checkUserStmt = $conn->prepare($checkUserSql);
$checkUserStmt->bind_param("ss", $neptun, $class_code);
$checkUserStmt->execute();
$checkUserResult = $checkUserStmt->get_result();

if ($checkUserResult->num_rows > 0) {
    $checkUserStmt->close();
    $conn->close();
    http_response_code(409);
    echo json_encode(['error' => 'Tárgy már felvéve']);
    exit();
}
$checkUserStmt->close();

// Tárgy felvétele
$insertSql = "INSERT INTO user_classes (class_code, neptun, allapot) VALUES (?, ?, 'F')";
$insertStmt = $conn->prepare($insertSql);
$insertStmt->bind_param("ss", $class_code, $neptun);

if ($insertStmt->execute()) {
    $insertStmt->close();
    $conn->close();
    echo json_encode(['success' => true, 'message' => 'Tárgy sikeresen felvéve']);
} else {
    $insertStmt->close();
    $conn->close();
    http_response_code(500);
    echo json_encode(['error' => 'Tárgy felvétele sikertelen']);
}
?>
