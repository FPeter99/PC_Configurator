import { getConfigurations, deleteConfiguration } from "./js/fetch";

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

const deleteDialogEl = document.querySelector("#delete-modal");
const deleteFormEl = document.querySelector("#delete-form");
const deleteConfigNameEl = document.querySelector("#delete-config-name");
const cancelDeleteBtnEl = document.querySelector("#cancel-delete-btn");

function createSavedConfigItem(savedConfiguration) {
    const template = document.querySelector("#saved-config-template");
    if (!template) return document.createElement("div");

    const fragment = template.content.cloneNode(true);
    const itemElement = fragment.querySelector(".saved-config-item");
    const titleElement = fragment.querySelector(".config-name");
    const partsListElement = fragment.querySelector(".config-parts-list");
    const totalElement = fragment.querySelector(".config-total");
    const deleteButton = fragment.querySelector(".delete-config-btn");
    const loadButton = fragment.querySelector(".load-config-btn");

    if (titleElement) {
        titleElement.textContent = savedConfiguration.name;
    }

    let totalPrice = 0;
    for (const category of CATEGORIES) {
        const selectedPart = savedConfiguration.parts ? savedConfiguration.parts[category.key] : null;
        if (selectedPart && selectedPart.price) {
            totalPrice += Number(selectedPart.price) || 0;
        }

        const listItem = document.createElement("li");
        const partText = selectedPart ? `${selectedPart.name} (${selectedPart.price} $)` : "Nincs kiválasztva";
        listItem.innerHTML = `<span class="part-category">${category.name}:</span> <span class="part-value">${partText}</span>`;
        partsListElement?.appendChild(listItem);
    }

    if (totalElement) {
        totalElement.textContent = `Végösszeg: ${totalPrice} $`;
    }

    loadButton?.addEventListener("click", () => {
        window.location.href = `index.html?load=${savedConfiguration.id}`;
    });

    deleteButton?.addEventListener("click", () => {
        deleteDialogEl.dataset.id = savedConfiguration.id;
        deleteConfigNameEl.textContent = savedConfiguration.name;
        deleteDialogEl.showModal();
    });

    return itemElement;
}

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

deleteFormEl?.addEventListener("submit", async (event) => {
    event.preventDefault();
    await deleteConfiguration(deleteDialogEl.dataset.id);
    deleteDialogEl.close();
    await initSavedConfigs();
});

cancelDeleteBtnEl?.addEventListener("click", () => {
    deleteDialogEl.close();
});

initSavedConfigs();