# Hallgatói Fájlmegosztó

Webes alkalmazás a Széchenyi István Egyetem hallgatói számára tanulmányi anyagok megosztására.

**Projektmunka 2025/26-1**

## Funkciók

- 📚 Tantárgyak felvétele és kezelése
- 📁 Fájlok feltöltése és letöltése
- 📝 Tananyag kérelmek létrehozása
- 💬 Chatszobák valós idejű kommunikációhoz
- ⭐ Feltöltések értékelése
- 🛡️ Admin felület

## Technológiák

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** PHP 8.x
- **Adatbázis:** MariaDB / MySQL
- **Szerver:** Apache (XAMPP)

## Telepítés

1. [XAMPP](https://www.apachefriends.org/) telepítése
2. Apache és MySQL indítása a XAMPP Control Panelen
3. Repo klónozása: `C:\xampp\htdocs\hallgatoi-fajlmegoszto`
4. Adatbázis létrehozása:
   - `localhost/phpmyadmin` megnyitása
   - Új adatbázis: `pm_db_fm_v1`
   - `adatbazis.sql` importálása
5. Alkalmazás megnyitása: `localhost/hallgatoi-fajlmegoszto/`

## Teszt Felhasználók

| Neptun |      Jelszó     |       Típus        |
|--------|-----------------|--------------------|
| asd123 | 12345678        | Normál felhasználó |
| qwe123 | qwe123KissJanos | Normál felhasználó |
| yxc123 | FelhoHyxc123    | Normál felhasználó |
| admin1 | adminFerenc123  | Adminisztrátor     |

## Dokumentáció

Részletes műszaki dokumentáció: [DOCUMENTATION.md](DOCUMENTATION.md)
