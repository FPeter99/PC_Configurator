# PC Összeállító – Felhasználói dokumentáció

## Tartalomjegyzék

1. [Az alkalmazás célja](#1-az-alkalmazás-célja)
2. [A felhasználói felület áttekintése](#2-a-felhasználói-felület-áttekintése)
3. [Alkatrész-kategóriák](#3-alkatrész-kategóriák)
4. [Alkatrész kiválasztása](#4-alkatrész-kiválasztása)
5. [Keresés és rendezés](#5-keresés-és-rendezés)
6. [Konfiguráció összegzése](#6-konfiguráció-összegzése)
7. [Kompatibilitás-ellenőrzés](#7-kompatibilitás-ellenőrzés)
8. [Mobilos használat](#8-mobilos-használat)
9. [Tipikus hibák és megoldásaik](#9-tipikus-hibák-és-megoldásaik)

---

## 1. Az alkalmazás célja

A **PC Összeállító** egy böngészőben futó webalkalmazás, amelynek segítségével egyszerűen és átláthatóan lehet saját asztali számítógépet összeállítani.

Az alkalmazás lehetővé teszi, hogy:
- kategóriánként böngéssz a rendelkezésre álló alkatrészek között,
- kiválaszd a neked megfelelő komponenseket,
- valós időben ellenőrizd az alkatrészek kompatibilitását,
- egy helyen lásd a konfigurációd összesített árát.

> **Nincs szükség regisztrációra vagy bejelentkezésre.** Az alkalmazás azonnal használható.

---

## 2. A felhasználói felület áttekintése

Az alkalmazás három fő területre oszlik:

```
┌─────────────────────────────────────────────────────┐
│                     FEJLÉC                          │
│            PC Összeállító – Válassz alkatrészt      │
├──────────────┬──────────────────────┬───────────────┤
│              │  Keresés / Rendezés  │               │
│  NAVIGÁCIÓ   │  ─────────────────── │ KONFIGURÁCIÓ  │
│  (bal oldal) │  Alkatrész-kártyák   │ ÖSSZEGZÉSE    │
│              │  (középső terület)   │ (jobb oldal)  │
│              │                      │               │
└──────────────┴──────────────────────┴───────────────┘
```

| Terület | Leírás |
|---|---|
| **Navigáció** (bal sáv) | Kategória-gombok az alkatrész-típusok között váltáshoz |
| **Középső terület** | A kiválasztott kategória alkatrészeinek kártyái |
| **Konfiguráció összegzése** (jobb sáv) | Az összeállítás áttekintése és a végösszeg |

---

## 3. Alkatrész-kategóriák

Az alkalmazás az alábbi 8 alkatrész-kategóriát tartalmazza:

| Ikon (nav) | Kategória | Leírás |
|---|---|---|
| 🔲 | **Processzor** | A számítógép „agya"; AMD és Intel modellek érhetők el |
| 🖥️ | **Alaplap** | Összeköti az összes komponenst |
| 📏 | **Memória (RAM)** | Munkamemória; DDR4 és DDR5 típusok |
| 🎮 | **Videokártya** | Grafikai teljesítmény; NVIDIA és AMD modellek |
| 💾 | **Tárhely** | Adattárolás; NVMe SSD és SATA SSD megoldások |
| ⚡ | **Tápegység** | A rendszer áramellátása |
| 🗂️ | **Ház** | A számítógépház |
| 🌀 | **CPU hűtő** | A processzor hűtése; léghűtéses és AIO vízhűtéses modellek |

---

## 4. Alkatrész kiválasztása

### Lépések

1. **Válassz kategóriát** a bal oldali navigációs sávban lévő gombok egyikére kattintva.

2. **Böngéssz a kártyák között.** Minden kártyán megjelennek az adott alkatrész legfontosabb műszaki adatai és ára.

3. **Kattints egy kártyára** az alkatrész kiválasztásához. A kiválasztott kártya **zöld kerettel** jelenik meg.

4. **A kiválasztás visszavonásához** kattints újra ugyanarra a kártyára – a kártya visszaáll alapállapotba.

> ℹ️ Kategóriánként egyszerre csak **egy alkatrész** választható ki.

### Az alkatrész-kártyákon megjelenő adatok

#### Processzor
| Adat | Leírás |
|---|---|
| Gyártó | AMD vagy Intel |
| Foglalat | pl. AM5, LGA1700 |
| Magok | fizikai magok száma |
| Szálak | logikai szálak száma |
| Alap órajel | alapfrekvencia (GHz) |
| Boost órajel | maximális frekvencia (GHz) |
| TDP | hőleadás/fogyasztás (W) |

#### Alaplap
| Adat | Leírás |
|---|---|
| Gyártó | pl. MSI, Gigabyte, ASUS |
| CPU foglalat | kompatibilis processzor-foglalat |
| RAM típusa | DDR4 vagy DDR5 |
| Formátum | pl. ATX |

#### Memória (RAM)
| Adat | Leírás |
|---|---|
| Gyártó | pl. Kingston, Corsair, G.Skill |
| RAM típusa | DDR4 vagy DDR5 |
| Kapacitás | GB-ban |
| Sebesség | MHz-ben |

#### Videokártya
| Adat | Leírás |
|---|---|
| Gyártó | NVIDIA vagy AMD |
| Interfész | pl. PCIe x16 |
| VRAM | videomemória (GB) |
| Memória típusa | pl. GDDR6, GDDR6X |
| TDP | fogyasztás (W) |

#### Tárhely
| Adat | Leírás |
|---|---|
| Gyártó | pl. Samsung, WD, Kingston |
| Típus | NVMe SSD vagy SATA SSD |
| Interfész | M.2 NVMe vagy SATA |
| Kapacitás | GB-ban |

#### Tápegység
| Adat | Leírás |
|---|---|
| Gyártó | pl. Corsair, be quiet!, MSI |
| Teljesítmény | W-ban |
| Hatásfok | pl. 80+ Gold |

#### Ház
| Adat | Leírás |
|---|---|
| Gyártó | pl. NZXT, Corsair, Fractal Design |
| Támogatott formátum | pl. ATX |

#### CPU hűtő
| Adat | Leírás |
|---|---|
| Gyártó | pl. DeepCool, Noctua, Arctic |
| Támogatott foglalat | kompatibilis CPU-foglalatók listája |

---

## 5. Keresés és rendezés

A középső terület tetején található a **keresési és rendezési eszköztár**.

### Keresés

1. Kattints a **„Keresés"** szövegmezőre.
2. Kezdd el beírni a keresett alkatrész nevét (pl. `Ryzen`, `RTX`, `Samsung`).
3. A lista **automatikusan szűri** az alkatrészeket gépelés közben.
4. A keresés **törlése:** töröld a beírt szöveget, és az összes alkatrész újra megjelenik.

> 💡 A keresés **nem érzékeny a kis- és nagybetűkre.**

### Rendezés

A „Keresés" mező mellett lévő **legördülő listából** kiválaszthatod a rendezési szempontot:

| Opció | Leírás |
|---|---|
| **Rendezés** *(alapértelmezett)* | Eredeti sorrend |
| **Ár: alacsony → magas** | A legolcsóbb alkatrészek kerülnek előre |
| **Ár: magas → alacsony** | A legdrágább alkatrészek kerülnek előre |

> ℹ️ A keresés és a rendezés **kombinálható**: egyszerre is alkalmazhatod mindkettőt.

---

## 6. Konfiguráció összegzése

A jobb oldali panelen (asztali nézetben) vagy a felnyíló összegző sávban (mobilon) mindig látható az aktuális konfiguráció.

### Az összegző panel tartalma

- **Minden kategória** megjelenik egy sorban.
- Ha egy kategóriában **már választottál alkatrészt**, megjelenik:
  - az alkatrész neve,
  - az alkatrész ára.
- Ha egy kategóriában **még nem választottál**, a „*nincs kiválasztva*" felirat jelenik meg.
- A panel alján látható a **Végösszeg** – az összes kiválasztott alkatrész árának összege.

### Navigálás az összegzőből

Az összegző panelben egy adott kategória sorára kattintva **átnavigálhatsz** az adott kategória alkatrész-listájára (ha az alkatrész kompatibilitási konfliktusos, piros jelzéssel látható).

---

## 7. Kompatibilitás-ellenőrzés

Az alkalmazás **automatikusan ellenőrzi** a kiválasztott alkatrészek kompatibilitását. Ha inkompatibilis kombinációt választasz, az alkalmazás jelzi a problémát.

### Mikor vált pirosra egy alkatrész?

| Konfliktus | Leírás |
|---|---|
| **Processzor ↔ Alaplap** | A CPU foglalata (pl. AM5) nem egyezik az alaplap CPU-foglalatával (pl. LGA1700) |
| **Memória ↔ Alaplap** | A RAM típusa (pl. DDR4) nem egyezik az alaplap által támogatott RAM-típussal (pl. DDR5) |
| **CPU hűtő ↔ Processzor** | A hűtő nem támogatja a CPU foglalatát |
| **Ház ↔ Alaplap** | Az alaplap formátuma (pl. ATX) nem egyezik a ház által támogatott formátummal |
| **Tárhely ↔ Alaplap** | A tárhely csatlakozói (pl. SATA) nem találhatók az alaplapon |
| **Tápegység ↔ Fogyasztás** | A tápegység teljesítménye (W) nem elegendő a CPU és GPU együttes fogyasztásához (+60 W rendszerköltség) |

### Hogyan jelenik meg a konfliktus?

- Az érintett **navigációs gomb** piros pöttyöt kap.
- Az érintett **alkatrész-kártya** piros kerettel jelenik meg.
- Az **összegző panelben** az érintett sor piros hátterű, és megjelenik a konfliktus neve (pl. `Processzor <=> Alaplap`).

### Példa kompatibilis konfiguráció

| Kategória | Alkatrész |
|---|---|
| Processzor | AMD Ryzen 5 7600 *(AM5, 65W TDP)* |
| Alaplap | Gigabyte B650 EAGLE AX *(AM5, DDR5, ATX)* |
| Memória | Kingston FURY Beast 32GB DDR5-5200 |
| Videokártya | NVIDIA GeForce RTX 4060 8GB *(115W TDP)* |
| Tárhely | WD Black SN770 1TB *(M.2 NVMe)* |
| Tápegység | Corsair RM650e *(650W)* |
| Ház | NZXT H5 Flow *(ATX)* |
| CPU hűtő | DeepCool AK400 *(AM5 támogatással)* |

> ✅ Ez a kombináció teljesen kompatibilis: AM5 foglalatot és DDR5 RAM-ot használ, az ATX alaplap elfér az ATX házban, a hűtő támogatja az AM5-öt, és a 650W-os tápegység bőven fedezi a ~240W becsült fogyasztást.

---

## 8. Mobilos használat

Az alkalmazás **telefonon és tableten** is teljes értékűen használható.

### Navigáció mobilon

Az oldal tetején bal oldalon látható a **☰ (hamburger) gomb**. Erre kattintva nyílik meg a kategória-navigáció.

- **Megnyitás:** kattints a **☰** gombra → a navigáció kicsúszik.
- **Bezárás:** kattints a **✕** gombra, vagy válassz egy kategóriát → a navigáció automatikusan bezárul.

### Összegzés mobilon

Az oldal alján egy **„Összegzés ▲"** sáv jelenik meg, amelyre kattintva felcsúszik a konfiguráció összegző panel.

- **Megnyitás:** kattints az **„Összegzés ▲"** gombra.
- **Bezárás:** kattints az **„Összegzés ▼"** gombra.

> ℹ️ Az összegző panel megnyitásakor a navigáció automatikusan bezárul (és fordítva), hogy a tartalom átlátható maradjon.

---

## 9. Tipikus hibák és megoldásaik

| Probléma | Lehetséges ok | Megoldás |
|---|---|---|
| Az oldal nem tölt be alkatrészeket | A szerver nem elérhető | Ellenőrizd, hogy a backend szerver fut-e, majd frissítsd az oldalt |
| Piros keretű a kiválasztott alkatrész | Kompatibilitási konfliktus | Olvasd el az összegző panelben a konfliktus leírását, és cseréld le az ütköző alkatrészt |
| Üres az alkatrész-lista keresés után | Nincs találat a beírt szövegre | Töröld a keresőmezőt, és próbálj más kulcsszóval keresni |
| A navigáció nem látható mobilon | A ☰ gomb nincs megnyomva | Nyomd meg a ☰ gombot a bal felső sarokban |

---

*Ez a dokumentáció a PC Összeállító alkalmazás aktuális verziójára vonatkozik.*
