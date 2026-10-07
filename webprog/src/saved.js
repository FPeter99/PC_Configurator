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

function createSavedConfigItem(savedConfiguration) {
    const template = document.querySelector("#saved-config-template");
    if (!template) return document.createElement("div");

    const fragment = template.content.cloneNode(true);
    const itemElement = fragment.querySelector(".saved-config-item");
    const titleElement = fragment.querySelector(".config-name");
    const partsListElement = fragment.querySelector(".config-parts-list");
    const totalElement = fragment.querySelector(".config-total");
    const deleteButton = fragment.querySelector(".delete-config-btn");

    if (titleElement) {
        titleElement.textContent = savedConfiguration.name || "Névtelen konfiguráció";
    }

    let totalPrice = 0;
    for (const category of CATEGORIES) {
        const selectedPart = savedConfiguration.parts ? savedConfiguration.parts[category.key] : null;
        if (selectedPart && selectedPart.price) {
            totalPrice += Number(selectedPart.price) || 0;
        }

        const listItem = document.createElement("li");
        listItem.textContent = `${category.name}: ${selectedPart ? `${selectedPart.name} (${selectedPart.price} $)` : "Nincs kiválasztva"}`;
        partsListElement?.appendChild(listItem);
    }

    if (totalElement) {
        totalElement.textContent = `Végösszeg: ${totalPrice} $`;
    }

    deleteButton?.addEventListener("click", async () => {
        try {
            await deleteConfiguration(savedConfiguration.id);
            await initSavedConfigs();
        } catch (err) {
            console.error("Hiba a törlés során:", err);
            alert("Hiba történt a konfiguráció törlésekor!");
        }
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

initSavedConfigs();