<?php
/**
 * Jelentés lezárása API (Admin)
 * 
 * Lezár (töröl) egy jelentést az admin felületről. A jelentett
 * tartalom marad, csak a jelentés kerül törlésre.
 * 
 * Metódus: POST
 * Paraméterek:
 *   - report_id (int): Jelentés azonosító
 * Válasz: JSON {success: bool, error?: string}
 * Szükséges: Bejelentkezés, Admin jogosultság
 */
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

// Admin jogosultság ellenőrzése
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    http_response_code(403);
    echo json_encode([
        'success' => false,
        'error' => 'Nincs admin jogosultság!'
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

// Ellenőrizzük, hogy megkaptuk-e a report_id-t
if (!isset($data['report_id']) || empty($data['report_id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Hiányzó jelentés azonosító!'
    ]);
    exit();
}

$reportId = $data['report_id'];

try {
    require_once __DIR__ . '/../config.php';
    $pdo = getPdoConnection();
    
    // Ellenőrizzük, hogy létezik-e a jelentés
    $checkStmt = $pdo->prepare("SELECT report_id FROM report WHERE report_id = :report_id");
    $checkStmt->execute([':report_id' => $reportId]);
    
    if (!$checkStmt->fetch()) {
        echo json_encode([
            'success' => false,
            'error' => 'A jelentés nem létezik!'
        ]);
        exit();
    }
    
    // Töröljük a jelentést
    $deleteStmt = $pdo->prepare("DELETE FROM report WHERE report_id = :report_id");
    $deleteStmt->execute([':report_id' => $reportId]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Jelentés sikeresen lezárva!'
    ]);
    
} catch (PDOException $e) {
    error_log("Jelentés lezárási hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Adatbázis hiba történt!'
    ]);
}
?>
