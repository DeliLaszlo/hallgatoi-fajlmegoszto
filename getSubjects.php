<?php
declare(strict_types=1);
session_start();
header('Content-Type: application/json; charset=utf-8');

$me = $_SESSION['neptun'] ?? $_SESSION['neptun_k'] ?? null;
if ($me === null) {
    http_response_code(401);
    echo json_encode([]); // a JS tömböt vár
    exit;
}

require_once __DIR__ . '/db.php'; // db(): PDO
$pdo = db();

// Ha az "allapot" flag-et használjátok, szűrj rá (1 = aktív).
$sql = "
  SELECT c.class_code, c.class_name
  FROM user_classes uc
  JOIN class c ON c.class_code = uc.class_code
  WHERE uc.neptun = :me AND (uc.allapot = 1 OR uc.allapot IS NULL)
  ORDER BY c.class_name ASC
";
$stmt = $pdo->prepare($sql);
$stmt->execute([':me' => $me]);

echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE);