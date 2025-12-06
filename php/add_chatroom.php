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
    $title = trim($_POST['chatroom_title'] ?? '');
    $description = trim($_POST['chatroom_description'] ?? '');

    if (empty($class_code)) {
        echo json_encode(['success' => false, 'error' => 'Hiányzik a tárgy kódja!']);
        exit();
    }
    if (empty($title) || empty($description)) {
        echo json_encode(['success' => false, 'error' => 'A cím és a leírás kitöltése kötelező!']);
        exit();
    }

    try {
        $pdo = getPdoConnection();
        
        // 1. ID Generálás (Workaround)
        $idQuery = $pdo->query("SELECT MAX(room_id) FROM chatroom");
        $maxId = $idQuery->fetchColumn();
        // Ha üres a tábla, kezdjük pl. 10001-től, vagy simán 1-től
        $nextId = $maxId ? ($maxId + 1) : 10001;

        // 2. Chatszoba beszúrása
        // (SQL dump alapján a létrehozó mező neve: 'creater_neptun')
        $stmt = $pdo->prepare("
            INSERT INTO chatroom (room_id, class_code, creater_neptun, title, description, create_date) 
            VALUES (:id, :class, :neptun, :title, :desc, NOW())
        ");
        
        $stmt->execute([
            ':id' => $nextId,
            ':class' => $class_code,
            ':neptun' => $neptun,
            ':title' => $title,
            ':desc' => $description
        ]);
        
        // 3. A létrehozó hozzáadása a tagokhoz (room_access)
        // Hogy azonnal tudjon írni bele
        $accessStmt = $pdo->prepare("
            INSERT INTO room_access (neptun, room_id, active) 
            VALUES (:neptun, :room_id, 1)
        ");
        
        $accessStmt->execute([
            ':neptun' => $neptun, 
            ':room_id' => $nextId
        ]);

        echo json_encode(['success' => true, 'message' => 'Chatszoba sikeresen létrehozva!']);

    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Adatbázis hiba: ' . $e->getMessage()]);
    }
}
?>