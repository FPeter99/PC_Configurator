[Főoldal](../index.md)

# main.js

A `main.js` fájl az összeállító oldal (`index.html`) fő JavaScript fájlja.  
Ez kapcsolja össze a HTML elemeket a JavaScript függvényekkel: betölti az alkatrészeket, kirajzolja a kártyákat, kezeli a kiválasztást, a keresést és a rendezést, ellenőrzi a kompatibilitást, kiszámolja a végösszeget, valamint a konfiguráció mentését és betöltését is ez a fájl végzi.

---

## Importok

```javascript
import "@assets/app.css";
import { getParts, getConfigurations, postConfiguration, putConfiguration, getConfiguration } from "./js/fetch";
```

A stíluslapot a Vite tölti be, az API hívásokat a [fetch.js](./fetch.js.md) függvényei végzik.

---

## Változók

### DOM elemek

A fájl elején a szükséges HTML elemekre mutató konstansok találhatók.

| Változó | Szelektor | Szerepe |
|----|----|----|
| `cards` | `#cards` | az alkatrészkártyák konténere |
| `searchInput` | `#search-input` | keresőmező |
| `sortSelect` | `#sort-select` | rendezés legördülő lista |
| `navButtons` | `.nav-btn` | a kategóriamenü gombjai |
| `summaryList` | `#summary-list` | az összegző panel tételeinek listája |
| `sectionTitle` | `#section-title` | az aktuális kategória neve |
| `sectionCount` | `#section-count` | a megjelenített alkatrészek száma |
| `menuToggle` | `#menu-toggle` | a mobil menü ☰ gombja |
| `catNav` | `#cat-nav` | a kategóriamenü |
| `summary` | `#summary` | az összegző panel (`aside`) |
| `summaryToggle` | `#summary-toggle` | az összegző panel nyitó gombja (mobil) |
| `barTotal` | `#bar-total` | az alsó sáv végösszege (mobil) |
| `configNameInput` | `#config-name` | a konfiguráció neve beviteli mező |
| `saveConfigBtn` | `#save-config-btn` | a mentés gomb |

---

### `CATEGORIES`

A kategóriák listája, a kulcs és a megjelenített név párosával.

```javascript
const CATEGORIES = [
    { key: "processors", name: "Processzor" },
    { key: "motherboards", name: "Alaplap" },
    { key: "ram", name: "Memória" },
    { key: "gpus", name: "Videokártya" },
    { key: "storage", name: "Tárhely" },
    { key: "powerSupplies", name: "Tápegység" },
    { key: "cases", name: "Ház" },
    { key: "cpuCoolers", name: "CPU hűtő" }
];
```

A `key` megegyezik az API végpont nevével (és a `db.json` tömbjének nevével), a `name` jelenik meg a felületen. A sorrend az összegző panel sorrendjét adja meg.

---

### `selected`

A felhasználó által kiválasztott alkatrészeket tárolja kategóriánként.

```javascript
const selected = {
    processors: null,
    motherboards: null,
    ram: null,
    gpus: null,
    storage: null,
    powerSupplies: null,
    cases: null,
    cpuCoolers: null
};
```

Egy kategóriához vagy `null` (nincs kiválasztva), vagy a teljes alkatrész objektum tartozik. Ez az alkalmazás állapota: a kompatibilitás-ellenőrzés, az összegző panel, a végösszeg és a mentés is ebből dolgozik.

---

### `currentCategory`

```javascript
let currentCategory = "processors";
```

Az éppen megjelenített kategória kulcsa. Induláskor a processzorok láthatók.

---

### `currentParts`

```javascript
let currentParts = [];
```

Az aktuális kategória lekért alkatrészei (a szűrés és rendezés előtti, eredeti lista).

---

## Metódusok

### `checkCompatibility(selectedParts)`

A kiválasztott alkatrészek kompatibilitását ellenőrzi.

```javascript
function checkCompatibility(selectedParts) {
    const conflicts = {};
    const issues = [];
    // ... szabályok ...
    return {
        isCompatible: issues.length === 0,
        conflicts,
        issues
    };
}
```

### Működési elv lépésről lépésre:

