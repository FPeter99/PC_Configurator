[Főoldal](../index.md)

# index.html és savedConfigs.html

A két HTML fájl a `webprog` mappában található. Mindkettő a `src/assets/app.css` stíluslapot használja, a JavaScript fájlt pedig modulként tölti be (`<script type="module">`).

---

## index.html (összeállító oldal)

A JavaScript fájlja: [main.js](../js/main.js.md)

### Szerkezet

```
<header>                  fejléc: ☰ menügomb, oldalnavigáció
<div class="layout">
    <nav id="cat-nav">    kategóriamenü (8 gomb)
    <main>                keresés, rendezés, kártyák
    <aside id="summary">  összegző panel
</div>
<template> × 8            alkatrészkártya-sablonok
```

### Fontos elemek

| Elem | Szerepe |
|----|----|
| `#menu-toggle` | a mobil menü ☰ gombja |
| `#cat-nav` | a kategóriamenü |
| `.nav-btn[data-part-type]` | egy kategória gombja, a `data-part-type` az API végpont neve; benne a `.dot` jelzi a kiválasztást és az ütközést |
| `#search-input` | keresőmező |
| `#sort-select` | rendezés (`default`, `price-asc`, `price-desc`) |
| `#section-title`, `#section-count` | az aktuális kategória neve és az alkatrészek száma |
| `#cards` | a kártyák konténere |
| `#summary` | az összegző panel (`aside`) |
| `#summary-bar`, `#bar-total`, `#summary-toggle` | az alsó sáv mobil nézetben: végösszeg és a panel nyitógombja |
| `#summary-list` | a kiválasztott alkatrészek listája |
| `#total-amount` | a végösszeg a panelben |
| `#config-name`, `#save-config-btn` | a mentés beviteli mezője és gombja |

### Kártyasablonok

A kártyák nem a JavaScriptben készülnek el teljesen, hanem `<template>` elemekből klónozódnak (lásd `createCard()`). Kategóriánként egy sablon van:

| Sablon azonosító | Kategória |
|----|----|
| `processor-card-template` | processors |
| `gpu-card-template` | gpus |
| `motherboard-card-template` | motherboards |
| `ram-card-template` | ram |
| `storage-card-template` | storage |
| `power-supply-card-template` | powerSupplies |
| `case-card-template` | cases |
| `cpu-cooler-card-template` | cpuCoolers |

Minden sablon `.card` elemből áll, benne `.card-title`, `.specs` (soronként egy `.row`, két `span`-nel: címke és érték) és `.price`. Az értékek `span` elemeinek osztálya (pl. `.socket`, `.tdp`, `.capacity`) egyezik a `createCard()` szelektoraival.

> Új mező hozzáadásakor a sablonba is fel kell venni egy `.row` elemet a megfelelő osztállyal, és a `createCard()` függvényben is ki kell tölteni.

---

## savedConfigs.html (mentett konfigurációk oldal)

A JavaScript fájlja: [saved.js](../js/saved.js.md)

### Szerkezet

```
<header>                      fejléc, oldalnavigáció
<main class="saved-configs-page">
    <div id="saved-configs-list">   a konfigurációk listája
<template id="saved-config-template">
<dialog id="delete-modal">          törlés megerősítése
```

### Fontos elemek

| Elem | Szerepe |
|----|----|
| `#saved-configs-list` | a konfigurációk konténere (kezdetben a „Konfigurációk betöltése..." szöveg) |
| `#saved-config-template` | egy konfigurációkártya sablonja |
| `.config-name`, `.config-parts-list`, `.config-total` | a sablonban: név, alkatrészek listája, végösszeg |
| `.load-config-btn`, `.delete-config-btn` | a sablonban: betöltés és törlés gomb |
| `#delete-modal` | a törlés megerősítő `<dialog>` ablaka |
| `#delete-form` | az ablakban lévő űrlap (`submit` = törlés) |
| `#delete-config-name` | a törlendő konfiguráció neve |
| `#cancel-delete-btn`, `#submit-delete-btn` | „Mégse" és „Törlés" gomb |

---

## Stíluslap (app.css)

A stíluslap egy `@import "tailwindcss"` sorral kezdődik (Tailwind CSS 4, a `@tailwindcss/vite` bővítményen keresztül), utána saját szabályok következnek.

### Színek

A színek CSS változókként a `:root`-ban vannak megadva:

| Változó | Érték | Használat |
|----|----|----|
| `--bg` | `#0F1319` | oldal háttere |
| `--panel` | `#161B22` | panelek, kártyák háttere |
| `--line` | `#262C36` | keretek |
| `--text` | `#E4E6EA` | szöveg |
| `--text-dim` | `#8B92A0` | halványabb szöveg |
| `--text-faint` | `#565D6B` | leghalványabb szöveg |
| `--accent` | `#E2A33D` | kiemelés |
| `--dark-accent` | `#775621` | sötétebb kiemelés |

### Töréspontok

| Töréspont | Változás |
|----|----|
| `max-width: 960px` | az összegző panel az oldal aljára kerül rögzített sávként, lenyitható (`#summary.open`); a menü 180 px széles |
| `max-width: 640px` | a kategóriamenü ☰ gombbal nyitható menüvé alakul (`#cat-nav.open`), a leíró szöveg eltűnik a fejlécből, az elrendezés egy oszlopos |

### Állapotosztályok

Ezeket a JavaScript kapcsolja:

| Osztály | Hol | Jelentése |
|----|----|----|
| `.active` | `.nav-btn` | az aktuális kategória (a `.header-btn` `active` osztálya a HTML-ben fix) |
| `.selected` | `.card`, `.summary-item`, `.dot` | kiválasztott alkatrész |
| `.conflict` | `.card`, `.summary-item`, `.dot` | kiválasztott, de ütköző alkatrész |
| `.open` | `#cat-nav`, `#summary`, `#menu-toggle` | mobil menü / panel nyitva |
| `.panel-open` | `body` | az összegző panel nyitva van |
