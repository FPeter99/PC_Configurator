import "@assets/app.css";
import { getParts } from "./js/fetch";

const cards = document.querySelector("#cards");
const searchInput = document.querySelector("#search-input");
const navButtons = document.querySelectorAll(".nav-btn");

const selected = {
    processors: null,
    gpus: null,
    motherboards: null,
    ram: null,
    storage: null,
    powerSupplies: null,
    cases: null,
    cpuCoolers: null
};

function createCard(part, partType) {

    let template;

    // Megfelelő template kiválasztása
    if (partType === "processors") {
        template = document.querySelector("#processor-card-template");
    }

    if (partType === "gpus") {
        template = document.querySelector("#gpu-card-template");
    }

    if (partType === "motherboards") {
        template = document.querySelector("#motherboard-card-template");
    }

    if (partType === "ram") {
        template = document.querySelector("#ram-card-template");
    }

    if (partType === "storage") {
        template = document.querySelector("#storage-card-template");
    }

    if (partType === "powerSupplies") {
        template = document.querySelector("#power-supply-card-template");
    }

    if (partType === "cases") {
        template = document.querySelector("#case-card-template");
    }

    if (partType === "cpuCoolers") {
        template = document.querySelector("#cpu-cooler-card-template");
    }


    // Template másolása
    const card = template.content.cloneNode(true);


    // Közös adatok
    card.querySelector(".card-title").textContent = part.name;
    card.querySelector(".price").textContent = `${part.price} $`;


    // PROCESSOR
    if (partType === "processors") {

        card.querySelector(".brand").textContent = part.brand;
        card.querySelector(".socket").textContent = part.socket;
        card.querySelector(".cores").textContent = part.cores;
        card.querySelector(".threads").textContent = part.threads;
        card.querySelector(".base-clock").textContent = `${part.baseClock} GHz`;
        card.querySelector(".boost-clock").textContent = `${part.boostClock} GHz`;
        card.querySelector(".tdp").textContent = `${part.tdp} W`;
    }


    // GPU
    if (partType === "gpus") {

        card.querySelector(".brand").textContent = part.brand;
        card.querySelector(".interface").textContent = part.interface;
        card.querySelector(".vram").textContent = `${part.vram} GB`;
        card.querySelector(".memory-type").textContent = part.memory_type;
        card.querySelector(".tdp").textContent = `${part.tdp} W`;
    }


    // MOTHERBOARD
    if (partType === "motherboards") {

        card.querySelector(".brand").textContent = part.brand;
        card.querySelector(".cpu-socket").textContent = part.socket;
        card.querySelector(".ram-type").textContent = part.ram_type;
        card.querySelector(".form-factor").textContent = part.form_factor;
    }


    // RAM
    if (partType === "ram") {

        card.querySelector(".brand").textContent = part.brand;
        card.querySelector(".ram-type").textContent = part.ram_type;
        card.querySelector(".capacity").textContent = `${part.capacity} GB`;
        card.querySelector(".speed").textContent = `${part.speed} MHz`;
    }


    // STORAGE
    if (partType === "storage") {

        card.querySelector(".brand").textContent = part.brand;
        card.querySelector(".storage-type").textContent = part.storage_type;
        card.querySelector(".interface").textContent = part.interface;
        card.querySelector(".capacity").textContent = `${part.capacity} GB`;
    }


    // POWER SUPPLY
    if (partType === "powerSupplies") {

        card.querySelector(".brand").textContent = part.brand;
        card.querySelector(".wattage").textContent = `${part.wattage} W`;
        card.querySelector(".efficiency").textContent = part.efficiency;
    }


    // CASE
    if (partType === "cases") {

        card.querySelector(".brand").textContent = part.brand;
        card.querySelector(".supported-form-factor").textContent =
            part.supported_form_factor;
    }


    // CPU COOLER
    if (partType === "cpuCoolers") {

        card.querySelector(".brand").textContent = part.brand;
        card.querySelector(".supported-sockets").textContent =
            part.supported_socket;
    }

    const cardElement = card.querySelector(".card");

    if (selected[partType]?.id === part.id) {
        cardElement.classList.add("selected");
    }


    cardElement.addEventListener("click", () => {
        const navButton = document.querySelector(
            `.nav-btn[data-part-type="${partType}"]`
        );

        const dot = navButton.querySelector(".dot");

        if (selected[partType]?.id === part.id) {
            selected[partType] = null;
            cardElement.classList.remove("selected");
            dot.classList.remove("selected");
            return;
        }

        selected[partType] = part;

        cards.querySelectorAll(".card").forEach(c => {
            c.classList.remove("selected");
        });

        cardElement.classList.add("selected");
        dot.classList.add("selected");
    });

    return card;
    }


function displayCards(parts, partType) {

    cards.replaceChildren(
        ...parts.map(part => createCard(part, partType))
    );
}


let currentParts = await getParts("processors");
let currentPartType = "processors";
displayCards(currentParts, currentPartType);

navButtons.forEach(btn => {
    btn.addEventListener("click", async () => {

        // aktív gomb frissítése
        navButtons.forEach(b => {
            b.classList.remove("active");
        });
        btn.classList.add("active");

        searchInput.value = "";

        // kiválasztott kategória lekérése
        currentPartType = btn.dataset.partType;

        // adatok lekérése az adott kategóriából
        currentParts = await getParts(currentPartType);

        // kártyák megjelenítése
        displayCards(currentParts, currentPartType);
    });
});

searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    const filtered = currentParts.filter(part =>
        part.name.toLowerCase().includes(term) ||
        part.brand.toLowerCase().includes(term)
    );

    displayCards(filtered, currentPartType);
});