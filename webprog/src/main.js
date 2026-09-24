import "@assets/app.css";
import { getParts } from "./js/fetch";

const cards = document.querySelector("#cards");
const summaryList = document.querySelector("#summary-list");
const sectionTitle = document.querySelector("#section-title");
const sectionCount = document.querySelector("#section-count");
const menuToggle = document.querySelector("#menu-toggle");
const catNav = document.querySelector("#cat-nav");

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

function checkCompatibility(selectedParts) {
    const conflicts = {};
    const issues = [];

    const addConflict = (key, msg) => {
        if (!conflicts[key]) conflicts[key] = [];
        conflicts[key].push(msg);
    };

    const cpu = selectedParts.processors;
    const mb = selectedParts.motherboards;
    const ram = selectedParts.ram;
    const gpu = selectedParts.gpus;
    const storage = selectedParts.storage;
    const psu = selectedParts.powerSupplies;
    const pcCase = selectedParts.cases;
    const cooler = selectedParts.cpuCoolers;

    if (cpu && mb) {
        const cpuSocket = cpu.socket;
        const mbSocket = mb.cpuSocket || mb.socket;
        if (cpuSocket && mbSocket && cpuSocket !== mbSocket) {
            addConflict("processors", "Processzor <=> Alaplap");
            addConflict("motherboards", "Processzor <=> Alaplap");
            issues.push(`Processzor <=> Alaplap`);
        }
    }

    if (mb && ram) {
        const mbRam = mb.ramType || mb.ram_type;
        const ramType = ram.ramType || ram.ram_type;
        if (mbRam && ramType && mbRam !== ramType) {
            addConflict("motherboards", "Memória <=> Alaplap");
            addConflict("ram", "Memória <=> Alaplap");
            issues.push(`Memória <=> Alaplap`);
        }
    }

    if (cpu && cooler) {
        const cpuSocket = cpu.socket;
        const supportedSockets = Array.isArray(cooler.supportedSockets)
            ? cooler.supportedSockets
            : (cooler.supportedSockets ? [cooler.supportedSockets] : (cooler.supported_socket ? [cooler.supported_socket] : []));
        if (cpuSocket && supportedSockets.length > 0 && !supportedSockets.includes(cpuSocket)) {
            addConflict("cpuCoolers", "CPU hűtő <=> Processzor");
            addConflict("processors", "CPU hűtő <=> Processzor");
            issues.push(`CPU hűtő <=> Processzor`);
        }
    }

    if (mb && pcCase) {
        const mbForm = mb.formFactor || mb.form_factor;
        const caseForm = pcCase.supportedFormFactor || pcCase.supported_form_factor;
        if (mbForm && caseForm && mbForm !== caseForm) {
            addConflict("motherboards", "Ház <=> Alaplap");
            addConflict("cases", "Ház <=> Alaplap");
            issues.push(`Ház <=> Alaplap`);
        }
    }

    if (mb && storage) {
        const storageInterfaces = mb.storageInterfaces || [];
        const storageIf = storage.interface;
        if (storageIf && storageInterfaces.length > 0 && !storageInterfaces.includes(storageIf)) {
            addConflict("storage", "Tárhely <=> Alaplap");
            addConflict("motherboards", "Tárhely <=> Alaplap");
            issues.push(`Tárhely <=> Alaplap`);
        }
    }

    if (psu) {
        const cpuTdp = Number(cpu?.tdp) || 0;
        const gpuTdp = Number(gpu?.tdp) || 0;
        const estimatedPower = cpuTdp + gpuTdp + 60;
        const psuWattage = Number(psu.wattage) || 0;
        if (psuWattage > 0 && estimatedPower > psuWattage) {
            addConflict("powerSupplies", "Tápegység <=> Fogyasztás");
            issues.push(`Tápegység <=> Fogyasztás`);
        }
    }

    return {
        isCompatible: issues.length === 0,
        conflicts,
        issues
    };
}

function updateTotal() {
    const total = Object.values(selected).reduce((sum, item) => {
        return sum + (item ? Number(item.price) || 0 : 0);
    }, 0);

    const totalAmountElement = document.querySelector("#total-amount");
    if (totalAmountElement) {
        totalAmountElement.textContent = `${total} $`;
    }
}