1. **Segédfüggvény:** Az `addConflict(key, msg)` egy üzenetet ad hozzá az adott kategóriához a `conflicts` objektumban.
2. **Alkatrészek kiolvasása:** A paraméterből kiveszi a `cpu`, `mb`, `ram`, `gpu`, `storage`, `psu`, `pcCase` és `cooler` értékeket.
3. **Szabályok ellenőrzése:** Minden szabály csak akkor fut le, ha mindkét érintett alkatrész ki van választva és az összehasonlított mezők léteznek.
4. **Ütközés rögzítése:** Hiba esetén mindkét érintett kategóriához bekerül az üzenet a `conflicts`-ba, az `issues` tömbbe pedig egyszer.
5. **Eredmény visszaadása:** Az `isCompatible` akkor igaz, ha az `issues` üres.

#### A szabályok

| # | Összehasonlítás | Üzenet | Érintett kategóriák |
|----|----|----|----|
| 1 | `cpu.socket` ≠ `mb.cpuSocket` | `Processzor <=> Alaplap` | processors, motherboards |
| 2 | `mb.ramType` ≠ `ram.ramType` | `Memória <=> Alaplap` | motherboards, ram |
| 3 | a `cooler.supportedSockets` nem tartalmazza a `cpu.socket` értékét | `CPU hűtő <=> Processzor` | cpuCoolers, processors |
| 4 | `mb.formFactor` ≠ `pcCase.supportedFormFactor` | `Ház <=> Alaplap` | motherboards, cases |
| 5 | a `mb.storageInterfaces` nem tartalmazza a `storage.interface` értékét | `Tárhely <=> Alaplap` | storage, motherboards |
| 6 | `cpu.tdp + gpu.tdp + 60` > `psu.wattage` | `Tápegység <=> Fogyasztás` | powerSupplies |

A tápegység-szabálynál a 60 W a többi alkatrész (alaplap, memória, tárhely, ventilátorok) becsült fogyasztása. Ha a CPU vagy a GPU nincs kiválasztva, a TDP értéke 0-nak számít. Pontosan egyenlő érték (pl. 240 W és 240 W) még elfogadott.

Néhány szabály a mezők régi (snake_case) nevét is elfogadja (`ram_type`, `form_factor`, `supported_socket`).

#### Paraméterek

* **`selectedParts`**
* A `selected` objektum.

#### Visszatért érték

```javascript
{
    isCompatible: false,
    conflicts: { processors: ["Processzor <=> Alaplap"], motherboards: ["Processzor <=> Alaplap"] },
    issues: ["Processzor <=> Alaplap"]
}
```

* **`isCompatible`**: igaz, ha nincs ütközés
* **`conflicts`**: kategóriánként az üzenetek tömbje
* **`issues`**: az ütközések egyszeri listája

---

### `updateTotal()`

Kiszámolja és megjeleníti a végösszeget.

```javascript
function updateTotal() {
    const total = Object.values(selected).reduce((sum, item) => {
        return sum + (item ? Number(item.price) || 0 : 0);
    }, 0);

    const totalAmountElement = document.querySelector("#total-amount");
    if (totalAmountElement) {
        totalAmountElement.textContent = `${total} $`;
    }
    barTotal.textContent = `${total} $`;
}
```

### Működési elv lépésről lépésre:

1. **Összeadás:** A `selected` értékein végigmegy, és összeadja a kiválasztott alkatrészek árát. A nem kiválasztott (`null`) tétel 0-nak számít.
2. **Megjelenítés az oldalpanelen:** A `#total-amount` elembe írja az összeget.
3. **Megjelenítés az alsó sávban:** Ugyanazt az összeget a `#bar-total` elembe is beírja (mobil nézethez).

#### Visszatért érték

* A függvény nem tér vissza értékkel, a két végösszeg-elemet frissíti. Az ár dollárban (`$`) jelenik meg.

---

### `renderSummary(compat)`

Újraépíti az összegző panel tételeit.

### Működési elv lépésről lépésre:

1. **Lista törlése:** A `summaryList` tartalmát üríti.
2. **Kategóriák bejárása:** A `CATEGORIES` sorrendjében minden kategóriához készít egy `.summary-item` elemet. Az elem osztálya `selected` (ha van kiválasztott alkatrész) és `conflict` (ha van ütközés).
3. **Kategórianév:** Egy `.sub` elembe kerül a kategória neve.
4. **Tartalom:** Ha nincs kiválasztott alkatrész, a „nincs kiválasztva" szöveg jelenik meg, egyébként az alkatrész neve (`.part-name`) és ára (`.part-price`).
5. **Ütközések:** Ha a kategóriához tartozik ütközés, minden üzenet egy `.conflict-text` elemben jelenik meg.
6. **DOM-ba fűzés:** Az elkészült elem bekerül a `summaryList`-be.

