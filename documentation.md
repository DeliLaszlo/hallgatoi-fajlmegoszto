# Hallgatói Fájlmegosztó - Műszaki Dokumentáció

## 1. Rendszer Áttekintés

### 1.1 Bevezetés

A **Hallgatói Fájlmegosztó** egy webes alkalmazás, amely lehetővé teszi a Széchenyi István Egyetem hallgatói számára a tanulmányi anyagok megosztását, kérelmek létrehozását és valós idejű kommunikációt chatszobákon keresztül. A rendszer tárgyankénti csoportosításban működik, ahol a felhasználók felvett tantárgyaikhoz kapcsolódó tartalmakat kezelhetnek.

### 1.2 Fő Funkciók

| Funkció | Leírás |
|---------|--------|
| **Felhasználókezelés** | Regisztráció, bejelentkezés, profil szerkesztés |
| **Tárgykezelés** | Tantárgyak felvétele és kezelése |
| **Fájlmegosztás** | Fájlok feltöltése, letöltése, értékelése |
| **Kérelmezés** | Tananyag kérelmek létrehozása és teljesítése |
| **Chatszobák** | Valós idejű kommunikáció tárgyankénti chatszobákban |
| **Adminisztráció** | Felhasználók, tartalmak és jelentések kezelése |

### 1.3 Technológiai Stack

| Réteg | Technológia |
|-------|-------------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+) |
| **Backend** | PHP 8.x |
| **Adatbázis** | MariaDB 10.4+ / MySQL |
| **Webszerver** | Apache (XAMPP) |
| **Session kezelés** | PHP Session |

---

## 2. Architektúra

### 2.1 Rendszer Architektúra

A rendszer háromrétegű architektúrát követ:

**1. Kliens réteg**
- Fő oldalak: `log_reg.php`, `dashboard.php`, `subject.php`, `chatroom.php`
- Közös JavaScript: `scripts.js` (validáció, AJAX kérések, DOM manipuláció)

**2. Szerver réteg**
- API végpontok a `php/` könyvtárban (login.php, registration.php, getFiles.php, upload_file.php, send_message.php, getChatrooms.php, vote.php, stb.)
- Adatbázis kapcsolat: `config.php` (MySQLi & PDO, Singleton Pattern)
- Kommunikáció: AJAX/Fetch API

**3. Adatbázis réteg**
- Adatbázis neve: `pm_db_fm_v1`
- Fő táblák: `user`, `class`, `upload`, `request`, `chatroom`

### 2.2 Könyvtárstruktúra

```
hallgatoi-fajlmegoszto/
├── adatbazis.sql          # Adatbázis séma és kezdeti adatok
├── config.php             # Adatbázis konfiguráció
├── log_reg.php            # Bejelentkezési/regisztrációs oldal
├── dashboard.php          # Felhasználói irányítópult
├── subject.php            # Tantárgy oldal
├── chatroom.php           # Chatszoba oldal
├── admin.php              # Admin felület
├── scripts.js             # Kliens oldali JavaScript
├── styles.css             # Stíluslapok
├── files/                 # Feltöltött fájlok tárolása
├── icons/                 # SVG ikonok
└── php/                   # Backend API végpontok
    ├── login.php
    ├── registration.php
    ├── logout.php
    ├── profile_get.php
    ├── profile_update.php
    ├── getFiles.php
    ├── upload_file.php
    ├── download_file.php
    ├── delete_file.php
    ├── edit_file.php
    ├── getRequests.php
    ├── add_request.php
    ├── edit_request.php
    ├── delete_request.php
    ├── accept_request.php
    ├── getChatrooms.php
    ├── add_chatroom.php
    ├── edit_chatroom.php
    ├── delete_chatroom.php
    ├── getMessages.php
    ├── send_message.php
    ├── vote.php
    ├── submit_report.php
    ├── getReports.php
    ├── close_report.php
    ├── getUserSubjects.php
    ├── getAvailableSubjects.php
    ├── add_subject.php
    ├── delete_subject.php
    ├── getUsers.php
    ├── delete_user.php
    ├── getStatistics.php
    └── getLatestActivities.php
```

---

## 3. Adatbázis Séma

### 3.1 Adatbázis Név
`pm_db_fm_v1`

### 3.2 Kapcsolatok összefoglalása

- `user` ↔ `class`: Sok-a-sokhoz kapcsolat (`user_classes` kereszttáblán keresztül)
- `class` → `chatroom`, `upload`, `request`: Egy-a-sokhoz kapcsolatok
- `user` → `upload`, `request`, `chatroom`, `message`, `report`: Egy-a-sokhoz (feltöltő/kérelmező/létrehozó/küldő/jelentő)
- `user` → `room_access`, `user_votes`: Egy-a-sokhoz (követés/szavazat)
- `chatroom` → `message`, `room_access`: Egy-a-sokhoz
- `upload` → `user_votes`, `upload_request`: Egy-a-sokhoz
- `request` → `upload_request`: Egy-a-sokhoz

### 3.3 Táblák Részletes Leírása

#### 3.3.1 `user` - Felhasználók

| Mező | Típus | Leírás |
|------|-------|--------|
| `neptun_k` | VARCHAR(6) | **Elsődleges kulcs.** Neptun kód (6 alfanumerikus karakter) |
| `nickname` | VARCHAR(50) | Felhasználónév |
| `password` | VARCHAR(255) | Bcrypt hashelt jelszó |
| `vnev` | VARCHAR(50) | Vezetéknév |
| `knev` | VARCHAR(50) | Keresztnév |
| `email` | VARCHAR(100) | Email cím |
| `admin` | TINYINT(1) | Admin jogosultság (1 = igen, NULL = nem) |

#### 3.3.2 `class` - Tantárgyak

| Mező | Típus | Leírás |
|------|-------|--------|
| `class_code` | VARCHAR(50) | **Elsődleges kulcs.** Tárgy kód (pl. GKNB_INTM123) |
| `class_name` | VARCHAR(120) | Tárgy teljes neve |
| `semester` | INT(2) | Félév (opcionális) |

#### 3.3.3 `user_classes` - Felhasználók felvett tárgyai

| Mező | Típus | Leírás |
|------|-------|--------|
| `class_code` | VARCHAR(50) | Tárgy kód (FK → class) |
| `neptun` | VARCHAR(6) | Neptun kód (FK → user) |
| `allapot` | VARCHAR(1) | Állapot: F=felvett, T=teljesített, E=elégtelen, U=újrafelvett |

#### 3.3.4 `upload` - Feltöltött fájlok

| Mező | Típus | Leírás |
|------|-------|--------|
| `up_id` | INT(7) | **Elsődleges kulcs.** Automatikus |
| `class_code` | VARCHAR(50) | Tárgy kód (FK → class) |
| `neptun` | VARCHAR(6) | Feltöltő Neptun kódja |
| `file_name` | VARCHAR(60) | Eredeti fájlnév |
| `path_to_file` | VARCHAR(255) | Fájl elérési útja |
| `upload_title` | VARCHAR(50) | Feltöltés címe |
| `upload_date` | DATE | Feltöltés dátuma |
| `downloads` | SMALLINT(5) | Letöltések száma |
| `comment` | VARCHAR(255) | Leírás |
| `rating` | INT(11) | Összesített értékelés |

#### 3.3.5 `request` - Kérelmek

| Mező | Típus | Leírás |
|------|-------|--------|
| `request_id` | INT(11) | **Elsődleges kulcs.** Automatikus |
| `neptun_k` | VARCHAR(6) | Kérelmező Neptun kódja |
| `class_code` | VARCHAR(50) | Tárgy kód (FK → class) |
| `request_name` | VARCHAR(50) | Kérelem címe |
| `request_date` | DATE | Létrehozás dátuma |
| `description` | VARCHAR(255) | Részletes leírás |

#### 3.3.6 `upload_request` - Kérelem-feltöltés kapcsolat

