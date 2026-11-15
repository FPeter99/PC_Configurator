import "@assets/app.css";
import { getParts, getConfigurations, postConfiguration, putConfiguration, getConfiguration } from "./js/fetch";

const cards = document.querySelector("#cards");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const navButtons = document.querySelectorAll(".nav-btn");
const summaryList = document.querySelector("#summary-list");
const sectionTitle = document.querySelector("#section-title");
const sectionCount = document.querySelector("#section-count");
const menuToggle = document.querySelector("#menu-toggle");
const catNav = document.querySelector("#cat-nav");
const summary = document.querySelector("#summary");
const summaryToggle = document.querySelector("#summary-toggle");
const barTotal = document.querySelector("#bar-total");
const totalAmount = document.querySelector("#total-amount");
const configNameInput = document.querySelector("#config-name");
const saveConfigBtn = document.querySelector("#save-config-btn");

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

let currentCategory = "processors";
let currentParts = [];

function addConflict(conflicts, message, ...categoryKeys) {
    for (const key of categoryKeys) {
        if (!conflicts[key]) {
            conflicts[key] = [];
        }
        conflicts[key].push(message);
    }
}

function checkCompatibility(selectedParts) {
    const conflicts = {};

    const cpu = selectedParts.processors;
    const mb = selectedParts.motherboards;
    const ram = selectedParts.ram;
    const gpu = selectedParts.gpus;
    const storage = selectedParts.storage;
    const psu = selectedParts.powerSupplies;
    const pcCase = selectedParts.cases;
    const cooler = selectedParts.cpuCoolers;

    if (cpu && mb && cpu.socket !== mb.cpuSocket) {
        addConflict(conflicts, "Processzor <=> Alaplap", "processors", "motherboards");
    }

    if (mb && ram && mb.ramType !== ram.ramType) {
        addConflict(conflicts, "Memória <=> Alaplap", "motherboards", "ram");
    }

    if (cpu && cooler && !cooler.supportedSockets.includes(cpu.socket)) {
        addConflict(conflicts, "CPU hűtő <=> Processzor", "cpuCoolers", "processors");
    }

    if (mb && pcCase && mb.formFactor !== pcCase.supportedFormFactor) {
        addConflict(conflicts, "Ház <=> Alaplap", "motherboards", "cases");
    }

    if (mb && storage && !mb.storageInterfaces.includes(storage.interface)) {
        addConflict(conflicts, "Tárhely <=> Alaplap", "motherboards", "storage");
    }

    if (psu && (cpu?.tdp || 0) + (gpu?.tdp || 0) + 60 > psu.wattage) {
        addConflict(conflicts, "Tápegység <=> Fogyasztás", "powerSupplies");
    }

    return conflicts;
}

function updateTotal() {
    const total = Object.values(selected).reduce((sum, part) => {
        return sum + (part ? Number(part.price) || 0 : 0);
    }, 0);

    totalAmount.textContent = `${total} $`;
    barTotal.textContent = `${total} $`;
}

function renderSummary(conflicts) {
    summaryList.innerHTML = "";

    CATEGORIES.forEach(category => {
        const part = selected[category.key];
        const messages = conflicts[category.key] || [];

        const itemEl = document.createElement("div");
        itemEl.className = "summary-item";
        itemEl.classList.toggle("conflict", messages.length > 0);
        itemEl.dataset.partType = category.key;

        const subEl = document.createElement("div");
        subEl.className = "sub";
        subEl.textContent = category.name;
        itemEl.appendChild(subEl);

        if (!part) {
            const statusEl = document.createElement("div");
            statusEl.className = "summary-status";
            statusEl.textContent = "nincs kiválasztva";
            itemEl.appendChild(statusEl);
        } else {
            const detailsEl = document.createElement("div");
            detailsEl.className = "summary-details";

            const nameEl = document.createElement("span");
            nameEl.className = "part-name";
            nameEl.textContent = part.name;

            const priceEl = document.createElement("span");
            priceEl.className = "part-price";
            priceEl.textContent = `${part.price} $`;

            detailsEl.appendChild(nameEl);
            detailsEl.appendChild(priceEl);
            itemEl.appendChild(detailsEl);
        }

        messages.forEach(message => {
                const conflictEl = document.createElement("div");
                conflictEl.className = "conflict-text";
                conflictEl.textContent = message;
                itemEl.appendChild(conflictEl);
        });

        summaryList.appendChild(itemEl);
    });
}

