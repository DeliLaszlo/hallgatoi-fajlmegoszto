<?php
declare(strict_types=1);
session_start();
header('Content-Type: application/json; charset=utf-8');

// Itt egységesítsd a session kulcsot a loginban használtal:
$me = $_SESSION['neptun'] ?? $_SESSION['neptun_k'] ?? null;
if ($me === null) {
    // A jelenlegi JS egy TÖMBÖT vár vissza → küldj vissza üres tömböt 401 mellett,
    // hogy ne dőljön el a forEach (vagy lásd a JS-javítást lentebb).
    http_response_code(401);
    echo json_encode([]); 
    exit;
}

// ... PDO csatlakozás ...
// SELECT c.class_code, c.class_name
// FROM user_classes uc JOIN class c ON c.class_code = uc.class_code
// WHERE uc.neptun = :me AND (uc.allapot = 1 OR allapot feltétel nélkül)
// ORDER BY c.class_name ASC
// echo json_encode($rows, JSON_UNESCAPED_UNICODE);


// -- Auth check --------------------------------------------------------------
if (!isset($_SESSION['neptun']) && !isset($_SESSION['neptun_k'])) {
    http_response_code(401);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['ok' => false, 'error' => ['code' => 'UNAUTH', 'message' => 'Bejelentkezés szükséges']]);
    exit;
}
$me = $_SESSION['neptun'] ?? $_SESSION['neptun_k'];

// -- PDO (használhatod a meglévő db connt / db.php-t) -----------------------
require_once __DIR__ . '/../config.php';
$pdo = db();

// -- Paraméterek -------------------------------------------------------------
$q        = isset($_GET['q']) ? trim((string)$_GET['q']) : '';
$page     = max(1, (int)($_GET['page'] ?? 1));
$pageSize = min(50, max(1, (int)($_GET['pageSize'] ?? 20)));
$offset   = ($page - 1) * $pageSize;

// -- WHERE és COUNT ----------------------------------------------------------
$where = 'WHERE 1=1';
$params = [];

if ($q !== '') {
    $where .= ' AND (c.class_code LIKE :q OR c.class_name LIKE :q)';
    $params[':q'] = "%{$q}%";
}

// Olyan tárgyak, amelyekre a felhasználó nincs felvéve aktívan
// (ha az "allapot" flag nincs használva, vedd ki az AND uc.allapot = 1 részt)
$sqlBase = "
    FROM class c
    LEFT JOIN user_classes uc
      ON uc.class_code = c.class_code
     AND uc.neptun = :me
     AND uc.allapot = 1
    $where
    AND uc.neptun IS NULL
";
$params[':me'] = $me;

// Total
$stmt = $pdo->prepare("SELECT COUNT(*) $sqlBase");
$stmt->execute($params);
$total = (int)$stmt->fetchColumn();

// Lista
$stmt = $pdo->prepare("
    SELECT c.class_code, c.class_name
    $sqlBase
    ORDER BY c.class_name ASC
    LIMIT :limit OFFSET :offset
");
foreach ($params as $k => $v) {
    $stmt->bindValue($k, $v, is_int($v) ? \PDO::PARAM_INT : \PDO::PARAM_STR);
}
$stmt->bindValue(':limit', $pageSize, \PDO::PARAM_INT);
$stmt->bindValue(':offset', $offset, \PDO::PARAM_INT);
$stmt->execute();

$data = $stmt->fetchAll(\PDO::FETCH_ASSOC);

// -- Válasz ------------------------------------------------------------------
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
    'ok'   => true,
    'data' => $data,
    'meta' => [
        'page' => $page,
        'pageSize' => $pageSize,
        'total' => $total
    ]
], JSON_UNESCAPED_UNICODE);