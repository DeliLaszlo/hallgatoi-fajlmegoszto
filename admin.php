<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="styles.css?v=1">
    <link rel="icon" type="image/x-icon" href="https://munkatars.sze.hu/core/templates/sze2018_bluerev/favicon.ico?v=2">
    <title>Admin felület</title>
</head>
<body>
    <div id="loading-screen" class="loading-screen initial-loading">
        <div class="loading-spinner">
            <img src="icons/hourglass.svg" alt="Betöltés">
            <div class="loading-text">Oldal betöltése...</div>
        </div>
    </div>
<header>
    <span class="active-section-name"></span>

    <button class="hamburger" aria-label="Menu">
        <img src="icons/hamburger_menu.svg" alt="Menu" class="hamburger-icon menu-icon">
        <img src="icons/close.svg" alt="Close" class="hamburger-icon close-icon">
    </button>

    <nav class="nav-menu">
        <h1>Admin felület</h1>
        <ul>
            <li><a href="#" id="nav_admin_overview">Áttekintés</a></li>
            <li><a href="#" id="nav_admin_users">Felhasználók</a></li>
            <li><a href="#" id="nav_admin_files">Fájlok</a></li>
            <li><a href="#" id="nav_admin_requests">Kérelmek</a></li>
            <li><a href="#" id="nav_admin_subjects">Tárgyak</a></li>
            <li><a href="#" id="nav_admin_chats">Chatszobák</a></li>
            <li>
                <button class="dark-mode-toggle" aria-label="Sötét mód váltás">
                    <img src="icons/darkmode.svg" alt="Sötét mód" class="dark-mode-icon moon-icon">
                    <img src="icons/lightmode.svg" alt="Világos mód" class="dark-mode-icon sun-icon">
                </button>
            </li>
        </ul>
        <a href="dashboard.php" class="dashboard_button">
            <img src="icons/arrowback.svg" alt="Irányítópult" class="dashboard-icon">
            <span>Irányítópult</span>
        </a>
        <a href="php/logout.php" class="logout_button">
            <img src="icons/logout.svg" alt="Kijelentkezés" class="logout-icon">
            <span>Kijelentkezés</span>
        </a>
    </nav>
</header>

