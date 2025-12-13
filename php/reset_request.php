<?php
/**
 * Kérelem újranyitása API
 * 
 * Visszaállítja egy teljesített kérelmet várakozó állapotba.
 * Csak a kérelem létrehozója használhatja.
 * 
 * Metódus: POST
 * Paraméterek:
 *   - request_id (int): Kérelem azonosító
 * Válasz: JSON {success: bool, error?: string}
 * Szükséges: Bejelentkezés
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

// Ellenőrizzük, hogy megkaptuk-e a kérelem ID-t
if (!isset($data['request_id']) || empty($data['request_id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Hiányzó kérelem azonosító!'
    ]);
    exit();
}

$request_id = $data['request_id'];
$neptun = $_SESSION['user_neptun'];

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
    
    $request = $stmt->fetch();
    
    if (!$request) {
        echo json_encode([
            'success' => false,
            'error' => 'Nem te hoztad létre ezt a kérelmet, vagy nem létezik!'
        ]);
        exit();
    }
    
    // Töröljük a kapcsolódó rekordot az upload_request táblából (visszaállítjuk a kérelmet)
    $deleteUploadRequestStmt = $pdo->prepare("
        DELETE FROM upload_request 
        WHERE request_id = :request_id
    ");
    $deleteUploadRequestStmt->execute([':request_id' => $request_id]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Kérelem sikeresen újraküldve!'
    ]);
    
} catch (PDOException $e) {
    error_log("Kérelem újraküldési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Adatbázis hiba történt!'
    ]);
}
?>
