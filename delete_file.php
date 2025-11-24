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

// Ellenőrizzük, hogy megkaptuk-e a fájl ID-t
if (!isset($data['up_id']) || empty($data['up_id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Hiányzó fájl azonosító!'
    ]);
    exit();
}

$up_id = $data['up_id'];
$neptun = $_SESSION['user_neptun'];

try {
    require_once __DIR__ . '/../config.php';
    $pdo = getPdoConnection();
    
    // Ellenőrizzük, hogy a felhasználó feltöltötte-e ezt a fájlt
    $stmt = $pdo->prepare("
        SELECT up_id, path_to_file, file_name 
        FROM upload 
        WHERE up_id = :up_id AND neptun = :neptun
    ");
    $stmt->execute([
        ':up_id' => $up_id,
        ':neptun' => $neptun
    ]);
    
    $file = $stmt->fetch();
    
    if (!$file) {
        echo json_encode([
            'success' => false,
            'error' => 'Nem te töltötted fel ezt a fájlt, vagy nem létezik!'
        ]);
        exit();
    }
    
    // Töröljük a kapcsolódó rekordokat az upload_request táblából
    $deleteRequestStmt = $pdo->prepare("
        DELETE FROM upload_request 
        WHERE upload_id = :up_id
    ");
    $deleteRequestStmt->execute([':up_id' => $up_id]);
    
    // Töröljük a szavazatokat a user_votes táblából
    $deleteVotesStmt = $pdo->prepare("
        DELETE FROM user_votes 
        WHERE upload_id = :up_id
    ");
    $deleteVotesStmt->execute([':up_id' => $up_id]);
    
    // Töröljük a fájlt az upload táblából
    $deleteStmt = $pdo->prepare("
        DELETE FROM upload 
        WHERE up_id = :up_id AND neptun = :neptun
    ");
    $deleteStmt->execute([
        ':up_id' => $up_id,
        ':neptun' => $neptun
    ]);
    
    // Opcionális: Töröljük a fizikai fájlt a szerverről
    // Ha a path_to_file és file_name megfelelően van beállítva
    $filePath = $file['path_to_file'] . '/' . $file['file_name'];
    if (file_exists($filePath)) {
        @unlink($filePath); // @ elnyomja a figyelmeztetést, ha nem sikerül
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Fájl sikeresen törölve!'
    ]);
    
} catch (PDOException $e) {
    error_log("Fájl törlési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Adatbázis hiba történt!'
    ]);
}
?>