# Tesztelés célja
A PC konfigurátor app felhasználói felületének megfelelő megjelenésének és működésének, valamint az alkatrész-választási, kompatibilitás-ellenőrzési és árszámítási logika helyességének biztosítása, az elvárttól eltérő eredmények kiszűrése.

---

# Tesztelt funkciók

## UI reszponzivitása
- Megfelelő váltás a mobilos, tablet és asztali nézet között
- Megfelelő alkatrészkártyák generálása kategóriánként

## Keresés és rendezés
- Alkatrészek szűrése névre
- Alkatrészek rendezése ár szerint

## Kompatibilitás-ellenőrzés
- Nem kompatibilis alkatrészek jelzése
- Jelzés megszűnése az alkatrész cseréje után

## Ár helyes kiszámítása
- Kiválasztott alkatrészek árának helyes összeadása

## Összegző panel működése
- Összegző panel megjelenítése az oldal betöltése után
- Kiválasztott alkatrészek megjelenítése az összegző panelben
- Összegző panel frissítése alkatrészváltás után
- Végösszeg kiszámítása és megjelenítése az összegző panelben

## Konfigurációk kezelése
- Konfiguráció mentése (új és azonos nevű)
- Mentett konfigurációk listázása, betöltése és törlése

---

# Tesztelési forgatókönyvek

## UI tesztek
| ID | Teszteset | Leírás | Várt eredmény |
|----|----|----|----|
| UI1 | Váltás a nézetek között | Ellenőrizzük, hogy az ablak szűkítésekor a felület a megfelelő töréspontokon vált-e (960px és 640px). | 960px alatt az összegző panel az oldal aljára kerül és lenyitható. 640px alatt a kategóriamenü ☰ gombbal nyitható menüvé alakul. |
| UI2 | Mobil menü működése | Mobil nézetben megnyomjuk a ☰ gombot, majd kiválasztunk egy kategóriát. | A menü lenyílik, a gomb ✕ jelre vált, kategóriaválasztás után a menü bezárul. |
| UI3 | Alkatrészkártyák helyes generálása | Végigkattintjuk mind a 8 kategóriát, és ellenőrizzük a megjelenő kártyákat. | Minden kategóriánál 10 kártya jelenik meg a saját mezőivel (pl. foglalat, TDP, kapacitás), mértékegységgel és árral, a címsor mellett a helyes darabszámmal. |
| UI4 | Aktív kategória jelölése | Kategóriát váltunk, és megnézzük a menüt. | Mindig csak az aktuális kategória gombja van aktív állapotban. |
| UI5 | Mentett konfigurációk oldal megjelenése | Megnyitjuk a mentett konfigurációk oldalt üres és feltöltött állapotban, asztali és mobil nézetben is. | Üres állapotban a „Nincsenek mentett konfigurációk." szöveg, egyébként minden konfiguráció külön kártyán, a gombok mobilon is használhatók. |

