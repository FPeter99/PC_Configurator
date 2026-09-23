import "@assets/app.css";
import { getParts } from "./js/fetch";

const cards = document.querySelector("#cards");
const summaryList = document.querySelector("#summary-list");
const sectionTitle = document.querySelector("#section-title");
const sectionCount = document.querySelector("#section-count");

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

function renderSummary() {
    if (!summaryList) return;

    summaryList.innerHTML = "";

    CATEGORIES.forEach(cat => {
        const itemEl = document.createElement("div");
        itemEl.className = "summary-item";
        itemEl.dataset.partType = cat.key;

        const subEl = document.createElement("div");
        subEl.className = "sub";
        subEl.textContent = cat.name;
        itemEl.appendChild(subEl);

        const statusEl = document.createElement("div");
        statusEl.className = "summary-status";
        statusEl.textContent = "nincs kiválasztva";
        itemEl.appendChild(statusEl);

        summaryList.appendChild(itemEl);
    });
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

    if (selected[partType]?.id === part.id) {
        cardElement.classList.add("selected");
    }

    cardElement.addEventListener("click", () => {
        const navButton = document.querySelector(`.nav-btn[data-part-type="${partType}"]`);
        const dot = navButton?.querySelector(".dot");

        if (selected[partType]?.id === part.id) {
            selected[partType] = null;
            cardElement.classList.remove("selected");
            dot?.classList.remove("selected");
            return;
        }

        selected[partType] = part;

        cards.querySelectorAll(".card").forEach(c => c.classList.remove("selected"));
        cardElement.classList.add("selected");
        dot?.classList.add("selected");
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

(async function init() {
    try {
        renderSummary();
        const processors = await getParts("processors");
        displayCards(processors, "processors");
    } catch (err) {
        console.error("Hiba:", err);
    }
})();