<main>
    <!-- ÁTTEKINTÉS -->
    <section id="admin_overview">
        <div class="section_header">
            <h1>Rendszer adminisztráció</h1>
        </div>

        <div class="content_container">
            <h2>Statisztika</h2>
            <p>Összes felhasználó: <strong>124</strong></p>
            <p>Aktív tárgyak: <strong>18</strong></p>
            <p>Feltöltött fájlok: <strong>672</strong></p>
            <p>Függő kérelmek: <strong>9</strong></p>
        </div>

        <div class="content_container">
            <h2>Legutóbbi aktivitások</h2>
            <p><strong>ZH_megoldas.pdf feltöltve</strong><br>
               Analízis 1 • kiss.anna • 2025.11.11. 17:52</p>
            <hr>
            <p><strong>Új felhasználó:</strong> kovacs.bence<br>
               Regisztráció • 2025.11.11. 17:40</p>
            <hr>
            <p><strong>Jogosultság módosítva</strong><br>
               matek1 tárgy admin jogosultság frissítve</p>
        </div>
    </section>

    <!-- FELHASZNÁLÓK -->
    <section id="admin_users">
        <div class="section_header">
            <h1>Felhasználók</h1>
            <div class="section_header_actions">
                <div class="search_container content_search_container">
                    <input type="text" placeholder="Felhasználó keresése név / email / Neptun alapján..." aria-label="Felhasználó keresése">
                    <button aria-label="Keresés">
                        <img src="icons/search.svg" alt="Keresés">
                    </button>
                </div>
                <button class="large_button">
                    <img src="icons/add.svg" alt="Új admin">
                    <span class="icon_text">Új admin hozzáadása</span>
                </button>
            </div>
        </div>

        <div class="content_container">
            <h2>Kiss Anna</h2>
            <p>Email: anna.kiss@example.com</p>
            <p>Szerep: Admin • Státusz: Aktív</p>
        </div>

        <div class="content_container">
            <h2>Nagy Péter</h2>
            <p>Email: peter.nagy@example.com</p>
            <p>Szerep: Hallgató • Státusz: Aktív</p>
        </div>

        <div class="content_container">
            <h2>Admin Teszt</h2>
            <p>Email: admin@test.hu</p>
            <p>Szerep: Admin • Státusz: Letiltva</p>
        </div>
    </section>

    <!-- FÁJLOK -->
    <section id="admin_files">
        <div class="section_header">
            <h1>Fájlok kezelése</h1>
            <div class="section_header_actions">
                <div class="search_container content_search_container">
                    <input type="text" placeholder="Fájl, tárgy vagy feltöltő keresése..." aria-label="Fájl keresése">
                    <button aria-label="Keresés">
                        <img src="icons/search.svg" alt="Keresés">
                    </button>
                </div>
                <button class="large_button">
                    <span class="icon_text">Csak jelentett fájlok</span>
                </button>
            </div>
        </div>

        <div class="content_container">
            <h2>ZH_megoldas.pdf</h2>
            <p>Analízis 1 • feltöltő: kiss.anna • Letöltések: 42</p>
            <p>Állapot: Jelentve</p>
        </div>

        <div class="content_container">
            <h2>EA_diak.pdf</h2>
            <p>Programozás alapjai • feltöltő: nagy.peter • Letöltések: 17</p>
            <p>Állapot: OK</p>
        </div>
    </section>

    <!-- KÉRELMEK -->
    <section id="admin_requests">
        <div class="section_header">
            <h1>Kérelmek</h1>
            <div class="section_header_actions">
                <div class="search_container content_search_container">
                    <input type="text" placeholder="Kérelmek szűrése (tárgy, felhasználó, státusz)..." aria-label="Kérelmek keresése">
                    <button aria-label="Keresés">
                        <img src="icons/search.svg" alt="Keresés">
                    </button>
                </div>
                <button class="large_button">
                    <span class="icon_text">Csak függő kérelmek</span>
                </button>
            </div>
        </div>

        <div class="content_container">
            <h2>#91 • horvath.mate</h2>
            <p>Típus: Admin jog tárgyra • Indok: Matek2 segítő tanár • Státusz: Függőben</p>
        </div>

        <div class="content_container">
            <h2>#92 • szabo.lili</h2>
            <p>Típus: Tárgy létrehozás • „Adatbázis rendszerek gyakorló” • Státusz: Elfogadva</p>
        </div>
    </section>

    <!-- TÁRGYAK -->
    <section id="admin_subjects">
        <div class="section_header">
            <h1>Tárgyak</h1>
            <div class="section_header_actions">
                <div class="search_container content_search_container">
                    <input type="text" placeholder="Tárgy keresése név vagy kód alapján..." aria-label="Tárgy keresése">
                    <button aria-label="Keresés">
                        <img src="icons/search.svg" alt="Keresés">
                    </button>
                </div>
                <button class="large_button">
                    <img src="icons/add.svg" alt="Új tárgy">
                    <span class="icon_text">Új tárgy létrehozása</span>
                </button>
            </div>
        </div>

        <div class="content_container">
            <h2>Webes technológiák</h2>
            <p>Kód: INF-WEB-202 • Felelős: dr. Web János • Aktív félév: 2025/26-1</p>
        </div>

        <div class="content_container">
            <h2>Adatbázis rendszerek</h2>
            <p>Kód: INF-DB-101 • Felelős: dr. SQL Mária • Aktív félév: 2025/26-1</p>
        </div>
    </section>

    <!-- CHATSZOBÁK -->
    <section id="admin_chats">
        <div class="section_header">
            <h1>Chatszobák</h1>
            <div class="section_header_actions">
                <div class="search_container content_search_container">
                    <input type="text" placeholder="Chatszoba keresése név vagy tárgy alapján..." aria-label="Chatszoba keresése">
                    <button aria-label="Keresés">
                        <img src="icons/search.svg" alt="Keresés">
                    </button>
                </div>
                <button class="large_button">
                    <img src="icons/add.svg" alt="Új chatszoba">
                    <span class="icon_text">Új chatszoba létrehozása</span>
                </button>
            </div>
        </div>

        <!-- Ugyanúgy kártyák, mint a tárgyaknál -->
        <div class="content_container">
            <h2>MATEK1 - ZH felkészítő</h2>
            <p>Kapcsolódó tárgy: Analízis 1</p>
            <p>Résztvevők: 38 • Összes üzenet: 420</p>
        </div>

        <div class="content_container">
            <h2>Prog1 - Konzultáció</h2>
            <p>Kapcsolódó tárgy: Programozás alapjai</p>
            <p>Résztvevők: 52 • Összes üzenet: 910</p>
        </div>

        <div class="content_container">
            <h2>Adatbázis GYAK - Projektcsoportok</h2>
            <p>Kapcsolódó tárgy: Adatbázis rendszerek</p>
            <p>Résztvevők: 27 • Összes üzenet: 260</p>
        </div>
    </section>
</main>

<script type="text/javascript" src="scripts.js"></script>
</body>
</html>
