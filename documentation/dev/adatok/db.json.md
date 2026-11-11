[Főoldal](../index.md)

# db.json és az API végpontok

A `json-server/data/db.json` fájl az alkalmazás "adatbázisa". A json-server ezt a fájlt szolgálja ki REST API-ként, a `routes.json` pedig az `/api/*` útvonalat a gyökérre irányítja át (`"/api/*": "/$1"`).

---

## Szerkezet

A fájl egyetlen JSON objektum, amelynek kulcsai a kategóriák (és egyben az API végpontok), értékei pedig tömbök.

```javascript
{
    processors: [ ... ],      // 10 db
    gpus: [ ... ],            // 10 db
    motherboards: [ ... ],    // 10 db
    ram: [ ... ],             // 10 db
    storage: [ ... ],         // 10 db
    powerSupplies: [ ... ],   // 10 db
    cases: [ ... ],           // 10 db
    cpuCoolers: [ ... ],      // 10 db
    configurations: [ ]       // a mentett konfigurációk, kezdetben üres
}
```

Minden alkatrésznek van egyedi (kategórián belüli) `id`, `name`, `brand` és `price` (dollárban, szám) mezője. A többi mező kategóriánként különbözik.

---

## Kategóriák és mezők

### `processors`

| Mező | Típus | Leírás | Példa |
|----|----|----|----|
| `socket` | szöveg | processzorfoglalat | `AM5`, `LGA1700` |
| `cores` | szám | magok száma | `6` |
| `threads` | szám | szálak száma | `12` |
| `baseClock` | szám | alap órajel (GHz) | `3.8` |
| `boostClock` | szám | boost órajel (GHz) | `5.1` |
| `tdp` | szám | hőleadás / fogyasztás (W) | `65` |

### `gpus`

| Mező | Típus | Leírás | Példa |
|----|----|----|----|
| `interface` | szöveg | csatlakozó | `PCIe x16` |
| `vram` | szám | videómemória (GB) | `8` |
| `memoryType` | szöveg | memória típusa | `GDDR6` |
| `tdp` | szám | fogyasztás (W) | `115` |

### `motherboards`

| Mező | Típus | Leírás | Példa |
|----|----|----|----|
| `cpuSocket` | szöveg | támogatott processzorfoglalat | `AM5` |
| `ramType` | szöveg | támogatott memóriatípus | `DDR5` |
| `gpuInterface` | szöveg | videokártya-csatlakozó | `PCIe x16` |
| `formFactor` | szöveg | alaplap formátuma | `ATX` |
| `storageInterfaces` | tömb | támogatott tárhely-interfészek | `["M.2 NVMe", "SATA"]` |

### `ram`

| Mező | Típus | Leírás | Példa |
|----|----|----|----|
| `ramType` | szöveg | memória típusa | `DDR5` |
| `capacity` | szám | kapacitás (GB) | `16` |
| `speed` | szám | sebesség (MHz) | `5200` |

### `storage`

| Mező | Típus | Leírás | Példa |
|----|----|----|----|
| `storageType` | szöveg | típus | `NVMe SSD`, `SATA SSD` |
| `interface` | szöveg | csatlakozó | `M.2 NVMe`, `SATA` |
| `capacity` | szám | kapacitás (GB) | `1000` |

### `powerSupplies`

| Mező | Típus | Leírás | Példa |
|----|----|----|----|
| `wattage` | szám | teljesítmény (W) | `650` |
| `efficiency` | szöveg | hatásfok-besorolás | `80+ Gold` |

### `cases`

| Mező | Típus | Leírás | Példa |
|----|----|----|----|
| `supportedFormFactor` | szöveg | támogatott alaplap-formátum | `ATX` |

### `cpuCoolers`

| Mező | Típus | Leírás | Példa |
|----|----|----|----|
| `coolerType` | szöveg | típus | `Air`, `AIO` |
| `supportedSockets` | tömb | támogatott foglalatok | `["AM5", "LGA1700"]` |

---

## Kompatibilitás és az adatmezők kapcsolata

| Szabály | Az összehasonlított mezők |
|----|----|
| Processzor és alaplap | `processors.socket` és `motherboards.cpuSocket` |
| Alaplap és memória | `motherboards.ramType` és `ram.ramType` |
| Hűtő és processzor | `cpuCoolers.supportedSockets` és `processors.socket` |
| Ház és alaplap | `cases.supportedFormFactor` és `motherboards.formFactor` |
| Tárhely és alaplap | `storage.interface` és `motherboards.storageInterfaces` |
| Tápegység | `processors.tdp` + `gpus.tdp` + 60 W és `powerSupplies.wattage` |

A `gpuInterface` mezőre jelenleg nincs szabály. Az alap adatokban minden alaplap és ház `ATX`, minden hűtő támogatja mindkét foglalatot, és minden tárhely-interfészt minden alaplap támogat, ezért a hűtő-, ház-, tárhely- és tápegység-szabályok csak módosított adatokkal tesztelhetők.

---

## `configurations`

A mentett konfigurációkat tartalmazza. Szerkezete a mentéskor jön létre:

```javascript
{
    "id": 1,
    "name": "Gamer PC",
    "parts": {
        "processors": { "id": 1, "name": "AMD Ryzen 5 7600", "price": 181, ... },
        "motherboards": { ... },
        "ram": null,
        "gpus": { ... },
        "storage": null,
        "powerSupplies": null,
        "cases": null,
        "cpuCoolers": null
    }
}
```

* **`id`**: a json-server adja automatikusan.
* **`name`**: a felhasználó által megadott név (azonos név esetén a mentés felülírja a meglévőt).
* **`parts`**: kategóriánként a kiválasztott alkatrész **teljes másolata**, vagy `null`.

---

## API végpontok

Az alap cím: `http://localhost:8888/api`

| Metódus | Végpont | Leírás |
|----|----|----|
| `GET` | `/api/<kategória>` | egy kategória összes alkatrésze |
| `GET` | `/api/<kategória>/<id>` | egy alkatrész (nem létező `id` esetén `404`) |
| `GET` | `/api/configurations` | az összes mentett konfiguráció |
| `GET` | `/api/configurations/<id>` | egy mentett konfiguráció |
| `POST` | `/api/configurations` | új konfiguráció mentése (az `id`-t a szerver adja) |
| `PUT` | `/api/configurations/<id>` | meglévő konfiguráció teljes cseréje |
| `DELETE` | `/api/configurations/<id>` | konfiguráció törlése |

A json-server további lehetőségeket is nyújt (pl. `?name_like=ryzen`, `?_sort=price`), az alkalmazás ezeket jelenleg nem használja, a keresést és rendezést a kliens végzi.

---

## Szerver konfigurációja

* **`json-server/config/json-server.json`**: `host: 0.0.0.0`, `port: 80`, `routes: data/routes.json`.
* **`json-server/Dockerfile`**: `node:20-alpine` alapon telepíti a `json-server@0.17` csomagot, bemásolja a konfigurációt és az adatokat, majd `--watch data/db.json` kapcsolóval indul.
* A fájlok a konténer **belsejébe másolódnak**, a konténer törlésekor a mentett konfigurációk elvesznek.

---

## Új alkatrész felvétele

1. Vegyél fel egy új objektumot a megfelelő tömbbe a `db.json`-ban, egyedi `id`-val.
2. Töltsd ki a kategória összes mezőjét a fenti táblázat szerint (különösen a kompatibilitás-ellenőrzésben használt mezőket).
3. Építsd újra a json-server image-et (`just down`, majd `just`).
