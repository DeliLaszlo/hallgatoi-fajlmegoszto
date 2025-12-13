<?php
/**
 * Admin tárgykezelő API
 * 
 * Adminisztrátori műveletek a tárgyakon: hozzáadás, szerkesztés, törlés.
 * Az action paraméter határozza meg a műveletet.
 * 
 * Metódus: POST
 * Paraméterek:
 *   - action (string): Művelet típusa (add|edit|delete)
 *   - subject_code (string): Tárgy kódja (add/edit)
 *   - subject_name (string): Tárgy neve (add/edit)
 *   - original_class_code (string): Eredeti tárgykód (edit)
 * Válasz: JSON {success: bool, error?: string, subject?: object}
 * Szükséges: Bejelentkezés, Admin jogosultság
 */
session_start();
require_once '../config.php';
header('Content-Type: application/json');

// Csak admin férhet hozzá
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    echo json_encode(['success' => false, 'error' => 'Nincs admin jogosultság!']);
    exit();
}

$action = $_POST['action'] ?? '';

try {
    $pdo = getPdoConnection();

    // --- ÚJ TÁRGY HOZZÁADÁSA ---
    if ($action === 'add') {
        $code = trim($_POST['subject_code']);
        $name = trim($_POST['subject_name']);
        
        if (empty($code) || empty($name)) {
            echo json_encode(['success' => false, 'error' => 'Minden mező kitöltése kötelező!']);
            exit();
        }

        // Ellenőrzés: létezik-e már ilyen kód?
        $check = $pdo->prepare("SELECT class_code FROM class WHERE class_code = :code");
        $check->execute([':code' => $code]);
        if ($check->fetch()) {
            echo json_encode(['success' => false, 'error' => 'Ez a tárgykód már létezik!']);
            exit();
        }
        
        $stmt = $pdo->prepare("INSERT INTO class (class_code, class_name) VALUES (:code, :name)");
        $stmt->execute([':code' => $code, ':name' => $name]);
        
        echo json_encode([
            'success' => true, 
            'message' => 'Tárgy sikeresen hozzáadva!',
            'subject' => [
                'class_code' => $code,
                'class_name' => $name
            ]
        ]);
    } 
    
    // --- TÁRGY SZERKESZTÉSE ---
    elseif ($action === 'edit') {
        $original_code = $_POST['original_class_code'];
        $new_name = trim($_POST['subject_name']);
        $new_code = trim($_POST['subject_code']);

        
        $stmt = $pdo->prepare("UPDATE class SET class_name = :name, class_code = :new_code WHERE class_code = :orig_code");
        $stmt->execute([
            ':name' => $new_name, 
            ':new_code' => $new_code,
            ':orig_code' => $original_code
        ]);

        echo json_encode([
            'success' => true, 
            'message' => 'Tárgy sikeresen frissítve!',
            'subject' => [
                'class_code' => $new_code,
                'class_name' => $new_name,
                'original_code' => $original_code
            ]
        ]);
    } 
    else {
        echo json_encode(['success' => false, 'error' => 'Ismeretlen művelet!']);
    }

} catch (PDOException $e) {
    // MySQL hibakód 1451: Foreign key constraint fails (ha nem lehet törölni/módosítani a kódot használat miatt)
    if ($e->getCode() == 23000) {
        echo json_encode(['success' => false, 'error' => 'Ez a tárgykód már foglalt, vagy nem módosítható mert használatban van!']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Adatbázis hiba: ' . $e->getMessage()]);
    }
}
?>