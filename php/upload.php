<?php
/**
 * Fájl feltöltés (Legacy verzió)
 * 
 * Régebbi form alapú fájl feltöltő. Az upload_file.php az újabb,
 * AJAX alapú verzió több funkcióval. Ez a fájl visszafelé kompatibilitás miatt maradt.
 * 
 * Engedélyezett fájltípusok: jpg, jpeg, png, gif, pdf, txt
 * 
 * Metódus: POST (multipart/form-data)
 * Paraméterek:
 *   - fileToUpload (file): A feltöltendő fájl
 * Válasz: Visszairányítás az előző oldalra
 * Szükséges: Bejelentkezés
 * 
 * ELAVULT: Használd az upload_file.php-t helyette
 */

/*
<form action="upload.php" method="post" enctype="multipart/form-data">
    <button type="submit" name="fileToUpload" class="button small_button content_upload_button upload_file_button" aria-label="Fájl feltöltése">
        <input type="file" name="fileToUpload" required>
        <span class="icon_text">Fájl feltöltése</span>
        <img src="icons/upload.svg" alt="Fájl feltöltése">
    </button>
</form>

*/
session_start();

$conn = new mysqli("localhost", "root", "", "pm_db_fm_v1");

$neptun1 = $_SESSION['user_neptun'];

$targetDir = "files/";

if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

$filename = basename($_FILES["fileToUpload"]["name"]);
$targetFile = $targetDir . $filename;

$uploadOk = 1;

$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt'];

$extension = strtolower(pathinfo($_FILES["fileToUpload"]["name"], PATHINFO_EXTENSION));

if (!in_array($extension, $allowedExtensions)) {
    echo '<script>alert("Hiba, ez a fájltípus nem engedélyezett!");history.back();</script>';
    die();
}

if ($_FILES["fileToUpload"]["error"] !== UPLOAD_ERR_OK) {
    echo '<script>alert("Hiba történt a feltöltés során!");history.back();</script>';
    $uploadOk = 0;
}

if ($uploadOk == 1) {
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $targetFile)) {

        if ($conn->connect_error) {
            die("Adatbázis hiba: " . $conn->connect_error);
        }
        $azonosito = str_pad(rand(0, 9999999), 7, "0", STR_PAD_LEFT);
        $filesize = 0;//$_FILES["fileToUpload"]["size"];
        $dl = 0;
        //itt $_POST[]-tal a formbol kapott adatokat illesztjuk be, az $stmt->bind_param-ot modositani kell ehhez
        //$neptun = "";
        //$class_code = "";
        //$ptf = "/files/".$filename;
        //$comment = $_POST['file_description'];
        
        // SQL beszúrás
        $stmt = $conn->prepare("INSERT INTO upload (up_id, class_code, neptun, file_name, path_to_file, upload_title, upload_date, downloads, comment, rating) VALUES (?, 'randomtargy', 'asd123', 'teszt',  '/files', ?, '2025-11-21', ?, 'Csakegyteszt', ?)");
        $stmt->bind_param("isii", $azonosito, $filename, $dl, $filesize);

        if ($stmt->execute()) {
            echo '<script>
            alert("A fájl sikeresen feltöltve és mentve az adatbázisba!\nAzonosító: ' . $azonosito . '\nNeptun: ' . $neptun1 . '\nOsztálykód: ' . $class_code1 . '");
            history.back();
            </script>';
            
        } else {
            echo '<script>alert("A fájl feltöltődött, de az adatbázis mentés nem sikerült!");history.back();</script>';
        }

        $stmt->close();
        $conn->close();

    } else {
        echo '<script>alert("Hiba történt a fájl mentésekor.");</script>';
    }
}
?>
