<?php
/**
 * Letöltésszámláló API
 * 
 * Növeli egy fájl letöltési számlálóját. A saját fájl letöltése
 * nem növeli a számlálót. AJAX hívással használandó.
 * 
 * Metódus: GET
 * Paraméterek:
 *   - up_id (int): Feltöltés azonosító
 * Válasz: JSON {success: bool, error?: string, downloads?: int, isOwn?: bool}
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

// Ellenőrizzük, hogy megkaptuk-e a fájl ID-t
if (!isset($_GET['up_id']) || empty($_GET['up_id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Hiányzó fájl azonosító!'
    ]);
    exit();
}

$up_id = $_GET['up_id'];
$neptun = $_SESSION['user_neptun'];

try {
    require_once __DIR__ . '/../config.php';
    $pdo = getPdoConnection();
    
    // Lekérjük a fájl adatait
    $stmt = $pdo->prepare("
        SELECT up_id, neptun, downloads
        FROM upload 
        WHERE up_id = :up_id
    ");
    $stmt->execute([':up_id' => $up_id]);
    
    $file = $stmt->fetch();
    
    if (!$file) {
        echo json_encode([
            'success' => false,
            'error' => 'A fájl nem található!'
        ]);
        exit();
    }
    
    $newDownloads = (int)$file['downloads'];
    $isOwn = (strtoupper($file['neptun']) === strtoupper($neptun));
    
    // Növeljük a letöltések számát (csak ha nem a saját fájlját tölti le)
    if (!$isOwn) {
        $updateStmt = $pdo->prepare("
            UPDATE upload 
            SET downloads = downloads + 1 
            WHERE up_id = :up_id
        ");
        $updateStmt->execute([':up_id' => $up_id]);
        $newDownloads++;
    }
    
    echo json_encode([
        'success' => true,
        'new_downloads' => $newDownloads,
        'is_own' => $isOwn
    ]);
    
} catch (PDOException $e) {
    error_log("Letöltés számláló hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Adatbázis hiba történt!'
    ]);
}
?>
