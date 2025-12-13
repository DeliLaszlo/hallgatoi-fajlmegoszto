<?php
/**
 * Felvehető tárgyak lekérdezése API
 * 
 * Visszaadja azokat a tárgyakat, amelyeket a felhasználó még nem vett fel.
 * 
 * Metódus: GET
 * Válasz: JSON [{class_code, class_name, semester}, ...]
 * Szükséges: Bejelentkezés
 */
session_start();
header('Content-Type: application/json');

// Felhasználó bejelentkezés ellenőrzése
if (!isset($_SESSION['user_neptun'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Nincs jogosultság']);
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

// Felvehető tárgyak lekérdezése
$sql = "SELECT c.class_code, c.class_name, c.semester
        FROM class c
        WHERE c.class_code NOT IN (
            SELECT uc.class_code 
            FROM user_classes uc 
            WHERE uc.neptun = ?
        )
        ORDER BY c.class_name";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $neptun);
$stmt->execute();
$result = $stmt->get_result();

$subjects = array();
while ($row = $result->fetch_assoc()) {
    $subjects[] = array(
        'class_code' => $row['class_code'],
        'class_name' => $row['class_name'],
        'semester' => $row['semester']
    );
}

$stmt->close();
$conn->close();

echo json_encode($subjects);
?>