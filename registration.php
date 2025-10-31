<?php
session_start();
$conn = new mysqli("localhost", "root", "", "pm_db_fm_v1");

// Csak akkor fusson, ha a felhasználó tényleg a Submit gombot nyomta meg
if (isset($_POST['submit'])) {
  try {
    // 2️⃣ Adatok beolvasása az űrlapból
    $neptun = trim($_POST['neptun']);
    $nick = trim($_POST['username']);
    $password = trim($_POST['password']);
    $nev = trim($_POST['fullname']);
    $parts = preg_split('/\s+/', $nev, 2, PREG_SPLIT_NO_EMPTY);
    $vnev = $parts[0] ?? '';
    $knev = $parts[1] ?? '';
    $email = trim($_POST['email']);

    $neptun = strtolower($neptun);
    $email = strtolower($email);

    $hashed_pass = password_hash($password, PASSWORD_DEFAULT);

    $sql = "SELECT neptun_k FROM user WHERE neptun_k = '$neptun'";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc(); 
    if ($result->num_rows != 0) {
        if($row['neptun_k'] == $neptun) {
            $_SESSION['register_neptun'] = $neptun;
            $_SESSION['register_nickname'] = $nick;
            $_SESSION['register_email'] = $email;
            $_SESSION['register_fullname'] = $nev;
            echo '<script>alert("Ez a neptun kód már foglalt!")
            window.location.href = "log_reg.php#register"; 
            </script>'; //index.php
            exit;
        }
    }
    $sql = "SELECT nickname FROM user WHERE nickname = '$nick'";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc(); 
    if ($result->num_rows != 0) {
        if($row['nickname'] == $nick) {
            $_SESSION['register_neptun'] = $neptun;
            $_SESSION['register_nickname'] = $nick;
            $_SESSION['register_email'] = $email;
            $_SESSION['register_fullname'] = $nev;
            echo '<script>alert("Ez a felhasználónév már foglalt!")
            window.location.href = "log_reg.php#register";
            </script>'; //index.php
            exit;
        }
    }
    $sql = "SELECT email FROM user WHERE email = '$email'";
    $result = $conn->query($sql);
    $row = $result->fetch_assoc(); 
    if ($result->num_rows != 0) {
        if($row['email'] == $email) {
            $_SESSION['register_neptun'] = $neptun;
            $_SESSION['register_nickname'] = $nick;
            $_SESSION['register_email'] = $email;
            $_SESSION['register_fullname'] = $nev;
            echo '<script>alert("Ez az email cím már foglalt!")
            window.location.href = "log_reg.php#register";
            </script>'; //index.php
            exit;
        }
    }

    // 4️⃣ Előkészített lekérdezés (prepared statement)
    $stmt = $conn->prepare("INSERT INTO user (neptun_k, nickname, password, vnev, knev, email) VALUES ('$neptun', '$nick', '$hashed_pass', '$vnev', '$knev', '$email')");

    // 6️⃣ Lekérdezés futtatása
    $stmt->execute();

    echo "<script>alert('✅ Sikeres regisztráció!'); window.location.href = 'log_reg.php';</script>";

  } catch (PDOException $e) {
    echo "❌ Hiba: " . $e->getMessage();
  }
} else {
  echo "Nincs elküldött űrlapadat.";
}

$conn->close();
?>
