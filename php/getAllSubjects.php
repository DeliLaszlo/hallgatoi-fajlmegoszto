<?php
/**
 * Összes tárgy lekérdezése API (Admin)
 * 
 * Visszaadja az összes tárgyat a rendszerben. Csak adminisztrátorok
 * számára elérhető a tárgyak kezeléséhez.
 * 
 * Metódus: GET
 * Válasz: JSON [{class_code, class_name, semester}, ...]
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

require_once __DIR__ . '/../config.php';
$conn = getMysqliConnection();

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Nem sikerült csatlakozni az adatbázishoz']);
    exit();
}
$conn->set_charset("utf8");

$subjects = [];

// Összes tárgy lekérése
$sql = "SELECT class_code, class_name, semester 
        FROM class 
        ORDER BY class_name ASC";

$result = $conn->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $subjects[] = [
            'class_code' => $row['class_code'],
            'class_name' => $row['class_name'],
            'semester' => $row['semester']
        ];
    }
}

$conn->close();

echo json_encode($subjects);
