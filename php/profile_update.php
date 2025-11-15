<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['user_neptun'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Nem vagy bejelentkezve']);
    exit();
}

require_once __DIR__ . '/../config.php';

try {
    $conn = getPdoConnection();
    $input = json_decode(file_get_contents('php://input'), true);
    $nickname = trim($input['username'] ?? '');
    $fullname = trim($input['fullname'] ?? '');
    $email = trim($input['email'] ?? '');
    $current_password = $input['current_password'] ?? '';
    $new_password = $input['new_password'] ?? '';
    
    // Regex minták
    $usernamePattern = '/^[a-zA-Z0-9_]{3,20}$/';
    $fullnamePattern = '/^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]+ [a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s]{1,49}$/';
    $emailPattern = '/^[^\s@]+@[^\s@]+\.[^\s@]+$/';
    $passwordPattern = '/^(?=.*[A-Z])(?=.*\d).{8,}$/';
    
    if (empty($nickname) || !preg_match($usernamePattern, $nickname)) {
        echo json_encode(['success' => false, 'error' => 'Érvénytelen felhasználónév! 3-20 karakter, csak betűk, számok és aláhúzás.']);
        exit();
    }
    
    if (empty($fullname) || !preg_match($fullnamePattern, $fullname)) {
        echo json_encode(['success' => false, 'error' => 'Érvénytelen név! Vezetéknév és legalább egy keresztnév szükséges.']);
        exit();
    }
    
    if (empty($email) || !preg_match($emailPattern, $email)) {
        echo json_encode(['success' => false, 'error' => 'Érvénytelen email cím!']);
        exit();
    }
    
    $email = strtolower($email);
    $nameParts = preg_split('/\s+/', $fullname, 2, PREG_SPLIT_NO_EMPTY);
    $vnev = $nameParts[0] ?? '';
    $knev = $nameParts[1] ?? '';
    
    // Neptun kód létezésének ellenőrzése
    $stmt = $conn->prepare("SELECT neptun_k FROM user WHERE nickname = :nickname AND neptun_k != :current_neptun");
    $stmt->bindParam(':nickname', $nickname);
    $stmt->bindParam(':current_neptun', $_SESSION['user_neptun']);
    $stmt->execute(); 
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'error' => 'Ez a felhasználónév már foglalt!']);
        exit();
    }
    
    // Email cím létezésének ellenőrzése
    $stmt = $conn->prepare("SELECT neptun_k FROM user WHERE email = :email AND neptun_k != :current_neptun");
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':current_neptun', $_SESSION['user_neptun']);
    $stmt->execute();
    
    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'error' => 'Ez az email cím már foglalt!']);
        exit();
    }
    
    // Amennyiben nem üresek a jelszó mezők
    if (!empty($current_password) || !empty($new_password)) {
        if (empty($current_password)) {
            echo json_encode(['success' => false, 'error' => 'Add meg a jelenlegi jelszavadat!']);
            exit();
        }
        
        if (empty($new_password)) {
            echo json_encode(['success' => false, 'error' => 'Add meg az új jelszavadat!']);
            exit();
        }
        
        if (!preg_match($passwordPattern, $new_password)) {
            echo json_encode(['success' => false, 'error' => 'Az új jelszó legalább 8 karakter hosszú legyen, tartalmazzon nagybetűt és számot!']);
            exit();
        }
        
        // Jelenlegi jelszó ellenőrzése
        $stmt = $conn->prepare("SELECT password FROM user WHERE neptun_k = :neptun");
        $stmt->bindParam(':neptun', $_SESSION['user_neptun']);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);     
        if (!$user || !password_verify($current_password, $user['password'])) {
            echo json_encode(['success' => false, 'error' => 'Helytelen jelenlegi jelszó!']);
            exit();
        }
        
        // Frissítés jelszóváltoztatással
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        $stmt = $conn->prepare("UPDATE user SET nickname = :nickname, vnev = :vnev, knev = :knev, email = :email, password = :password WHERE neptun_k = :neptun");
        $stmt->bindParam(':password', $hashed_password);
    } else {
        // Frissítés jelszóváltoztatás nélkül
        $stmt = $conn->prepare("UPDATE user SET nickname = :nickname, vnev = :vnev, knev = :knev, email = :email WHERE neptun_k = :neptun");
    }
    
    $stmt->bindParam(':nickname', $nickname);
    $stmt->bindParam(':vnev', $vnev);
    $stmt->bindParam(':knev', $knev);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':neptun', $_SESSION['user_neptun']);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true, 
            'message' => 'Profil sikeresen frissítve!',
            'data' => [
                'neptun' => $_SESSION['user_neptun'],
                'nickname' => $nickname,
                'full_name' => $fullname,
                'email' => $email
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Hiba történt a profil frissítése során!']);
    }
    
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Adatbázis hiba: ' . $e->getMessage()]);
}

$conn = null;
?>
