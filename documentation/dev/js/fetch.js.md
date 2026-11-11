[Főoldal](../index.md)

# fetch.js

A `fetch.js` fájl az alkalmazás API rétege.  
Minden HTTP kérés, amely a json-server felé indul, ebben a fájlban található, így a többi fájl (`main.js`, `saved.js`) nem a `fetch()` függvényt hívja közvetlenül, hanem az innen exportált függvényeket.

---

## Változók

### `BASE_URL`

Az API alapcíme.

```javascript
const BASE_URL = "http://localhost:8888/api";
```

A json-server `routes.json` fájlja az `/api/*` útvonalat a `/$1` útvonalra irányítja át, ezért például a `/api/processors` valójában a `db.json` `processors` tömbjét adja vissza.

---

### `VALID_PART_TYPES`

Az engedélyezett alkatrész-kategóriák listája.

```javascript
const VALID_PART_TYPES = [
    "processors", "gpus", "motherboards", "ram",
    "storage", "powerSupplies", "cases", "cpuCoolers"
];
```

A kategóriák kulcsai megegyeznek a `db.json` tömbjeinek nevével.

---

### `parts`

```javascript
export let parts = [];
```

Exportált, üres tömb. A jelenlegi kód nem használja.

---

## Metódusok

### `getParts(partType)`

Lekéri egy kategória összes alkatrészét.

```javascript
export async function getParts(partType) {
    if (!VALID_PART_TYPES.includes(partType)) {
        throw new Error(`Invalid part type: ${partType}`);
    }

    const response = await fetch(`${BASE_URL}/${partType}`, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (!response.ok) {
        throw new Error(`Error while fetching: ${response.status}`);
    }

    return await response.json();
}
```

### Működési elv lépésről lépésre:

1. **Kategória ellenőrzése:** Ha a `partType` nincs a `VALID_PART_TYPES` listában, a függvény hibát dob, és nem indít hálózati kérést.
2. **Kérés küldése:** `GET` kérés a `/api/<partType>` címre.
3. **Státusz ellenőrzése:** Ha a válasz nem sikeres (`response.ok` hamis), a függvény hibát dob a státuszkóddal.
4. **Eredmény visszaadása:** A válasz JSON tartalma visszaadódik.

#### Paraméterek

* **`partType`**
* A kategória kulcsa.
* Példa: `processors`, `gpus`, `cpuCoolers`

#### Visszatért érték

* `Promise`, amely egy alkatrészeket tartalmazó tömböt ad vissza.

---

### `getConfigurations()`

Lekéri az összes mentett konfigurációt.

```javascript
export async function getConfigurations()
```

* **Kérés:** `GET /api/configurations`
* **Visszatért érték:** `Promise`, egy konfigurációkat tartalmazó tömbbel (üres tömb, ha még nincs mentés).
* **Hiba esetén:** `Error: Error while fetching configurations: <státuszkód>`

---

### `getConfiguration(id)`

Lekér egy konkrét mentett konfigurációt.

```javascript
export async function getConfiguration(id)
```

* **Kérés:** `GET /api/configurations/<id>`
* **Paraméter:** `id` a konfiguráció azonosítója.
* **Visszatért érték:** `Promise`, egy konfigurációs objektummal.
* **Hiba esetén:** `Error: Error while fetching configuration: <státuszkód>` (pl. `404`, ha nincs ilyen azonosító).

---

### `postConfiguration(configData)`

Új konfigurációt hoz létre.

```javascript
export async function postConfiguration(configData) {
    const response = await fetch(`${BASE_URL}/configurations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(configData)
    });

    if (!response.ok) {
        throw new Error(`Error while saving configuration: ${response.status}`);
    }

    return await response.json();
}
```

### Működési elv lépésről lépésre:

1. **Kérés összeállítása:** `POST` kérés a `/api/configurations` címre, JSON törzzsel.
2. **Azonosító:** A json-server automatikusan `id`-t rendel az új elemhez.
3. **Státusz ellenőrzése:** Sikertelen válasz esetén hibát dob.
4. **Eredmény visszaadása:** A létrehozott konfigurációt (az `id`-val együtt) adja vissza.

#### Paraméterek

* **`configData`**
* A mentendő konfiguráció.
* Példa: `{ name: "Gamer PC", parts: { processors: {...}, gpus: null, ... } }`

---

### `putConfiguration(id, configData)`

Egy meglévő konfigurációt **teljes egészében lecserél**.

```javascript
export async function putConfiguration(id, configData)
```

* **Kérés:** `PUT /api/configurations/<id>`, JSON törzzsel
* **Paraméterek:** `id` a módosítandó konfiguráció azonosítója, `configData` az új tartalom.
* **Visszatért érték:** `Promise`, a frissített konfigurációval.
* **Hiba esetén:** `Error: Error while updating configuration: <státuszkód>`

> A `PUT` a teljes objektumot cseréli, ezért az `id` mező is a törzs része lesz a json-server által.

---

### `deleteConfiguration(id)`

Töröl egy konfigurációt.

```javascript
export async function deleteConfiguration(id)
```

* **Kérés:** `DELETE /api/configurations/<id>`
* **Paraméter:** `id` a törlendő konfiguráció azonosítója.
* **Visszatért érték:** `Promise`, a json-server válaszával (üres objektum).
* **Hiba esetén:** `Error: Error while deleting configuration: <státuszkód>`

---

## Előfeltételek és függőségek

* A json-servernek futnia kell a `BASE_URL`-ben megadott címen.
* A függvények `Promise`-t adnak vissza, ezért `await`-tel vagy `.then()`-nel kell használni őket.
* A hibákat a **hívó oldalnak** kell kezelnie (`try/catch`), a fájl csak kivételt dob.
* Az exportált függvényeket a `main.js` és a `saved.js` használja.
