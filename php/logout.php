<?php
/**
 * Felhasználó kijelentkezés
 * 
 * Megszünteti a felhasználó session-jét és átirányít a bejelentkezési oldalra.
 * 
 * Metódus: GET
 * Válasz: Átirányítás a log_reg.php oldalra
 */
session_start();
session_unset();
session_destroy();
header("Location: ../log_reg.php");
exit();
?>