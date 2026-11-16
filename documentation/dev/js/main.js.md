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
| `totalAmount` | `#total-amount` | a végösszeg az oldalpanelben |
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

### `addConflict(conflicts, message, ...categoryKeys)`

Egy ütközés üzenetét rögzíti a megadott kategóriáknál. A `checkCompatibility()` használja.

```javascript
function addConflict(conflicts, message, ...categoryKeys) {
    for (const key of categoryKeys) {
        if (!conflicts[key]) {
            conflicts[key] = [];
        }
        conflicts[key].push(message);
    }
}
```

#### Paraméterek

* **`conflicts`**: az ütközéseket gyűjtő objektum (kategóriakulcs → üzenetek tömbje), a függvény ezt módosítja
* **`message`**: az ütközés szövege
* **`...categoryKeys`**: azok a kategóriák, amelyekhez az üzenetet hozzá kell adni (egy vagy több kulcs)

---

### `checkCompatibility(selectedParts)`

A kiválasztott alkatrészek kompatibilitását ellenőrzi.

```javascript
function checkCompatibility(selectedParts) {
    const conflicts = {};
    // ... szabályok ...
    return conflicts;
}
```

### Működési elv lépésről lépésre:

1. **Alkatrészek kiolvasása:** A paraméterből kiveszi a `cpu`, `mb`, `ram`, `gpu`, `storage`, `psu`, `pcCase` és `cooler` értékeket.
2. **Szabályok ellenőrzése:** Minden szabály csak akkor fut le, ha az érintett alkatrészek ki vannak választva. A hiányzó értékeket az opcionális láncolás (`?.`) kezeli.
3. **Ütközés rögzítése:** Hiba esetén az `addConflict()` mindkét érintett kategóriához felveszi az üzenetet a `conflicts` objektumba.
4. **Eredmény visszaadása:** A függvény a `conflicts` objektumot adja vissza.

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

A szabályok a `db.json` camelCase mezőneveit használják (`ramType`, `formFactor`, `supportedSockets`). A korábbi snake_case nevekre (`ram_type`, `form_factor`, `supported_socket`) nincs tartalék.

#### Paraméterek

* **`selectedParts`**
* A `selected` objektum.

#### Visszatért érték

```javascript
{
    processors: ["Processzor <=> Alaplap"],
    motherboards: ["Processzor <=> Alaplap"]
}
```

* Kulcs: a kategória kulcsa, érték: az ott talált ütközések üzeneteinek tömbje.
* Ha nincs ütközés, az eredmény üres objektum (`{}`). Egy kategória ütközését a `Boolean(conflicts[kulcs])` kifejezéssel lehet ellenőrizni.

---

### `updateTotal()`

Kiszámolja és megjeleníti a végösszeget.

```javascript
function updateTotal() {
    const total = Object.values(selected).reduce((sum, part) => {
        return sum + (part ? Number(part.price) || 0 : 0);
    }, 0);

    totalAmount.textContent = `${total} $`;
    barTotal.textContent = `${total} $`;
}
```

### Működési elv lépésről lépésre:

1. **Összeadás:** A `selected` értékein végigmegy, és összeadja a kiválasztott alkatrészek árát. A nem kiválasztott (`null`) tétel 0-nak számít.
2. **Megjelenítés az oldalpanelen:** A `totalAmount` (`#total-amount`) elembe írja az összeget.
3. **Megjelenítés az alsó sávban:** Ugyanazt az összeget a `barTotal` (`#bar-total`) elembe is beírja (mobil nézethez).

#### Visszatért érték

* A függvény nem tér vissza értékkel, a két végösszeg-elemet frissíti. Az ár dollárban (`$`) jelenik meg.

---

### `renderSummary(conflicts)`

Újraépíti az összegző panel tételeit.

### Működési elv lépésről lépésre:

1. **Lista törlése:** A `summaryList` tartalmát üríti.
2. **Kategóriák bejárása:** A `CATEGORIES` sorrendjében minden kategóriához készít egy `.summary-item` elemet. Ha a kategóriához tartozik ütközés, az elem megkapja a `conflict` osztályt (`classList.toggle`). A `selected` osztályt az elem nem kapja meg.
3. **Kategórianév:** Egy `.sub` elembe kerül a kategória neve.
4. **Tartalom:** Ha nincs kiválasztott alkatrész, a „nincs kiválasztva" szöveg jelenik meg, egyébként az alkatrész neve (`.part-name`) és ára (`.part-price`).
5. **Ütközések:** A kategória minden ütközési üzenete egy `.conflict-text` elemben jelenik meg.
6. **DOM-ba fűzés:** Az elkészült elem bekerül a `summaryList`-be.

#### Paraméterek

* **`conflicts`**
* A `checkCompatibility()` visszatérési értéke.

> A szövegeket `textContent`-tel állítja be, így az adatokban lévő HTML nem értelmeződik.

---

### `updateNavStatus(conflicts)`

Frissíti a kategóriamenü gombjainak állapotát.

### Működési elv lépésről lépésre:

1. **Gombok bejárása:** A `navButtons` minden elemén végigmegy.
2. **Pont (`.dot`) frissítése:** A `selected` osztályt megkapja, ha van kiválasztott alkatrész a kategóriában, a `conflict` osztályt pedig akkor, ha a kiválasztott alkatrész ütközésben van.
3. **Aktív gomb:** Az `active` osztályt az aktuális kategória (`currentCategory`) gombja kapja, a többiről lekerül. A kategóriaváltáskor a gombok aktív állapotát ez a függvény állítja be, az eseménykezelő nem.

---

### `updateCardsBorder(conflicts)`

Frissíti a megjelenített kártyák állapotát (kijelölés és ütközés).

### Működési elv lépésről lépésre:

1. **Ütközés vizsgálata:** Egyszer megnézi, van-e ütközés az aktuális kategóriában (`conflicts[currentCategory]`).
2. **Kártyák bejárása:** A `#cards` konténer minden `.card` elemén végigmegy.
3. **Kijelölés ellenőrzése:** A kártya `data-part-id` értékét összeveti az aktuális kategória kiválasztott alkatrészének azonosítójával.
4. **Osztályok:** A `selected` osztály a kijelölt kártyán van, a `conflict` osztály pedig a kijelölt és ütközésben lévő kártyán.

A kártyák állapotosztályait csak ez a függvény állítja. A `createCard()` nem állít be ilyet, a `render()` pedig az `updateUI()` hívásán keresztül ezt is lefuttatja.

---

### `updateUI()`

Az összes állapotfüggő megjelenítést frissíti.

```javascript
function updateUI() {
    const conflicts = checkCompatibility(selected);
    updateTotal();
    renderSummary(conflicts);
    updateNavStatus(conflicts);
    updateCardsBorder(conflicts);
}
```

### Működési elv lépésről lépésre:

1. **Kompatibilitás ellenőrzése:** `checkCompatibility(selected)`, egyetlen alkalommal.
2. **Végösszeg frissítése:** `updateTotal()`.
3. **Részek frissítése:** Az eredményt (`conflicts`) átadja a `renderSummary()`, `updateNavStatus()` és `updateCardsBorder()` függvényeknek.

Ezt a függvényt kell meghívni minden olyan esemény után, amely módosítja a `selected` objektumot.

---

### `createCard(part, partType)`

Egy alkatrészhez elkészíti a megjelenítendő kártyát.

### Működési elv lépésről lépésre:

1. **Sablon kiválasztása:** A sablon azonosítója a kategória kulcsából képződik: `#<partType>-card-template` (pl. `#processors-card-template`, `#cpuCoolers-card-template`). Ha a sablon nem létezik, a függvény hibát dob.
2. **Klónozás:** A sablon tartalmát klónozza, a kártya `data-part-id` attribútumába beírja az alkatrész azonosítóját.
3. **Cím:** A `.card-title` elembe beírja az alkatrész nevét.
4. **Mezők automatikus kitöltése:** Az alkatrész objektum minden mezőjén végigmegy (`Object.entries(part)`). Ha a sablonban van a mező nevével megegyező osztályú elem (pl. `socket` → `.socket`, `baseClock` → `.baseClock`), beírja az értékét. A tömb értékeket vesszővel összefűzve írja ki (pl. `supportedSockets`).
5. **Ár:** A `.price` elembe beírja az árat `<ár> $` formában.
6. **Kattintás kezelése:** A kártya `click` eseménykezelője kijelöli az alkatrészt, vagy ha az már ki volt választva, visszavonja a kijelölést (`selected[partType] = null`), majd meghívja az `updateUI()` függvényt.

