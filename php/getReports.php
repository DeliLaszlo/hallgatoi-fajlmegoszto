<?php
/**
 * Jelentések lekérdezése API (Admin)
 * 
 * Visszaadja az összes beküldött jelentést a jelentett tartalom
 * részleteivel együtt. Csak adminisztrátorok számára elérhető.
 * 
 * Metódus: GET
 * Válasz: JSON [{report_id, reported_type, description, item_details...}, ...]
 * Szükséges: Bejelentkezés, Admin jogosultság
 */
session_start();
require_once '../config.php';

header('Content-Type: application/json');

// Ellenőrizzük, hogy a felhasználó be van-e jelentkezve
if (!isset($_SESSION['user_neptun'])) {
    echo json_encode(['success' => false, 'message' => 'Nem vagy bejelentkezve']);
    exit();
}

// Admin jogosultság ellenőrzése
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Nincs admin jogosultság']);
    exit();
}

try {
    $query = "SELECT 
                r.report_id,
                r.report_neptun,
                r.reported_type,
                r.reported_table,
                r.reported_id,
                r.description as report_description,
                u.nickname,
                u.vnev,
                u.knev
              FROM report r
              JOIN user u ON r.report_neptun = u.neptun_k
              ORDER BY r.report_id DESC";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute();
    $reports = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Kiegészítjük a jelentéseket az adott elem részleteivel
    foreach ($reports as &$report) {
        switch ($report['reported_table']) {
            case 'upload':
                $uploadStmt = $pdo->prepare("SELECT u.upload_title, u.upload_date, u.file_name, u.comment, u.neptun, us.vnev, us.knev, us.nickname 
                                            FROM upload u 
                                            JOIN user us ON u.neptun = us.neptun_k 
                                            WHERE u.up_id = :id");
                $uploadStmt->bindParam(':id', $report['reported_id'], PDO::PARAM_INT);
                $uploadStmt->execute();
                $uploadDetails = $uploadStmt->fetch(PDO::FETCH_ASSOC);
                if ($uploadDetails) {
                    $report['item_name'] = $uploadDetails['upload_title'];
                    $report['item_date'] = $uploadDetails['upload_date'];
                    $report['file_name'] = $uploadDetails['file_name'];
                    $report['item_description'] = $uploadDetails['comment'];
                    $report['item_creator_neptun'] = $uploadDetails['neptun'];
                    $report['item_creator_name'] = $uploadDetails['vnev'] . ' ' . $uploadDetails['knev'];
                }
                break;
                
            case 'request':
                $requestStmt = $pdo->prepare("SELECT r.request_name, r.request_date, r.description, r.neptun_k, u.vnev, u.knev, u.nickname 
                                              FROM request r 
                                              JOIN user u ON r.neptun_k = u.neptun_k 
                                              WHERE r.request_id = :id");
                $requestStmt->bindParam(':id', $report['reported_id'], PDO::PARAM_INT);
                $requestStmt->execute();
                $requestDetails = $requestStmt->fetch(PDO::FETCH_ASSOC);
                if ($requestDetails) {
                    $report['item_name'] = $requestDetails['request_name'];
                    $report['item_date'] = $requestDetails['request_date'];
                    $report['item_description'] = $requestDetails['description'];
                    $report['item_creator_neptun'] = $requestDetails['neptun_k'];
                    $report['item_creator_name'] = $requestDetails['vnev'] . ' ' . $requestDetails['knev'];
                }
                break;
                
            case 'chatroom':
                $chatroomStmt = $pdo->prepare("SELECT c.title, c.create_date, c.description, c.creater_neptun, u.vnev, u.knev, u.nickname 
                                               FROM chatroom c 
                                               LEFT JOIN user u ON c.creater_neptun = u.neptun_k 
                                               WHERE c.room_id = :id");
                $chatroomStmt->bindParam(':id', $report['reported_id'], PDO::PARAM_INT);
                $chatroomStmt->execute();
                $chatroomDetails = $chatroomStmt->fetch(PDO::FETCH_ASSOC);
                if ($chatroomDetails) {
                    $report['item_name'] = $chatroomDetails['title'];
                    $report['item_date'] = $chatroomDetails['create_date'];
                    $report['item_description'] = $chatroomDetails['description'];
                    $report['item_creator_neptun'] = $chatroomDetails['creater_neptun'];
                    if ($chatroomDetails['vnev'] && $chatroomDetails['knev']) {
                        $report['item_creator_name'] = $chatroomDetails['vnev'] . ' ' . $chatroomDetails['knev'];
                    } else {
                        $report['item_creator_name'] = 'Rendszer';
                    }
                }
                break;
        }
        
        $report['reporter_name'] = $report['vnev'] . ' ' . $report['knev'];
        $report['reporter_neptun'] = $report['report_neptun'];
    }
    
    echo json_encode(['success' => true, 'reports' => $reports]);
    
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Adatbázis hiba: ' . $e->getMessage()]);
}
?>
