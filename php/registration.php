<?php
session_start();
require_once __DIR__ . '/../config.php';
header('Content-Type: application/json');

try {
    $conn = getMysqliConnection();

    // Ellenőrizzük, hogy POST kérés-e
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'field' => '', 'error' => 'Érvénytelen kérés']);
        exit;
    }

    // Adatok beolvasása
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if (!$data) {
        // Ha nem JSON, próbáljuk meg POST-ból
        $neptun = $_POST['neptun'] ?? '';
        $username = $_POST['username'] ?? '';
        $password = $_POST['password'] ?? '';
        $fullname = $_POST['fullname'] ?? '';
        $email = $_POST['email'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';
    } else {
        $neptun = $data['neptun'] ?? '';
        $username = $data['username'] ?? '';
        $password = $data['password'] ?? '';
        $fullname = $data['fullname'] ?? '';
        $email = $data['email'] ?? '';
        $confirmPassword = $data['confirm_password'] ?? '';
    }

    // Validációs minták
    $patterns = [
        'neptun' => '/^[A-Z0-9]{6}$/i',
        'username' => '/^[a-zA-Z0-9_]{3,20}$/',
        'fullname' => '/^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]+ [a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s]{1,49}$/',
        'email' => '/^[^\s@]+@[^\s@]+\.[^\s@]+$/',
        'password' => '/^(?=.*[A-Z])(?=.*\d).{8,}$/'
    ];

    // Frontend validáció
    if (empty($neptun)) {
        echo json_encode(['success' => false, 'field' => 'neptun', 'error' => 'A Neptun kód megadása kötelező!']);
        exit;
    }
    if (!preg_match($patterns['neptun'], $neptun)) {
        echo json_encode(['success' => false, 'field' => 'neptun', 'error' => 'A Neptun kód 6 alfanumerikus karakterből kell álljon!']);
        exit;
    }

    if (empty($username)) {
        echo json_encode(['success' => false, 'field' => 'username', 'error' => 'A felhasználónév megadása kötelező!']);
        exit;
    }
    if (!preg_match($patterns['username'], $username)) {
        echo json_encode(['success' => false, 'field' => 'username', 'error' => '3-20 karakter, csak betűk, számok és aláhúzás!']);
        exit;
    }

    if (empty($fullname)) {
        echo json_encode(['success' => false, 'field' => 'fullname', 'error' => 'A teljes név megadása kötelező!']);
        exit;
    }
    if (!preg_match($patterns['fullname'], $fullname)) {
        echo json_encode(['success' => false, 'field' => 'fullname', 'error' => 'Vezetéknév és legalább egy keresztnév szükséges!']);
        exit;
    }

    if (empty($email)) {
        echo json_encode(['success' => false, 'field' => 'email', 'error' => 'Az email cím megadása kötelező!']);
        exit;
    }
    if (!preg_match($patterns['email'], $email)) {
        echo json_encode(['success' => false, 'field' => 'email', 'error' => 'Érvénytelen email formátum!']);
        exit;
    }

    if (empty($password)) {
        echo json_encode(['success' => false, 'field' => 'password', 'error' => 'A jelszó megadása kötelező!']);
        exit;
    }
    if (!preg_match($patterns['password'], $password)) {
        echo json_encode(['success' => false, 'field' => 'password', 'error' => 'Legalább 8 karakter, 1 nagybetű és 1 szám!']);
        exit;
    }

    if (empty($confirmPassword)) {
        echo json_encode(['success' => false, 'field' => 'confirm_password', 'error' => 'A jelszó megerősítése kötelező!']);
        exit;
    }
    if ($password !== $confirmPassword) {
        echo json_encode(['success' => false, 'field' => 'confirm_password', 'error' => 'A két jelszó nem egyezik!']);
        exit;
    }

    // Adatok tisztítása
    $neptun = strtolower(trim($neptun));
    $username = trim($username);
    $fullname = trim($fullname);
    $email = strtolower(trim($email));

    // Név szétválasztása
    $parts = preg_split('/\s+/', $fullname, 2, PREG_SPLIT_NO_EMPTY);
    $vnev = $parts[0] ?? '';
    $knev = $parts[1] ?? '';

    // Adatbázis ellenőrzések - Neptun kód
    $stmt = $conn->prepare("SELECT neptun_k FROM user WHERE neptun_k = ?");
    $stmt->bind_param("s", $neptun);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'field' => 'neptun', 'error' => 'Ez a Neptun kód már foglalt!']);
        $stmt->close();
        $conn->close();
        exit;
    }
    $stmt->close();

    // Adatbázis ellenőrzések - Felhasználónév
    $stmt = $conn->prepare("SELECT nickname FROM user WHERE nickname = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'field' => 'username', 'error' => 'Ez a felhasználónév már foglalt!']);
        $stmt->close();
        $conn->close();
        exit;
    }
    $stmt->close();

    // Adatbázis ellenőrzések - Email
    $stmt = $conn->prepare("SELECT email FROM user WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'field' => 'email', 'error' => 'Ez az email cím már foglalt!']);
        $stmt->close();
        $conn->close();
        exit;
    }
    $stmt->close();

    // Jelszó hash-elés
    $hashed_pass = password_hash($password, PASSWORD_DEFAULT);

    // Felhasználó beszúrása
    $stmt = $conn->prepare("INSERT INTO user (neptun_k, nickname, password, vnev, knev, email) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $neptun, $username, $hashed_pass, $vnev, $knev, $email);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Sikeres regisztráció!']);
    } else {
        echo json_encode(['success' => false, 'field' => '', 'error' => 'Hiba történt a regisztráció során!']);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'field' => '', 'error' => 'Hiba történt: ' . $e->getMessage()]);
}
?>
