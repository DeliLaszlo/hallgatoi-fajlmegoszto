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

// Kötelező mezők ellenőrzése
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

if (!isset($_POST['class_code']) || empty($_POST['class_code'])) {
    echo json_encode([
        'success' => false,
        'error' => 'A tárgy kód kötelező!'
    ]);
    exit();
}

// Fájl ellenőrzése
if (!isset($_FILES['file_upload']) || $_FILES['file_upload']['error'] !== UPLOAD_ERR_OK) {
    $errorMessage = 'Hiba történt a fájl feltöltése során!';
    if (isset($_FILES['file_upload'])) {
        switch ($_FILES['file_upload']['error']) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $errorMessage = 'A fájl túl nagy!';
                break;
            case UPLOAD_ERR_NO_FILE:
                $errorMessage = 'Nem lett fájl kiválasztva!';
                break;
        }
    }
    echo json_encode([
        'success' => false,
        'error' => $errorMessage
    ]);
    exit();
}

$neptun = $_SESSION['user_neptun'];
$fileTitle = trim($_POST['file_title']);
$fileDescription = trim($_POST['file_description']);
$classCode = $_POST['class_code'];
$requestId = isset($_POST['request_id']) && !empty($_POST['request_id']) ? intval($_POST['request_id']) : null;

// Engedélyezett fájltípusok
$allowedExtensions = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'];
$originalFileName = basename($_FILES['file_upload']['name']);
$extension = strtolower(pathinfo($originalFileName, PATHINFO_EXTENSION));

if (!in_array($extension, $allowedExtensions)) {
    echo json_encode([
        'success' => false,
        'error' => 'Ez a fájltípus nem engedélyezett! Engedélyezett típusok: ' . implode(', ', $allowedExtensions)
    ]);
    exit();
}

// Maximális fájlméret (10MB)
$maxFileSize = 10 * 1024 * 1024;
if ($_FILES['file_upload']['size'] > $maxFileSize) {
    echo json_encode([
        'success' => false,
        'error' => 'A fájl túl nagy! Maximum 10MB engedélyezett.'
    ]);
    exit();
}

try {
    require_once __DIR__ . '/../config.php';
    $pdo = getPdoConnection();
    
    // Ellenőrizzük, hogy létezik-e a tárgy
    $classCheckStmt = $pdo->prepare("SELECT class_code FROM class WHERE class_code = ?");
    $classCheckStmt->execute([$classCode]);
    if (!$classCheckStmt->fetch()) {
        echo json_encode([
            'success' => false,
            'error' => 'A megadott tárgy nem létezik!'
        ]);
        exit();
    }
    
    // Ha kérelemhez töltünk fel, ellenőrizzük hogy létezik-e és nincs-e már teljesítve
    if ($requestId) {
        $requestCheckStmt = $pdo->prepare("
            SELECT r.request_id, r.neptun_k, r.class_code
            FROM request r
            LEFT JOIN upload_request ur ON r.request_id = ur.request_id
            WHERE r.request_id = ?
        ");
        $requestCheckStmt->execute([$requestId]);
        $requestData = $requestCheckStmt->fetch();
        
        if (!$requestData) {
            echo json_encode([
                'success' => false,
                'error' => 'A megadott kérelem nem létezik!'
            ]);
            exit();
        }
        
        // Ellenőrizzük, hogy a kérelem ugyanahhoz a tárgyhoz tartozik-e
        if ($requestData['class_code'] !== $classCode) {
            echo json_encode([
                'success' => false,
                'error' => 'A kérelem nem ehhez a tárgyhoz tartozik!'
            ]);
            exit();
        }
        
        // Nem tölthet fel saját kérelemre
        if (strtoupper($requestData['neptun_k']) === strtoupper($neptun)) {
            echo json_encode([
                'success' => false,
                'error' => 'Saját kérelemre nem tölthetsz fel!'
            ]);
            exit();
        }
    }
    
    // Fájl mentési könyvtár
    $uploadDir = __DIR__ . '/../files/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }
    
    // Eredeti fájlnév megtartása, ütközés esetén számozás hozzáadása
    $savedFileName = $originalFileName;
    $targetPath = $uploadDir . $savedFileName;
    
    if (file_exists($targetPath)) {
        $fileInfo = pathinfo($originalFileName);
        $counter = 1;
        do {
            $savedFileName = $fileInfo['filename'] . '_' . $counter . '.' . $fileInfo['extension'];
            $targetPath = $uploadDir . $savedFileName;
            $counter++;
        } while (file_exists($targetPath));
    }
    
    // Fájl áthelyezése
    if (!move_uploaded_file($_FILES['file_upload']['tmp_name'], $targetPath)) {
        echo json_encode([
            'success' => false,
            'error' => 'Hiba történt a fájl mentése során!'
        ]);
        exit();
    }
    
    // Tranzakció indítása
    $pdo->beginTransaction();
    
    try {
        // Új up_id generálása (7 jegyű)
        $maxIdStmt = $pdo->query("SELECT MAX(up_id) as max_id FROM upload");
        $maxIdRow = $maxIdStmt->fetch();
        $newUpId = $maxIdRow['max_id'] ? $maxIdRow['max_id'] + 1 : 1000001;
        
        // Upload rekord beszúrása
        $insertStmt = $pdo->prepare("
            INSERT INTO upload (up_id, class_code, neptun, file_name, path_to_file, upload_title, upload_date, downloads, comment, rating)
            VALUES (?, ?, ?, ?, ?, ?, CURDATE(), 0, ?, 0)
        ");
        $insertStmt->execute([
            $newUpId,
            $classCode,
            $neptun,
            $savedFileName,
            'files/',
            $fileTitle,
            $fileDescription
        ]);
        
        // Ha kérelemhez töltöttünk fel, kapcsoljuk össze
        if ($requestId) {
            // Ellenőrizzük, nincs-e már kapcsolat
            $existingLinkStmt = $pdo->prepare("SELECT request_id FROM upload_request WHERE request_id = ?");
            $existingLinkStmt->execute([$requestId]);
            
            if ($existingLinkStmt->fetch()) {
                // Frissítjük a meglévő kapcsolatot
                $updateLinkStmt = $pdo->prepare("
                    UPDATE upload_request 
                    SET upload_id = ?, status = 'F'
                    WHERE request_id = ?
                ");
                $updateLinkStmt->execute([$newUpId, $requestId]);
            } else {
                // Új kapcsolat létrehozása
                $insertLinkStmt = $pdo->prepare("
                    INSERT INTO upload_request (request_id, upload_id, status)
                    VALUES (?, ?, 'T')
                ");
                $insertLinkStmt->execute([$requestId, $newUpId]);
            }
        }
        
        $pdo->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Fájl sikeresen feltöltve!',
            'up_id' => $newUpId,
            'request_id' => $requestId,
            'file' => [
                'up_id' => $newUpId,
                'title' => $fileTitle,
                'description' => $fileDescription,
                'upload_date' => date('Y-m-d')
            ]
        ]);
        
    } catch (Exception $e) {
        $pdo->rollBack();
        // Töröljük a feltöltött fájlt, ha az adatbázis művelet sikertelen
        if (file_exists($targetPath)) {
            unlink($targetPath);
        }
        throw $e;
    }
    
} catch (PDOException $e) {
    error_log("Fájl feltöltési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Adatbázis hiba történt!'
    ]);
} catch (Exception $e) {
    error_log("Fájl feltöltési hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Hiba történt a feltöltés során!'
    ]);
}
?>
