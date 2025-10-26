<?php

$conn = new mysqli("localhost", "root", "", "pm_db_fm_v1");

// Csak akkor fusson, ha a felhasználó tényleg a Submit gombot nyomta meg
if (isset($_POST['submit'])) {
  try {
    // 2️⃣ Adatok beolvasása az űrlapból
    $neptun = trim($_POST['neptun']);
    $nick = trim($_POST['username']);
    $password = trim($_POST['password']);
    $vnev = trim($_POST['Vname']);
    $knev = trim($_POST['Kname']);
    $email = trim($_POST['email']);

    $neptun = strtolower($neptun);
    $email = strtolower($email);

    $hashed_pass = password_hash($password, PASSWORD_DEFAULT);

    $sql = "SELECT neptun_k FROM user WHERE neptun_k = '$neptun'";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc(); 
    if ($result->num_rows != 0) {
        if($row['neptun'] == $neptun) {
            echo '<script>alert("Ez a neptun kód már foglalt!")
            window.location.href = "log_reg.php"; 
            </script>'; //index.php
            exit;
        }
    }
    $sql = "SELECT nickname FROM user WHERE nickname = '$nick'";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc(); 
    if ($result->num_rows != 0) {
        if($row['nickname'] == $nick) {
            echo '<script>alert("Ez a felhasználónév már foglalt!")
            window.location.href = "log_reg.php";
            </script>'; //index.php
            exit;
        }
    }
    $sql = "SELECT email FROM user WHERE email = '$email'";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc(); 
    if ($result->num_rows != 0) {
        if($row['email'] == $email) {
            echo '<script>alert("Ez az email cím már foglalt!")
            window.location.href = "log_reg.php";
            </script>'; //index.php
            exit;
        }
    }

    // 4️⃣ Előkészített lekérdezés (prepared statement)
    $stmt = $conn->prepare("INSERT INTO user (neptun_k, nickname, password, vnev, knev, email) VALUES ('$neptun', '$nick', '$hashed_pass', '$vnev', '$knev', '$email')");

    // 6️⃣ Lekérdezés futtatása
    $stmt->execute();

    echo "✅ Az adatok sikeresen elmentve az adatbázisba!";
    echo "<br><a href='log_reg.php'>Vissza az űrlaphoz</a>"; //index.php

  } catch (PDOException $e) {
    echo "❌ Hiba: " . $e->getMessage();
  }
} else {
  echo "Nincs elküldött űrlapadat.";
}

$conn->close();
?>