| Mező | Típus | Leírás |
|------|-------|--------|
| `request_id` | INT(5) | Kérelem azonosító (FK → request) |
| `upload_id` | INT(7) | Feltöltés azonosító (FK → upload) |
| `status` | VARCHAR(1) | Állapot: F=függőben, T=teljesített, U=újraküldött |

#### 3.3.7 `chatroom` - Chatszobák

| Mező | Típus | Leírás |
|------|-------|--------|
| `room_id` | INT(11) | **Elsődleges kulcs.** Automatikus |
| `class_code` | VARCHAR(50) | Tárgy kód (FK → class) |
| `creater_neptun` | VARCHAR(6) | Létrehozó Neptun kódja (NULL = rendszer chatszoba) |
| `title` | VARCHAR(75) | Chatszoba neve |
| `description` | TEXT | Leírás |
| `create_date` | DATETIME | Létrehozás időpontja |

#### 3.3.8 `room_access` - Chatszoba hozzáférés

| Mező | Típus | Leírás |
|------|-------|--------|
| `neptun` | VARCHAR(6) | Felhasználó Neptun kódja |
| `room_id` | INT(5) | Chatszoba azonosító |
| `active` | TINYINT(1) | Aktív követés (1 = igen) |

#### 3.3.9 `message` - Üzenetek

| Mező | Típus | Leírás |
|------|-------|--------|
| `msg_id` | BIGINT(20) | **Elsődleges kulcs** |
| `sender_neptun` | VARCHAR(6) | Küldő Neptun kódja |
| `room_id` | INT(5) | Chatszoba azonosító |
| `text` | VARCHAR(255) | Üzenet szövege |
| `send_time` | DATETIME | Küldés időpontja |

#### 3.3.10 `user_votes` - Szavazatok

| Mező | Típus | Leírás |
|------|-------|--------|
| `neptun_k` | VARCHAR(6) | Szavazó Neptun kódja |
| `upload_id` | INT(11) | Feltöltés azonosító |
| `value` | TINYINT(4) | Szavazat értéke (+1 vagy -1) |

#### 3.3.11 `report` - Jelentések

| Mező | Típus | Leírás |
|------|-------|--------|
| `report_id` | INT(5) | **Elsődleges kulcs** |
| `report_neptun` | VARCHAR(6) | Jelentő Neptun kódja |
| `reported_type` | VARCHAR(10) | Típus (Feltöltés/Kérvény) |
| `reported_table` | VARCHAR(25) | Forrás tábla |
| `reported_id` | INT(5) | Jelentett elem azonosítója |
| `description` | VARCHAR(255) | Jelentés leírása |

---

## 4. API Specifikáció

### 4.1 Áttekintés

Minden API végpont a `php/` könyvtárban található. A válaszok JSON formátumúak.

**Általános válasz struktúra:**
```json
{
    "success": true|false,
    "message": "Sikeres művelet",
    "error": "Hibaüzenet",
    "field": "hibás_mező_neve",
    "data": { }
}
```

### 4.2 Autentikációs API-k

#### POST `/php/login.php`
Felhasználó bejelentkeztetése.

**Kérés:**
```json
{
    "neptun": "ABC123",
    "password": "jelszó123"
}
```

**Válasz (siker):**
```json
{
    "success": true,
    "message": "Sikeres bejelentkezés!",
    "isAdmin": false
}
```

**Válasz (hiba):**
```json
{
    "success": false,
    "field": "neptun",
    "error": "Helytelen Neptun kód vagy jelszó!"
}
```

---

#### POST `/php/registration.php`
Új felhasználó regisztrálása.

**Kérés:**
```json
{
    "neptun": "ABC123",
    "username": "felhasznalo1",
    "fullname": "Kovács János",
    "email": "kovacs.janos@example.com",
    "password": "Jelszo123",
    "confirm_password": "Jelszo123"
}
```

**Validációs szabályok:**
| Mező | Szabály |
|------|---------|
| `neptun` | 6 alfanumerikus karakter |
| `username` | 3-20 karakter, betűk, számok, aláhúzás |
| `fullname` | Vezetéknév + keresztnév (szóközzel) |
| `email` | Érvényes email formátum |
| `password` | Min. 8 karakter, 1 nagybetű, 1 szám |

---

#### GET `/php/logout.php`
Kijelentkezés és session törlése.

---

### 4.3 Profil API-k

#### GET `/php/profile_get.php`
Bejelentkezett felhasználó profil adatainak lekérése.

**Válasz:**
```json
{
    "success": true,
    "neptun": "abc123",
    "username": "felhasznalo1",
    "fullname": "Kovács János",
    "email": "kovacs@example.com"
}
```

---

#### POST `/php/profile_update.php`
Profil adatok frissítése.

**Kérés:**
```json
{
    "username": "ujfelhasznalonev",
    "fullname": "Új Név",
    "email": "uj@email.com",
    "current_password": "regiJelszo",
    "new_password": "UjJelszo123",
    "repeat_password": "UjJelszo123"
}
```

---

### 4.4 Tárgy API-k

#### GET `/php/getUserSubjects.php`
Felhasználó felvett tárgyainak listázása.

**Válasz:**
```json
{
    "success": true,
    "subjects": [
        {
            "class_code": "GKNB_INTM123",
            "class_name": "Adatbáziskezelés 1.",
            "allapot": "F"
        }
    ]
}
```

---

#### GET `/php/getAvailableSubjects.php`
Felvehető tárgyak listázása (amiket még nem vett fel a felhasználó).

**Válasz:**
```json
[
    {
        "class_code": "GKNB_INTM123",
        "class_name": "Adatbáziskezelés 1.",
        "semester": 3
    }
]
```

---

#### POST `/php/add_subject.php`
Tárgy felvétele a felhasználóhoz.

**Kérés:**
```json
{
    "class_code": "GKNB_INTM123"
}
```

---

#### POST `/php/delete_subject.php`
Tárgy törlése a felhasználó listájából.

**Kérés:**
```json
{
    "class_code": "GKNB_INTM123",
    "admin_mode": false
}
```

Az `admin_mode` értéke `true` esetén az admin felületről törli a tárgyat a rendszerből.

---

### 4.5 Fájl API-k

#### GET `/php/getFiles.php`
Fájlok listázása.

**Paraméterek:**
- `class_code` (opcionális): Tárgy szerinti szűrés
- `user_only` (opcionális): Csak saját feltöltések

---

#### POST `/php/upload_file.php`
Fájl feltöltése (multipart/form-data).

**Paraméterek:**
| Mező | Típus | Leírás |
|------|-------|--------|
| `file_title` | string | Feltöltés címe |
| `file_description` | string | Leírás |
| `class_code` | string | Tárgy kód |
| `file_upload` | file | A fájl |
| `request_id` | int | Kérelem ID (opcionális) |

**Támogatott fájltípusok:** pdf, doc, docx, txt, xls, xlsx, ppt, pptx  
**Maximális méret:** 10 MB

---

#### GET `/php/download_file.php`
Fájl letöltése.

**Paraméterek:**
- `up_id`: Feltöltés azonosító

---

#### POST `/php/delete_file.php`
Fájl törlése (csak saját fájl vagy admin).

**Kérés:**
```json
{
    "up_id": 1000001,
    "admin_mode": false
}
```

Az `admin_mode` értéke `true` esetén admin jogosultsággal törli a fájlt.

---

#### POST `/php/edit_file.php`
Fájl szerkesztése (multipart/form-data).

**Paraméterek:**
| Mező | Típus | Leírás |
|------|-------|--------|
| `up_id` | int | Feltöltés azonosító |
| `file_title` | string | Új cím |
| `file_description` | string | Új leírás |
| `replace_file` | string | "yes" ha fájlcserét is kér |
| `file_upload` | file | Új fájl (opcionális) |

---

#### GET `/php/getFileDetails.php`
Fájl részletes adatainak lekérdezése.

**Paraméterek:**
- `mode`: Lekérdezés módja (`upload` vagy `all`)
- `id`: Feltöltés azonosító (mode=upload esetén)

**Válasz:**
```json
{
    "success": true,
    "file": {
        "up_id": 1000001,
        "upload_title": "Előadás jegyzet",
        "file_name": "eloadas.pdf",
        "description": "1. előadás anyaga",
        "rating": 5,
        "uploader_neptun": "abc123",
        "uploader_nickname": "felhasznalo1",
        "class_name": "Adatbáziskezelés",
        "downloads": 42,
        "user_vote": 1
    }
}
```

---

#### GET `/php/increment_download.php`
Letöltésszámláló növelése. Saját fájl letöltése nem növeli a számlálót.

**Paraméterek:**
- `up_id`: Feltöltés azonosító

**Válasz:**
```json
{
    "success": true,
    "downloads": 43,
    "isOwn": false
}
```

---

#### POST `/php/vote.php`
Fájl értékelése.

**Kérés:**
```json
{
    "upload_id": 1000001,
    "vote": 1
}
```
A `vote` értéke: `1` (upvote) vagy `-1` (downvote)

---

### 4.6 Kérelem API-k

#### GET `/php/getRequests.php`
Kérelmek listázása.

**Paraméterek:**
- `class_code`: Tárgy szerinti szűrés
- `user_only`: Csak saját kérelmek

---

#### POST `/php/add_request.php`
Új kérelem létrehozása.

**Kérés:**
```json
{
    "class_code": "GKNB_INTM123",
    "request_title": "Adattípusok",
    "request_description": "Milyen adattípusok léteznek?"
}
```

---

#### POST `/php/accept_request.php`
Kérelem teljesítése feltöltéssel. A kérelem-feltöltés összekapcsolása.

**Kérés:**
```json
{
    "request_id": 12345
}
```

A feltöltés során automatikusan hívódik, amikor a felhasználó egy kérelemre válaszként tölt fel fájlt.

---

#### POST `/php/edit_request.php`
Kérelem szerkesztése (csak saját).

**Kérés (form-data):**
| Mező | Típus | Leírás |
|------|-------|--------|
| `request_id` | int | Kérelem azonosító |
| `request_title` | string | Új cím |
| `request_description` | string | Új leírás |

---

#### POST `/php/delete_request.php`
Kérelem törlése.

**Kérés:**
```json
{
    "request_id": 12345,
    "admin_mode": false
}
```

---

#### POST `/php/reset_request.php`
Kérelem állapot visszaállítása (függőben). Visszaállítja a teljesített kérelmet várakozó állapotba.

**Kérés:**
```json
{
    "request_id": 12345
}
```

Csak a kérelem létrehozója használhatja.

---

### 4.7 Chatszoba API-k

#### GET `/php/getChatrooms.php`
Chatszobák listázása.

**Paraméterek:**
- `class_code`: Tárgy szerinti szűrés
- `followed_only`: Csak követett szobák

---

#### POST `/php/add_chatroom.php`
Új chatszoba létrehozása.

**Kérés:**
```json
{
    "class_code": "GKNB_INTM123",
    "title": "Tanuló csoport",
    "description": "Közös tanulás"
}
```

---

#### POST `/php/follow_chatroom.php`
Chatszoba követése. Hozzáadja a szobát a felhasználó követett szobáihoz.

**Kérés:**
```json
{
    "room_id": 10001
}
```

---

#### POST `/php/unfollow_chatroom.php`
Chatszoba követés megszüntetése. Eltávolítja a szobát a felhasználó követett szobáiból.

**Kérés:**
```json
{
    "room_id": 10001
}
```

---

#### GET `/php/checkChatroom.php`
Chatszoba létezésének ellenőrzése.

**Paraméterek:**
- `room_id`: Chatszoba azonosító

**Válasz:**
```json
{
    "success": true,
    "exists": true
}
```

---

#### POST `/php/edit_chatroom.php`
Chatszoba szerkesztése (csak saját).

**Kérés (form-data):**
| Mező | Típus | Leírás |
|------|-------|--------|
| `room_id` | int | Chatszoba azonosító |
| `chatroom_title` | string | Új cím |
| `chatroom_description` | string | Új leírás |

---

#### POST `/php/delete_chatroom.php`
Chatszoba törlése az összes üzenetével együtt.

**Kérés:**
```json
{
    "room_id": 10001,
    "admin_mode": false
}
```

---

#### GET `/php/getMessages.php`
Chatszoba üzeneteinek lekérése.

**Paraméterek:**
- `room_id`: Chatszoba azonosító

**Válasz:**
```json
{
    "success": true,
    "messages": [
        {
            "msg_id": 1,
            "sender_neptun": "abc123",
            "nickname": "felhasznalo1",
            "text": "Üzenet szövege",
            "send_time": "2025-12-13 10:30:00"
        }
    ]
}
```

---

#### POST `/php/send_message.php`
Üzenet küldése chatszobába.

**Kérés:**
```json
{
    "room_id": 10001,
    "text": "Üzenet szövege"
}
```

---

### 4.8 Jelentés API-k

#### POST `/php/submit_report.php`
Tartalom jelentése.

**Kérés:**
```json
{
    "reported_type": "Feltöltés",
    "reported_table": "upload",
    "reported_id": 1000001,
    "description": "Hibás tartalom"
}
```

---

#### GET `/php/getReports.php`
Jelentések listázása (admin). Visszaadja az összes beküldött jelentést a jelentett tartalom részleteivel együtt.

**Válasz:**
```json
{
    "success": true,
    "reports": [
        {
            "report_id": 1,
            "report_neptun": "abc123",
            "reported_type": "Feltöltés",
            "reported_table": "upload",
            "reported_id": 1000001,
            "report_description": "Hibás tartalom",
            "item_name": "Előadás jegyzet",
            "item_creator_name": "Kovács János"
        }
    ]
}
```

---

#### POST `/php/close_report.php`
Jelentés lezárása (admin). Törli a jelentést, de a jelentett tartalom megmarad.

**Kérés:**
```json
{
    "report_id": 1
}
```

---

### 4.9 Admin API-k

#### GET `/php/getStatistics.php`
Statisztikák lekérése.

**Válasz:**
```json
{
    "success": true,
    "users": 124,
    "subjects": 37,
    "files": 672,
    "requests": 9,
    "chatrooms": 45
}
```

---

#### GET `/php/getUsers.php`
Összes felhasználó listázása (admin). Felhasználókezeléshez az admin felületen.

**Válasz:**
```json
[
    {
        "neptun": "ABC123",
        "nickname": "felhasznalo1",
        "full_name": "Kovács János",
        "email": "kovacs@example.com"
    }
]
```

---

#### POST `/php/delete_user.php`
Felhasználó törlése (admin). Törli a felhasználót és az összes kapcsolódó adatát (feltöltések, kérelmek, chatszobák, üzenetek, szavazatok stb.).

**Kérés:**
```json
{
    "neptun": "ABC123"
}
```

Az admin nem törölheti saját magát.

---

#### GET `/php/getLatestActivities.php`
Legutóbbi aktivitások (feltöltések, kérelmek, chatszobák). Az admin dashboard áttekintéséhez.

**Válasz:**
```json
{
    "files": [
        {
            "id": 1000001,
            "title": "Előadás jegyzet",
            "description": "1. előadás anyaga",
            "creator": "felhasznalo1",
            "create_date": "2025-01-15 10:30:00"
        }
    ],
    "requests": [...],
    "chatrooms": [...]
}
```

---

#### GET `/php/getAllSubjects.php`
Összes tárgy listázása (admin).

**Válasz:**
```json
[
    {
        "class_code": "GKNB_INTM123",
        "class_name": "Adatbáziskezelés 1.",
        "semester": 3
    }
]
```

---

#### POST `/php/admin_subject_handler.php`
Admin tárgykezelő (hozzáadás, szerkesztés, törlés).

**Kérés (form-data):**
| Mező | Típus | Leírás |
|------|-------|--------|
| `action` | string | Művelet: `add`, `edit`, `delete` |
| `subject_code` | string | Tárgy kódja |
| `subject_name` | string | Tárgy neve (add/edit) |
| `original_class_code` | string | Eredeti kód (edit) |

**Válasz:**
```json
{
    "success": true,
    "message": "Tárgy sikeresen hozzáadva!",
    "subject": {
        "class_code": "GKNB_INTM123",
        "class_name": "Adatbáziskezelés 1."
    }
}
```

---

## 5. Frontend Architektúra

### 5.1 JavaScript Struktúra

A `scripts.js` fájl moduláris felépítésű:

```javascript
// 1. Globális konstansok
const TIMING = { ... };           // Időzítések
const VALIDATION_PATTERNS = { ... }; // RegExp minták
const API = { ... };              // API végpontok

// 2. Segédfüggvények
function escapeHtml(text) { ... }
function showLoading(message) { ... }
function hideLoading() { ... }
function isPage(pageName) { ... }
function getUrlParam(paramName) { ... }

// 3. Fő inicializáció (DOMContentLoaded)
document.addEventListener('DOMContentLoaded', function() {
    // Form kezelés
    // Navigáció
    // Modal kezelés
    // Generátor függvények
});

// 4. Modulok (IIFE)
// Chatroom modul
// Admin modul
```

### 5.2 Időzítési Konstansok

```javascript
const TIMING = {
    ANIMATION_FAST: 10,      // Gyors classList váltás
    ANIMATION_SHORT: 50,     // Rövid animáció
    ANIMATION_MEDIUM: 100,   // Közepes animáció
    MODAL_CLOSE: 400,        // Modal bezárás
    LOADING_SHORT: 500,      // Rövid betöltés
    LOADING_LONG: 1250,      // Hosszú betöltés
    CHAT_POLLING: 3000       // Chat frissítés intervallum
};
```

### 5.3 Validációs Minták

```javascript
const VALIDATION_PATTERNS = {
    neptun: /^[A-Z0-9]{6}$/i,
    username: /^[a-zA-Z0-9_]{3,20}$/,
    fullname: /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ]+ [a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s]{1,49}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    password: /^(?=.*[A-Z])(?=.*\d).{8,}$/
};
```

### 5.4 Generátor Függvények

| Függvény | Leírás |
|----------|--------|
| `generateSubjects()` | Dashboard tárgyak listája |
| `generateFiles()` | Dashboard feltöltött fájlok |
| `generateRequests()` | Dashboard kérelmek |
| `generateChatrooms()` | Dashboard chatszobák |
| `generateSubjectFiles()` | Tárgy oldal fájlok |
| `generateSubjectRequests()` | Tárgy oldal kérelmek |
| `generateSubjectChatrooms()` | Tárgy oldal chatszobák |
| `generateAvailableSubjects()` | Felvehető tárgyak modal |

---

## 6. Biztonság

### 6.1 Autentikáció

- **Session alapú** autentikáció
- Session inaktivitási limit: **30 perc**
- Jelszavak **bcrypt** algoritmussal hashelve (`password_hash()`)
- Admin jogosultság session-ben tárolva

### 6.2 Session Kezelés

```php
// Inaktivitás ellenőrzése minden oldalon
$inactive_limit = 1800; // 30 perc
if (isset($_SESSION['last_activity']) && 
    (time() - $_SESSION['last_activity'] > $inactive_limit)) {
    header("Location: php/logout.php");
    exit();
}
$_SESSION['last_activity'] = time();
```

### 6.3 Input Validáció

- **Kliens oldali:** JavaScript RegExp validáció
- **Szerver oldali:** PHP validáció és szanitizálás
- **SQL injection védelem:** Prepared statements (MySQLi és PDO)
- **XSS védelem:** `htmlspecialchars()` és `escapeHtml()` használata

### 6.4 Fájl Feltöltés Biztonság

```php
$allowed_extensions = ['pdf', 'doc', 'docx', 'txt', 'xls', 'xlsx', 'ppt', 'pptx'];
$max_file_size = 10 * 1024 * 1024; // 10 MB
```

---

## 7. Session Változók

| Változó | Típus | Leírás |
|---------|-------|--------|
| `user_neptun` | string | Bejelentkezett felhasználó Neptun kódja |
| `last_activity` | int | Utolsó aktivitás időbélyege |
| `isAdmin` | bool | Admin jogosultság |

