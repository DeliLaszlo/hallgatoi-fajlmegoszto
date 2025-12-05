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
        // 1. Mód: Neptun kód alapján chatszobák keresése (dashboard saját és követett chatszobák)
        
        $query = "SELECT 
                    ch.room_id,
                    ch.title,
                    ch.description,
                    ch.class_code,
                    ch.creater_neptun,
                    ch.create_date,
                    c.class_name,
                    usr.nickname as creater_nickname,
                    ra.active,
                    CASE 
                        WHEN ch.creater_neptun = ? THEN 'own'
                        ELSE 'followed'
                    END as chatroom_type
                  FROM chatroom ch
                  LEFT JOIN class c ON ch.class_code = c.class_code
                  LEFT JOIN user usr ON ch.creater_neptun = usr.neptun_k
                  LEFT JOIN room_access ra ON ch.room_id = ra.room_id AND ra.neptun = ?
                  WHERE ch.creater_neptun = ? OR (ra.neptun = ? AND ra.active = 1)
                  ORDER BY ch.room_id DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ssss", $user_neptun, $user_neptun, $user_neptun, $user_neptun);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $chatrooms = [];
        while ($row = $result->fetch_assoc()) {
            // Ha a létrehozó NULL, akkor "Adminisztrátor"
            $creater_nickname = $row['creater_neptun'] ? $row['creater_nickname'] : 'Adminisztrátor';
            
            // Formázzuk a dátumot, ha nem NULL
            $create_date = $row['create_date'] ? date('Y-m-d', strtotime($row['create_date'])) : null;
            
            $chatrooms[] = [
                'room_id' => $row['room_id'],
                'title' => $row['title'],
                'description' => $row['description'],
                'class_code' => $row['class_code'],
                'class_name' => $row['class_name'],
                'creater_neptun' => $row['creater_neptun'],
                'creater_nickname' => $creater_nickname,
                'create_date' => $create_date,
                'chatroom_type' => $row['chatroom_type'],
                'is_active' => ($row['active'] == 1)
            ];
        }
        
        echo json_encode(['success' => true, 'chatrooms' => $chatrooms]);
        
    } elseif ($mode === 'class') {
        // 2. Mód: Tárgy kód alapján chatszobák keresése (subject chatszobák)
        
        $class_code = $_GET['class_code'] ?? null;
        
        if (!$class_code) {
            echo json_encode(['success' => false, 'message' => 'Hiányzó class_code paraméter']);
            exit();
        }
        
        $query = "SELECT 
                    ch.room_id,
                    ch.title,
                    ch.description,
                    ch.class_code,
                    ch.creater_neptun,
                    ch.create_date,
                    usr.nickname as creater_nickname,
                    ra.active
                  FROM chatroom ch
                  LEFT JOIN user usr ON ch.creater_neptun = usr.neptun_k
                  LEFT JOIN room_access ra ON ch.room_id = ra.room_id AND ra.neptun = ?
                  WHERE ch.class_code = ?
                  ORDER BY ch.room_id DESC";
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param("ss", $user_neptun, $class_code);
        $stmt->execute();
        $result = $stmt->get_result();
        
        $chatrooms = [];
        while ($row = $result->fetch_assoc()) {
            // Ellenőrizzük, hogy a felhasználó saját chatszobája-e
            $is_own = ($row['creater_neptun'] === $user_neptun);
            
            // Követi-e a chatszobát (ha van room_access bejegyzés a felhasználónak ehhez a szobához)
            $is_following = !is_null($row['active']);
            
            // Ha a létrehozó NULL, akkor "Adminisztrátor"
            $creater_nickname = $row['creater_neptun'] ? $row['creater_nickname'] : 'Adminisztrátor';
            
            // Formázzuk a dátumot, ha nem NULL
            $create_date = $row['create_date'] ? date('Y-m-d', strtotime($row['create_date'])) : null;
            
            $chatrooms[] = [
                'room_id' => $row['room_id'],
                'title' => $row['title'],
                'description' => $row['description'],
                'class_code' => $row['class_code'],
                'creater_neptun' => $row['creater_neptun'],
                'creater_nickname' => $creater_nickname,
                'create_date' => $create_date,
                'is_own' => $is_own,
                'is_following' => $is_following
            ];
        }
        
        echo json_encode(['success' => true, 'chatrooms' => $chatrooms]);
        
    } elseif ($mode === 'all') {
        // 3. Mód: Összes chatszoba lekérdezése admin számára
        
        // Admin jogosultság ellenőrzése
        if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
            echo json_encode(['success' => false, 'message' => 'Nincs admin jogosultság']);
            exit();
        }
        
        $query = "SELECT 
                    ch.room_id,
                    ch.title,
                    ch.description,
                    ch.class_code,
                    ch.creater_neptun,
                    ch.create_date,
                    c.class_name,
                    usr.nickname as creater_nickname
                  FROM chatroom ch
                  LEFT JOIN class c ON ch.class_code = c.class_code
                  LEFT JOIN user usr ON ch.creater_neptun = usr.neptun_k
                  ORDER BY ch.create_date DESC";
        
        $result = $conn->query($query);
        
        if ($result->num_rows === 0) {
            echo json_encode(['success' => true, 'chatrooms' => []]);
            exit();
        }
        
        $chatrooms = [];
        while ($row = $result->fetch_assoc()) {
            // Ha a létrehozó NULL, akkor "Adminisztrátor"
            $creater_nickname = $row['creater_neptun'] ? $row['creater_nickname'] : 'Adminisztrátor';
            
            // Formázzuk a dátumot, ha nem NULL
            $create_date = $row['create_date'] ? date('Y-m-d', strtotime($row['create_date'])) : null;
            
            $chatrooms[] = [
                'room_id' => $row['room_id'],
                'title' => $row['title'],
                'description' => $row['description'],
                'class_code' => $row['class_code'],
                'class_name' => $row['class_name'],
                'creater_neptun' => $row['creater_neptun'],
                'creater_nickname' => $creater_nickname,
                'create_date' => $create_date
            ];
        }
        
        echo json_encode(['success' => true, 'chatrooms' => $chatrooms]);
        
    } else {
        echo json_encode(['success' => false, 'message' => 'Ismeretlen mode']);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Hiba történt: ' . $e->getMessage()]);
}

$conn->close();
?>
