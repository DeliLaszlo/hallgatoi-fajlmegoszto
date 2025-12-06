<?php
session_start();
require_once '../config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_neptun'])) {
    echo json_encode(['success' => false, 'error' => 'Nincs bejelentkezve!']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $neptun = $_SESSION['user_neptun'];
    $class_code = $_POST['class_code'] ?? '';
    $title = trim($_POST['request_title'] ?? '');
    $description = trim($_POST['request_description'] ?? '');

    if (empty($class_code) || empty($title) || empty($description)) {
        echo json_encode(['success' => false, 'error' => 'Minden mező kitöltése kötelező!']);
        exit();
    }

    try {
        $pdo = getPdoConnection();
        
        // Kézi ID generálás 
        $idQuery = $pdo->query("SELECT MAX(request_id) FROM request");
        $maxId = $idQuery->fetchColumn();
        $nextId = $maxId ? ($maxId + 1) : 1;

        $stmt = $pdo->prepare("
            INSERT INTO request (request_id, neptun_k, class_code, request_name, description, request_date) 
            VALUES (:id, :neptun, :class_code, :title, :desc, NOW())
        ");
        
        $stmt->execute([
            ':id' => $nextId,
            ':neptun' => $neptun,
            ':class_code' => $class_code,
            ':title' => $title,
            ':desc' => $description
        ]);

        // Adatok visszaküldése siker esetén
        echo json_encode([
            'success' => true, 
            'message' => 'Kérelem sikeresen létrehozva!',
            'request' => [
                'request_id' => $nextId,
                'request_name' => $title,
                'description' => $description,
                'request_date' => date('Y-m-d')
            ]
        ]);

    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Adatbázis hiba: ' . $e->getMessage()]);
    }
}
?>