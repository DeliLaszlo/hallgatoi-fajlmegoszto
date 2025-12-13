<?php
/**
 * Adatbázis konfiguráció és kapcsolatok
 * 
 * Ez a fájl tartalmazza az adatbázis beállításokat és a kapcsolatkezelő függvényeket.
 * Két típusú kapcsolatot biztosít: MySQLi és PDO.
 * 
 * @file config.php
 * @project Hallgatói Fájlmegosztó
 */

// Adatbázis kapcsolat beállítások
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'pm_db_fm_v1');

/**
 * MySQLi adatbázis kapcsolat létrehozása (singleton pattern)
 * 
 * @return mysqli A MySQLi kapcsolat objektum
 * @throws Exception Ha a kapcsolódás sikertelen
 */
function getMysqliConnection() {
    static $conn = null;
    
    if ($conn === null) {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        
        if ($conn->connect_error) {
            throw new Exception("MySQLi csatlakozás sikertelen: " . $conn->connect_error);
        }
        
        $conn->set_charset("utf8mb4");
    }
    
    return $conn;
}

/**
 * PDO adatbázis kapcsolat létrehozása (singleton pattern)
 * 
 * @return PDO A PDO kapcsolat objektum
 * @throws PDOException Ha a kapcsolódás sikertelen
 */
function getPdoConnection() {
    static $pdo = null;
    
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    }
    
    return $pdo;
}

/**
 * Rövidített alias a getPdoConnection() függvényhez
 * 
 * @return PDO A PDO kapcsolat objektum
 */
function db() {
    return getPdoConnection();
}

// Alapértelmezett kapcsolatok inicializálása
$conn = getMysqliConnection();
$pdo = getPdoConnection();
