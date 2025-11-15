<?php
session_start();
require_once __DIR__ . '/../config.php';
$conn = getMysqliConnection();

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
  $_SESSION['login_neptun'] = $neptun;
  echo '<script>alert("Ez az email cím vagy neptun kód nem szerepel az adatbázisban!")
  window.location.href = "../log_reg.php"; 
  </script>'; 
  exit;
}


if(password_verify($password, $row['password'])) {
  $_SESSION['user_neptun'] = $neptun;
  $_SESSION['last_activity'] = time();
  echo '<script>window.location.href = "../dashboard.php";</script>';
}
else {
  $_SESSION['login_neptun'] = $neptun;
  echo '<script>alert("Ez az email cím vagy neptun kód nem szerepel az adatbázisban!")
  window.location.href = "../log_reg.php";
  </script>';
}

$conn->close();
?>