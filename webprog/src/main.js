import "@assets/app.css";
import { getParts } from "./js/fetch";

const cards = document.querySelector("#cards");


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
        card.querySelector(".base-clock").textContent = `${part.base_clock} GHz`;
        card.querySelector(".boost-clock").textContent = `${part.boost_clock} GHz`;
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


    return card;
}


function displayCards(parts, partType) {

    cards.replaceChildren(
        ...parts.map(part => createCard(part, partType))
    );
}


const processors = await getParts("processors");

displayCards(processors, "processors");

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});