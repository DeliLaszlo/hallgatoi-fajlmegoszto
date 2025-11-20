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
<body>
    <div id="loading-screen" class="loading-screen initial-loading">
        <div class="loading-spinner">
            <img src="icons/hourglass.svg" alt="Betöltés">
            <div class="loading-text">Oldal betöltése...</div>
        </div>
    </div>
    <header>
        <img src="icons/IVK_logo.png" alt="IVK logo" class="ivk_logo header_img" width="1920" height="586">
        <h1 id="adminh1">Admin felület</h1>
    </header>
    <section id="admin">
            <!-- ====== Áttekintés ====== -->
            <h2>Statisztika</h2>
            <div class="content_container">
                <p>Összes felhasználó: 124</p>
                <p>Aktív tárgyak: 18</p>
                <p>Feltöltött fájlok: 672</p>
             <p>Függő kérelmek: 9</p>
            </div>

            <!-- ====== Legutóbbi aktivitások ====== -->
            <h2>Legutóbbi aktivitások</h2>
            <div class="content_container">
                <p>ZH_megoldas.pdf feltöltve<br>Analízis 1 • kiss.anna • 2025.11.11. 17:52</p>
                <hr>
                <p>Új felhasználó: kovacs.bence<br>Regisztráció • 2025.11.11. 17:40</p>
                <hr>
                <p>Jogosultság módosítva<br>matek1 tárgy admin jogosultság frissítve</p>
            </div>

            <!-- ================== FÁJLOK ================== -->
            <h2>Fájlok kezelése</h2>
            <div class="content_container">
                <div class="search_container content_search_container" style="max-width:350px; margin-bottom:14px;">
                    <input type="text" id="fileSearch" placeholder="Fájl keresése...">
                    <button><img src="icons/search.svg" alt="Keresés"></button>
                </div>

                <div class="list-card admin-list" id="fileList">
                    <div class="list-row">
                        <div class="list-main">
                            <div class="list-title">ZH_megoldas.pdf</div>
                            <div class="list-subtitle">
                                Analízis 1 • feltöltő: kiss.anna • Letöltések: 42
                                <span class="badge badge-red">Jelentve</span>
                            </div>
                        </div>
                        <div class="list-actions">
                            <button class="link-btn">Megnyitás</button>
                            <button class="link-btn">Törlés</button>
                        </div>
                    </div>

                    <hr>

                    <div class="list-row">
                        <div class="list-main">
                            <div class="list-title">EA_diak.pdf</div>
                            <div class="list-subtitle">
                                Programozás alapjai • nagy.peter • Letöltések: 17
                                <span class="badge badge-green">OK</span>
                            </div>
                        </div>
                        <div class="list-actions">
                            <button class="link-btn">Megnyitás</button>
                            <button class="link-btn">Törlés</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ================== ÚJ TÁRGY LÉTREHOZÁSA ================== -->
            <h2>Új tárgy létrehozása</h2>
            <div class="content_container">
                    <p>
                        <label for="new_subject_name">Tárgy neve</label>
                        <div class="search_container content_search_container">
                            <input type="text" id="new_subject_name" name="new_subject_name" placeholder="pl. Matematika 1.">
                        </div>
                    </p>

                    <p>
                        <label for="new_subject_code">Tárgy kódja</label>
                        <div class="search_container content_search_container">
                            <input type="text" id="new_subject_code" name="new_subject_code" placeholder="pl. GKNB_MSTM001">
                        </div>
                    </p>

                    <p>
                        <label for="new_subject_desc">Leírás (opcionális)</label>
                        <div class="search_container content_search_container">
                            <textarea id="new_subject_desc"
                                    name="new_subject_desc"
                                    rows="3"
                                    placeholder="Rövid leírás a tárgyról..."
                                    style="background:transparent; border:none; width:100%; padding:10px 14px; resize:vertical;"></textarea>
                        </div>
                    </p>

                    <p>
                        <button type="button" class="large_button">
                            <span class="icon_text">Tárgy létrehozása</span>
                        </button>
                    </p>
            </div>

            <!-- ================== KÉRELMEK ================== -->
            <h2>Kérelmek</h2>
            <div class="content_container">
                <div class="search_container content_search_container" style="max-width:350px; margin-bottom:14px;">
                    <input type="text" id="requestSearch" placeholder="Kérelem keresése...">
                    <button><img src="icons/search.svg" alt="Keresés"></button>
                </div>

                <div class="list-card admin-list" id="requestList">
                    <div class="list-row">
                        <div class="list-main">
                            <div class="list-title">#91 • horvath.mate</div>
                            <div class="list-subtitle">
                                Admin jog tárgyra • Indok: Matek2 segítő tanár
                                <span class="badge badge-yellow">Függőben</span>
                            </div>
                        </div>
                        <div class="list-actions">
                            <button class="link-btn">Elfogadás</button>
                            <button class="link-btn">Elutasítás</button>
                        </div>
                    </div>

                    <hr>

                    <div class="list-row">
                        <div class="list-main">
                            <div class="list-title">#92 • szabo.lili</div>
                            <div class="list-subtitle">
                                Tárgy létrehozás • „Adatbázis rendszerek gyakorló”
                                <span class="badge badge-green">Elfogadva</span>
                            </div>
                        </div>
                        <div class="list-actions">
                            <button class="link-btn">Részletek</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    <script src="scripts.js"></script>
</body>
</html>