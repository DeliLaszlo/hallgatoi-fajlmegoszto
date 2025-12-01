<?php
session_start();
header('Content-Type: application/json');

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

$neptun = $_SESSION['user_neptun'];

// Ellenőrizzük a kötelező mezőket
if (!isset($_POST['request_id']) || empty($_POST['request_id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Hiányzó kérelem azonosító!'
    ]);
    exit();
}

if (!isset($_POST['request_title']) || empty(trim($_POST['request_title']))) {
    echo json_encode([
        'success' => false,
        'error' => 'A kérelem címe kötelező!'
    ]);
    exit();
}

if (!isset($_POST['request_description']) || empty(trim($_POST['request_description']))) {
    echo json_encode([
        'success' => false,
        'error' => 'A leírás kötelező!'
    ]);
    exit();
}

$request_id = $_POST['request_id'];
$request_title = trim($_POST['request_title']);
$request_description = trim($_POST['request_description']);

try {
    require_once __DIR__ . '/../config.php';
    $pdo = getPdoConnection();
    
    // Ellenőrizzük, hogy a felhasználó hozta-e létre ezt a kérelmet
    $stmt = $pdo->prepare("
        SELECT request_id
        FROM request 
        WHERE request_id = :request_id AND neptun_k = :neptun
    ");
    $stmt->execute([
        ':request_id' => $request_id,
        ':neptun' => $neptun
    ]);
    
    $existingRequest = $stmt->fetch();
    
    if (!$existingRequest) {
        echo json_encode([
            'success' => false,
            'error' => 'Nem te hoztad létre ezt a kérelmet, vagy nem létezik!'
        ]);
        exit();
    }
    
    // Frissítjük az adatbázist
    $updateStmt = $pdo->prepare("
        UPDATE request 
        SET request_name = :title, 
            description = :description
        WHERE request_id = :request_id AND neptun_k = :neptun
    ");
    
    $updateStmt->execute([
        ':title' => $request_title,
        ':description' => $request_description,
        ':request_id' => $request_id,
        ':neptun' => $neptun
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Kérelem sikeresen módosítva!'
    ]);
    
} catch (PDOException $e) {
    error_log("Kérelem szerkesztési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Adatbázis hiba történt!'
    ]);
} catch (Exception $e) {
    error_log("Kérelem szerkesztési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Hiba történt a kérelem módosítása során!'
    ]);
}
?>