## Funkcionális tesztek
| ID | Teszteset | Leírás | Várt eredmény |
|----|----|----|----|
| F1 | Alkatrész kiválasztása és visszavonása | Rákattintunk egy kártyára, majd ugyanarra még egyszer. | Az első kattintásra a kártya kijelölt lesz, a második kattintásra a kijelölés megszűnik. Kategóriánként egyszerre csak egy alkatrész lehet kijelölve. |
| F2 | Keresés | A keresőmezőbe beírunk egy részletet (pl. „ryzen 9"), kis- és nagybetűvel is. | Csak a névben egyező alkatrészek jelennek meg, a számláló frissül. Találat hiányában üres lista jelenik meg hiba nélkül. |
| F3 | Rendezés ár szerint | Kiválasztjuk az „Ár: alacsony → magas", majd az „Ár: magas → alacsony" opciót, keresés mellett is. | A kártyák az árak szerint növekvő, illetve csökkenő sorrendben jelennek meg. |
| F4 | Konfigurációár helyes kiszámítása | Mind a 8 kategóriából kiválasztunk egy-egy alkatrészt, és összevetjük az árak kézi összegével. | A rendszer helyesen összeadja a kiválasztott alkatrészek árát. |
| F5 | Összegző panel megjelenése | Ellenőrizzük, hogy az oldal betöltése után az összegző panel látható-e, és tartalmazza-e a fő elemeket. | Az összegző panelben látszik mind a 8 kategória („nincs kiválasztva" állapotban), a `0 $` végösszeg, a konfigurációnév mező és a mentés gomb. |
| F6 | Összegző frissülése alkatrészváltás után | Alkatrészeket választunk, cserélünk és visszavonunk. | Az összegzőben mindig a jelenleg kiválasztott alkatrészek neve és ára látszik. A kijelölések kategóriaváltás után is megmaradnak. |
| F7 | Végösszeg helyes megjelenítése | Több alkatrész kiválasztása és cseréje után ellenőrizzük a végösszeget az oldalpanelen és az alsó sávban. | Mindkét helyen ugyanaz a helyes végösszeg jelenik meg. |
| F8 | Kompatibilitás: foglalat | Ryzen 5 7600 (AM5) processzort választunk LGA1700-as alaplappal. | Mindkét alkatrésznél „Processzor <=> Alaplap" jelzés jelenik meg, a kártya és a menüpont ütközést jelző stílust kap. Az alaplap AM5-ösre cserélése után a jelzés eltűnik. |
| F9 | Kompatibilitás: memória | DDR5-ös alaplapot választunk DDR4-es memóriával. | Mindkét alkatrésznél „Memória <=> Alaplap" jelzés jelenik meg. Kompatibilis párosításnál nincs jelzés. |
| F10 | Kompatibilitás: hűtő, ház, tárhely, tápegység | A szabályokat egységteszttel vagy módosított `db.json`-nal ellenőrizzük (az alap adatokkal nem váltható ki). | Hűtő–foglalat, ház–alaplap formátum, tárhely–alaplap interfész és tápegység–fogyasztás ütközés esetén a megfelelő jelzés megjelenik, egyébként nem. Tápegységnél a határérték (CPU TDP + GPU TDP + 60 W = a tápegység teljesítménye) még elfogadott. |
| F11 | Új konfiguráció mentése | Alkatrészeket választunk, nevet adunk, majd a mentés gombra kattintunk. | A gomb 2 másodpercig „Mentve! ✓" feliratot mutat, a névmező kiürül, a konfiguráció megjelenik a mentett oldalon. Név nélkül a „Névtelen konfiguráció" nevet kapja. |
| F12 | Mentés azonos névvel | Kétszer mentünk el konfigurációt ugyanazon a néven, eltérő alkatrészekkel. | Nem jön létre duplikátum, a meglévő konfiguráció az új tartalommal felülíródik. |
| F13 | Mentett konfiguráció betöltése | A mentett oldalon a „Betöltés" gombra kattintunk. | Az összeállító oldal megnyílik, a mentett alkatrészek kijelölve, a név a mezőben, az összegző és a végösszeg helyes. |
| F14 | Mentett konfiguráció törlése | A „Konfiguráció törlése" gomb után a megerősítő ablakban először a „Mégse", majd a „Törlés" gombot választjuk. | „Mégse" esetén a konfiguráció megmarad. „Törlés" után eltűnik a listából, az utolsó törlése után megjelenik az üres állapot szövege. |
| F15 | Hibás konfigurációazonosító | Megnyitjuk az `index.html?load=9999` címet. | Az alkalmazás nem fagy le: az alkatrészek betöltődnek, üres konfigurációval indul. *(A jelenlegi kód ezt valószínűleg nem teljesíti, lásd a megjegyzést.)* |
| F16 | Hiba az API elérésekor | Leállított szerver mellett megnyitjuk az oldalt, váltunk kategóriát, mentünk és törlünk. | Az alkalmazás nem omlik össze, a felhasználó érthető visszajelzést kap. *(A jelenlegi kód csak a konzolra naplóz.)* |

---

# Tesztkörnyezet
- Indítás: `just` (json-server a 8888-as, Vite a 8080-as porton)
- Böngészők: Chrome és Firefox (legfrissebb), mobilnézet a DevTools emulációjával (375×667)
- Adat: a `db.json` eredeti állapota, üres `configurations` tömb minden tesztkör előtt