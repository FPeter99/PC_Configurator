# Tesztelési jegyzőkönyv

## Projekt neve
PC Configurator

## Tesztelés dátuma
2026.11.11

## Tesztelő
Bencs Dániel

---

## Végrehajtott tesztek és eredmények

### UI tesztek

| ID | Megnevezés | Eredmény | Megjegyzés |
|----|----|----|----|
| UI1 | Váltás a nézetek között | Sikeres | 960px alatt az összegző panel alulra kerül és lenyitható, 640px alatt a menü ☰ gombbal nyitható |
| UI2 | Mobil menü működése | Sikeres | A menü lenyílik, a gomb ✕ jelre vált, kategóriaválasztás után a menü bezárul |
| UI3 | Alkatrészkártyák helyes generálása | Sikeres | Mind a 8 kategóriánál 10 kártya jelenik meg a saját mezőivel, árral és helyes darabszámmal |
| UI4 | Aktív kategória jelölése | Sikeres | Mindig csak az aktuális kategória gombja aktív |
| UI5 | Mentett konfigurációk oldal megjelenése | Sikeres | Üres és feltöltött állapotban is helyes, mobilon a gombok használhatók |

---

### Funkcionális tesztek

| ID | Megnevezés | Eredmény | Megjegyzés |
|----|----|----|----|
| F1 | Alkatrész kiválasztása és visszavonása | Sikeres | Kattintásra kijelölődik, újabb kattintásra megszűnik, kategóriánként csak egy alkatrész jelölhető ki |
| F2 | Keresés | Sikeres | Kis- és nagybetűre is működik, a számláló frissül, találat nélkül üres lista jelenik meg hiba nélkül |
| F3 | Rendezés ár szerint | Sikeres | Növekvő és csökkenő sorrend is helyes, kereséssel együtt is működik |
| F4 | Konfigurációár helyes kiszámítása | Sikeres | A 8 kategóriából kiválasztott alkatrészek összege (1044 $) megegyezik a kézi összeggel |
| F5 | Összegző panel megjelenése | Sikeres | Betöltés után látszik mind a 8 kategória „nincs kiválasztva" állapotban, a 0 $ végösszeg, a névmező és a mentés gomb |
| F6 | Összegző frissülése alkatrészváltás után | Sikeres | Választás, csere és visszavonás után is a jelenlegi alkatrészek látszanak, a kijelölések kategóriaváltás után megmaradnak |
| F7 | Végösszeg helyes megjelenítése | Sikeres | Az oldalpanelen és az alsó sávban mindig ugyanaz a helyes összeg jelenik meg |
| F8 | Kompatibilitás: foglalat | Sikeres | AM5 processzor és LGA1700 alaplap esetén megjelenik a jelzés, az alaplap vagy a processzor cseréje után eltűnik |
| F9 | Kompatibilitás: memória | Sikeres | DDR5 alaplap és DDR4 memória esetén megjelenik a jelzés, kompatibilis párosításnál nincs jelzés |
| F10 | Kompatibilitás: hűtő, ház, tárhely, tápegység | Sikeres | Az alap adatokkal nem váltható ki, ezért módosított alkatrészlistákkal futott. A tápegység határértéke (CPU + GPU + 60 W) még elfogadott |
| F11 | Új konfiguráció mentése | Sikeres | A gomb „Mentve! ✓" feliratot mutat, a névmező kiürül, név nélkül a „Névtelen konfiguráció" nevet kapja |
| F12 | Mentés azonos névvel | Sikeres | Nem jön létre duplikátum, a meglévő konfiguráció felülíródik |
| F13 | Mentett konfiguráció betöltése | Sikeres | A mentett alkatrészek kijelölve jelennek meg, a név a mezőben van, a végösszeg helyes |
| F14 | Mentett konfiguráció törlése | Sikeres | „Mégse" esetén megmarad, „Törlés" után eltűnik, az utolsó törlése után megjelenik az üres állapot szövege |

---

## Hibák

| ID | Leírás | Súlyosság | Állapot |
|----|----|----|----|
| - | Nem találtunk hibát | - | - |

---

## Összegzés
A tesztelés során a rendszer megfelelően működött, hibát nem találtunk. Mind a 14 funkcionális és mind az 5 UI teszteset sikeres volt. Az alkatrészek kiválasztása, a keresés, a rendezés, az árszámítás, a kompatibilitás-ellenőrzés, az összegző panel és a konfigurációk kezelése a tesztelési tervnek megfelelően működik, a felület pedig a különböző képernyőméreteken is helyesen jelenik meg.