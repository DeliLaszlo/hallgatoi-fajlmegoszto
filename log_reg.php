<?php
session_start();
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
                <div class="input-field">
                    <input type="text" id="loginNeptun" name="neptun" placeholder="Neptun kód" required autofocus>
                    <span class="error-message" id="error_login_neptun"></span>
                </div>
                <div class="input-field">
                    <input type="password" id="loginPassword" name="password" placeholder="Jelszó" required>
                    <span class="error-message" id="error_login_password"></span>
                </div>
                <button type="submit">Bejelentkezés</button>
                <a href="#" id="showRegister">Regisztráció</a>
            </form>
        </div>
        <div id="register" style="display: none;">
            <h1>Regisztráció</h1>
            <form id="registerForm" action="php/registration.php" method="post"> 
                <div id="register_input_container">
                    <div class="input-field">
                        <input type="text" id="registerNeptun" name="neptun" placeholder="Neptun kód" required autofocus>
                        <span class="error-message" id="error_register_neptun"></span>
                    </div>
                    <div class="input-field">
                        <input type="text" id="registerUsername" name="username" placeholder="Felhasználónév" required>
                        <span class="error-message" id="error_register_username"></span>
                    </div>
                    <div class="input-field">
                        <input type="text" id="registerFullname" name="fullname" placeholder="Teljes név" required>
                        <span class="error-message" id="error_register_fullname"></span>
                    </div>
                    <div class="input-field">
                        <input type="email" id="registerEmail" name="email" placeholder="Email" required>
                        <span class="error-message" id="error_register_email"></span>
                    </div>
                    <div class="input-field">
                        <input type="password" id="registerPassword" name="password" placeholder="Jelszó" required>
                        <span class="error-message" id="error_register_password"></span>
                    </div>
                    <div class="input-field">
                        <input type="password" id="registerConfirmPassword" name="confirm_password" placeholder="Jelszó újra" required>
                        <span class="error-message" id="error_register_confirm_password"></span>
                    </div>
                </div>
                <button type="submit" id="submit" name="submit">Regisztráció</button>
                <a href="#" id="showLogin">Bejelentkezés</a>
            </form>
        </div>
    </div>
    <p id="trademark">Széchenyi István Egyetem Projektmunka 2025/26-1</p>
    <script type="text/javascript" src="scripts.js"></script>
</body>
</html>
