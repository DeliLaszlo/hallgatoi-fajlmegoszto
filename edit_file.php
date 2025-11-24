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
if (!isset($_POST['up_id']) || empty($_POST['up_id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Hiányzó fájl azonosító!'
    ]);
    exit();
}

if (!isset($_POST['file_title']) || empty(trim($_POST['file_title']))) {
    echo json_encode([
        'success' => false,
        'error' => 'A fájl címe kötelező!'
    ]);
    exit();
}

if (!isset($_POST['file_description']) || empty(trim($_POST['file_description']))) {
    echo json_encode([
        'success' => false,
        'error' => 'A leírás kötelező!'
    ]);
    exit();
}

$up_id = $_POST['up_id'];
$file_title = trim($_POST['file_title']);
$file_description = trim($_POST['file_description']);
$replace_file = isset($_POST['replace_file']) && $_POST['replace_file'] === 'on';

try {
    require_once __DIR__ . '/../config.php';
    $pdo = getPdoConnection();
    
    // Ellenőrizzük, hogy a felhasználó feltöltötte-e ezt a fájlt
    $stmt = $pdo->prepare("
        SELECT up_id, file_name, path_to_file
        FROM upload 
        WHERE up_id = :up_id AND neptun = :neptun
    ");
    $stmt->execute([
        ':up_id' => $up_id,
        ':neptun' => $neptun
    ]);
    
    $existingFile = $stmt->fetch();
    
    if (!$existingFile) {
        echo json_encode([
            'success' => false,
            'error' => 'Nem te töltötted fel ezt a fájlt, vagy nem létezik!'
        ]);
        exit();
    }
    
    $newFileName = $existingFile['file_name'];
    $pathToFile = $existingFile['path_to_file'];
    
    // Ha új fájlt töltöttek fel
    if ($replace_file && isset($_FILES['file_upload']) && $_FILES['file_upload']['error'] === UPLOAD_ERR_OK) {
        $uploadedFile = $_FILES['file_upload'];
        
        // Fájl validáció
        $allowedExtensions = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx'];
        $fileExtension = strtolower(pathinfo($uploadedFile['name'], PATHINFO_EXTENSION));
        
        if (!in_array($fileExtension, $allowedExtensions)) {
            echo json_encode([
                'success' => false,
                'error' => 'Nem engedélyezett fájltípus!'
            ]);
            exit();
        }
        
        // Fájl méret ellenőrzés max 10mb több fölös
        $maxFileSize = 10 * 1024 * 1024; // 10MB
        if ($uploadedFile['size'] > $maxFileSize) {
            echo json_encode([
                'success' => false,
                'error' => 'A fájl mérete túl nagy! Maximum 10MB lehet.'
            ]);
            exit();
        }
        
        // Töröljük a régi fájlt
        $oldFilePath = $pathToFile . '/' . $existingFile['file_name'];
        if (file_exists($oldFilePath)) {
            @unlink($oldFilePath);
        }
        
        // Új fájlnév generálása (időbélyeg + eredeti név)
        $newFileName = time() . '_' . basename($uploadedFile['name']);
        $targetPath = $pathToFile . '/' . $newFileName;
        
        // Feltöltés könyvtár létrehozása, ha nem létezik
        if (!is_dir($pathToFile)) {
            mkdir($pathToFile, 0755, true);
        }
        
        // Fájl áthelyezése
        if (!move_uploaded_file($uploadedFile['tmp_name'], $targetPath)) {
            echo json_encode([
                'success' => false,
                'error' => 'Hiba történt a fájl feltöltése során!'
            ]);
            exit();
        }
    }
    
    // Frissítjük az adatbázist
    $updateStmt = $pdo->prepare("
        UPDATE upload 
        SET upload_title = :title, 
            comment = :description,
            file_name = :file_name
        WHERE up_id = :up_id AND neptun = :neptun
    ");
    
    $updateStmt->execute([
        ':title' => $file_title,
        ':description' => $file_description,
        ':file_name' => $newFileName,
        ':up_id' => $up_id,
        ':neptun' => $neptun
    ]);
    
    echo json_encode([
        'success' => true,
        'message' => 'Fájl sikeresen módosítva!'
    ]);
    
} catch (PDOException $e) {
    error_log("Fájl szerkesztési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Adatbázis hiba történt!'
    ]);
} catch (Exception $e) {
    error_log("Fájl szerkesztési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Hiba történt a fájl módosítása során!'
    ]);
}
?>