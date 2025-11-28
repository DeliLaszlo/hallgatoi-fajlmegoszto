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
        // 1. Mód: Neptun kód alapján kérelmek keresése (dashboard saját kérelmek)
        
        $query = "SELECT 
                    r.request_id,
                    r.request_name,
                    r.description,
                    r.class_code,
                    c.class_name,
                    ur.status,
                    r.request_date
                  FROM request r
                  INNER JOIN class c ON r.class_code = c.class_code
                  LEFT JOIN upload_request ur ON r.request_id = ur.request_id
                  WHERE r.neptun_k = ?
                  ORDER BY r.request_id DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $user_neptun);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $requests = [];
        while ($row = $result->fetch_assoc()) {
            // Teljesítettség ellenőrzése: 'T' = teljesített, egyébként várakozó
            $is_completed = ($row['status'] === 'T');
            
            $requests[] = [
                'request_id' => $row['request_id'],
                'request_name' => $row['request_name'],
                'description' => $row['description'],
                'class_code' => $row['class_code'],
                'class_name' => $row['class_name'],
                'request_date' => $row['request_date'],
                'is_completed' => $is_completed
            ];
        }
        
        echo json_encode(['success' => true, 'requests' => $requests]);
        
    } elseif ($mode === 'class') {
        // 2. Mód: Tárgy kód alapján kérelmek keresése (subject kérelmek)
        
        $class_code = $_GET['class_code'] ?? null;
        
        if (!$class_code) {
            echo json_encode(['success' => false, 'message' => 'Hiányzó class_code paraméter']);
            exit();
        }
        
        $query = "SELECT 
                    r.request_id,
                    r.request_name,
                    r.description,
                    r.neptun_k as requester_neptun,
                    usr.nickname as requester_nickname,
                    r.class_code,
                    ur.status,
                    r.request_date
                  FROM request r
                  INNER JOIN user usr ON r.neptun_k = usr.neptun_k
                  LEFT JOIN upload_request ur ON r.request_id = ur.request_id
                  WHERE r.class_code = ? AND (ur.status IS NULL OR ur.status != 'T')
                  ORDER BY r.request_id DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $class_code);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $requests = [];
        while ($row = $result->fetch_assoc()) {
            // Ellenőrizzük, hogy a felhasználó saját kérelme-e
            $is_own = ($row['requester_neptun'] === $user_neptun);
            
            // Teljesítettség ellenőrzése: 'T' = teljesített, egyébként várakozó
            $is_completed = ($row['status'] === 'T');
            
            $requests[] = [
                'request_id' => $row['request_id'],
                'request_name' => $row['request_name'],
                'description' => $row['description'],
                'requester_neptun' => $row['requester_neptun'],
                'requester_nickname' => $row['requester_nickname'],
                'request_date' => $row['request_date'],
                'is_own' => $is_own,
                'is_completed' => $is_completed,
                'class_code' => $row['class_code']
            ];
        }
        
        echo json_encode(['success' => true, 'requests' => $requests]);
        
    } elseif ($mode === 'all') {
        // 3. Mód: Összes kérelem lekérdezése admin számára
        
        $query = "SELECT 
                    r.request_id,
                    r.request_name,
                    r.description,
                    r.class_code,
                    c.class_name,
                    r.neptun_k as requester_neptun,
                    usr.nickname as requester_nickname,
                    r.request_date,
                    ur.status
                  FROM request r
                  INNER JOIN user usr ON r.neptun_k = usr.neptun_k
                  INNER JOIN class c ON r.class_code = c.class_code
                  LEFT JOIN upload_request ur ON r.request_id = ur.request_id
                  ORDER BY r.request_date DESC";
        
        $result = $conn->query($query);
        
        if ($result->num_rows === 0) {
            echo json_encode(['success' => true, 'requests' => []]);
            exit();
        }
        
        $requests = [];
        while ($row = $result->fetch_assoc()) {
            $is_completed = ($row['status'] === 'T');
            
            $requests[] = [
                'request_id' => $row['request_id'],
                'request_name' => $row['request_name'],
                'description' => $row['description'],
                'class_code' => $row['class_code'],
                'class_name' => $row['class_name'],
                'requester_neptun' => $row['requester_neptun'],
                'requester_nickname' => $row['requester_nickname'],
                'request_date' => $row['request_date'],
                'is_completed' => $is_completed
            ];
        }
        
        echo json_encode(['success' => true, 'requests' => $requests]);
        
    } else {
        echo json_encode(['success' => false, 'message' => 'Ismeretlen mode']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Hiba történt: ' . $e->getMessage()]);
}

$conn->close();
?>
