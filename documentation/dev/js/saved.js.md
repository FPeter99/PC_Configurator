[Főoldal](../index.md)

# saved.js

A `saved.js` fájl a mentett konfigurációk oldal (`savedConfigs.html`) JavaScript fájlja.  
Kilistázza a mentett konfigurációkat, kezeli a betöltés és a törlés gombokat, valamint a törlés megerősítő ablakát.

---

## Importok

```javascript
import { getConfigurations, deleteConfiguration } from "./js/fetch";
```

---

## Változók

### `CATEGORIES`

A kategóriák listája kulcs és megjelenített név párosával, ugyanaz, mint a [main.js](./main.js.md) fájlban.

```javascript
const CATEGORIES = [
    { key: "processors", name: "Processzor" },
    { key: "motherboards", name: "Alaplap" },
    // ... a többi kategória
];
```

A sorrend adja meg, hogy az alkatrészek milyen sorrendben jelennek meg egy konfiguráción belül.

---

### DOM elemek

| Változó | Szelektor | Szerepe |
|----|----|----|
| `container` | `#saved-configs-list` | a konfigurációk konténere |
| `deleteDialogEl` | `#delete-modal` | a törlés megerősítő `<dialog>` ablaka |
| `deleteFormEl` | `#delete-form` | az ablakban lévő űrlap |
| `deleteConfigNameEl` | `#delete-config-name` | a törlendő konfiguráció neve az ablakban |
| `cancelDeleteBtnEl` | `#cancel-delete-btn` | a „Mégse" gomb |

---

## Metódusok

### `createSavedConfigItem(savedConfiguration)`

Egy mentett konfigurációhoz elkészíti a megjelenítendő kártyát.

### Működési elv lépésről lépésre:

1. **Sablon klónozása:** A `#saved-config-template` tartalmát klónozza.
2. **Alkatrészek listázása:** A `CATEGORIES` sorrendjében minden kategóriához létrehoz egy `<li>` elemet, benne két `span` elemmel: a `.part-category` a kategória nevét (`<kategória>:`), a `.part-value` az alkatrészt (`<név> (<ár> $)`) vagy a `Nincs kiválasztva` szöveget tartalmazza, ha a kategóriához nincs alkatrész.
3. **Végösszeg számítása:** Ugyanebben a ciklusban összeadja a kiválasztott alkatrészek árát.
4. **Név és végösszeg:** A `.config-name` elem a konfiguráció nevét, a `.config-total` elem a `Végösszeg: <összeg> $` szöveget kapja.
5. **Betöltés gomb:** Kattintásra átirányít az `index.html?load=<id>` címre.
6. **Törlés gomb:** Kattintásra a megerősítő ablak `data-id` attribútumába beírja az azonosítót, megjeleníti a konfiguráció nevét, és megnyitja az ablakot (`showModal()`).

#### Paraméterek

* **`savedConfiguration`**
* Egy mentett konfiguráció objektum.
* Példa: `{ id: 1, name: "Gamer PC", parts: { processors: {...}, gpus: null, ... } }`

#### Visszatért érték

* Egy `DocumentFragment` (a klónozott sablon), amely a `.saved-config-item` elemet tartalmazza.

> Minden szöveget `textContent`-tel állít be (az alkatrészek soraiban is), így az adatokban lévő HTML nem értelmeződik.

---

### `initSavedConfigs()`

Betölti és megjeleníti az összes mentett konfigurációt.

```javascript
async function initSavedConfigs() {
    try {
        const savedConfigurations = await getConfigurations();
        if (savedConfigurations.length === 0) {
            container.innerHTML = `<p class="empty-configs">Nincsenek mentett konfigurációk.</p>`;
            return;
        }

        container.replaceChildren(
            ...savedConfigurations.map(createSavedConfigItem)
        );
    } catch (err) {
        console.error("Hiba a mentett konfigurációk betöltésekor:", err);
        container.innerHTML = `<p class="empty-configs">Hiba történt a konfigurációk betöltésekor.</p>`;
    }
}
```

### Működési elv lépésről lépésre:

1. **Konfigurációk lekérése:** A `getConfigurations()` visszaadja az összes mentést.
2. **Üres állapot:** Ha nincs mentés, a „Nincsenek mentett konfigurációk." szöveg jelenik meg.
3. **Kártyák létrehozása és megjelenítés:** A `map()` minden konfigurációhoz elkészíti a kártyát a `createSavedConfigItem()` függvénnyel, a `replaceChildren()` pedig lecseréli a konténer tartalmát (a „betöltés..." szöveget) a kártyákra.
4. **Hiba esetén:** A konzolra naplóz, és a „Hiba történt a konfigurációk betöltésekor." szöveg jelenik meg.

---

## Eseménykezelők

### Törlés megerősítése (`deleteFormEl`, `submit`)

```javascript
deleteFormEl.addEventListener("submit", async (event) => {
    event.preventDefault();
    await deleteConfiguration(deleteDialogEl.dataset.id);
    deleteDialogEl.close();
    await initSavedConfigs();
});
```

1. **Alapértelmezett küldés tiltása:** `event.preventDefault()`, nem töltődik újra az oldal.
2. **Törlés:** A `deleteConfiguration()` kitörli az ablak `data-id` attribútumában tárolt konfigurációt.
3. **Ablak bezárása:** `close()`.
4. **Lista frissítése:** `initSavedConfigs()` újra lekéri és kirajzolja a listát.

### Mégse (`cancelDeleteBtnEl`, `click`)

```javascript
cancelDeleteBtnEl.addEventListener("click", () => {
    deleteDialogEl.close();
});
```

Az ablak bezárul, a konfiguráció megmarad.

---

## Oldal inicializálása

A fájl végén az `initSavedConfigs()` függvény hívása indítja a lista betöltését, amint a modul lefut.

---

## Előfeltételek és függőségek

* A `savedConfigs.html`-ben léteznie kell a `#saved-configs-list`, `#delete-modal`, `#delete-form`, `#delete-config-name` és `#cancel-delete-btn` azonosítójú elemnek, valamint a `#saved-config-template` sablonnak.
* A [fetch.js](./fetch.js.md) `getConfigurations()` és `deleteConfiguration()` függvényei szükségesek.

---

## Ismert korlátok

* A törlés (`deleteConfiguration`) hívása körül nincs `try/catch`: hálózati hiba esetén a megerősítő ablak nyitva marad, a felhasználó nem kap visszajelzést.
* A konfiguráció összegét a mentett árakból számolja, nem a jelenlegi `db.json` árakból.
* A HTML elemek meglétét a kód feltételezi (nincsenek null-ellenőrzések), ezért egy hiányzó azonosítójú elem vagy sablon hibát okoz.
