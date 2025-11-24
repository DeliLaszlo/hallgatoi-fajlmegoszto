<?php
/*
<form action="upload.php" method="post" enctype="multipart/form-data">
    <button type="submit" name="fileToUpload" class="button small_button content_upload_button upload_file_button" aria-label="Fájl feltöltése">
        <input type="file" name="fileToUpload" required>
        <span class="icon_text">Fájl feltöltése</span>
        <img src="icons/upload.svg" alt="Fájl feltöltése">
    </button>
</form>

*/

$targetDir = "files/";

if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
}

$targetFile = $targetDir . basename($_FILES["fileToUpload"]["name"]);
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
        echo '<script>alert("A fájl sikeresen feltöltve: " . basename($_FILES["fileToUpload"]["name"]));history.back();</script>';
    } else {
        echo '<script>alert("Hiba történt a fájl mentésekor.")</script>';
    }
}
// '<script>alert("Hiba történt a feltöltés során!");history.back();</script>'
?>
