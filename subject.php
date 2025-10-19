<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" type="image/x-icon" href="https://munkatars.sze.hu/core/templates/sze2018_bluerev/favicon.ico?v=2">
    <title>Tárgy címe</title> <!-- PHP-val generált -->
</head>
<body>
    <header>
        <span class="active-section-name"></span>
        <button class="hamburger" aria-label="Menu">
            <img src="icons/hamburger_menu.svg" alt="Menu" class="hamburger-icon menu-icon">
            <img src="icons/close.svg" alt="Close" class="hamburger-icon close-icon">
        </button>
        <nav class="nav-menu">
            <h1>Tárgy címe</h1> <!-- PHP-val generált -->
            <ul>
                <li><a href="#" id="nav_fajlok">Feltöltött fájlok</a></li>
                <li><a href="#" id="nav_kerelemek">Kérelmek</a></li>
                <li><a href="#" id="nav_chatszobak">Chatszobák</a></li>
            </ul>
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
        <section id="subject_fajlok">
            <div class="section_header subject_files_header">
                <h1>Feltöltött fájlok</h1>
                <div class="section_header_actions">
                    <div class="search_container content_search_container">
                        <input type="text" id="file_search_input" placeholder="Fájl keresése..." aria-label="Fájl keresése">
                        <button id="file_search_button" aria-label="Keresés">
                            <img src="icons/search.svg" alt="Keresés">
                        </button>
                    </div>
                    <button class="large_button upload_file_button" aria-label="Fájl feltöltése">
                        <img src="icons/upload.svg" alt="Fájl feltöltése">
                        <span class="icon_text">Fájl feltöltése</span>
                    </button>
                </div>
            </div>
            <hr>
            <!-- Ha nincsenek fájlok, display none nélkül -->
            <h2 class="no_content_message" style="display: none;">Még nincsenek feltöltött fájlok ehhez a tárgyhoz.</h2>
            <!-- Tárgy fájljai, később PHP-vel generálandó -->
            <div class="content_container uploaded_files_container">
                <a href="#" class="container_link file_details_link" aria-label="Fájl részletei"></a>
                <button class="button small_button content_download_button" aria-label="Letöltés">
                    <span class="icon_text">Letöltés</span>
                    <img src="icons/download.svg" alt="Letöltés">
                </button>
                <div class="content_rating">
                    <span>4.5 / 5<span class="hideable_text"> (20 értékelés)</span></span>
                    <img src="icons/star.svg" alt="Értékelés">     
                </div>
                <div class="content_downloads">
                    <span>42<span class="hideable_text"> letöltés</span></span>
                    <img src="icons/download.svg" alt="Letöltések">
                </div>
                <h2>Fájl neve</h2>
                <p>Fájl leírása</p>
                <p>Feltöltő, feltöltés dátuma</p>
            </div>
            <!-- Generálandó rész vége -->
            <!-- Felhasználó saját fájlja esetén, később PHP-vel generálandó -->
            <div class="content_container uploaded_files_container">
                <a href="#" class="container_link own_details_link" aria-label="Fájl részletei"></a>
                <button class="button small_button content_download_button" aria-label="Letöltés">
                    <span class="icon_text">Letöltés</span>
                    <img src="icons/download.svg" alt="Letöltés">
                </button>
                <div class="content_rating">
                    <span>4.5 / 5<span class="hideable_text"> (20 értékelés)</span></span>
                    <img src="icons/star.svg" alt="Értékelés">     
                </div>
                <div class="content_downloads">
                    <span>42<span class="hideable_text"> letöltés</span></span>
                    <img src="icons/download.svg" alt="Letöltések">
                </div>
                <h2>Fájl neve</h2>
                <p>Fájl leírása</p>
                <p>Te, feltöltés dátuma</p>
            </div>
            <!-- Generálandó rész vége -->
        </section>
        <section id="subject_kerelemek">
            <div class="section_header">
                <h1>Kérelmek</h1>
                <button class="large_button add_request_button" aria-label="Kérelem hozzáadása">
                    <img src="icons/add.svg" alt="Kérelem hozzáadása">
                    <span class="icon_text">Új kérelem</span>
                </button>
            </div>
            <hr>
            <!-- Ha nincsenek kérelmek, display none nélkül -->
            <h2 class="no_content_message" style="display: none;">Még nincsenek kérelmek ehhez a tárgyhoz.</h2>
            <!-- Tárgy kérelmei, később PHP-vel generálandó -->
            <div class="content_container request_container">
                <a href="#" class="container_link upload_file_button" aria-label="Fájl feltöltése"></a>
                <button class="button small_button content_upload_button upload_file_button" aria-label="Fájl feltöltése">
                    <span class="icon_text">Fájl feltöltése</span>
                    <img src="icons/upload.svg" alt="Fájl feltöltése">
                </button>
                <button class="button small_button content_report_button report_button" aria-label="Kérelem jelentése">
                    <span class="icon_text">Jelentés</span>
                    <img src="icons/report.svg" alt="Kérelem jelentése">
                </button>
                <h2>Kérelem címe</h2>
                <p>Kérelem leírása</p>
                <p>Kérelmező, feltöltés dátuma</p>
            </div>
            <!-- Generálandó rész vége -->
            <!-- Felhasználó saját kérelme esetén, később PHP-vel generálandó -->
            <div class="content_container request_container">
                <a href="#" class="container_link own_uncompleted_requests_link" aria-label="Kérelem megnyitása"></a>
                <button class="button small_button content_edit_button edit_request_button" aria-label="Szerkesztés">
                    <span class="icon_text">Szerkesztés</span>
                    <img src="icons/edit.svg" alt="Szerkesztés">
                </button>
                <button class="button small_button content_delete_button" aria-label="Törlés">
                    <span class="icon_text">Törlés</span>
                    <img src="icons/delete.svg" alt="Törlés">
                </button>
                <h2>Kérelem címe</h2>
                <p>Kérelem leírása</p>
                <p>Te, feltöltés dátuma</p>
            </div>
            <!-- Generálandó rész vége -->
        </section>
        <section id="subject_chatszobak">
            <div class="section_header">
                <h1>Chatszobák</h1>
                <button class="large_button add_chatroom_button" aria-label="Chatszoba hozzáadása">
                    <img src="icons/add.svg" alt="Chatszoba hozzáadása">
                    <span class="icon_text">Új chatszoba</span>
                </button>
            </div>
            <hr>
            <!-- Ha nincsenek chatszobák, display none nélkül -->
            <h2 class="no_content_message" style="display: none;">Még nincsenek chatszobák ehhez a tárgyhoz.</h2>
            <!-- Tárgy chatszobái, később PHP-vel generálandó -->
            <div class="content_container chatroom_container">
                <a href="#" class="container_link chatroom_link" aria-label="Chatszoba megnyitása"></a>
                <button class="button small_button content_follow_button" aria-label="Követés">
                    <span class="icon_text">Követés</span>
                    <img src="icons/follow.svg" alt="Követés">
                </button>
                <button class="button small_button content_unfollow_button" aria-label="Követés megszüntetése" style="display: none;">
                    <span class="icon_text">Követés megszüntetése</span>
                    <img src="icons/unfollow.svg" alt="Követés megszüntetése">
                </button>
                <button class="button small_button content_report_button report_button" aria-label="Chatszoba jelentése">
                    <span class="icon_text">Jelentés</span>
                    <img src="icons/report.svg" alt="Chatszoba jelentése">
                </button>
                <h2>Chatszoba címe</h2>
                <p>Chatszoba leírása</p>
                <p>Létrehozó, követők száma</p>
            </div>
            <!-- Generálandó rész vége -->
            <!-- Felhasználó saját chatszobája esetén, később PHP-vel generálandó -->
            <div class="content_container chatroom_container">
                <a href="#" class="container_link chatroom_link" aria-label="Chatroom megnyitása"></a>
                <button class="button small_button content_edit_button edit_chatroom_button" aria-label="Szerkesztés">
                    <span class="icon_text">Szerkesztés</span>
                    <img src="icons/edit.svg" alt="Szerkesztés">
                </button>
                <button class="button small_button content_delete_button" aria-label="Törlés">
                    <span class="icon_text">Törlés</span>
                    <img src="icons/delete.svg" alt="Törlés">
                </button>
                <h2>Chatroom címe</h2>
                <p>Chatroom leírása</p>
                <p>Te, követők száma</p>
            </div>
            <!-- Generálandó rész vége -->
        </section>
    </main>
    <div class="modal file_details_modal">
        <div class="modal_content">
            <button class="button small_button modal_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <!-- Fájl részletei, adatok később PHP-vel generálandó -->
            <h2 class="data-file-title">Fájl címe</h2>
            <hr>
            <h2>Fájl részletei</h2>
            <h3>Feltöltő:<span class="data-file-uploader">Felhasználó neve</span></h3>
            <h3>Fájlnév:<span class="data-file-name">fajl_neve.pdf</span></h3>
            <h3>Feltöltés dátuma:<span class="data-file-date">2025-01-01</span></h3>
            <h3>Fájl mérete:<span class="data-file-size">1.5 MB</span></h3>
            <h3>Letöltések:<span class="data-file-downloads">42</span></h3>
            <h3>Értékelés:<span class="data-file-rating">4.5 / 5 (20 értékelés)</span></h3>
            <h3>Leírás:</h3>
            <p class="data-file-description">Itt van a fájl részletes leírása. Ez a szöveg több soros is lehet, és részletes információkat tartalmazhat a fájlról.</p>
            <!-- Generálandó rész vége -->
            <hr>
            <div class="modal_footer">
                <button class="button modal_rate_button" aria-label="Értékelés">
                    <img src="icons/star.svg" alt="Értékelés">
                    <span>Értékelés</span>
                </button>
                <button class="button modal_download_button" aria-label="Letöltés">
                    <img src="icons/download.svg" alt="Letöltés">
                    <span>Letöltés</span>
                </button>
                <button class="button report_button" aria-label="Jelentés">
                    <img src="icons/report.svg" alt="Jelentés">
                    <span>Jelentés</span>
                </button>
            </div>
        </div>
    </div>
    <div class="modal small_modal upload_file_modal">
        <div class="modal_content small_modal_content">
            <button class="button small_button upload_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2>Fájl feltöltése</h2>
            <hr>
            <!-- Fájl feltöltő űrlap, később PHP-val feldolgozandó -->
            <form id="upload_file_form" action="" method="post" enctype="multipart/form-data">
                <label for="file_title">Fájl címe:</label>
                <input type="text" id="file_title" name="file_title" placeholder="Fájl címe" required>
                <label for="file_description">Rövid leírás:</label>
                <textarea id="file_description" name="file_description" placeholder="Fájl leírása" required></textarea>
                <label for="file_upload">Fájl kiválasztása:</label>
                <input type="file" id="file_upload" name="file_upload" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png">
                <hr>
                <div class="modal_footer">
                    <button type="button" class="button upload_close_button" aria-label="Mégse">
                        <img src="icons/close.svg" alt="Mégse">
                        <span>Mégse</span>
                    </button>
                    <button type="submit" class="button modal_upload_button" aria-label="Feltöltés">
                        <img src="icons/upload.svg" alt="Feltöltés">
                        <span>Feltöltés</span>
                    </button>
                </div>
            </form>
            <!-- Generálandó rész vége -->
        </div>
    </div>
    <div class="modal small_modal add_request_modal">
        <div class="modal_content small_modal_content">
            <button class="button small_button request_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2>Új kérelem</h2>
            <hr>
            <!-- Kérelem feltöltő űrlap, később PHP-val feldolgozandó -->
            <form id="add_request_form" action="" method="post" enctype="multipart/form-data">
                <label for="request_title">Kérelem címe:</label>
                <input type="text" id="request_title" name="request_title" placeholder="Kérelem címe" required>
                <label for="request_description">Rövid leírás:</label>
                <textarea id="request_description" name="request_description" placeholder="Kérelem leírása" required></textarea>
                <hr>
                <div class="modal_footer">
                    <button type="button" class="button request_close_button" aria-label="Mégse">
                        <img src="icons/close.svg" alt="Mégse">
                        <span>Mégse</span>
                    </button>
                    <button type="submit" class="button modal_add_button" aria-label="Feltöltés">
                        <img src="icons/add.svg" alt="Feltöltés">
                        <span>Létrehozás</span>
                    </button>
                </div>
            </form>
            <!-- Generálandó rész vége -->
        </div>
    </div>
    <div class="modal small_modal add_chatroom_modal">
        <div class="modal_content small_modal_content">
            <button class="button small_button chatroom_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2>Új chatszoba</h2>
            <hr>
            <!-- Chatszoba űrlap, később PHP-val feldolgozandó -->
            <form id="add_chatroom_form" action="" method="post" enctype="multipart/form-data">
                <label for="chatroom_title">Chatszoba címe:</label>
                <input type="text" id="chatroom_title" name="chatroom_title" placeholder="Chatszoba címe" required>
                <label for="chatroom_description">Rövid leírás:</label>
                <textarea id="chatroom_description" name="chatroom_description" placeholder="Chatszoba leírása" required></textarea>
                <hr>
                <div class="modal_footer">
                    <button type="button" class="button chatroom_close_button" aria-label="Mégse">
                        <img src="icons/close.svg" alt="Mégse">
                        <span>Mégse</span>
                    </button>
                    <button type="submit" class="button modal_add_button" aria-label="Feltöltés">
                        <img src="icons/add.svg" alt="Feltöltés">
                        <span>Létrehozás</span>
                    </button>
                </div>
            </form>
            <!-- Generálandó rész vége -->
        </div>
    </div>
    <div class="modal small_modal rate_file_modal">
        <div class="modal_content small_modal_content">
            <button class="button small_button rate_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2>Fájl értékelése</h2>
            <hr>
            <div class="rating_container">
                <p>Válassza ki az értékelését:</p>
                <div class="star_rating">
                    <img src="icons/star.svg" alt="1 csillag" class="rating_star" data-rating="1">
                    <img src="icons/star.svg" alt="2 csillag" class="rating_star" data-rating="2">
                    <img src="icons/star.svg" alt="3 csillag" class="rating_star" data-rating="3">
                    <img src="icons/star.svg" alt="4 csillag" class="rating_star" data-rating="4">
                    <img src="icons/star.svg" alt="5 csillag" class="rating_star" data-rating="5">
                </div>
            </div>
            <hr>
            <div class="modal_footer">
                <button class="button rate_close_button" aria-label="Mégse">
                    <img src="icons/close.svg" alt="Mégse">
                    <span>Mégse</span>
                </button>
                <button class="button modal_save_rate_button" aria-label="Értékelés">
                    <img src="icons/star.svg" alt="Értékelés">
                    <span>Értékelés</span>
                </button>
            </div>
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
            <h3>Fájl mérete:<span class="data-file-size">1.5 MB</span></h3>
            <h3>Letöltések:<span class="data-file-downloads">42</span></h3>
            <h3>Értékelés:<span class="data-file-rating">4.5 / 5 (20 értékelés)</span></h3>
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
                    <input type="file" id="fileUpload" name="file_upload" accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png">
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
    <div class="modal small_modal report_content_modal">
        <div class="modal_content small_modal_content">
            <button class="button small_button report_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2>Jelentés beküldése</h2>
            <hr>
            <!-- Tartalom jelentő űrlap, később PHP-val feldolgozandó -->
            <p>Írja le, miért szeretné jelenteni ezt a tartalmat:</p>
            <form id="reportContentForm" action="" method="post">
                <textarea id="report_description" name="report_description" placeholder="Írja ide a jelentés okát" required></textarea>
                <hr>
                <div class="modal_footer">
                    <button type="button" class="button report_close_button" aria-label="Mégse">
                        <img src="icons/close.svg" alt="Mégse">
                        <span>Mégse</span>
                    </button>
                    <button type="submit" class="button modal_report_button" aria-label="Beküldés">
                        <img src="icons/save.svg" alt="Mentés">
                        <span>Beküldés</span>
                    </button>
                </div>
            </form>
            <!-- Feldolgozandó rész vége -->    
        </div>
    </div>
    <script type="text/javascript" src="scripts.js"></script>
</body>
</html>