#### Paraméterek

* **`compat`**
* A `checkCompatibility()` visszatérési értéke.

> A szövegeket `textContent`-tel állítja be, így az adatokban lévő HTML nem értelmeződik.

---

### `updateNavStatus(compat)`

Frissíti a kategóriamenü gombjainak állapotát.

### Működési elv lépésről lépésre:

1. **Gombok bejárása:** Minden `.nav-btn` elemen végigmegy.
2. **Pont (`.dot`) frissítése:** A `selected` osztályt megkapja, ha van kiválasztott alkatrész a kategóriában, a `conflict` osztályt pedig akkor, ha a kiválasztott alkatrész ütközésben van.
3. **Aktív gomb:** Az `active` osztályt az aktuális kategória (`currentCategory`) gombja kapja.

---

### `updateCardsBorder(compat)`

Frissíti a megjelenített kártyák keretét.

### Működési elv lépésről lépésre:

1. **Kártyák bejárása:** A `#cards` konténer minden `.card` elemén végigmegy.
2. **Kijelölés ellenőrzése:** A kártya `data-part-id` értékét összeveti az aktuális kategória kiválasztott alkatrészének azonosítójával.
3. **Osztályok:** A `selected` osztály a kijelölt kártyán van, a `conflict` osztály pedig a kijelölt és ütközésben lévő kártyán.

---

### `updateUI()`

Az összes állapotfüggő megjelenítést frissíti.

```javascript
function updateUI() {
    updateTotal();
    const compat = checkCompatibility(selected);
    renderSummary(compat);
    updateNavStatus(compat);
    updateCardsBorder(compat);
}
```

### Működési elv lépésről lépésre:

1. **Végösszeg frissítése:** `updateTotal()`.
2. **Kompatibilitás ellenőrzése:** `checkCompatibility(selected)`, egyetlen alkalommal.
3. **Részek frissítése:** Az eredményt átadja a `renderSummary()`, `updateNavStatus()` és `updateCardsBorder()` függvényeknek.

Ezt a függvényt kell meghívni minden olyan esemény után, amely módosítja a `selected` objektumot.

---

### `createCard(part, partType)`

Egy alkatrészhez elkészíti a megjelenítendő kártyát.

### Működési elv lépésről lépésre:

1. **Sablon kiválasztása:** A `partType` alapján megkeresi a megfelelő `<template>` elemet az `index.html`-ben (pl. `#processor-card-template`, `#gpu-card-template`). Ha nincs ilyen, üres `div`-et ad vissza.
2. **Klónozás:** A sablon tartalmát klónozza, a kártya `data-part-id` attribútumába beírja az alkatrész azonosítóját.
3. **Közös mezők:** A `.card-title` és a `.price` elembe beírja a nevet és az árat (`<ár> $`).
4. **Kategóriafüggő mezők:** A kategóriától függően kitölti a sablon mezőit mértékegységgel:

| Kategória | Kitöltött mezők |
|----|----|
| `processors` | brand, socket, cores, threads, base-clock (GHz), boost-clock (GHz), tdp (W) |
| `gpus` | brand, interface, vram (GB), memory-type, tdp (W) |
| `motherboards` | brand, cpu-socket, ram-type, form-factor |
| `ram` | brand, ram-type, capacity (GB), speed (MHz) |
| `storage` | brand, storage-type, interface, capacity (GB) |
| `powerSupplies` | brand, wattage (W), efficiency |
| `cases` | brand, supported-form-factor |
| `cpuCoolers` | brand, supported-sockets (vesszővel elválasztva) |

5. **Kijelölés állapota:** Ha az alkatrész már ki van választva, a kártya megkapja a `selected` (és szükség esetén a `conflict`) osztályt.
6. **Kattintás kezelése:** A kártya `click` eseménykezelője kijelöli az alkatrészt, vagy ha az már ki volt választva, visszavonja a kijelölést (`selected[partType] = null`), majd meghívja az `updateUI()` függvényt.

#### Paraméterek

* **`part`**
* Az alkatrész objektum a `db.json`-ból.

* **`partType`**
* A kategória kulcsa.
* Példa: `processors`, `gpus`

#### Visszatért érték

* Egy `DocumentFragment`, amely a kártyát tartalmazza.

---

### `displayCards(parts, partType)`

Kirajzolja a kártyákat.

### Működési elv lépésről lépésre:

1. **Cím frissítése:** A `#section-title` a kategória nevét kapja.
2. **Számláló frissítése:** A `#section-count` megjeleníti a darabszámot, pl. `(10 alkatrész)`.
3. **Kártyák cseréje:** A `cards.replaceChildren(...)` lecseréli a konténer korábbi tartalmát az új kártyákra.

---

### `sortParts(parts, sortBy)`

A listát ár szerint rendezi.

```javascript
function sortParts(parts, sortBy) {
    const sorted = [...parts];

    if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);

    return sorted;
}
```

#### Paraméterek

* **`parts`**: az alkatrészek tömbje
* **`sortBy`**: `price-asc` (növekvő), `price-desc` (csökkenő), vagy `default` (az eredeti sorrend)

#### Visszatért érték

* Új tömb, az eredeti nem módosul.

---

### `render()`

Szűri, rendezi és kirajzolja a `currentParts` listát.

```javascript
function render() {
    const term = searchInput.value.toLowerCase();

    const filtered = currentParts.filter(part =>
        part.name.toLowerCase().includes(term)
    );

    const sorted = sortParts(filtered, sortSelect.value);

    displayCards(sorted, currentCategory);
    updateUI();
}
```

### Működési elv lépésről lépésre:

1. **Keresőkifejezés:** A keresőmező értéke kisbetűsre alakítva.
2. **Szűrés:** Csak azok az alkatrészek maradnak, amelyeknek a neve (kisbetűsen) tartalmazza a kifejezést.
3. **Rendezés:** A `sortParts()` rendezi az eredményt a kiválasztott szempont szerint.
4. **Megjelenítés:** `displayCards()` kirajzolja a kártyákat.
5. **Állapot frissítése:** `updateUI()` frissíti a kijelöléseket, az összegzőt és a menüt.

---

### `loadSavedConfigFromUrl()`

Betölt egy mentett konfigurációt, ha az URL tartalmaz `load` paramétert (`index.html?load=<id>`).

```javascript
async function loadSavedConfigFromUrl() {
    const configId = new URLSearchParams(window.location.search).get("load");
    if (!configId) return;

    const savedConfiguration = await getConfiguration(configId);

    for (const category of CATEGORIES) {
        selected[category.key] = savedConfiguration.parts?.[category.key] ?? null;
    }

    if (configNameInput) {
        configNameInput.value = savedConfiguration.name || "";
    }
}
```

### Működési elv lépésről lépésre:

1. **Paraméter kiolvasása:** Ha nincs `load` paraméter, a függvény leáll.
2. **Konfiguráció lekérése:** A `getConfiguration()` lekéri a mentett konfigurációt.
3. **Kiválasztások visszaállítása:** A `selected` minden kategóriája megkapja a mentett alkatrészt (vagy `null`-t).
4. **Név beírása:** A konfiguráció neve bekerül a névmezőbe.

---

## Eseménykezelők

### Kategóriaváltás

```javascript
navButtons.forEach(btn => {
    btn.addEventListener("click", async () => { ... });
});
```

1. A kattintott gomb lesz aktív, a többiről lekerül az `active` osztály.
2. A keresőmező kiürül, a rendezés visszaáll az alapra.
3. A `currentCategory` az új kategória kulcsa lesz (`data-part-type`).
4. A `getParts()` lekéri az új kategória alkatrészeit a `currentParts` változóba.
5. A `render()` kirajzolja a kártyákat.

### Keresés és rendezés

```javascript
searchInput.addEventListener("input", render);
sortSelect.addEventListener("change", render);
```

Gépeléskor és rendezésváltáskor a `render()` újra szűri és rendezi a listát. A `currentParts` nem módosul, így a keresés törlése után az eredeti lista visszajön.

### Mobil menü (`menuToggle`, `catNav`)

