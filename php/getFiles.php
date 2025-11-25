<?php
session_start();
header('Content-Type: application/json');

// Adatbázis kapcsolat
require_once __DIR__ . '/../config.php';
$conn = getMysqliConnection();

// Ellenőrizzük, hogy be van-e jelentkezve a felhasználó
if (!isset($_SESSION['user_neptun'])) {
    echo json_encode(['success' => false, 'message' => 'Nincs bejelentkezve']);
    exit();
}

$user_neptun = $_SESSION['user_neptun'];

// Meghatározzuk, hogy milyen típusú lekérdezést kell végrehajtani
$mode = $_GET['mode'] ?? null;

if (!$mode) {
    echo json_encode(['success' => false, 'message' => 'Hiányzó mode paraméter']);
    exit();
}

try {
    if ($mode === 'neptun') {
        // 1. Mód: Neptun kód alapján fájlok keresése (dashboard saját fájlok)
        
        $query = "SELECT 
                    u.up_id,
                    u.upload_title,
                    u.comment as description,
                    u.file_name,
                    u.class_code,
                    c.class_name,
                    u.rating,
                    u.upload_date
                  FROM upload u
                  INNER JOIN class c ON u.class_code = c.class_code
                  WHERE u.neptun = ?
                  ORDER BY u.up_id DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $user_neptun);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $files = [];
        while ($row = $result->fetch_assoc()) {
            $files[] = [
                'up_id' => $row['up_id'],
                'title' => $row['upload_title'],
                'description' => $row['description'],
                'file_name' => $row['file_name'],
                'class_code' => $row['class_code'],
                'class_name' => $row['class_name'],
                'upload_date' => $row['upload_date'],
                'rating' => $row['rating']
            ];
        }
        
        echo json_encode(['success' => true, 'files' => $files]);
        
    } elseif ($mode === 'class') {
        // 2. Mód: Tárgy kód alapján fájlok keresése (subject fájlok)
        
        $class_code = $_GET['class_code'] ?? null;
        
        if (!$class_code) {
            echo json_encode(['success' => false, 'message' => 'Hiányzó class_code paraméter']);
            exit();
        }
        
        $query = "SELECT 
                    u.up_id,
                    u.upload_title,
                    u.comment as description,
                    u.file_name,
                    u.neptun as uploader_neptun,
                    usr.nickname as uploader_nickname,
                    u.rating,
                    u.class_code,
                    u.upload_date,
                    u.downloads
                  FROM upload u
                  INNER JOIN user usr ON u.neptun = usr.neptun_k
                  WHERE u.class_code = ?
                  ORDER BY u.up_id DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $class_code);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $files = [];
        while ($row = $result->fetch_assoc()) {
            // Ellenőrizzük, hogy a felhasználó saját fájlja-e
            $is_own = ($row['uploader_neptun'] === $user_neptun);
            
            $files[] = [
                'up_id' => $row['up_id'],
                'title' => $row['upload_title'],
                'description' => $row['description'],
                'file_name' => $row['file_name'],
                'uploader_neptun' => $row['uploader_neptun'],
                'uploader_nickname' => $row['uploader_nickname'],
                'upload_date' => $row['upload_date'],
                'downloads' => $row['downloads'],
                'rating' => $row['rating'],
                'is_own' => $is_own,
                'class_code' => $row['class_code']
            ];
        }
        
        echo json_encode(['success' => true, 'files' => $files]);
        
    } else {
        echo json_encode(['success' => false, 'message' => 'Ismeretlen mode']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Hiba történt: ' . $e->getMessage()]);
}

$conn->close();
?>
