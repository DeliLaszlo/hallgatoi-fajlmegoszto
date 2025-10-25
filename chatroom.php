<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css?v=1761247878">
    <link rel="icon" type="image/x-icon" href="https://munkatars.sze.hu/core/templates/sze2018_bluerev/favicon.ico?v=2">
    <title>Chatszobák</title> <!-- PHP-val generált -->

<style>
/* Scoped fallback to ensure own messages visible even if cache overrides */
#subject_chatszobak .chat_bubble.me {
  background: var(--primary-color) !important;
  color: #fff !important;
  border-color: var(--primary-color) !important;
}
#subject_chatszobak .chat_row.me { justify-content: flex-end; }
#subject_chatszobak .chat_row.other { justify-content: flex-start; }
</style>

</head>
<body>
    <header>
        <span class="active-section-name"></span>
        <button class="hamburger" aria-label="Menu">
            <img src="icons/hamburger_menu.svg" alt="Menu" class="hamburger-icon menu-icon">
            <img src="icons/close.svg" alt="Close" class="hamburger-icon close-icon">
        </button>
        <nav class="nav-menu">
            <h1><button class="dark-mode-toggle" aria-label="Sötét mód váltás">
                <img src="icons/darkmode.svg" alt="Sötét mód" class="dark-mode-icon moon-icon">
                <img src="icons/lightmode.svg" alt="Világos mód" class="dark-mode-icon sun-icon">
                </button> <!-- PHP-val generált --></h1>
            <a href="#" class="dashboard_button">
                <img src="icons/arrowback.svg" alt="Irányítópult" class="dashboard-icon">
                <span>Irányítópult</span>
            </a>
            <a href="#" class="logout_button">
                <img src="icons/logout.svg" alt="Kijelentkezés" class="logout-icon">
                <span>Kijelentkezés</span>
            </a>
        </nav>
    </header>
    <main>
        <section id="subject_chatszobak">
  <div class="section_header">
    <h1>Chatszobák
    </h1>
    <div class="section_header_actions">
      <div class="search_container content_search_container">
        <input type="search" id="chat_search" placeholder="Keresés a beszélgetésekben" aria-label="Keresés a beszélgetésekben">
        <button type="button" aria-label="Keresés">
          <img src="icons/search.svg" alt="Keresés">
        </button>
      </div>
      <button id="chat_invite_btn" class="large_button" type="button">
        <img src="icons/user-plus.svg" alt="">
        <span class="icon_text">Meghívás</span>
      </button>
      <button id="chat_new_conv" class="large_button" type="button">
        <img src="icons/plus.svg" alt="">
        <span class="icon_text">Új beszélgetés</span>
      </button>
    </div>
  </div>
  <hr>

  <div class="chat_layout">
    <!-- Oldalsáv: beszélgetések -->
    <aside class="chat_sidebar">
      <div id="chat_conv_list" class="chat_list" role="list">
        <!-- Példasorok – eltávolítható, ha dinamikus lesz -->
        <div class="chat_list_item active">
          <div class="chat_avatar">Á</div>
          <div>
            <div><strong>Általános</strong></div>
            <div class="no_content_message" style="font-size:.8rem;">#general</div>
          </div>
        </div>
        <div class="chat_list_item">
          <div class="chat_avatar">P</div>
          <div>
            <div><strong>Projektcsapat</strong></div>
            <div class="no_content_message" style="font-size:.8rem;">#team</div>
          </div>
        </div>
        <div class="chat_list_item">
          <div class="chat_avatar">V</div>
          <div>
            <div><strong>Vizsga felkészülés</strong></div>
            <div class="no_content_message" style="font-size:.8rem;">#exam</div>
          </div>
        </div>
      </div>

      <div style="margin-top:.5rem; display:flex; gap:.5rem;">
        <button id="chat_delete_conv" class="button" type="button"><span>Törlés</span></button>
        <button id="chat_clear_btn" class="button" type="button"><span>Tisztítás (helyi)</span></button>
      </div>
    </aside>

    <!-- Üzenetek nézet -->
    <section class="chat_window">
      <div class="chat_header_inline">
        <div class="chat_title">
          <div id="chat_room_avatar" class="chat_avatar">Á</div>
          <h3 id="chat_room_title" style="margin:0;">Általános</h3>
        </div>
        
      </div>

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
      </div>

      <form id="chat_composer" class="chat_input">
        <textarea id="chat_text" maxlength="2000" placeholder="Írj üzenetet..." required></textarea>
        <button class="large_button" type="submit">
          <img src="icons/send.svg" alt="">
          <span class="icon_text">Küldés</span>
        </button>
      </form>
    </section>
  </div>
</section>
    </main>
<script type="text/javascript" src="scripts.js?v=2"></script>
</boby>
</html>