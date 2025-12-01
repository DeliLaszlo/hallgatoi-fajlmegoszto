<?php
session_start();
header('Content-Type: application/json');

// Ellenőrizzük, hogy be van-e jelentkezve
if (!isset($_SESSION['user_neptun'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Nincs bejelentkezve!'
    ]);
    exit();
}

// Csak POST kérést fogadunk el
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'error' => 'Hibás kérés!'
    ]);
    exit();
}

// JSON input beolvasása
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Ellenőrizzük a kötelező mezőket
if (!isset($data['up_id']) || empty($data['up_id'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Hiányzó fájl azonosító!'
    ]);
    exit();
}

if (!isset($data['vote']) || !in_array($data['vote'], ['up', 'down', 'remove'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Érvénytelen szavazat!'
    ]);
    exit();
}

$up_id = $data['up_id'];
$vote = $data['vote'];
$neptun = $_SESSION['user_neptun'];

try {
    require_once __DIR__ . '/../config.php';
    $pdo = getPdoConnection();
    
    // Ellenőrizzük, hogy létezik-e a fájl
    $checkFileStmt = $pdo->prepare("
        SELECT up_id, neptun, rating 
        FROM upload 
        WHERE up_id = :up_id
    ");
    $checkFileStmt->execute([':up_id' => $up_id]);
    $file = $checkFileStmt->fetch();
    
    if (!$file) {
        echo json_encode([
            'success' => false,
            'error' => 'A fájl nem létezik!'
        ]);
        exit();
    }
    
    // Nem szavazhatunk a saját feltöltésünkre
    if (strtoupper($file['neptun']) === strtoupper($neptun)) {
        echo json_encode([
            'success' => false,
            'error' => 'Nem szavazhatsz a saját feltöltésedre!'
        ]);
        exit();
    }
    
    // Ellenőrizzük, hogy szavazott-e már a felhasználó
    $checkVoteStmt = $pdo->prepare("
        SELECT neptun_k, upload_id, value 
        FROM user_votes 
        WHERE neptun_k = :neptun AND upload_id = :up_id
    ");
    $checkVoteStmt->execute([
        ':neptun' => $neptun,
        ':up_id' => $up_id
    ]);
    $existingVote = $checkVoteStmt->fetch();
    
    $ratingChange = 0;
    $newVoteValue = null;
    
    if ($vote === 'up') {
        $newVoteValue = 1;
    } elseif ($vote === 'down') {
        $newVoteValue = -1;
    }
    // 'remove' esetén null marad
    
    if ($existingVote) {
        $oldValue = (int)$existingVote['value'];
        
        if ($vote === 'remove' || ($newVoteValue !== null && $oldValue === $newVoteValue)) {
            // Szavazat eltávolítása (vagy toggle - ugyanaz a gomb újra megnyomva)
            $deleteVoteStmt = $pdo->prepare("
                DELETE FROM user_votes 
                WHERE neptun_k = :neptun AND upload_id = :up_id
            ");
            $deleteVoteStmt->execute([
                ':neptun' => $neptun,
                ':up_id' => $up_id
            ]);
            $ratingChange = -$oldValue;
            $newVoteValue = null;
        } else {
            // Szavazat módosítása
            $updateVoteStmt = $pdo->prepare("
                UPDATE user_votes 
                SET value = :value 
                WHERE neptun_k = :neptun AND upload_id = :up_id
            ");
            $updateVoteStmt->execute([
                ':value' => $newVoteValue,
                ':neptun' => $neptun,
                ':up_id' => $up_id
            ]);
            $ratingChange = $newVoteValue - $oldValue;
        }
    } else {
        if ($newVoteValue !== null) {
            // Új szavazat hozzáadása
            $insertVoteStmt = $pdo->prepare("
                INSERT INTO user_votes (neptun_k, upload_id, value) 
                VALUES (:neptun, :up_id, :value)
            ");
            $insertVoteStmt->execute([
                ':neptun' => $neptun,
                ':up_id' => $up_id,
                ':value' => $newVoteValue
            ]);
            $ratingChange = $newVoteValue;
        }
    }
    
    // Frissítjük a fájl rating mezőjét
    if ($ratingChange !== 0) {
        $updateRatingStmt = $pdo->prepare("
            UPDATE upload 
            SET rating = rating + :change 
            WHERE up_id = :up_id
        ");
        $updateRatingStmt->execute([
            ':change' => $ratingChange,
            ':up_id' => $up_id
        ]);
    }
    
    // Lekérjük az új rating értéket
    $newRatingStmt = $pdo->prepare("
        SELECT rating 
        FROM upload 
        WHERE up_id = :up_id
    ");
    $newRatingStmt->execute([':up_id' => $up_id]);
    $newRating = $newRatingStmt->fetchColumn();
    
    echo json_encode([
        'success' => true,
        'message' => 'Szavazat sikeresen rögzítve!',
        'new_rating' => (int)$newRating,
        'user_vote' => $newVoteValue
    ]);
    
} catch (PDOException $e) {
    error_log("Szavazási hiba: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => 'Adatbázis hiba történt!'
    ]);
}
?>
