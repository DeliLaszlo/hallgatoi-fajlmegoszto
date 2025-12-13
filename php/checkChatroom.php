<?php
/**
 * Chatszoba létezésének ellenőrzése API
 * 
 * Ellenőrzi, hogy egy adott chatszoba létezik-e. Hasznos a chatszoba
 * oldal betöltése előtt az érvényesség ellenőrzésére.
 * 
 * Metódus: GET
 * Paraméterek:
 *   - room_id (int): Chatszoba azonosító
 * Válasz: JSON {success: bool, exists: bool, message?: string}
 * Szükséges: Bejelentkezés
 */
session_start();
header('Content-Type: application/json');

// Adatbázis kapcsolat
require_once __DIR__ . '/../config.php';
$conn = getMysqliConnection();

// Ellenőrizzük, hogy be van-e jelentkezve a felhasználó
if (!isset($_SESSION['user_neptun'])) {
    echo json_encode(['success' => false, 'message' => 'Nincs bejelentkezve']);
    exit();
}

$room_id = $_GET['room_id'] ?? null;

if (!$room_id) {
    echo json_encode(['success' => false, 'message' => 'Hiányzó room_id paraméter']);
    exit();
}

try {
    // Ellenőrizzük, hogy a szoba létezik-e
    $query = "SELECT room_id FROM chatroom WHERE room_id = ?";
    
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $room_id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        // A szoba nem létezik
        echo json_encode(['success' => false, 'exists' => false]);
    } else {
        // A szoba létezik
        echo json_encode(['success' => true, 'exists' => true]);
    }
    
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Hiba történt: ' . $e->getMessage()]);
}

$conn->close();
?>
