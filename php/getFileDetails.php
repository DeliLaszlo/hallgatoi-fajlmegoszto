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

// Meghatározzuk, hogy milyen típusú lekérdezést kell végrehajtani
$mode = $_GET['mode'] ?? null;
$id = $_GET['id'] ?? null;

if (!$mode || !$id) {
    echo json_encode(['success' => false, 'message' => 'Hiányzó paraméterek']);
    exit();
}

try {
    if ($mode === 'upload') {
        // 1. Mód: up_id alapján
        $up_id = intval($id);
        
        $query = "SELECT 
                    u.up_id,
                    u.upload_title,
                    u.file_name,
                    u.comment as description,
                    u.rating,
                    u.neptun as uploader_neptun,
                    usr.nickname as uploader_nickname,
                    c.class_name,
                    u.class_code,
                    u.path_to_file
                  FROM upload u
                  INNER JOIN user usr ON u.neptun = usr.neptun_k
                  INNER JOIN class c ON u.class_code = c.class_code
                  WHERE u.up_id = ?";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $up_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Nem található fájl']);
            exit();
        }
        
        $row = $result->fetch_assoc();
        
        // Statikus értékek (később implementálandók)
        $upload_date = "2025-01-15"; // Statikus dátum
        $file_size = "2.5 MB"; // Statikus fájlméret
        $downloads = 42; // Statikus letöltésszám
        
        // Válasz összeállítása
        $response = [
            'success' => true,
            'data' => [
                'up_id' => $row['up_id'],
                'title' => $row['upload_title'],
                'file_name' => $row['file_name'],
                'uploader' => $row['uploader_nickname'] . ' (' . $row['uploader_neptun'] . ')',
                'uploader_neptun' => $row['uploader_neptun'],
                'class_name' => $row['class_name'],
                'class_code' => $row['class_code'],
                'upload_date' => $upload_date,
                'file_size' => $file_size,
                'downloads' => $downloads,
                'rating' => $row['rating'],
                'description' => $row['description'],
                'path_to_file' => $row['path_to_file']
            ]
        ];
        
        echo json_encode($response);
        
    } elseif ($mode === 'request') {
        // 2. Mód: request_id alapján
        $request_id = intval($id);
        
        $query = "SELECT 
                    u.up_id,
                    u.upload_title,
                    u.file_name,
                    u.comment as description,
                    u.rating,
                    u.neptun as uploader_neptun,
                    usr.nickname as uploader_nickname,
                    c.class_name,
                    u.class_code,
                    u.path_to_file,
                    ur.status,
                    r.request_name,
                    r.description as request_description
                  FROM upload_request ur
                  INNER JOIN upload u ON ur.upload_id = u.up_id
                  INNER JOIN user usr ON u.neptun = usr.neptun_k
                  INNER JOIN class c ON u.class_code = c.class_code
                  INNER JOIN request r ON ur.request_id = r.request_id
                  WHERE ur.request_id = ?";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $request_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Nem található fájl ehhez a kérelemhez']);
            exit();
        }
        
        $row = $result->fetch_assoc();
        
        // Statikus értékek (később implementálandók)
        $upload_date = "2025-01-15"; // Statikus dátum
        $file_size = "2.5 MB"; // Statikus fájlméret
        $downloads = 42; // Statikus letöltésszám
        
        // Válasz összeállítása
        $response = [
            'success' => true,
            'data' => [
                'up_id' => $row['up_id'],
                'request_id' => $request_id,
                'title' => $row['upload_title'],
                'file_name' => $row['file_name'],
                'uploader' => $row['uploader_nickname'] . ' (' . $row['uploader_neptun'] . ')',
                'uploader_neptun' => $row['uploader_neptun'],
                'class_name' => $row['class_name'],
                'class_code' => $row['class_code'],
                'upload_date' => $upload_date,
                'file_size' => $file_size,
                'downloads' => $downloads,
                'rating' => $row['rating'],
                'description' => $row['description'],
                'path_to_file' => $row['path_to_file'],
                'status' => $row['status'],
                'request_name' => $row['request_name'],
                'request_description' => $row['request_description']
            ]
        ];
        
        echo json_encode($response);
        
    } else {
        echo json_encode(['success' => false, 'message' => 'Ismeretlen mód']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Hiba történt: ' . $e->getMessage()]);
}

$conn->close();
?>
