<?php
session_start();
if (isset($_SESSION['login_neptun'])) {
    $login_data = ['neptun' => $_SESSION['login_neptun']];
}
else {
    $login_data = [];
}

$register_data = [
    'neptun'   => $_SESSION['register_neptun']   ?? '',
    'nickname' => $_SESSION['register_nickname'] ?? '',
    'fullname' => $_SESSION['register_fullname'] ?? '',
    'email'    => $_SESSION['register_email']    ?? '',
];

unset(
    $_SESSION['login_neptun'],
    $_SESSION['register_neptun'],
    $_SESSION['register_nickname'],
    $_SESSION['register_fullname'],
    $_SESSION['register_email'],
)
?>
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" type="image/x-icon" href="https://munkatars.sze.hu/core/templates/sze2018_bluerev/favicon.ico?v=2">
    <title>Hallgatói fájlmegosztó</title>
</head>
<body>
    <img src="icons/IVK_logo.png" alt="IVK logo" class="ivk_logo" id="login_ivk_logo" width="1920" height="586">
    <div id="index_container">
        <div id="index_header">
            <h1>Hallgatói Fájlmegosztó</h1>
            <p>Széchenyi István Egyetem</p>
        </div>
        <div id="login" >
            <h1>Bejelentkezés</h1>
            <form id="loginForm" action="php/login.php" method="post">
                <input type="text" id="loginNeptun" name="neptun" value="<?php echo htmlspecialchars($login_data['neptun'] ?? ''); ?>" placeholder="Neptun kód" required autofocus>
                <input type="password" id="loginPassword" name="password" placeholder="Jelszó" required>
                <button type="submit">Bejelentkezés</button>
                <a href="#" id="showRegister">Regisztráció</a>
            </form>
        </div>
        <div id="register" style="display: none;">
            <h1>Regisztráció</h1>
            <form id="registerForm" action="php/registration.php" method="post"> 
                <input type="text" id="registerNeptun" name="neptun" value="<?php echo htmlspecialchars($register_data['neptun'] ?? ''); ?>" placeholder="Neptun kód" required autofocus>
                <input type="text" id="registerUsername" name="username" value="<?php echo htmlspecialchars($register_data['nickname'] ?? ''); ?>" placeholder="Felhasználónév" required>
                <input type="text" id="registerFullname" name="fullname" value="<?php echo htmlspecialchars($register_data['fullname'] ?? ''); ?>" placeholder="Teljes név" required>
                <input type="email" id="registerEmail" name="email" value="<?php echo htmlspecialchars($register_data['email'] ?? ''); ?>" placeholder="Email" required>
                <input type="password" id="registerPassword" name="password" placeholder="Jelszó" required>
                <input type="password" id="registerConfirmPassword" name="confirm_password" placeholder="Jelszó újra" required>
                <button type="submit" id="submit" name="submit">Regisztráció</button>
                <a href="#" id="showLogin">Bejelentkezés</a>
            </form>
        </div>
    </div>
    <script type="text/javascript" src="scripts.js"></script>
</body>
</html>
