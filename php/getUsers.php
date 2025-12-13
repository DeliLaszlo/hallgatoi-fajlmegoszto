<?php
/**
 * Felhasználók lekérdezése API (Admin)
 * 
 * Visszaadja az összes felhasználót a rendszerben (kivéve a bejelentkezett admint).
 * Felhasználókezeléshez használandó az admin felületen.
 * 
 * Metódus: GET
 * Válasz: JSON [{neptun, nickname, full_name, email}, ...]
 * Szükséges: Bejelentkezés, Admin jogosultság
 */
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

$users = [];

// Összes felhasználó lekérése kivéve a bejelentkezett admin
$sql = "SELECT neptun_k, nickname, vnev, knev, email 
        FROM user 
        WHERE neptun_k != ? 
        ORDER BY nickname ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $neptun);
$stmt->execute();
$result = $stmt->get_result();

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $users[] = [
            'neptun' => $row['neptun_k'],
            'nickname' => $row['nickname'],
            'full_name' => $row['vnev'] . ' ' . $row['knev'],
            'email' => $row['email']
        ];
    }
}

$stmt->close();
$conn->close();

echo json_encode($users);
