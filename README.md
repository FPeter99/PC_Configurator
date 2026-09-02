# PC Configurator – Projektterv

## 1. A projekt célja

A projekt célja egy olyan webalkalmazás létrehozása, amely lehetővé teszi a felhasználók számára, hogy saját számítógépet állítsanak össze különböző PC-alkatrészek kiválasztásával.

A felhasználó különböző kategóriákból, például processzorból, videokártyából, alaplapból, memóriából, háttértárból és tápegységből választhatja ki a számára megfelelő alkatrészeket.

## 2. A webalkalmazás működése

A webalkalmazás egy Live Serveren fog futni, és az adatbázissal együtt lesz elérhető.

Az alkatrészek adatai egy adatbázisban lesznek tárolva. A webalkalmazás a szerverrel HTTP kéréseken keresztül kommunikál, és a `fetch` segítségével éri el az adatokat.

A rendszer a következő műveleteket támogatja:

- **GET** – alkatrészek adatainak lekérése
- **PUT** – meglévő alkatrészek adatainak módosítása
- **DELETE** – alkatrészek törlése

## 3. Adatbázis

Az adatbázis szerkezete az elkészített [adatbázisterv](https://dbdiagram.io/d/PC_Configurator_db-6a97fa525450bea1becb3105) alapján kerül kialakításra.

Az adatbázisban külön kategóriákban lesznek tárolva a PC-alkatrészek, például:

- processzorok
- videokártyák
- alaplapok
- RAM-ok
- háttértárak
- tápegységek
- számítógépházak
- CPU-hűtők

Az egyes alkatrészekhez a működéshez szükséges tulajdonságok és az ár is tárolva lesz.

## 4. Kompatibilitás ellenőrzése

A program egyik fontos feladata az alkatrészek kompatibilitásának figyelése.

A rendszer ellenőrzi, hogy a kiválasztott alkatrészek használhatók-e együtt. Például megvizsgálja, hogy a kiválasztott CPU foglalata kompatibilis-e a kiválasztott alaplap foglalatával, illetve hogy a memória típusa megfelel-e az alaplapnak.

Nem kompatibilis alkatrészek kiválasztása esetén a program ezt jelzi a felhasználónak.

## 5. A weboldal

A weboldal felépítése és működése a készített [weboldalterv](url) alapján kerül kialakításra.

A felület célja, hogy egyszerűen és átláthatóan lehessen kiválasztani az egyes PC-alkatrészeket, valamint meg lehessen tekinteni az összeállított számítógép adatait és várható árát.

## 6. A projekt eredménye

A projekt végére egy működő webalkalmazás készül, amelyben a felhasználó különböző PC-alkatrészekből saját számítógépet állíthat össze, miközben a rendszer az alkatrészek kompatibilitását is ellenőrzi.