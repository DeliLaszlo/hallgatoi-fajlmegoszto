<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css">
    <link rel="icon" type="image/x-icon" href="https://munkatars.sze.hu/core/templates/sze2018_bluerev/favicon.ico?v=2">
    <script type="text/javascript" src="scripts.js"></script>
    <title>Dashboard</title>
</head>
<body>
    <header>
        <img src="https://munkatars.sze.hu/images/Arculat/Kari%20logo/IVK_hun.png" alt="IVK logo" class="ivk_logo header_img" width="8737" height="2665">
        <span class="active-section-name"></span>
        <button class="hamburger" aria-label="Menu">
            <img src="icons/hamburger_menu.svg" alt="Menu" class="hamburger-icon menu-icon">
            <img src="icons/close.svg" alt="Close" class="hamburger-icon close-icon">
        </button>
        <nav class="nav-menu">
            <h1>Dashboard</h1>
            <ul>
                <li><a href="#" id="nav_targyak">Tárgyaim</a></li>
                <li><a href="#" id="nav_fajlok">Feltöltött fájljaim</a></li>
                <li><a href="#" id="nav_kerelemek">Kérelmeim</a></li>
                <li><a href="#" id="nav_chatszobak">Chatszobáim</a></li>
                <li><a href="#" id="nav_profil">Profilom</a></li>
            </ul>
            <a href="#" class="logoutButton">
                <img src="icons/logout.svg" alt="Kijelentkezés" class="logout-icon">
                <span>Kijelentkezés</span>
            </a>
        </nav>
    </header>
    <main>
        <section id="dashboard_targyak">
            <h1>Dummy text 1</h1>
        </section>
        <section id="dashboard_fajlok">
            <h1>Feltöltött fájljaim</h1>
            <!-- Felhasználó fájljai, később PHP-vel generálandó -->
            <div class="content_container">
                <a href="#" class="container_link details_link" aria-label="Fájl megnyitása"></a>
                <button class="content_button content_download_button" aria-label="Letöltés">
                    <img src="icons/download.svg" alt="Letöltés">
                </button>
                <button class="content_button content_delete_button" aria-label="Törlés">
                    <img src="icons/delete.svg" alt="Törlés">
                </button>
                <h2>Fájl címe</h2>
                <p>Fájl leírása</p>
                <p>Feltöltés dátuma, tárgy neve </p>
            </div>
            <!-- Generálandó rész vége -->
        </section>
        <section id="dashboard_kerelemek">
            <h1>Dummy text 3</h1>
        </section>
        <section id="dashboard_chatszobak">
            <h1>Dummy text 4</h1>
        </section>
        <section id="dashboard_profil">
            <h1>Dummy text 5</h1>
        </section>
    </main>
    <div class="file_details_modal" style="display: none;">
        <div class="modal_content">
            <!-- Fájl részletei, később PHP-vel generálandó -->

        </div>
    </div>
</body>
</html>