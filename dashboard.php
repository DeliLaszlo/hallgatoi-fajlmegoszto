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
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" type="image/x-icon" href="https://munkatars.sze.hu/core/templates/sze2018_bluerev/favicon.ico?v=2">
    <title>Dashboard</title>
</head>
<body>
    <div id="loading-screen" class="loading-screen initial-loading">
        <div class="loading-spinner">
            <img src="icons/hourglass.svg" alt="Betöltés">
            <div class="loading-text">Oldal betöltése...</div>
        </div>
    </div>
    <header>
        <img src="icons/IVK_logo.png" alt="IVK logo" class="ivk_logo header_img" width="1920" height="586">
        <span class="active-section-name"></span>
        <button class="hamburger" aria-label="Menu">
            <img src="icons/hamburger_menu.svg" alt="Menu" class="hamburger-icon menu-icon">
            <img src="icons/close.svg" alt="Close" class="hamburger-icon close-icon">
        </button>
        <nav class="nav-menu">
            <h1>Irányítópult</h1>
            <ul>
                <li><a href="#" id="nav_sajat_targyak">Tárgyaim</a></li>
                <li><a href="#" id="nav_sajat_fajlok">Feltöltött fájljaim</a></li>
                <li><a href="#" id="nav_sajat_kerelemek">Kérelmeim</a></li>
                <li><a href="#" id="nav_sajat_chatszobak">Chatszobáim</a></li>
                <li><a href="#" id="nav_profile">Profilom</a></li>
                <li>
                    <button class="dark-mode-toggle" aria-label="Sötét mód váltás">
                        <img src="icons/darkmode.svg" alt="Sötét mód" class="dark-mode-icon moon-icon">
                        <img src="icons/lightmode.svg" alt="Világos mód" class="dark-mode-icon sun-icon">
                    </button>
                </li>
            </ul>
            <a href="php/logout.php" class="logout_button">
                <img src="icons/logout.svg" alt="Kijelentkezés" class="logout-icon">
                <span>Kijelentkezés</span>
            </a>
        </nav>
    </header>
    <main>
        <section id="dashboard_targyak">
            <div class="section_header subject_header">
                <div class="header-div">
                    <img src="icons/subjects.svg" alt="Tárgyak ikon">
                    <h1>Tárgyaim</h1>
                </div>
                <div class="section_header_actions">
                    <div class="search_container content_search_container">
                        <input type="text" id="dashboard_subject_search" class="subject_search_input" placeholder="Tárgy keresése..." aria-label="Tárgy keresése">
                        <button class="subject_search_button" aria-label="Keresés">
                            <img src="icons/search.svg" alt="Keresés">
                        </button>
                    </div>
                    <button class="large_button add_subject_button" aria-label="Tárgy hozzáadása">
                        <img src="icons/add.svg" alt="Tárgy hozzáadása">
                        <span class="icon_text">Tárgy felvétele</span>
                    </button>
                </div> 
            </div>
            <hr>
            <div id="user_subjects"></div>
        </section>
        <section id="dashboard_fajlok">
            <div class="section_header subject_header">
                <div class="header-div">
                    <img src="icons/file.svg" alt="Fájlok ikon">
                    <h1>Feltöltött fájljaim</h1>
                </div>
                <div class="section_header_actions">
                    <div class="search_container content_search_container">
                        <input type="text" id="file_search_input" placeholder="Fájl keresése..." aria-label="Fájl keresése">
                        <button id="file_search_button" aria-label="Keresés">
                            <img src="icons/search.svg" alt="Keresés">
                        </button>
                    </div>
                </div>
            </div>
            <hr>
            <div id="dashboard_file_container"></div>
        </section>
        <section id="dashboard_kerelemek">
            <div class="section_header">
                <div class="header-div">
                    <img src="icons/request.svg" alt="Kérelmek ikon">
                    <h1>Kérelmeim</h1>
                </div>
                <div class="section_header_actions">
                    <div class="search_container content_search_container">
                        <input type="text" id="request_search_input" placeholder="Kérelem keresése..." aria-label="Kérelem keresése">
                        <button id="request_search_button" aria-label="Keresés">
                            <img src="icons/search.svg" alt="Keresés">
                        </button>
                    </div>
                </div>
            </div> 
            <hr>
            <div id="dashboard_request_container"></div>
        </section>
        <section id="dashboard_chatszobak">
            <div class="section_header">
                <div class="header-div">
                    <img src="icons/chat.svg" alt="Chatszobák ikon">
                    <h1>Saját chatszobáim</h1>
                </div>
                <div class="section_header_actions">
                    <div class="search_container content_search_container">
                        <input type="text" id="chatroom_search_input" placeholder="Chatszoba keresése..." aria-label="Chatszoba keresése">
                        <button id="chatroom_search_button" aria-label="Keresés">
                            <img src="icons/search.svg" alt="Keresés">
                        </button>
                    </div>
                </div>
            </div>
            <hr>
            <h1 class="shrinkText">Követett chatszobáim</h1>
            <hr>
        </section>
        <section id="dashboard_profile">
            <div class="header-div">
                <img src="icons/users.svg" alt="Profil ikon">
                <h1>Profilom</h1>
            </div>
            <hr>
            <form id="profile_form">
                <div id="profile_info">
                    <!-- Felhasználó profil adatai, később PHP-vel generálandó -->
                    <div class="profile_field">
                        <h3>Neptun kód:</h3>
                        <input type="text" id="profile_neptun" name="neptun" value="ABC123" readonly/>
                        <span class="error-message" id="error_neptun"></span>
                    </div>
                    <div class="profile_field">
                        <h3>Felhasználónév:</h3>
                        <input type="text" id="profile_username" name="username" value="felhasznalonev" readonly/>
                        <span class="error-message" id="error_username"></span>
                    </div>
                    <div class="profile_field">
                        <h3>Teljes név:</h3>
                        <input type="text" id="profile_fullname" name="fullname" value="Teljes Név" readonly/>
                        <span class="error-message" id="error_fullname"></span>
                    </div>
                    <div class="profile_field">
                        <h3>Email:</h3>
                        <input type="text" id="profile_email" name="email" value="email@example.com" readonly/>
                        <span class="error-message" id="error_email"></span>
                    </div>
                    <!-- Generálandó rész vége -->
                    <div id="password_fields" style="display: none;">
                        <div class="profile_field">
                            <h3>Jelenlegi jelszó:</h3>
                            <input type="password" id="profile_current_password" name="current_password"/>
                            <span class="error-message" id="error_current_password"></span>
                        </div>
                        <div class="profile_field">
                            <h3>Új jelszó:</h3>
                            <input type="password" id="profile_new_password" name="new_password"/>
                            <span class="error-message" id="error_new_password"></span>
                        </div>
                        <div class="profile_field">
                            <h3>Új jelszó megerősítése:</h3>
                            <input type="password" id="profile_repeat_password" name="repeat_password"/>
                            <span class="error-message" id="error_repeat_password"></span>
                        </div>
                    </div>
                    <div id="profile_buttons">
                        <button type="button" class="large_button edit_profile_button" aria-label="Profil szerkesztése">
                            <img src="icons/edit.svg" alt="Szerkesztés">
                            <span>Profil szerkesztése</span>
                        </button>
                        <div id="profile_edit_buttons" style="display: none;">
                            <button type="button" class="large_button cancel_profile_button" aria-label="Mégse">
                                <img src="icons/close.svg" alt="Mégse">
                                <span>Mégse</span>
                            </button>
                            <button type="submit" class="large_button save_profile_button" aria-label="Mentés">
                                <img src="icons/save.svg" alt="Mentés">
                                <span>Mentés</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    </main>
    <div class="modal add_subject_modal">
        <div class="modal_content">
            <button class="button small_button modal_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2>Új tárgy felvétele</h2>
            <hr>
            <div class="search_container modal_search_container">
                <input type="text" id="subject_search_input" placeholder="Tárgy keresése..." aria-label="Tárgy keresése">
                <button id="subject_search_button" aria-label="Keresés">
                    <img src="icons/search.svg" alt="Keresés">
                </button>
            </div>
            <hr>
            <div id="subject_list_container"></div>
        </div>
    </div>
    <div class="modal own_file_details_modal">
        <div class="modal_content">
            <button class="button small_button modal_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <!-- Saját fájl részletei, adatok később PHP-vel generálandó -->
            <h2 class="data-file-title">Fájl címe</h2>
            <hr>
            <h2>Fájl részletei</h2>
            <h3>Fájlnév:<span class="data-file-name">fajl_neve.pdf</span></h3>
            <h3>Tárgy:<span class="data-file-subject">Tárgy neve</span></h3>
            <h3>Feltöltés dátuma:<span class="data-file-date">2025-01-01</span></h3>
            <h3>Letöltések:<span class="data-file-downloads">42</span></h3>
            <h3>Értékelés:<span class="data-file-rating">17</span></h3>
            <h3>Leírás:</h3>
            <p class="data-file-description">Itt van a fájl részletes leírása. Ez a szöveg több soros is lehet, és részletes információkat tartalmazhat a fájlról.</p>
            <!-- Generálandó rész vége -->
            <hr>
            <div class="modal_footer">
                <button class="button modal_delete_button" aria-label="Fájl törlése">
                    <img src="icons/delete.svg" alt="Törlés">
                    <span>Fájl törlése</span>
                </button>
                <button class="button modal_download_button" aria-label="Letöltés">
                    <img src="icons/download.svg" alt="Letöltés">
                    <span>Letöltés</span>
                </button>
                <button class="button modal_edit_button edit_file_button" aria-label="Szerkesztés">
                    <img src="icons/edit.svg" alt="Szerkesztés">
                    <span>Szerkesztés</span>
                </button>
            </div>
        </div>
    </div>
    <div class="modal own_uncompleted_requests_modal">
        <div class="modal_content">
            <button class="button small_button modal_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <!-- Saját teljesítetlen kérelem részletei, adatok később PHP-vel generálandó -->
            <h2 class="data-request-title">Kérelem címe</h2>
            <hr>
            <h2>Kérelem részletei</h2>
            <h3>Tárgy:<span class="data-request-subject">Tárgy neve</span></h3>
            <h3>Feltöltés dátuma:<span class="data-request-date">2025-01-01</span></h3>
            <h3>Leírás:</h3>
            <p class="data-request-description">Itt van a kérelem részletes leírása. Ez a szöveg több soros is lehet, és részletes információkat tartalmazhat a kérelemről.</p>
            <!-- Generálandó rész vége -->
            <hr>
            <div class="modal_footer">
                <button class="button modal_delete_button" aria-label="Kérelem törlése">
                    <img src="icons/delete.svg" alt="Törlés">
                    <span>Kérelem törlése</span>
                </button>
                <button class="button modal_edit_button edit_request_button" aria-label="Szerkesztés">
                    <img src="icons/edit.svg" alt="Szerkesztés">
                    <span>Szerkesztés</span>
                </button>
            </div>
        </div>
    </div>
    <div class="modal own_completed_requests_modal">
        <div class="modal_content">
            <button class="button small_button modal_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <!-- Saját teljesített kérelem részletei, adatok később PHP-vel generálandó -->
            <h2 class="data-request-title">Kérelem címe</h2>
            <hr>
            <h2>Kérelemhez feltöltött fájl részletei</h2>
            <h3>Fájl címe:<span class="data-file-title">Fájl címe</span></h3>
            <h3>Feltöltő:<span class="data-file-uploader">Feltöltő neve</span></h3>
            <h3>Fájlnév:<span class="data-file-name">fajl_neve.pdf</span></h3>
            <h3>Tárgy:<span class="data-file-subject">Tárgy neve</span></h3>
            <h3>Feltöltés dátuma:<span class="data-file-date">2025-01-01</span></h3>
            <h3>Letöltések:<span class="data-file-downloads">42</span></h3>
            <h3 class="voting_section">
                <span>Értékelés:</span>
                <span class="data-file-rating">17</span>
                <span class="voting_container">
                    <button class="button modal_downvote_button downvote_button" aria-label="Nem tetszik">
                        <img src="icons/downvote.svg" alt="Nem tetszik">
                    </button>  
                    <button class="button modal_upvote_button upvote_button" aria-label="Tetszik">
                        <img src="icons/upvote.svg" alt="Tetszik">
                    </button>  
                </span>
            </h3>
            <h3>Leírás:</h3>
            <p class="data-file-description">Itt van a fájl részletes leírása. Ez a szöveg több soros is lehet, és részletes információkat tartalmazhat a fájlról.</p>
            <!-- Generálandó rész vége -->
            <hr>
            <div class="modal_footer">
                <button class="button modal_accept_button" aria-label="Kérelem lezárása">
                    <img src="icons/tick.svg" alt="Elfogadás">
                    <span>Kérelem lezárása</span>
                </button>
                <button class="button modal_download_button" aria-label="Letöltés">
                    <img src="icons/download.svg" alt="Letöltés">
                    <span>Letöltés</span>
                </button>
                <button class="button modal_reset_button" aria-label="Újraküldés">
                    <img src="icons/reset.svg" alt="Újraküldés">
                    <span>Kérelem újraküldés</span>
                </button>
            </div>
        </div>
    </div>
    <div class="modal small_modal edit_file_modal">
        <div class="modal_content small_modal_content">
            <button class="button small_button edit_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2>Fájl szerkesztése</h2>
            <hr>
            <!-- Fájl szerkesztő űrlap, később PHP-vel generálandó az alapértelmezett érték -->
            <form id="editFileForm" action="" method="post" enctype="multipart/form-data">
                <label for="fileTitle">Fájl címe:</label>
                <input type="text" id="fileTitle" name="file_title" value="Fájl címe" required>
                <label for="fileDescription">Rövid leírás:</label>
                <textarea id="fileDescription" name="file_description" required>Fájl leírása</textarea>
                <div class="checkbox-container">
                    <input type="checkbox" id="replace_file_checkbox" name="replace_file">
                    <label for="replace_file_checkbox">Más fájl feltöltése</label>
                </div>
                <div id="file_upload_section" style="display: none;">
                    <label for="fileUpload">Fájl kiválasztása:</label>
                    <input type="file" id="fileUpload" name="file_upload" accept=".pdf,.doc,.docx,.txt,.xls,.xlsx" required>
                </div>
                <hr>
                <div class="modal_footer">
                    <button type="button" class="button edit_close_button" aria-label="Mégse">
                        <img src="icons/close.svg" alt="Mégse">
                        <span>Mégse</span>
                    </button>
                    <button type="submit" class="button modal_edit_button" aria-label="Mentés">
                        <img src="icons/save.svg" alt="Mentés">
                        <span>Mentés</span>
                    </button>
                </div>
            </form>
            <!-- Generálandó rész vége -->
        </div>
    </div>
    <div class="modal small_modal edit_request_modal">
        <div class="modal_content small_modal_content">
            <button class="button small_button edit_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2>Kérelem szerkesztése</h2>
            <hr>
            <!-- Kérelem szerkesztő űrlap, később PHP-vel generálandó az alapértelmezett érték -->
            <form id="editRequestForm" action="" method="post">
                <label for="requestTitle">Kérelem címe:</label>
                <input type="text" id="requestTitle" name="request_title" value="Kérelem címe" required>
                <label for="requestDescription">Rövid leírás:</label>
                <textarea id="requestDescription" name="request_description" required>Kérelem leírása</textarea>
                <hr>
                <div class="modal_footer">
                    <button type="button" class="button edit_close_button" aria-label="Mégse">
                        <img src="icons/close.svg" alt="Mégse">
                        <span>Mégse</span>
                    </button>
                    <button type="submit" class="button modal_edit_button" aria-label="Mentés">
                        <img src="icons/save.svg" alt="Mentés">
                        <span>Mentés</span>
                    </button>
                </div>
            </form>
            <!-- Generálandó rész vége -->
        </div>
    </div>
    <div class="modal small_modal edit_chatroom_modal">
        <div class="modal_content small_modal_content">
            <button class="button small_button edit_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2>Chatszoba szerkesztése</h2>
            <hr>
            <!-- Chatszoba szerkesztő űrlap, később PHP-vel generálandó az alapértelmezett érték -->
            <form id="editChatroomForm" action="" method="post">
                <label for="chatroomTitle">Chatszoba címe:</label>
                <input type="text" id="chatroomTitle" name="chatroom_title" value="Chatszoba címe" required>
                <label for="chatroomDescription">Rövid leírás:</label>
                <textarea id="chatroomDescription" name="chatroom_description" required>Chatszoba leírása</textarea>
                <hr>
                <div class="modal_footer">
                    <button type="button" class="button edit_close_button" aria-label="Mégse">
                        <img src="icons/close.svg" alt="Mégse">
                        <span>Mégse</span>
                    </button>
                    <button type="submit" class="button modal_edit_button" aria-label="Mentés">
                        <img src="icons/save.svg" alt="Mentés">
                        <span>Mentés</span>
                    </button>
                </div>
            </form>
            <!-- Generálandó rész vége -->
        </div>
    </div>
    <script type="text/javascript" src="scripts.js"></script>
</body>
</html>