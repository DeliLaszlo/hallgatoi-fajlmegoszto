<?php
session_start();
if (!isset($_SESSION['user_neptun'])) {
    header("Location: log_reg.php");
    exit();
}
$inactive_limit = 1800; // 30 perc inaktivitás
if (isset($_SESSION['last_activity']) && (time() - $_SESSION['last_activity'] > $inactive_limit)) {
    header("Location: logout.php");
    exit();
} else {
    $_SESSION['last_activity'] = time();
}
?>

<!DOCTYPE html>
<html lang="hu">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="styles.css?v=1761247878">
  <link rel="icon" type="image/x-icon" href="https://munkatars.sze.hu/core/templates/sze2018_bluerev/favicon.ico?v=2">
  <title>Chatszobák</title>
</head>

<body>
  <div id="loading-screen" class="loading-screen initial-loading">
    <div class="loading-spinner">
      <img src="icons/hourglass.svg" alt="Betöltés">
      <div class="loading-text">Oldal betöltése...</div>
    </div>
  </div>
  <header class="visible_hamburger">
    <img src="icons/IVK_logo.png" alt="IVK logo" class="ivk_logo header_img" width="1920" height="586">
    <span class="active-section-name">Chatszoba neve</span>
    <button class="hamburger" aria-label="Menu">
      <img src="icons/hamburger_menu.svg" alt="Menu" class="hamburger-icon menu-icon">
      <img src="icons/close.svg" alt="Close" class="hamburger-icon close-icon">
    </button>
    <nav class="nav-menu">
      <h1>Chatszobáim</h1>
      <div class="search_container chatroom_search_container">
        <input type="text" id="chatroom_search_input" placeholder="Chatszoba keresése..." aria-label="Chatszoba keresése">
        <button id="chatroom_search_button" aria-label="Keresés">
          <img src="icons/search.svg" alt="Keresés">
        </button>
      </div>
      <ul id="chat_conv_list"></ul>
      <ul>
        <li>
          <button class="dark-mode-toggle" aria-label="Sötét mód váltás">
            <img src="icons/darkmode.svg" alt="Sötét mód" class="dark-mode-icon moon-icon">
            <img src="icons/lightmode.svg" alt="Világos mód" class="dark-mode-icon sun-icon">
          </button>
        </li>
      </ul>
      <a href="javascript:history.back()" class="go_back_button">
        <img src="icons/arrowback.svg" alt="Irányítópult" class="dashboard-icon">
        <span>Vissza</span>
      </a>
      <a href="logout.php" class="logout_button">
        <img src="icons/logout.svg" alt="Kijelentkezés" class="logout-icon">
        <span>Kijelentkezés</span>
      </a>
    </nav>
      
  </header>
  <main>
    <div id="chatszobak">
      <div class="chat_layout">
        <section class="chat_window">
          <div id="chat_messages" class="chat_messages" aria-live="polite"></div>
          <form id="chat_composer" class="chat_input">
            <textarea id="chat_text" maxlength="2000" placeholder="Írj üzenetet..." required></textarea>
            <button class="button small_button send_message_button" type="submit">
                <img src="icons/send.svg" alt="">
            </button>
          </form>
        </section>
      </div>
    </div>
  </main>
  <script type="text/javascript" src="scripts.js"></script>
</body>

</html>