function renderSummary(compat) {
    if (!summaryList) return;

    summaryList.innerHTML = "";

    CATEGORIES.forEach(cat => {
        const item = selected[cat.key];
        const hasConflict = Boolean(compat.conflicts[cat.key]);
        const conflictMsgs = compat.conflicts[cat.key] || [];

        const itemEl = document.createElement("div");
        itemEl.className = `summary-item ${item ? "selected" : ""} ${hasConflict ? "conflict" : ""}`;
        itemEl.dataset.partType = cat.key;

        const subEl = document.createElement("div");
        subEl.className = "sub";
        subEl.textContent = cat.name;

        itemEl.appendChild(subEl);

        if (!item) {
            const statusEl = document.createElement("div");
            statusEl.className = "summary-status";
            statusEl.textContent = "nincs kiválasztva";
            itemEl.appendChild(statusEl);
        } else {
            const detailsEl = document.createElement("div");
            detailsEl.className = "summary-details";

            const nameEl = document.createElement("span");
            nameEl.className = "part-name";
            nameEl.textContent = item.name;

            const priceEl = document.createElement("span");
            priceEl.className = "part-price";
            priceEl.textContent = `${item.price} $`;

            detailsEl.appendChild(nameEl);
            detailsEl.appendChild(priceEl);
            itemEl.appendChild(detailsEl);
        }

        if (hasConflict) {
            conflictMsgs.forEach(msg => {
                const conflictEl = document.createElement("div");
                conflictEl.className = "conflict-text";
                conflictEl.textContent = msg;
                itemEl.appendChild(conflictEl);
            });
        }

        summaryList.appendChild(itemEl);
    });
}

function updateNavStatus(compat) {
    document.querySelectorAll(".nav-btn").forEach(btn => {
        const type = btn.dataset.partType;
        const dot = btn.querySelector(".dot");
        const isSelected = Boolean(selected[type]);
        const hasConflict = Boolean(compat.conflicts[type]);

        if (dot) {
            dot.classList.toggle("selected", isSelected);
            dot.classList.toggle("conflict", isSelected && hasConflict);
        }

        btn.classList.toggle("active", type === currentCategory);
    });
}

function updateCardsBorder(compat) {
    if (!cards) return;

    cards.querySelectorAll(".card").forEach(cardEl => {
        const partId = Number(cardEl.dataset.partId);
        const isSelected = selected[currentCategory]?.id === partId;
        const hasConflict = Boolean(compat.conflicts[currentCategory]);

        cardEl.classList.toggle("selected", isSelected);
        cardEl.classList.toggle("conflict", isSelected && hasConflict);
    });
}

function updateUI() {
    updateTotal();
    const compat = checkCompatibility(selected);
    renderSummary(compat);
    updateNavStatus(compat);
    updateCardsBorder(compat);
}

