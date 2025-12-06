<?php
/*
            <form id="add_chatroom_form" action="php/create_chatroom.php" method="post" enctype="multipart/form-data">
                <input type="hidden" id="classcode" name="classcode" value="<?php echo $class_code ?>">
                <label for="chatroom_title">Chatszoba címe:</label>
                <input type="text" id="chatroom_title" name="chatroom_title" placeholder="Chatszoba címe" required>
                <label for="chatroom_description">Rövid leírás:</label>
                <textarea id="chatroom_description" name="chatroom_description" placeholder="Chatszoba leírása" required></textarea>
                <hr>
                <div class="modal_footer">
                    <button type="button" class="button chatroom_close_button" aria-label="Mégse">
                        <img src="icons/close.svg" alt="Mégse">
                        <span>Mégse</span>
                    </button>
                    <button type="submit" class="button modal_add_button" aria-label="Feltöltés">
                        <img src="icons/add.svg" alt="Feltöltés">
                        <span>Létrehozás</span>
                    </button>
                </div>
            </form>
*/

session_start();

$pdo = new PDO("mysql:host=localhost;dbname=pm_db_fm_v1;charset=utf8", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


$neptun = $_SESSION['user_neptun'];

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

$class_code = $_POST['classcode'];
$title = $_POST['chatroom_title'];
$desc = $_POST['chatroom_description'];

$stmt = $pdo->prepare("INSERT INTO chatroom (class_code, creater_neptun, title, description) VALUES ('$class_code', '$neptun', '$title', '$desc')");

$stmt->execute();

// Get last inserted ID directly (MUCH better)
$room_id = $pdo->lastInsertId();

if (!$room_id) {
    echo "Insert failed.";
    exit;
}

$stmt = null;
$pdo  = null; 

$pdo = new PDO("mysql:host=localhost;dbname=pm_db_fm_v1;charset=utf8", "root", "");
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Insert into room_access safely, preventing duplicates
$stmt = $pdo->prepare("INSERT INTO room_access (neptun, room_id, active) VALUES ('$neptun', $room_id, 1)");
$stmt->execute();

$stmt = null;
$pdo  = null; 

echo "<script>history.back();</script>";
?>
