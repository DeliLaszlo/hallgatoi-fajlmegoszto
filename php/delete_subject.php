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

// JSON input beolvasása
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Ellenőrizzük, hogy megkaptuk-e a class_code-ot
if (!isset($data['class_code']) || empty($data['class_code'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Hiányzó tárgy kód!'
    ]);
    exit();
}

$class_code = $data['class_code'];
$neptun = $_SESSION['user_neptun'];

try {
    require_once __DIR__ . '/../config.php';
    $pdo = getPdoConnection();
    
    // Ellenőrizzük, hogy a felhasználó felvette-e ezt a tárgyat
    $stmt = $pdo->prepare("
        SELECT class_code 
        FROM user_classes 
        WHERE neptun = :neptun AND class_code = :class_code
    ");
    $stmt->execute([
        ':neptun' => $neptun,
        ':class_code' => $class_code
    ]);
    
    if ($stmt->rowCount() === 0) {
        echo json_encode([
            'success' => false,
            'error' => 'Nem vetted fel ezt a tárgyat!'
        ]);
        exit();
    }
    
    // Töröljük a tárgyat a user_classes táblából
    $deleteStmt = $pdo->prepare("
        DELETE FROM user_classes 
        WHERE neptun = :neptun AND class_code = :class_code
    ");
    $deleteStmt->execute([
        ':neptun' => $neptun,
        ':class_code' => $class_code
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Tárgy sikeresen törölve!'
    ]);
    
} catch (PDOException $e) {
    error_log("Tárgy törlési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Adatbázis hiba történt!'
    ]);
}
?>