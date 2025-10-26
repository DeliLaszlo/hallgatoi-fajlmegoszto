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
  <header class="visible_hamburger">
    <img src="icons/IVK_logo.png" alt="IVK logo" class="ivk_logo header_img" width="1920" height="586">
    <span class="active-section-name">Chatszoba neve</span>
    <button class="hamburger" aria-label="Menu">
      <img src="icons/hamburger_menu.svg" alt="Menu" class="hamburger-icon menu-icon">
      <img src="icons/close.svg" alt="Close" class="hamburger-icon close-icon">
    </button>
    <nav class="nav-menu">
      <h1>Chatszobáim</h1>
      <ul id="chat_conv_list">
        <li><a class="chat_list_item active">Általános</a></li>
        <li><a class="chat_list_item">Projekt</a></li>
        <li><a class="chat_list_item">Vizsga</a></li>
      </ul>
      <ul>
        <li>
          <button class="dark-mode-toggle" aria-label="Sötét mód váltás">
            <img src="icons/darkmode.svg" alt="Sötét mód" class="dark-mode-icon moon-icon">
            <img src="icons/lightmode.svg" alt="Világos mód" class="dark-mode-icon sun-icon">
          </button>
        </li>
      </ul>
      <a href="#" class="go_back_button">
        <img src="icons/arrowback.svg" alt="Irányítópult" class="dashboard-icon">
        <span>Vissza</span>
      </a>
      <a href="#" class="logout_button">
        <img src="icons/logout.svg" alt="Kijelentkezés" class="logout-icon">
        <span>Kijelentkezés</span>
      </a>
    </nav>
      
  </header>
  <main>
    <div id="chatszobak">
      <div class="chat_layout">
        <section class="chat_window">
          <div id="chat_messages" class="chat_messages" aria-live="polite">
            <!-- Minta üzenetek – eltávolítható -->
            <div class="chat_row other">
              <div class="chat_bubble">
                <div>Szia, hogy haladsz a beadandóval?</div>
                <div class="chat_meta">Anna • 2025-10-23 10:00</div>
              </div>
            </div>
            <div class="chat_row me">
              <div class="chat_bubble me">
                <div>Már majdnem kész, ma este befejezem!</div>
                <div class="chat_meta">Én • 2025-10-23 10:01</div>
              </div>
            </div>
            <!-- Minta üzenetek vége --> 
          </div>
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
  <script type="text/javascript" src="scripts.js?v=2"></script>
</body>

</html>