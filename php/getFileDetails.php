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

if (!$mode) {
    echo json_encode(['success' => false, 'message' => 'Hiányzó paraméterek']);
    exit();
}

// Ha mode=all, akkor nincs szükség id-re
if ($mode !== 'all' && !$id) {
    echo json_encode(['success' => false, 'message' => 'Hiányzó paraméterek']);
    exit();
}

try {
    if ($mode === 'upload') {
        // 1. Mód: up_id alapján
        $up_id = intval($id);
        $user_neptun = $_SESSION['user_neptun'];
        
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
                    u.upload_date,
                    u.downloads,
                    uv.value as user_vote
                  FROM upload u
                  INNER JOIN user usr ON u.neptun = usr.neptun_k
                  INNER JOIN class c ON u.class_code = c.class_code
                  LEFT JOIN user_votes uv ON u.up_id = uv.upload_id AND uv.neptun_k = ?
                  WHERE u.up_id = ?";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("si", $user_neptun, $up_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Nem található fájl']);
            exit();
        }
        
        $row = $result->fetch_assoc();
        
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
                'upload_date' => $row['upload_date'],
                'downloads' => $row['downloads'],
                'rating' => $row['rating'],
                'description' => $row['description'],
                'path_to_file' => $row['path_to_file'],
                'user_vote' => $row['user_vote']
            ]
        ];
        
        echo json_encode($response);
        
    } elseif ($mode === 'request') {
        // 2. Mód: request_id alapján
        $request_id = intval($id);
        $user_neptun = $_SESSION['user_neptun'];
        
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
                    r.description as request_description,
                    u.upload_date,
                    u.downloads,
                    uv.value as user_vote
                  FROM upload_request ur
                  INNER JOIN upload u ON ur.upload_id = u.up_id
                  INNER JOIN user usr ON u.neptun = usr.neptun_k
                  INNER JOIN class c ON u.class_code = c.class_code
                  INNER JOIN request r ON ur.request_id = r.request_id
                  LEFT JOIN user_votes uv ON u.up_id = uv.upload_id AND uv.neptun_k = ?
                  WHERE ur.request_id = ?";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("si", $user_neptun, $request_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Nem található fájl ehhez a kérelemhez']);
            exit();
        }
        
        $row = $result->fetch_assoc();
        
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
                'upload_date' => $row['upload_date'],
                'downloads' => $row['downloads'],
                'rating' => $row['rating'],
                'description' => $row['description'],
                'path_to_file' => $row['path_to_file'],
                'status' => $row['status'],
                'request_name' => $row['request_name'],
                'request_description' => $row['request_description'],
                'user_vote' => $row['user_vote']
            ]
        ];
        
        echo json_encode($response);
        
    } elseif ($mode === 'all') {
        // 3. Mód: Összes fájl lekérdezése admin számára
        
        // Admin jogosultság ellenőrzése
        if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
            echo json_encode(['success' => false, 'message' => 'Nincs admin jogosultság']);
            exit();
        }
        
        $query = "SELECT 
                    u.up_id,
                    u.upload_title,
                    u.file_name,
                    u.comment as description,
                    u.neptun as uploader_neptun,
                    usr.nickname as uploader_nickname,
                    c.class_name,
                    u.class_code,
                    u.upload_date,
                    u.downloads
                  FROM upload u
                  INNER JOIN user usr ON u.neptun = usr.neptun_k
                  INNER JOIN class c ON u.class_code = c.class_code
                  ORDER BY u.upload_date DESC";
        
        $result = $conn->query($query);
        
        if ($result->num_rows === 0) {
            echo json_encode(['success' => true, 'files' => []]);
            exit();
        }
        
        $files = [];
        while ($row = $result->fetch_assoc()) {
            $files[] = [
                'up_id' => $row['up_id'],
                'title' => $row['upload_title'],
                'file_name' => $row['file_name'],
                'uploader' => $row['uploader_nickname'] . ' (' . $row['uploader_neptun'] . ')',
                'uploader_neptun' => $row['uploader_neptun'],
                'class_name' => $row['class_name'],
                'class_code' => $row['class_code'],
                'upload_date' => $row['upload_date'],
                'downloads' => $row['downloads'],
                'description' => $row['description']
            ];
        }
        
        echo json_encode(['success' => true, 'files' => $files]);
        
    } else {
        echo json_encode(['success' => false, 'message' => 'Ismeretlen mód']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Hiba történt: ' . $e->getMessage()]);
}

$conn->close();
?>
