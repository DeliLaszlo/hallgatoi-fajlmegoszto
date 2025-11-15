-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Nov 15. 09:43
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `pm_db_fm_v1`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `chatroom`
--

CREATE TABLE `chatroom` (
  `room_id` int(5) NOT NULL,
  `class_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_hungarian_ci DEFAULT NULL,
  `creater_neptun` varchar(6) CHARACTER SET utf8 COLLATE utf8_hungarian_ci DEFAULT NULL,
  `title` varchar(75) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `description` text CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `create_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `chatroom`
--

INSERT INTO `chatroom` (`room_id`, `class_code`, `creater_neptun`, `title`, `description`, `create_date`) VALUES
(10001, 'GKNB_AUTM077', NULL, 'Digitális log.rendsz.és kapcsolások informatikusoknak', 'Digitális log.rendsz.és kapcsolások informatikusoknak nevű tárgy chatszobája', NULL),
(10002, 'GKNB_INTM110', NULL, 'Számítógépgép architektúrák', 'Számítógépgép architektúrák nevű tárgy chatszobája', NULL),
(10003, 'GKNB_INTM111', NULL, 'Digitális kompetenciák, önálló képzési stratégia', 'Digitális kompetenciák, önálló képzési stratégia nevű tárgy chatszobája', NULL),
(10004, 'GKNB_INTM112', NULL, 'Python alapok informatikusoknak', 'Python alapok informatikusoknak nevű tárgy chatszobája', NULL),
(10005, 'GKNB_MSTM001', NULL, 'Matematika 1.', 'Matematika 1. nevű tárgy chatszobája', NULL),
(10006, 'GKNB_MSTM064', NULL, 'Diszkrét matematika', 'Diszkrét matematika nevű tárgy chatszobája', NULL),
(10007, 'GKNB_MSTM065', NULL, 'Algoritmusok és adatstruktúrák', 'Algoritmusok és adatstruktúrák nevű tárgy chatszobája', NULL),
(10008, 'KGNB_NETM042', NULL, 'Közgazdaságtan', 'Közgazdaságtan nevű tárgy chatszobája', NULL),
(10009, 'GKNB_INTM114', NULL, 'Programozás', 'Programozás nevű tárgy chatszobája', NULL),
(10010, 'GKNB_INTM115', NULL, 'Operációs rendszerek', 'Operációs rendszerek nevű tárgy chatszobája', NULL),
(10011, 'GKNB_INTM116', NULL, 'Renszer és irányítási alapok', 'Renszer és irányítási alapok nevű tárgy chatszobája', NULL),
(10012, 'GKNB_INTM117', NULL, 'Mikroelektromechanikai rendszerek', 'Mikroelektromechanikai rendszerek nevű tárgy chatszobája', NULL),
(10013, 'GKNB_INTM118', NULL, 'Szoftvertechnológia 1.', 'Szoftvertechnológia 1. nevű tárgy chatszobája', NULL),
(10014, 'GKNB_MSTM008', NULL, 'Matematika 2.', 'Matematika 2. nevű tárgy chatszobája', NULL),
(10015, 'KGNB_MMTM048', NULL, 'Vállalatgazdaságtan', 'Vállalatgazdaságtan nevű tárgy chatszobája', NULL),
(10016, 'GKNB_INTM119', NULL, 'Oo programozás', 'Oo programozás nevű tárgy chatszobája', NULL),
(10017, 'GKNB_INTM120', NULL, 'Unix, Windows operációs rendszerek', 'Unix, Windows operációs rendszerek nevű tárgy chatszobája', NULL),
(10018, 'GKNB_INTM121', NULL, 'Számítógép hálózatok', 'Számítógép hálózatok nevű tárgy chatszobája', NULL),
(10019, 'GKNB_INTM122', NULL, 'Szoftvertechnológia 2.', 'Szoftvertechnológia 2. nevű tárgy chatszobája', NULL),
(10020, 'GKNB_INTM123', NULL, 'Adatbáziskezelés 1.', 'Adatbáziskezelés 1. nevű tárgy chatszobája', NULL),
(10021, 'GKNB_INTM167', NULL, 'Szakmai gyakorlat', 'Szakmai gyakorlat nevű tárgy chatszobája', NULL),
(10022, 'GKNB_MSTM011', NULL, 'Matematika 3.', 'Matematika 3. nevű tárgy chatszobája', NULL),
(10023, 'GKNB_FKTM045', NULL, 'Fizika informatikusoknak', 'Fizika informatikusoknak nevű tárgy chatszobája', NULL),
(10024, 'GKNB_INTM025', NULL, 'Rendszerüzemeltetés és biztonság', 'Rendszerüzemeltetés és biztonság nevű tárgy chatszobája', NULL),
(10025, 'GKNB_INTM124', NULL, 'Mesterséges intelligencia', 'Mesterséges intelligencia nevű tárgy chatszobája', NULL),
(10026, 'GKNB_INTM125', NULL, 'Adatbáziskezelés 2.', 'Adatbáziskezelés 2. nevű tárgy chatszobája', NULL),
(10027, 'GKNB_MSTM087', NULL, 'Bevezetés az adatelemzésbe', 'Bevezetés az adatelemzésbe nevű tárgy chatszobája', NULL),
(10028, 'DKNB_JTTM054', NULL, 'Modern információtechnológia jogi kérdései', 'Modern információtechnológia jogi kérdései nevű tárgy chatszobája', NULL),
(10029, 'GKNB_INTM007', NULL, 'Vállalati információs rendszerek', 'Vállalati információs rendszerek nevű tárgy chatszobája', NULL),
(10030, 'GKNB_INTM087', NULL, 'Ipar 4.0 technológiák', 'Ipar 4.0 technológiák nevű tárgy chatszobája', NULL),
(10031, 'GKNB_INTM126', NULL, 'Projektmunka', 'Projektmunka nevű tárgy chatszobája', NULL),
(10032, 'GKNB_INTM128', NULL, 'Modellezés és optimalizálás gyak.ban', 'Modellezés és optimalizálás gyak.ban nevű tárgy chatszobája', NULL),
(10033, 'GKNB_INTM096', NULL, 'Szakdolgozati konzultáció 1', 'Szakdolgozati konzultáció 1 nevű tárgy chatszobája', NULL),
(10034, 'GKNB_INTM129', NULL, 'Modern szofterfejlesztési eszközök', 'Modern szofterfejlesztési eszközök nevű tárgy chatszobája', NULL),
(10035, 'GKNB_TATM038', NULL, 'Virtualizációs technológiák', 'Virtualizációs technológiák nevű tárgy chatszobája', NULL),
(10036, 'GKNB_INTM008', NULL, 'IT-szolgáltatások', 'IT-szolgáltatások nevű tárgy chatszobája', NULL),
(10037, 'GKNB_INTM097', NULL, 'Szakdolgozati konzultáció 2', 'Szakdolgozati konzultáció 2 nevű tárgy chatszobája', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `class`
--

CREATE TABLE `class` (
  `class_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `class_name` varchar(120) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `semester` int(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `class`
--

INSERT INTO `class` (`class_code`, `class_name`, `semester`) VALUES
('DKNB_JTTM054', 'Modern információtechnológia jogi kérdései', NULL),
('GKNB_AUTM077', 'Digitális log.rendsz.és kapcsolások informatikusoknak', NULL),
('GKNB_FKTM045', 'Fizika informatikusoknak', NULL),
('GKNB_INTM007', 'Vállalati információs rendszerek', NULL),
('GKNB_INTM008', 'IT-szolgáltatások', NULL),
('GKNB_INTM025', 'Rendszerüzemeltetés és biztonság', NULL),
('GKNB_INTM087', 'Ipar 4.0 technológiák', NULL),
('GKNB_INTM096', 'Szakdolgozati konzultáció 1', NULL),
('GKNB_INTM097', 'Szakdolgozati konzultáció 2', NULL),
('GKNB_INTM110', 'Számítógépgép architektúrák', NULL),
('GKNB_INTM111', 'Digitális kompetenciák, önálló képzési stratégia', NULL),
('GKNB_INTM112', 'Python alapok informatikusoknak', NULL),
('GKNB_INTM114', 'Programozás', NULL),
('GKNB_INTM115', 'Operációs rendszerek', NULL),
('GKNB_INTM116', 'Renszer és irányítási alapok', NULL),
('GKNB_INTM117', 'Mikroelektromechanikai rendszerek', NULL),
('GKNB_INTM118', 'Szoftvertechnológia 1.', NULL),
('GKNB_INTM119', 'Oo programozás', NULL),
('GKNB_INTM120', 'Unix, Windows operációs rendszerek', NULL),
('GKNB_INTM121', 'Számítógép hálózatok', NULL),
('GKNB_INTM122', 'Szoftvertechnológia 2.', NULL),
('GKNB_INTM123', 'Adatbáziskezelés 1.', NULL),
('GKNB_INTM124', 'Mesterséges intelligencia', NULL),
('GKNB_INTM125', 'Adatbáziskezelés 2.', NULL),
('GKNB_INTM126', 'Projektmunka', NULL),
('GKNB_INTM128', 'Modellezés és optimalizálás gyak.ban', NULL),
('GKNB_INTM129', 'Modern szofterfejlesztési eszközök', NULL),
('GKNB_INTM167', 'Szakmai gyakorlat', NULL),
('GKNB_MSTM001', 'Matematika 1.', NULL),
('GKNB_MSTM008', 'Matematika 2.', NULL),
('GKNB_MSTM011', 'Matematika 3.', NULL),
('GKNB_MSTM064', 'Diszkrét matematika', NULL),
('GKNB_MSTM065', 'Algoritmusok és adatstruktúrák', NULL),
('GKNB_MSTM087', 'Bevezetés az adatelemzésbe', NULL),
('GKNB_TATM038', 'Virtualizációs technológiák', NULL),
('KGNB_MMTM048', 'Vállalatgazdaságtan', NULL),
('KGNB_NETM042', 'Közgazdaságtan', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `message`
--

CREATE TABLE `message` (
  `msg_id` bigint(20) NOT NULL,
  `sender_neptun` varchar(6) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `room_id` int(5) NOT NULL,
  `text` varchar(255) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `send_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `report`
--

CREATE TABLE `report` (
  `report_id` int(5) NOT NULL,
  `reported_neptun` varchar(6) NOT NULL,
  `reported_type` varchar(10) NOT NULL,
  `reported_table` varchar(25) NOT NULL,
  `reported_id` int(5) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `report`
--

INSERT INTO `report` (`report_id`, `reported_neptun`, `reported_type`, `reported_table`, `reported_id`, `description`) VALUES
(10001, 'asd123', 'Feltöltés', 'upload', 1000001, 'Téves elnevezés. Nem uml, hanem folyamat diagram szerepel a feltöltésben');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `request`
--

CREATE TABLE `request` (
  `request_id` int(5) NOT NULL,
  `neptun_k` varchar(6) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `class_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `request_name` varchar(50) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `description` varchar(255) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL COMMENT 'Melyik anyag/óra tartalmát kéri a felhasználó'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `request`
--

INSERT INTO `request` (`request_id`, `neptun_k`, `class_code`, `request_name`, `description`) VALUES
(10001, 'asd123', 'GKNB_INTM118', 'Uml diagram', '\"uml diagrammok elemei\"'),
(10002, 'asd123', 'GKNB_INTM115', 'Op rendszer zh anyagai', 'Az elso zh-ban szereplő anyagok');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `room_access`
--

CREATE TABLE `room_access` (
  `neptun` varchar(6) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `room_id` int(5) NOT NULL,
  `active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `room_access`
--

INSERT INTO `room_access` (`neptun`, `room_id`, `active`) VALUES
('asd123', 10013, 1),
('asd123', 10010, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `upload`
--

CREATE TABLE `upload` (
  `up_id` int(7) NOT NULL,
  `class_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci NOT NULL,
  `neptun` varchar(6) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `file_name` varchar(60) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `path_to_file` varchar(255) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `upload_title` varchar(50) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `comment` varchar(255) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `rating` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `upload`
--

INSERT INTO `upload` (`up_id`, `class_code`, `neptun`, `file_name`, `path_to_file`, `upload_title`, `comment`, `rating`) VALUES
(1000001, 'GKNB_INTM118', 'asd123', 'uml.pdf', 'Projektmunka\\xampp\\htdocs\\project\\files', 'Uml diagrammok elemei', 'Az uml diagramokban hasznáható elemek és azok szerepe', 0),
(1000002, 'GKNB_INTM115', 'asd123', 'elso_op_zh.txt', 'Projektmunka\\xampp\\htdocs\\project\\files', 'Zh kérdések és válaszok', 'Az elso zh-ban előforduló kérdések és válaszaik', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `upload_request`
--

CREATE TABLE `upload_request` (
  `request_id` int(5) NOT NULL,
  `upload_id` int(7) NOT NULL,
  `status` varchar(1) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL COMMENT 'F->függőben lévő, T->teljesített,  U->újraküldött '
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `upload_request`
--

INSERT INTO `upload_request` (`request_id`, `upload_id`, `status`) VALUES
(10001, 1000001, 'T'),
(10002, 1000002, 'F');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user`
--

CREATE TABLE `user` (
  `neptun_k` varchar(6) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `nickname` varchar(50) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `password` varchar(255) NOT NULL,
  `vnev` varchar(50) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `knev` varchar(50) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `user`
--

INSERT INTO `user` (`neptun_k`, `nickname`, `password`, `vnev`, `knev`, `email`) VALUES
('asd123', 'teszt', '$2y$10$jAbOZefHgUgUCB4F0bdQgevBtkGsbENuVliNLBrIJPBEpu3kDJi9S', 'Proba', 'Lajos', 'asd123@gmail.com');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_classes`
--

CREATE TABLE `user_classes` (
  `class_code` varchar(50) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `neptun` varchar(6) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL,
  `allapot` varchar(1) CHARACTER SET utf8 COLLATE utf8_hungarian_ci NOT NULL COMMENT 'F->felvett, T->teljesitett, E->elegtelenre teljesített, U->újra felvett'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `user_classes`
--

INSERT INTO `user_classes` (`class_code`, `neptun`, `allapot`) VALUES
('GKNB_INTM118', 'asd123', 'F'),
('GKNB_INTM115', 'asd123', 'T');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `chatroom`
--
ALTER TABLE `chatroom`
  ADD PRIMARY KEY (`room_id`);

--
-- A tábla indexei `class`
--
ALTER TABLE `class`
  ADD PRIMARY KEY (`class_code`);

--
-- A tábla indexei `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`msg_id`);

--
-- A tábla indexei `report`
--
ALTER TABLE `report`
  ADD PRIMARY KEY (`report_id`);

--
-- A tábla indexei `request`
--
ALTER TABLE `request`
  ADD PRIMARY KEY (`request_id`);

--
-- A tábla indexei `upload`
--
ALTER TABLE `upload`
  ADD PRIMARY KEY (`up_id`);

--
-- A tábla indexei `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`neptun_k`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
