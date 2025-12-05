<?php
session_start();

$conn = new mysqli("localhost", "root", "", "pm_db_fm_v1");

$neptun = $_SESSION['user_neptun'];

// Ellenőrizzük, hogy be van-e jelentkezve
if (!isset($_SESSION['user_neptun'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Nincs bejelentkezve!'
    ]);
    exit();
}

// Csak POST kérést fogadunk el
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'error' => 'Hibás kérés!'
    ]);
    exit();
}


$class_code = $_POST['classcode'];
$title = $_POST['request_title'];
$comment = $_POST['request_description'];

$stmt = $conn->prepare("INSERT INTO request (neptun_k, class_code, request_name, description) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $neptun, $class_code, $title, $comment);

if ($stmt->execute()) {   
    echo "<script>history.back();</script>";
} 
else {
    echo '<script>alert("A kérvény feltöltése sikertelen!");history.back();</script>';
}
?>