---

## 8. Oldalak és Funkcionalitás

### 8.1 log_reg.php - Bejelentkezés/Regisztráció

- Bejelentkezési form
- Regisztrációs form (váltható)
- Kliens oldali validáció
- Admin felhasználók automatikus átirányítása

### 8.2 dashboard.php - Irányítópult

**Szekciók:**
1. **Tárgyaim** - Felvett tantárgyak kártyái, tárgy felvétel
2. **Feltöltött fájljaim** - Saját feltöltések kezelése
3. **Kérelmeim** - Saját kérelmek listája
4. **Chatszobáim** - Létrehozott és követett chatszobák
5. **Profilom** - Profil adatok szerkesztése

### 8.3 subject.php - Tárgy oldal

- Tárgyhoz tartozó feltöltött fájlok
- Tárgyhoz tartozó kérelmek
- Tárgyhoz tartozó chatszobák
- Fájl feltöltés
- Kérelem létrehozás
- Chatszoba létrehozás

### 8.4 chatroom.php - Chatszoba

- Valós idejű üzenetküldés
- Üzenetek polling alapú frissítése (3 másodpercenként)
- Oldalsáv követett chatszobákkal
- Chatszoba váltás

### 8.5 admin.php - Admin felület

**Funkciók:**
- Statisztikák megjelenítése
- Legutóbbi aktivitások
- Felhasználók kezelése (törlés)
- Tárgyak kezelése (létrehozás, törlés)
- Fájlok kezelése
- Kérelmek kezelése
- Chatszobák kezelése
- Jelentések kezelése

---

## 9. Adatbázis Kapcsolat

### 9.1 Konfiguráció (config.php)

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'pm_db_fm_v1');
```

### 9.2 Kapcsolat Típusok

A rendszer két típusú adatbázis kapcsolatot támogat:

#### MySQLi (Singleton)
```php
function getMysqliConnection() {
    static $conn = null;
    if ($conn === null) {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        $conn->set_charset("utf8mb4");
    }
    return $conn;
}
```

#### PDO (Singleton)
```php
function getPdoConnection() {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]);
    }
    return $pdo;
}
```

---

## 10. Üzenet Típusok és Állapotkódok

### 10.1 Felhasználói Állapotok (user_classes.allapot)

| Kód | Jelentés |
|-----|----------|
| F | Felvett |
| T | Teljesített |
| E | Elégtelenre teljesített |
| U | Újra felvett |

### 10.2 Kérelem Állapotok (upload_request.status)

| Kód | Jelentés |
|-----|----------|
| F | Függőben |
| T | Teljesített |
| U | Újraküldött |

---

## 11. Függelék

### 11.1 Teszt Felhasználók

| Neptun |      Jelszó     |       Típus        |
|--------|-----------------|--------------------|
| asd123 | 12345678        | Normál felhasználó |
| qwe123 | qwe123KissJanos | Normál felhasználó |
| yxc123 | FelhoHyxc123    | Normál felhasználó |
| admin1 | adminFerenc123  | Adminisztrátor     |

### 11.2 Támogatott Fájltípusok

- Dokumentumok: `.pdf`, `.doc`, `.docx`, `.txt`
- Táblázatok: `.xls`, `.xlsx`
- Prezentációk: `.ppt`, `.pptx`

### 11.3 Reszponzív Töréspontok (CSS)

A `styles.css` fájl tartalmazza a reszponzív megjelenítés beállításait. Az alkalmazás mobilbarát kialakítású hamburger menüvel.

### 11.4 Sötét Mód

Az alkalmazás támogatja a sötét módot, amely a felhasználó preferenciáját localStorage-ban tárolja.

---

## 12. Verziókövetés

| Verzió | Dátum | Leírás |
|--------|-------|--------|
| 1.0.0 | 2025-12-08 | Első kiadás |

---

*Dokumentum készült: 2025. december 13.*  
*Projekt: Hallgatói Fájlmegosztó - Széchenyi István Egyetem Projektmunka 2025/26-1*
