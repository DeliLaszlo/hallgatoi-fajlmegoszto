<?php
session_start();
if (!isset($_SESSION['user_neptun'])) {
    // Később admin ellenőrzés hozzáadása
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
    <title>Admin felület</title>
</head>
<body id="admin_page">
    <div id="loading-screen" class="loading-screen initial-loading">
        <div class="loading-spinner">
            <img src="icons/hourglass.svg" alt="Betöltés">
            <div class="loading-text">Oldal betöltése...</div>
        </div>
    </div>
    <header>
        <img src="icons/IVK_logo.png" alt="IVK logo" class="ivk_logo header_img" width="1920" height="586">
        <h1 id="adminh1">Admin felület</h1>
        <a href="php/logout.php" class="logout_button header_button top_middle_button">
            <img src="icons/logout.svg" alt="Kijelentkezés" class="logout-icon">
            <span class="hideable_text">Kijelentkezés</span>
        </a>
    </header>
    <section id="admin">
        <!-- Kezelőgombok -->
        <div class="admin_buttons">
            <button id="manageUsersButton">
                <img src="icons/users.svg" alt="Felhasználók kezelése ikon">
                <span >Felhasználók kezelése</span>
            </button>
            <button id="manageSubjectsButton">
                <img src="icons/subjects.svg" alt="Tárgyak kezelése ikon">
                <span >Tárgyak kezelése</span>
            </button>
            <button id="manageFilesButton">
                <img src="icons/file.svg" alt="Fájlok kezelése ikon">
                <span >Fájlok kezelése</span>
            </button>
            <button id="manageRequestsButton">
                <img src="icons/request.svg" alt="Kérelmek kezelése ikon">
                <span >Kérelmek kezelése</span>
            </button>
            <button id="manageChatroomsButton">
                <img src="icons/chat.svg" alt="Chatszobák kezelése ikon">
                <span >Chatszobák kezelése</span>
            </button>
        </div>

        <!-- ====== Áttekintés ====== --> 
        <div class="content_container">
            <h2><img src="icons/statistics.svg" alt="Statisztika ikon">Statisztika</h2>
            <p id="allUsers">Összes felhasználó: 124</p>
            <p id="allSubjects">Aktív tárgyak: 18</p>
            <p id="allFiles">Feltöltött fájlok: 672</p>
            <p id="allRequests">Függő kérelmek: 9</p>
            <p id="allChatrooms">Aktív chatszobák: 5</p>
        </div>

        <!-- ====== Legutóbbi aktivitások ====== -->
        <details>
            <summary>
                <img src="icons/hourglass.svg" alt="Óra ikon">
                <h2>Legutóbbi aktivitások</h2>
            </summary>
            <div class="filterButtons">
                <div class="filterItem">
                    <input type="radio" name="latestFilter" id="latestFiles" checked>
                    <label for="latestFiles" class="filterLabel">Fájlok</label>
                </div>
                <div class="filterItem">
                    <input type="radio" name="latestFilter" id="latestRequests">
                    <label for="latestRequests" class="filterLabel">Kérelmek</label>
                </div>
                <div class="filterItem">
                    <input type="radio" name="latestFilter" id="latestChatrooms">
                    <label for="latestChatrooms" class="filterLabel">Chatszobák</label>
                </div>
            </div>
            <div id="latest_activities_container"></div>
        </details>
        <!-- ================== Jelentések ================== -->
        <details>
            <summary>
                <img src="icons/report.svg" alt="Jelentés ikon">
                <h2>Jelentések kezelése</h2>
            </summary>
            <div class="filterButtons">
                <div class="filterItem">
                    <input type="radio" name="reportFilter" id="reportedAll" checked>
                    <label for="reportedAll" class="filterLabel">Összes</label>
                </div>
                <div class="filterItem">
                    <input type="radio" name="reportFilter" id="reportedFiles">
                    <label for="reportedFiles" class="filterLabel">Fájlok</label>
                </div>
                <div class="filterItem">
                    <input type="radio" name="reportFilter" id="reportedRequests">
                    <label for="reportedRequests" class="filterLabel">Kérelmek</label>
                </div>
                <div class="filterItem">
                    <input type="radio" name="reportFilter" id="reportedChatrooms">
                    <label for="reportedChatrooms" class="filterLabel">Chatszobák</label>
                </div>
            </div>
            <!-- Kinézet még változni fog -->
            <div class="content_container">
                <h3>Elem neve</h3>
                <p>Jelentés oka</p>
                <p>Jelentő, dátum</p>
            </div>
            <!-- -->
        </details>
    </section>
    <!-- Felhasználók kezelése modal -->
    <div class="modal admin_user_modal">
        <div class="modal_content">
            <button class="button small_button modal_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2>Felhasználók</h2>
            <hr>
            <div class="search_container admin_search modal_search_container">
                <input type="text" id="user_search_input" class="admin_search_input" placeholder="Felhasználó keresése..." aria-label="Felhasználó keresése">
                <button id="user_search_button" aria-label="Keresés">
                    <img src="icons/search.svg" alt="Keresés">
                </button>
            </div>
            <hr>
            <div id="user_list_container"></div>
        </div>
    </div>
    <!-- Tárgyak kezelése modal -->
    <div class="modal admin_subject_modal">
        <div class="modal_content">
            <button class="button small_button modal_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2>Tárgyak</h2>
            <hr>
            <div class="admin_modal_header">
                <button class="large_button new_subject_button" aria-label="Tárgy hozzáadása">
                    <img src="icons/add.svg" alt="Tárgy hozzáadása">
                    <span>Új tárgy</span>
                </button>
                <div class="search_container modal_search_container">
                    <input type="text" id="subject_search_input" class="admin_search_input" placeholder="Tárgy keresése..." aria-label="Tárgy keresése">
                    <button id="subject_search_button" aria-label="Keresés">
                        <img src="icons/search.svg" alt="Keresés">
                    </button>
                </div>
            </div>
            <hr>
            <div id="subject_list_container"></div>
        </div>
    </div>
    <!-- Új tárgy hozzáadása modal -->
    <div class="modal small_modal admin_add_subject_modal">
        <div class="modal_content small_modal_content">
            <button class="button small_button modal_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2>Tárgy hozzáadása</h2>
            <hr>
            <form id="addSubjectForm" action="" method="post">
                <label for="subjectName">Tárgy neve:</label>
                <input type="text" id="subjectName" name="subject_name" placeholder="Tárgy neve" required>
                <label for="subjectCode">Tárgy kódja:</label>
                <input type="text" id="subjectCode" name="subject_code" placeholder="Tárgy kódja" required>
                <hr>
                <div class="modal_footer">
                    <button type="button" class="button add_close_button" aria-label="Mégse">
                        <img src="icons/close.svg" alt="Mégse">
                        <span>Mégse</span>
                    </button>
                    <button type="submit" class="button modal_add_button" aria-label="Hozzáadás">
                        <img src="icons/add.svg" alt="Hozzáadás">
                        <span>Hozzáadás</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
    <!-- Tárgy szerkesztése modal -->
    <div class="modal small_modal admin_edit_subject_modal">
        <div class="modal_content small_modal_content">
            <button class="button small_button modal_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2>Tárgy szerkesztése</h2>
            <hr>
            <form id="editSubjectForm" action="" method="post">
                <label for="subjectName">Tárgy neve:</label>
                <input type="text" id="editSubjectName" name="subject_name" value="Tárgy neve" required>
                <label for="subjectCode">Tárgy kódja:</label>
                <input type="text" id="editSubjectCode" name="subject_code" value="Tárgy kódja" required>
                <hr>
                <div class="modal_footer">
                    <button type="button" class="button edit_close_button" aria-label="Mégse">
                        <img src="icons/close.svg" alt="Mégse">
                        <span>Mégse</span>
                    </button>
                    <button type="submit" class="button modal_save_button" aria-label="Mentés">
                        <img src="icons/save.svg" alt="Mentés">
                        <span>Mentés</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
    <!-- Fájlok kezelése modal -->
    <div class="modal admin_files_modal">
        <div class="modal_content">
            <button class="button small_button modal_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2>Fájlok</h2>
            <hr>
            <div class="search_container admin_search modal_search_container">
                <input type="text" id="admin_file_search_input" class="admin_search_input" placeholder="Fájl keresése..." aria-label="Fájl keresése">
                <button id="admin_file_search_button" aria-label="Keresés">
                    <img src="icons/search.svg" alt="Keresés">
                </button>
            </div>
            <hr>
            <div id="file_list_container"></div>
        </div>
    </div>
    <!-- Kérelmek kezelése modal -->
    <div class="modal admin_requests_modal">
        <div class="modal_content">
            <button class="button small_button modal_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2>Kérelmek</h2>
            <hr>
            <div class="search_container admin_search modal_search_container">
                <input type="text" id="admin_request_search_input" class="admin_search_input" placeholder="Kérelem keresése..." aria-label="Kérelem keresése">
                <button id="admin_request_search_button" aria-label="Keresés">
                    <img src="icons/search.svg" alt="Keresés">
                </button>
            </div>
            <hr>
            <div id="request_list_container"></div>
        </div>
    </div>
    <!-- Chatszobák kezelése modal -->
    <div class="modal admin_chatrooms_modal">
        <div class="modal_content">
            <button class="button small_button modal_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2>Chatszobák</h2>
            <hr>
            <div class="search_container admin_search modal_search_container">
                <input type="text" id="admin_chatroom_search_input" class="admin_search_input" placeholder="Chatszoba keresése..." aria-label="Chatszoba keresése">
                <button id="admin_chatroom_search_button" aria-label="Keresés">
                    <img src="icons/search.svg" alt="Keresés">
                </button>
            </div>
            <hr>
            <div id="chatroom_list_container">
                <div class="content_container admin_container admin_chatroom_container">
                    <a href="#" class="container_link chatroom_link" aria-label="Chatszoba megnyitása"></a>
                    <h2>Chatszoba neve</h2>
                    <button class="button small_button admin_button chatroom_delete_button" data-chatroom-id="" aria-label="Chatszoba törlése">
                        <img src="icons/delete.svg" alt="Törlés">
                        <span class="icon_text">Törlés</span>
                    </button>
                    <p>Létrehozó, dátum</p>
                    <p></p> <!-- Üres hely a jó elrendezés miatt -->
                    <p>Leírás</p>
                </div>
            </div>
        </div>
    </div>
    <!-- Fájl részletei modal -->
    <div class="modal file_details_modal">
        <div class="modal_content">
            <button class="button small_button modal_close_button" aria-label="Bezárás">
                <img src="icons/close.svg" alt="Bezárás">
            </button>
            <h2 class="data-file-title">Fájl címe</h2>
            <hr>
            <h2>Fájl részletei</h2>
            <h3>Feltöltő:<span class="data-file-uploader">Felhasználó neve</span></h3>
            <h3>Fájlnév:<span class="data-file-name">fajl_neve.pdf</span></h3>
            <h3>Feltöltés dátuma:<span class="data-file-date">2025-01-01</span></h3>
            <h3>Letöltések:<span class="data-file-downloads">42</span></h3>
            <h3 class="voting_section">
                <span>Értékelés:</span>
                <span class="data-file-rating">17</span>
            </h3>
            <h3>Leírás:</h3>
            <p class="data-file-description">Itt van a fájl részletes leírása. Ez a szöveg több soros is lehet, és részletes információkat tartalmazhat a fájlról.</p>
            <hr>
            <div class="modal_footer">
                <button class="button delete_button" aria-label="Törlés">
                    <img src="icons/delete.svg" alt="Törlés">
                    <span>Törlés</span>
                </button>
                <button class="button modal_download_button" aria-label="Letöltés">
                    <img src="icons/download.svg" alt="Letöltés">
                    <span>Letöltés</span>
                </button>
            </div>
        </div>
    </div>
    <script src="scripts.js"></script>
</body>
</html>