* A ☰ gomb kattintásakor a `catNav` megkapja/elveszti az `open` osztályt, a gomb szövege `✕` és `☰` között vált.
* Ha a menü nyitva van, a menüre kattintás (kategóriaválasztás) bezárja.

### Összegző panel (`summaryToggle`)

* Kattintásra a `#summary` panel `open` osztálya, valamint a `body` `panel-open` osztálya váltakozik, a gomb felirata `Összegzés ▲` és `Összegzés ▼` között vált.
* Ha a panel kinyílik, a nyitott mobil menü bezáródik.

### Konfiguráció mentése (`saveConfigBtn`)

```javascript
saveConfigBtn.addEventListener("click", async () => {
    const name = configNameInput?.value?.trim() || "Névtelen konfiguráció";
    const configData = {
        name: name,
        parts: { ...selected }
    };

    try {
        const configurations = await getConfigurations();
        const existing = configurations.find(config => config.name === name);

        if (existing) {
            await putConfiguration(existing.id, configData);
        } else {
            await postConfiguration(configData);
        }
        // névmező ürítése, "Mentve! ✓" felirat 2 másodpercig
    } catch (err) {
        console.error("Hiba a mentés során:", err);
    }
});
```

### Működési elv lépésről lépésre:

1. **Név meghatározása:** A beírt név szóközök nélkül. Üres név esetén `Névtelen konfiguráció`.
2. **Adat összeállítása:** `{ name, parts }`, ahol a `parts` a `selected` másolata (az alkatrészek teljes objektumként, nem csak azonosítóval).
3. **Azonos név keresése:** Lekéri az összes mentést, és megnézi, van-e azonos nevű (kis- és nagybetű számít).
4. **Mentés:** Ha van, `PUT` kéréssel felülírja, ha nincs, `POST` kéréssel új konfigurációt hoz létre.
5. **Visszajelzés:** A névmező kiürül, a gomb felirata 2 másodpercre `Mentve! ✓` lesz.
6. **Hiba esetén:** A hibát csak a konzolra naplózza.

---

## Oldal inicializálása

```javascript
(async function init() {
    try {
        await loadSavedConfigFromUrl();
        currentParts = await getParts("processors");
        render();
    } catch (err) {
        console.error("Hiba:", err);
    }
})();
```

### Működési elv lépésről lépésre:

1. **Mentett konfiguráció betöltése:** Ha az URL tartalmaz `load` paramétert, a konfiguráció visszaáll.
2. **Processzorok lekérése:** Az induló kategória alkatrészeinek lekérése.
3. **Megjelenítés:** `render()` kirajzolja a kártyákat és frissíti az összegzőt.
4. **Hiba esetén:** A hibát a konzolra naplózza.

---

## Előfeltételek és függőségek

* Az `index.html`-ben léteznie kell az összes fent felsorolt azonosítójú elemnek és a nyolc `<template>` elemnek.
* A json-servernek futnia kell, és a [db.json](../adatok/db.json.md) kategóriáinak neve egyeznie kell a `CATEGORIES` kulcsaival.
* A [fetch.js](./fetch.js.md) függvényeinek elérhetőnek kell lenniük.

---

## Ismert korlátok

* **Hibakezelés:** A hálózati hibák csak a konzolra kerülnek, a felhasználó nem kap róluk visszajelzést. A kategóriaváltás eseménykezelőjében nincs `try/catch`.
* **Hibás `?load=` azonosító:** Ha a megadott konfiguráció nem létezik, a `loadSavedConfigFromUrl()` hibát dob, az `init()` a `catch` ágra fut, és az alkatrészek nem töltődnek be.
* **Kompatibilitás és mentés:** Ütköző vagy üres konfiguráció is elmenthető.
* **Ház és alaplap:** A formátumok szigorú egyenlőségét vizsgálja (egy ATX ház a valóságban kisebb alaplapot is befogadna).
* **Alaplap és videokártya:** Az alaplap `gpuInterface` mezőjére nincs ellenőrzés.
* **Mentett adat:** A mentés az alkatrész teljes másolatát tárolja, ezért ha az alkatrész ára később megváltozik a `db.json`-ban, a mentett konfiguráció a régi árat használja.
* **Pénznem:** Az árak dollárban (`$`) jelennek meg.
