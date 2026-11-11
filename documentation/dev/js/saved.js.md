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
| `deleteDialogEl` | `#delete-modal` | a törlés megerősítő `<dialog>` ablaka |
| `deleteFormEl` | `#delete-form` | az ablakban lévő űrlap |
| `deleteConfigNameEl` | `#delete-config-name` | a törlendő konfiguráció neve az ablakban |
| `cancelDeleteBtnEl` | `#cancel-delete-btn` | a „Mégse" gomb |

---

## Metódusok

### `createSavedConfigItem(savedConfiguration)`

Egy mentett konfigurációhoz elkészíti a megjelenítendő kártyát.

### Működési elv lépésről lépésre:

1. **Sablon klónozása:** A `#saved-config-template` tartalmát klónozza. Ha a sablon nem található, üres `div`-et ad vissza.
2. **Név beírása:** A `.config-name` elem a konfiguráció nevét kapja.
3. **Alkatrészek listázása:** A `CATEGORIES` sorrendjében minden kategóriához létrehoz egy `<li>` elemet. A tartalma `<kategória>: <név> (<ár> $)`, vagy `Nincs kiválasztva`, ha a kategóriához nincs alkatrész.
4. **Végösszeg számítása:** A kiválasztott alkatrészek árát összeadja, és a `.config-total` elembe `Végösszeg: <összeg> $` formában beírja.
5. **Betöltés gomb:** Kattintásra átirányít az `index.html?load=<id>` címre.
6. **Törlés gomb:** Kattintásra a megerősítő ablak `data-id` attribútumába beírja az azonosítót, megjeleníti a konfiguráció nevét, és megnyitja az ablakot (`showModal()`).

#### Paraméterek

* **`savedConfiguration`**
* Egy mentett konfiguráció objektum.
* Példa: `{ id: 1, name: "Gamer PC", parts: { processors: {...}, gpus: null, ... } }`

#### Visszatért érték

* Egy `.saved-config-item` elem (a klónozott sablonból).

> Az alkatrészek sorait `innerHTML`-lel írja ki, így az alkatrész nevében lévő HTML értelmeződne. A konfiguráció neve `textContent`-tel kerül ki, ezért az biztonságos.

---

### `initSavedConfigs()`

Betölti és megjeleníti az összes mentett konfigurációt.

```javascript
async function initSavedConfigs() {
    const container = document.querySelector("#saved-configs-list");
    if (!container) return;

    try {
        const savedConfigurations = await getConfigurations();
        if (!savedConfigurations || savedConfigurations.length === 0) {
            container.innerHTML = `<p class="empty-configs">Nincsenek mentett konfigurációk.</p>`;
            return;
        }

        const configCards = [];
        for (const savedConfiguration of savedConfigurations) {
            configCards.push(createSavedConfigItem(savedConfiguration));
        }
        container.replaceChildren(...configCards);
    } catch (err) {
        console.error("Hiba a mentett konfigurációk betöltésekor:", err);
        container.innerHTML = `<p class="empty-configs">Hiba történt a konfigurációk betöltésekor.</p>`;
    }
}
```

### Működési elv lépésről lépésre:

1. **Konténer keresése:** A `#saved-configs-list` elemet keresi, ha nincs, leáll.
2. **Konfigurációk lekérése:** A `getConfigurations()` visszaadja az összes mentést.
3. **Üres állapot:** Ha nincs mentés, a „Nincsenek mentett konfigurációk." szöveg jelenik meg.
4. **Kártyák létrehozása:** Minden konfigurációhoz elkészíti a kártyát a `createSavedConfigItem()` függvénnyel.
5. **Megjelenítés:** `replaceChildren()` lecseréli a konténer tartalmát (a „betöltés..." szöveget) a kártyákra.
6. **Hiba esetén:** A konzolra naplóz, és a „Hiba történt a konfigurációk betöltésekor." szöveg jelenik meg.

---

## Eseménykezelők

### Törlés megerősítése (`deleteFormEl`, `submit`)

```javascript
deleteFormEl?.addEventListener("submit", async (event) => {
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
cancelDeleteBtnEl?.addEventListener("click", () => {
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
