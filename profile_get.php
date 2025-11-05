<?php
declare(strict_types=1);
session_start();

// Mindig JSON legyen
header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', '0');
ini_set('html_errors', '0');
ini_set('log_errors', '1');

// Hogy a 500-at is JSON-ban kapd meg
set_exception_handler(function (Throwable $e) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => ['message' => $e->getMessage()]], JSON_UNESCAPED_UNICODE);
    exit;
});
set_error_handler(function ($sev, $msg, $file, $line) {
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => ['message' => "$msg in $file:$line"]], JSON_UNESCAPED_UNICODE);
    exit;
});

// --- Gyors ping a fájl életképességére (böngészőben kipróbálható: ?__ping=1) ---
if (isset($_GET['__ping'])) {
    echo json_encode(['ok' => true, 'data' => ['ping' => 'pong']]);
    exit;
}

// --- AUTH: nálad a kulcs ez ---
$neptun = $_SESSION['user_neptun'] ?? null;
if (!$neptun) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => ['message' => 'UNAUTH', 'session' => $_SESSION]], JSON_UNESCAPED_UNICODE);
    exit;
}

// --- DB kapcsolat ---
require_once __DIR__ . '/db.php'; // győződj meg róla, hogy a path jó!
$pdo = db(); // PDO: ERRMODE_EXCEPTION legyen

// --- Lekérdezés ---
$stmt = $pdo->prepare("
    SELECT neptun_k, nickname, vnev, knev, email
    FROM user
    WHERE neptun_k = :n
    LIMIT 1
");
$stmt->execute([':n' => $neptun]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$row) {
    http_response_code(404);
    echo json_encode(['ok' => false, 'error' => ['message' => 'USER_NOT_FOUND']], JSON_UNESCAPED_UNICODE);
    exit;
}

$fullname = trim(($row['vnev'] ?? '') . ' ' . ($row['knev'] ?? ''));
echo json_encode([
    'ok'   => true,
    'data' => [
        'neptun_k' => $row['neptun_k'],
        'nickname' => $row['nickname'],
        'fullname' => $fullname,
        'email'    => $row['email'],
    ]
], JSON_UNESCAPED_UNICODE);