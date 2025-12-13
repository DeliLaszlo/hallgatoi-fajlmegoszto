<?php
/**
 * Jelentés beküldése API
 * 
 * Beküld egy jelentést (report) egy tartalom ellen (fájl, kérelem vagy chatszoba).
 * Ellenőrzi, hogy a felhasználó nem jelentette-e már korábban ugyanazt.
 * 
 * Metódus: POST
 * Paraméterek:
 *   - item_type (string): Tartalom típusa (upload|request|chatroom)
 *   - item_id (int): Tartalom azonosítója
 *   - report_description (string): Jelentés indoklása
 * Válasz: JSON {success: bool, error?: string, message?: string}
 * Szükséges: Bejelentkezés
 */
session_start();
require_once '../config.php';
header('Content-Type: application/json');

if (!isset($_SESSION['user_neptun'])) {
    echo json_encode(['success' => false, 'error' => 'Nincs bejelentkezve!']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $report_neptun = $_SESSION['user_neptun'];
    $description = trim($_POST['report_description'] ?? '');
    
    $item_type = $_POST['item_type'] ?? ''; 
    $item_id = $_POST['item_id'] ?? '';

    if (empty($description) || empty($item_type) || empty($item_id)) {
        echo json_encode(['success' => false, 'error' => 'Hiányzó adatok a jelentéshez!']);
        exit();
    }

    $reported_table = '';
    $reported_type_display = '';

    switch ($item_type) {
        case 'upload':
            $reported_table = 'upload';
            $reported_type_display = 'Feltöltés';
            break;
        case 'request':
            $reported_table = 'request';
            $reported_type_display = 'Kérelem';
            break;
        case 'chatroom':
            $reported_table = 'chatroom';
            $reported_type_display = 'Chatszoba';
            break;
        default:
            echo json_encode(['success' => false, 'error' => 'Érvénytelen jelentés típus!']);
            exit();
    }

    try {
        $pdo = getPdoConnection();
        
        // Ellenőrzés: volt-e már ilyen jelentés
        $check = $pdo->prepare("SELECT report_id FROM report WHERE report_neptun = :neptun AND reported_table = :table AND reported_id = :id");
        $check->execute([':neptun' => $report_neptun, ':table' => $reported_table, ':id' => $item_id]);
        
        if ($check->fetch()) {
            echo json_encode(['success' => false, 'error' => 'Ezt a tartalmat már jelentetted!']);
            exit();
        }

        
        // Mivel nincs AUTO_INCREMENT, lekérjük a legnagyobb ID-t és hozzáadunk egyet
        $idQuery = $pdo->query("SELECT MAX(report_id) FROM report");
        $maxId = $idQuery->fetchColumn();
        $nextId = $maxId ? ($maxId + 1) : 1; // Ha üres a tábla, 1-gyel kezdünk

        // Beszúrás a generált ID-val (report_id mezőt is töltjük!)
        $stmt = $pdo->prepare("INSERT INTO report (report_id, report_neptun, reported_type, reported_table, reported_id, description) VALUES (:id, :rpt_neptun, :rpt_type, :rpt_table, :rpt_id, :desc)");
        
        $stmt->execute([
            ':id'         => $nextId,
            ':rpt_neptun' => $report_neptun,
            ':rpt_type'   => $reported_type_display,
            ':rpt_table'  => $reported_table,
            ':rpt_id'     => $item_id,
            ':desc'       => $description
        ]);

        echo json_encode(['success' => true, 'message' => 'Jelentés sikeresen elküldve!']);

    } catch (PDOException $e) {
        // Ha még így is ütközés van (pl. ketten egyszerre jelentettek), próbáljuk újra eggyel nagyobbal
        if ($e->getCode() == 23000) {
             echo json_encode(['success' => false, 'error' => 'Rendszerhiba (ütközés), próbáld újra pár másodperc múlva!']);
        } else {
             echo json_encode(['success' => false, 'error' => 'SQL Hiba: ' . $e->getMessage()]);
        }
    }
}
?>