<?php
declare(strict_types=1);
session_start();

header('Content-Type: application/json; charset=utf-8');
ini_set('display_errors', '0');
ini_set('html_errors', '0');
ini_set('log_errors', '1');

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

$neptun = $_SESSION['user_neptun'] ?? null;
if (!$neptun) {
    http_response_code(401);
    echo json_encode(['ok' => false, 'error' => ['message' => 'UNAUTH']]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];
$nickname = trim((string)($input['nickname'] ?? ''));
$fullname = trim((string)($input['fullname'] ?? ''));
$email    = trim((string)($input['email'] ?? ''));

$currentPassword = (string)($input['current_password'] ?? '');
$newPassword     = (string)($input['new_password'] ?? '');
$newPasswordConf = (string)($input['new_password_confirm'] ?? '');

// ---- Validációk ----
if ($nickname === '' || mb_strlen($nickname) < 3 || mb_strlen($nickname) > 20 || !preg_match('/^[a-zA-Z0-9_]+$/', $nickname)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => ['message' => 'INVALID_NICKNAME']]);
    exit;
}
if ($fullname === '' || mb_strlen($fullname) < 2 || mb_strlen($fullname) > 100) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => ['message' => 'INVALID_FULLNAME']]);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => ['message' => 'INVALID_EMAIL']]);
    exit;
}

// fullname → vnev + knev (első szóköznél vágunk)
$parts = preg_split('/\s+/', $fullname, 2);
$vnev = $parts[0] ?? '';
$knev = $parts[1] ?? '';
if ($knev === '') { $knev = ''; }

// --- DB ---
require_once __DIR__ . '/db.php';
$pdo = db();

// Egyediség ellenőrzés (opcionális, de hasznos)
$chk = $pdo->prepare("SELECT COUNT(*) FROM user WHERE nickname = :nn AND neptun_k <> :me");
$chk->execute([':nn' => $nickname, ':me' => $neptun]);
if ((int)$chk->fetchColumn() > 0) {
    http_response_code(409);
    echo json_encode(['ok' => false, 'error' => ['message' => 'NICKNAME_IN_USE']]);
    exit;
}
$chk = $pdo->prepare("SELECT COUNT(*) FROM user WHERE email = :em AND neptun_k <> :me");
$chk->execute([':em' => $email, ':me' => $neptun]);
if ((int)$chk->fetchColumn() > 0) {
    http_response_code(409);
    echo json_encode(['ok' => false, 'error' => ['message' => 'EMAIL_IN_USE']]);
    exit;
}

// Jelszóváltás (opcionális)
$setPassword = false;
$hash = null;
if ($newPassword !== '' || $newPasswordConf !== '') {
    if ($newPassword !== $newPasswordConf) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => ['message' => 'PASSWORD_MISMATCH']]);
        exit;
    }
    // min 8, 1 nagybetű, 1 szám
    if (!preg_match('/^(?=.*[A-Z])(?=.*\d).{8,}$/', $newPassword)) {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => ['message' => 'WEAK_PASSWORD']]);
        exit;
    }
    if ($currentPassword === '') {
        http_response_code(400);
        echo json_encode(['ok' => false, 'error' => ['message' => 'CURRENT_PASSWORD_REQUIRED']]);
        exit;
    }
    // jelenlegi jelszó ellenőrzés
    $stmt = $pdo->prepare("SELECT password FROM user WHERE neptun_k = :me LIMIT 1");
    $stmt->execute([':me' => $neptun]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row || !password_verify($currentPassword, $row['password'])) {
        http_response_code(403);
        echo json_encode(['ok' => false, 'error' => ['message' => 'CURRENT_PASSWORD_INVALID']]);
        exit;
    }
    $setPassword = true;
    $hash = password_hash($newPassword, PASSWORD_BCRYPT);
}

// Mentés
if ($setPassword) {
    $stmt = $pdo->prepare("
        UPDATE user
           SET nickname = :nn, vnev = :v, knev = :k, email = :em, password = :pw
         WHERE neptun_k = :me
    ");
    $stmt->execute([':nn' => $nickname, ':v' => $vnev, ':k' => $knev, ':em' => $email, ':pw' => $hash, ':me' => $neptun]);
} else {
    $stmt = $pdo->prepare("
        UPDATE user
           SET nickname = :nn, vnev = :v, knev = :k, email = :em
         WHERE neptun_k = :me
    ");
    $stmt->execute([':nn' => $nickname, ':v' => $vnev, ':k' => $knev, ':em' => $email, ':me' => $neptun]);
}

echo json_encode(['ok' => true], JSON_UNESCAPED_UNICODE);