A mértékegységek (GHz, W, GB, MHz) a HTML sablonban vannak, a JavaScript csak az értéket írja be. Új mező megjelenítéséhez elég a sablonba felvenni egy elemet, amelynek az osztálya a `db.json`-beli mezőnév (kis- és nagybetűre érzékenyen), a `createCard()` függvényt nem kell módosítani. A sablonok felépítését a [html.md](../html/html.md) írja le.

A kártya `selected` és `conflict` osztályát nem ez a függvény állítja, hanem az `updateCardsBorder()`.

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

Ha a `partType` nem szerepel a `CATEGORIES` listában, a függvény hibát dob.

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

    configNameInput.value = savedConfiguration.name || "";
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

1. A keresőmező kiürül, a rendezés visszaáll az alapra.
2. A `currentCategory` az új kategória kulcsa lesz (`data-part-type`).
3. A `getParts()` lekéri az új kategória alkatrészeit a `currentParts` változóba.
4. A `render()` kirajzolja a kártyákat. Az `updateUI()` hívásán keresztül az `updateNavStatus()` a kattintott gombra beállítja az `active` osztályt, a többiről leveszi.

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
const saveButtonText = saveConfigBtn.textContent;

saveConfigBtn.addEventListener("click", async () => {
    const name = configNameInput.value.trim() || "Névtelen konfiguráció";
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
    } catch (err) {
        console.error("Hiba a mentés során:", err);
        return;
    }

    configNameInput.value = "";
    saveConfigBtn.textContent = "Mentve! ✓";
    setTimeout(() => {
        saveConfigBtn.textContent = saveButtonText;
    }, 2000);
});
```

### Működési elv lépésről lépésre:

1. **Név meghatározása:** A beírt név szóközök nélkül. Üres név esetén `Névtelen konfiguráció`.
2. **Adat összeállítása:** `{ name, parts }`, ahol a `parts` a `selected` másolata (az alkatrészek teljes objektumként, nem csak azonosítóval).
3. **Azonos név keresése:** Lekéri az összes mentést, és megnézi, van-e azonos nevű (kis- és nagybetű számít).
4. **Mentés:** Ha van, `PUT` kéréssel felülírja, ha nincs, `POST` kéréssel új konfigurációt hoz létre.
5. **Hiba esetén:** A hibát a konzolra naplózza, és a függvény visszatér (`return`). Ilyenkor a névmező nem ürül, és a „Mentve!" felirat sem jelenik meg.
6. **Visszajelzés:** A névmező kiürül, a gomb felirata 2 másodpercre `Mentve! ✓` lesz, majd visszaáll az eredeti szövegre. Az eredeti feliratot a `saveButtonText` tárolja, a fájl betöltésekor elmenti.

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

* Az `index.html`-ben léteznie kell az összes fent felsorolt azonosítójú elemnek és a nyolc `<template>` elemnek (`<kategóriakulcs>-card-template` azonosítóval). A kód nem ellenőrzi az elemek meglétét, hiányzó elem esetén hibát dob.
* A sablonokban az érték elemek osztályának egyeznie kell a `db.json` mezőneveivel (camelCase).
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
* **Hiányzó elemek:** A HTML elemek meglétét a kód feltételezi (nincsenek null-ellenőrzések), ezért egy hiányzó azonosítójú elem vagy sablon hibát okoz az oldal betöltésekor.
* **Mezőnevek:** A kártyák és a kompatibilitás-ellenőrzés a `db.json` camelCase mezőneveire épül. Más nevű (pl. snake_case) mezőt nem tudnak kezelni.
