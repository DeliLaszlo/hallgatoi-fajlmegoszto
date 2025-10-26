<?php
// Kapcsolódás az adatbázishoz, a root a felhasználó, jelszó alapbol nincs, ez az üres mező, az utolsó adat pedig az adatbázis neve
$conn = new mysqli("localhost", "root", "", "pm_db_fm_v1");

// Felhasználótól kapott adatok (űrlapról POST-tal)
$neptun = $_POST['neptun'];
$password = $_POST['password'];

//neptun kód kisbetűvel szerepel
$neptun = strtolower($neptun);

//a lekérdezést egy változóba írjuk
$sql = "SELECT password FROM user WHERE neptun_k = '$neptun'";
//a lekérdezést megadjuk az adatbázisnak
$result = $conn->query($sql);

//a kapott eredményeket lekérdezhető és oszlopok alapján kikeresheté
$row = $result->fetch_assoc();

if ($result->num_rows > 0) {
} else {
  echo '<script>alert("Ez az email cím vagy neptun kód nem szerepel az adatbázisban!")
  window.location.href = "log_reg.php"; 
  </script>'; //index.php
  exit;
}


if(password_verify($password, $row['password'])) {
  echo "<br><a href='dashboard.php'>Irány a főoldal</a>";
}
else {
  echo '<script>alert("Téves jelszó!")
  window.location.href = "log_reg.php";
  </script>'; //index.php
}

$conn->close();
?>