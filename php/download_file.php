<?php
session_start();

// Ellenőrizzük, hogy be van-e jelentkezve
if (!isset($_SESSION['user_neptun'])) {
    http_response_code(403);
    die('Nincs bejelentkezve!');
}

// Ellenőrizzük, hogy megkaptuk-e a fájl ID-t
if (!isset($_GET['up_id']) || empty($_GET['up_id'])) {
    http_response_code(400);
    die('Hiányzó fájl azonosító!');
}

$up_id = $_GET['up_id'];
$neptun = $_SESSION['user_neptun'];

try {
    require_once __DIR__ . '/../config.php';
    $pdo = getPdoConnection();
    
    // Lekérjük a fájl adatait
    $stmt = $pdo->prepare("
        SELECT up_id, file_name, path_to_file, upload_title, neptun, downloads
        FROM upload 
        WHERE up_id = :up_id
    ");
    $stmt->execute([':up_id' => $up_id]);
    
    $file = $stmt->fetch();
    
    if (!$file) {
        http_response_code(404);
        die('A fájl nem található!');
    }
    
    // Fájl útvonal összeállítása (projekt gyökérkönyvtárhoz képest)
    $pathToFile = ltrim($file['path_to_file'], '/'); // Eltávolítjuk a kezdő perjelet ha van
    $filePath = __DIR__ . '/../' . $pathToFile . $file['file_name'];
    
    // Ellenőrizzük, hogy létezik-e a fájl
    if (!file_exists($filePath)) {
        http_response_code(404);
        die('A fájl nem található a szerveren!');
    }
    
    // A letöltések számát az increment_download.php kezeli külön AJAX hívással
    // így a frontend frissíteni tudja a UI-t is
    
    // Fájl típus meghatározása
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $filePath);
    finfo_close($finfo);
    
    // Fájl méret
    $fileSize = filesize($filePath);
    
    // HTTP fejlécek beállítása a letöltéshez
    header('Content-Type: ' . $mimeType);
    header('Content-Disposition: attachment; filename="' . basename($file['file_name']) . '"');
    header('Content-Length: ' . $fileSize);
    header('Cache-Control: no-cache, must-revalidate');
    header('Pragma: public');
    
    // Fájl tartalmának kiírása
    readfile($filePath);
    exit();
    
} catch (PDOException $e) {
    error_log("Fájl letöltési hiba: " . $e->getMessage());
    http_response_code(500);
    die('Adatbázis hiba történt!');
} catch (Exception $e) {
    error_log("Fájl letöltési hiba: " . $e->getMessage());
    http_response_code(500);
    die('Hiba történt a fájl letöltése során!');
}
?>