function createCard(part, partType) {
    let template;

    if (partType === "processors") template = document.querySelector("#processor-card-template");
    if (partType === "gpus") template = document.querySelector("#gpu-card-template");
    if (partType === "motherboards") template = document.querySelector("#motherboard-card-template");
    if (partType === "ram") template = document.querySelector("#ram-card-template");
    if (partType === "storage") template = document.querySelector("#storage-card-template");
    if (partType === "powerSupplies") template = document.querySelector("#power-supply-card-template");
    if (partType === "cases") template = document.querySelector("#case-card-template");
    if (partType === "cpuCoolers") template = document.querySelector("#cpu-cooler-card-template");

    if (!template) return document.createElement("div");

    const cardFrag = template.content.cloneNode(true);
    const cardElement = cardFrag.querySelector(".card");
    cardElement.dataset.partId = part.id;

    cardFrag.querySelector(".card-title").textContent = part.name;
    cardFrag.querySelector(".price").textContent = `${part.price} $`;

    if (partType === "processors") {
        cardFrag.querySelector(".brand").textContent = part.brand || "";
        cardFrag.querySelector(".socket").textContent = part.socket || "";
        cardFrag.querySelector(".cores").textContent = part.cores || "";
        cardFrag.querySelector(".threads").textContent = part.threads || "";
        cardFrag.querySelector(".base-clock").textContent = `${part.baseClock} GHz`;
        cardFrag.querySelector(".boost-clock").textContent = `${part.boostClock} GHz`;
        cardFrag.querySelector(".tdp").textContent = `${part.tdp} W`;
    } else if (partType === "gpus") {
        cardFrag.querySelector(".brand").textContent = part.brand || "";
        cardFrag.querySelector(".interface").textContent = part.interface || "";
        cardFrag.querySelector(".vram").textContent = `${part.vram} GB`;
        cardFrag.querySelector(".memory-type").textContent = part.memoryType || part.memory_type || "";
        cardFrag.querySelector(".tdp").textContent = `${part.tdp} W`;
    } else if (partType === "motherboards") {
        cardFrag.querySelector(".brand").textContent = part.brand || "";
        cardFrag.querySelector(".cpu-socket").textContent = part.cpuSocket || part.socket || "";
        cardFrag.querySelector(".ram-type").textContent = part.ramType || part.ram_type || "";
        cardFrag.querySelector(".form-factor").textContent = part.formFactor || part.form_factor || "";
    } else if (partType === "ram") {
        cardFrag.querySelector(".brand").textContent = part.brand || "";
        cardFrag.querySelector(".ram-type").textContent = part.ramType || part.ram_type || "";
        cardFrag.querySelector(".capacity").textContent = `${part.capacity} GB`;
        cardFrag.querySelector(".speed").textContent = `${part.speed} MHz`;
    } else if (partType === "storage") {
        cardFrag.querySelector(".brand").textContent = part.brand || "";
        cardFrag.querySelector(".storage-type").textContent = part.storageType || part.storage_type || "";
        cardFrag.querySelector(".interface").textContent = part.interface || "";
        cardFrag.querySelector(".capacity").textContent = `${part.capacity} GB`;
    } else if (partType === "powerSupplies") {
        cardFrag.querySelector(".brand").textContent = part.brand || "";
        cardFrag.querySelector(".wattage").textContent = `${part.wattage} W`;
        cardFrag.querySelector(".efficiency").textContent = part.efficiency || "";
    } else if (partType === "cases") {
        cardFrag.querySelector(".brand").textContent = part.brand || "";
        cardFrag.querySelector(".supported-form-factor").textContent = part.supportedFormFactor || part.supported_form_factor || "";
    } else if (partType === "cpuCoolers") {
        cardFrag.querySelector(".brand").textContent = part.brand || "";
        const sockets = Array.isArray(part.supportedSockets)
            ? part.supportedSockets.join(", ")
            : (part.supportedSockets || part.supported_socket || "");
        cardFrag.querySelector(".supported-sockets").textContent = sockets;
    }

    const compat = checkCompatibility(selected);
    const isSelected = selected[partType]?.id === part.id;
    const hasConflict = Boolean(compat.conflicts[partType]);

    if (isSelected) {
        cardElement.classList.add("selected");
        if (hasConflict) {
            cardElement.classList.add("conflict");
        }
    }

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
    currentParts = parts;
    const categoryObj = CATEGORIES.find(c => c.key === partType);
    if (sectionTitle) {
        sectionTitle.textContent = categoryObj ? categoryObj.name : partType;
    }
    if (sectionCount) {
        sectionCount.textContent = `(${parts.length} alkatrész)`;
    }

    cards.replaceChildren(
        ...parts.map(part => createCard(part, partType))
    );
}

const navButtons = document.querySelectorAll(".nav-btn");
navButtons.forEach(btn => {
    btn.addEventListener("click", async () => {
        navButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const partType = btn.dataset.partType;
        currentCategory = partType;
        const parts = await getParts(partType);
        displayCards(parts, partType);
    });
});

if (menuToggle && catNav) {
    menuToggle.addEventListener("click", () => {
        catNav.classList.toggle("open");
    });
}

(async function init() {
    try {
        const processors = await getParts("processors");
        displayCards(processors, "processors");
        updateUI();
    } catch (err) {
        console.error("Hiba:", err);
    }
})();