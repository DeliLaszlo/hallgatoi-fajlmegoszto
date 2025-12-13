<?php
/**
 * Felhasználó bejelentkezés API
 * 
 * Kezeli a felhasználó bejelentkezését Neptun kód és jelszó alapján.
 * Sikeres bejelentkezés esetén session-t indít és beállítja az admin jogosultságot.
 * 
 * Metódus: POST
 * Paraméterek:
 *   - neptun (string): Neptun kód
 *   - password (string): Jelszó
 * Válasz: JSON {success: bool, message?: string, error?: string, isAdmin?: bool}
 */
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
        $password = $_POST['password'] ?? '';
    } else {
        $neptun = $data['neptun'] ?? '';
        $password = $data['password'] ?? '';
    }

    // Validáció
    if (empty($neptun)) {
        echo json_encode(['success' => false, 'field' => 'neptun', 'error' => 'A Neptun kód megadása kötelező!']);
        exit;
    }

    if (empty($password)) {
        echo json_encode(['success' => false, 'field' => 'password', 'error' => 'A jelszó megadása kötelező!']);
        exit;
    }

    // Neptun kód kisbetűvel szerepel
    $neptun = strtolower(trim($neptun));
    $stmt = $conn->prepare("SELECT password, admin FROM user WHERE neptun_k = ?");
    $stmt->bind_param("s", $neptun);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'field' => '', 'error' => 'Helytelen Neptun kód vagy jelszó!']);
        $stmt->close();
        $conn->close();
        exit;
    }

    $row = $result->fetch_assoc();

    if (password_verify($password, $row['password'])) {
        $_SESSION['user_neptun'] = $neptun;
        $_SESSION['last_activity'] = time();
        
        // Admin ellenőrzés az adatbázisból
        $isAdmin = ($row['admin'] == 1);
        if ($isAdmin) {
            $_SESSION['isAdmin'] = true;
        } else {
            unset($_SESSION['isAdmin']);
        }
        
        echo json_encode(['success' => true, 'message' => 'Sikeres bejelentkezés!', 'isAdmin' => $isAdmin]);
    } else {
        echo json_encode(['success' => false, 'field' => '', 'error' => 'Helytelen Neptun kód vagy jelszó!']);
    }

    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'field' => '', 'error' => 'Hiba történt: ' . $e->getMessage()]);
}
?>