function updateNavStatus(conflicts) {
    navButtons.forEach(btn => {
        const type = btn.dataset.partType;
        const isSelected = Boolean(selected[type]);
        const hasConflict = Boolean(conflicts[type]);
        const dot = btn.querySelector(".dot");

        dot.classList.toggle("selected", isSelected);
        dot.classList.toggle("conflict", isSelected && hasConflict);
        btn.classList.toggle("active", type === currentCategory);
    });
}

function updateCardsBorder(conflicts) {
    const hasConflict = Boolean(conflicts[currentCategory]);

    cards.querySelectorAll(".card").forEach(cardEl => {
        const partId = Number(cardEl.dataset.partId);
        const isSelected = selected[currentCategory]?.id === partId;

        cardEl.classList.toggle("selected", isSelected);
        cardEl.classList.toggle("conflict", isSelected && hasConflict);
    });
}

function updateUI() {
    const conflicts = checkCompatibility(selected);
    updateTotal();
    renderSummary(conflicts);
    updateNavStatus(conflicts);
    updateCardsBorder(conflicts);
}

function createCard(part, partType) {
    const template = document.querySelector(`#${partType}-card-template`);
    const cardFrag = template.content.cloneNode(true);
    const cardElement = cardFrag.querySelector(".card");

    cardElement.dataset.partId = part.id;
    cardFrag.querySelector(".card-title").textContent = part.name;

    for (const [field, value] of Object.entries(part)) {
        const element = cardFrag.querySelector("." + field);
        if (element) {
            element.textContent = Array.isArray(value) ? value.join(", ") : value;
        }
    }

    cardFrag.querySelector(".price").textContent = `${part.price} $`;

    cardElement.addEventListener("click", () => {
        if (selected[partType]?.id === part.id) {
            selected[partType] = null;
        } else {
            selected[partType] = part;
        }
        updateUI();
    });

    return cardFrag;
}

function displayCards(parts, partType) {
    const category = CATEGORIES.find(c => c.key === partType);
    sectionTitle.textContent = category.name;
    sectionCount.textContent = `(${parts.length} alkatrész)`;

    cards.replaceChildren(
        ...parts.map(part => createCard(part, partType))
    );
}

function sortParts(parts, sortBy) {
    const sorted = [...parts];

    if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);

    return sorted;
}

function render() {
    const term = searchInput.value.toLowerCase();

    const filtered = currentParts.filter(part =>
        part.name.toLowerCase().includes(term)
    );

    const sorted = sortParts(filtered, sortSelect.value);

    displayCards(sorted, currentCategory);
    updateUI();
}

navButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
        searchInput.value = "";
        sortSelect.value = "default";

        // kiválasztott kategória lekérése
        currentCategory = btn.dataset.partType;

        // adatok lekérése az adott kategóriából
        currentParts = await getParts(currentCategory);

        // kártyák megjelenítése
        render();
    });
});

searchInput.addEventListener("input", render);
sortSelect.addEventListener("change", render);

menuToggle.addEventListener("click", () => {
    const open = catNav.classList.toggle("open");
    menuToggle.classList.toggle("open", open);
    menuToggle.textContent = open ? "✕" : "☰";
});

catNav.addEventListener("click", () => {
    if (catNav.classList.contains("open")) menuToggle.click();
});

summaryToggle.addEventListener("click", () => {
    const open = summary.classList.toggle("open");
    document.body.classList.toggle("panel-open", open);
    summaryToggle.textContent = open ? "Összegzés ▼" : "Összegzés ▲";

    if (open && catNav.classList.contains("open")) menuToggle.click();
});

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

async function loadSavedConfigFromUrl() {
    const configId = new URLSearchParams(window.location.search).get("load");
    if (!configId) return;

    const savedConfiguration = await getConfiguration(configId);

    for (const category of CATEGORIES) {
        selected[category.key] = savedConfiguration.parts?.[category.key] ?? null;
    }

    configNameInput.value = savedConfiguration.name || "";
}

(async function init() {
    try {
        await loadSavedConfigFromUrl();
        currentParts = await getParts("processors");
        render();
    } catch (err) {
        console.error("Hiba:", err);
    }
})();