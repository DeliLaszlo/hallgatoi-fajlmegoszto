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
                <p>Feltöltés dátuma</p>
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
            <!-- Tárgy kérelmei, később PHP-vel generálandó -->
            <div class="content_container request_container">
                <a href="#" class="container_link upload_file_button" aria-label="Fájl feltöltése"></a>
                <h2>Kérelem címe</h2>
                <p>Kérelem leírása</p>
                <p>Kérelmező, feltöltés dátuma</p>
            </div>
            <!-- Generálandó rész vége -->
        </section>
        <section id="subject_chatszobak">
            <h1>Dummy text 3</h1>
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
                <button class="button modal_report_button" aria-label="Jelentés">
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
            </form>
            <!-- Generálandó rész vége -->
            <hr>
            <div class="modal_footer">
                <button class="button upload_close_button" aria-label="Mégse">
                    <img src="icons/close.svg" alt="Mégse">
                    <span>Mégse</span>
                </button>
                <button class="button modal_upload_button" aria-label="Feltöltés">
                    <img src="icons/upload.svg" alt="Feltöltés">
                    <span>Feltöltés</span>
                </button>
            </div>
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
            </form>
            <!-- Generálandó rész vége -->
            <hr>
            <div class="modal_footer">
                <button class="button request_close_button" aria-label="Mégse">
                    <img src="icons/close.svg" alt="Mégse">
                    <span>Mégse</span>
                </button>
                <button class="button modal_add_button" aria-label="Feltöltés">
                    <img src="icons/add.svg" alt="Feltöltés">
                    <span>Létrehozás</span>
                </button>
            </div>
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
    <script type="text/javascript" src="scripts.js"></script>
</body>
</html>