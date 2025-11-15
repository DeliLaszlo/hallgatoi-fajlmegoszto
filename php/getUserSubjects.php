<?php
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


// Felhasználó tantárgyainak lekérdezése
$sql = "SELECT c.class_code, c.class_name, c.semester, uc.allapot
        FROM user_classes uc
        INNER JOIN class c ON uc.class_code = c.class_code
        WHERE uc.neptun = ?
        ORDER BY c.class_name";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $neptun);
$stmt->execute();
$result = $stmt->get_result();

$subjects = array();
while ($row = $result->fetch_assoc()) {
    // Feltöltött fájlok és függőben lévő kérések számának lekérdezése
    $fileCountSql = "SELECT COUNT(*) as file_count FROM upload WHERE class_code = ?";
    $fileStmt = $conn->prepare($fileCountSql);
    $fileStmt->bind_param("s", $row['class_code']);
    $fileStmt->execute();
    $fileResult = $fileStmt->get_result();
    $fileRow = $fileResult->fetch_assoc();
    $fileCount = $fileRow['file_count'];
    $fileStmt->close();
    
    $requestCountSql = "SELECT COUNT(*) as request_count 
                        FROM request r 
                        LEFT JOIN upload_request ur ON r.request_id = ur.request_id 
                        WHERE r.class_code = ? AND (ur.status = 'F' OR ur.status IS NULL)";
    $requestStmt = $conn->prepare($requestCountSql);
    $requestStmt->bind_param("s", $row['class_code']);
    $requestStmt->execute();
    $requestResult = $requestStmt->get_result();
    $requestRow = $requestResult->fetch_assoc();
    $requestCount = $requestRow['request_count'];
    $requestStmt->close();
    
    $subjects[] = array(
        'class_code' => $row['class_code'],
        'class_name' => $row['class_name'],
        'semester' => $row['semester'],
        'allapot' => $row['allapot'],
        'file_count' => $fileCount,
        'request_count' => $requestCount
    );
}

$stmt->close();
$conn->close();

echo json_encode($subjects);
?>