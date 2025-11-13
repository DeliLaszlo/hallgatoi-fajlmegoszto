<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_neptun'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Nem vagy bejelentkezve']);
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "pm_db_fm_v1";

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $stmt = $conn->prepare("SELECT neptun_k, nickname, CONCAT(vnev, ' ', knev) as full_name, email FROM user WHERE neptun_k = :neptun");
    $stmt->bindParam(':neptun', $_SESSION['user_neptun']);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($user) {
        echo json_encode([
            'neptun' => $user['neptun_k'],
            'nickname' => $user['nickname'],
            'full_name' => $user['full_name'],
            'email' => $user['email']
        ]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Felhasználó nem található']);
    }
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Adatbázis hiba: ' . $e->getMessage()]);
}

$conn = null;
?>
