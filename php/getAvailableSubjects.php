<?php
declare(strict_types=1);
session_start();

header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', '0');
ini_set('html_errors', '0');
ini_set('log_errors', '1');

set_exception_handler(function (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => ['code' => 'EXCEPTION', 'message' => $e->getMessage()]], JSON_UNESCAPED_UNICODE);
    exit;
});
set_error_handler(function ($severity, $message, $file, $line) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => ['code' => 'ERROR', 'message' => "$message in $file:$line"]], JSON_UNESCAPED_UNICODE);
    exit;
});

// --- AUTH (a te kulcsoddal) ---
$me = $_SESSION['user_neptun'] ?? null;
if ($me === null) {
    http_response_code(401);
    echo json_encode([]);
    exit;
}

// --- DB ---
require_once __DIR__ . '/../config.php';
$pdo = db(); // PDO: ERRMODE_EXCEPTION legyen

// --- Paraméterek ---
$q        = isset($_GET['q']) ? trim((string)$_GET['q']) : '';
$page     = max(1, (int)($_GET['page'] ?? 1));
$pageSize = min(50, max(1, (int)($_GET['pageSize'] ?? 20)));
$offset   = ($page - 1) * $pageSize;

// --- WHERE + PARAMS ---
$where  = 'WHERE 1=1';
$params = [':me' => $me];

if ($q !== '') {
    $where .= ' AND (c.class_code LIKE :q OR c.class_name LIKE :q)';
    $params[':q'] = "%{$q}%";
}

// LIMIT/OFFSET: ne bindoljuk, csak szigorúan intté castolva illesszük be (MySQL miatt)
$pageSize = (int)$pageSize;
$offset   = (int)$offset;

// Ha NEM használjátok az allapot = 1-et, TÖRÖLD azt a sort!
$sql = "
  SELECT c.class_code, c.class_name
  FROM class c
  LEFT JOIN user_classes uc
    ON uc.class_code = c.class_code
   AND uc.neptun     = :me
   AND uc.allapot    = 1       -- <<< HA NEM HASZNÁLJÁTOK, TÖRÖLD EZT A SORT!
  $where
  AND uc.neptun IS NULL
  ORDER BY c.class_name ASC
  LIMIT $pageSize OFFSET $offset
";

$stmt = $pdo->prepare($sql);
foreach ($params as $k => $v) {
    $stmt->bindValue($k, $v, is_int($v) ? PDO::PARAM_INT : PDO::PARAM_STR);
}
$stmt->execute();

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE);