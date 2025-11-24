<?php
/*
while ($row = $result->fetch_assoc()) {
    $file = $row['upload_title'];  
    $filePath = $dir . $file;

    if (file_exists($filePath)) {

        echo "<li>";
        echo "<form action='download.php' method='post' style='display:inline;'>";
        echo "<input type='hidden' name='file' value='" . htmlspecialchars($file) . "'>";
        echo "<button type='submit'>Letöltés: " . htmlspecialchars($file) . "</button>";
        echo "</form>";
        echo "</li>";
    }
}
*/
$conn = new mysqli("localhost", "root", "", "pm_db_fm_v1");
$conn->set_charset("utf8");

$dir = "files/";

// Ha nincs file paraméter
if (!isset($_POST['file'])) {
    die("Nincs megadva fájl.");
}

$file = basename($_POST['file']); // Biztonsági ok: csak fájlnév
$path = $dir . $file;

// Ellenőrzés, hogy létezik-e
if (!file_exists($path)) {
    die("A kért fájl nem található.");
}

$conn->query("UPDATE upload SET downloads = downloads + 1 WHERE upload_title = '$file'");

// Letöltés header-ek
header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="'.$file.'"');
header('Content-Length: ' . filesize($path));

readfile($path);
exit;
?>
