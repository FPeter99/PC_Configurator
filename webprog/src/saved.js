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

const container = document.querySelector("#saved-configs-list");
const deleteDialogEl = document.querySelector("#delete-modal");
const deleteFormEl = document.querySelector("#delete-form");
const deleteConfigNameEl = document.querySelector("#delete-config-name");
const cancelDeleteBtnEl = document.querySelector("#cancel-delete-btn");

function createSavedConfigItem(savedConfiguration) {
    const template = document.querySelector("#saved-config-template");
    const fragment = template.content.cloneNode(true);
    const partsListElement = fragment.querySelector(".config-parts-list");

    let totalPrice = 0;
    for (const category of CATEGORIES) {
        const selectedPart = savedConfiguration.parts?.[category.key];        
        if (selectedPart) {
            totalPrice += Number(selectedPart.price) || 0;
        }

        const categoryEl = document.createElement("span");
        categoryEl.className = "part-category";
        categoryEl.textContent = `${category.name}:`;

        const valueEl = document.createElement("span");
        valueEl.className = "part-value";
        valueEl.textContent = selectedPart ? `${selectedPart.name} (${selectedPart.price} $)` : "Nincs kiválasztva";

        const listItem = document.createElement("li");
        listItem.append(categoryEl, " ", valueEl);
        partsListElement.appendChild(listItem);
    }

   fragment.querySelector(".config-name").textContent = savedConfiguration.name;
    fragment.querySelector(".config-total").textContent = `Végösszeg: ${totalPrice} $`;

    fragment.querySelector(".load-config-btn").addEventListener("click", () => {
        window.location.href = `index.html?load=${savedConfiguration.id}`;
    });

    fragment.querySelector(".delete-config-btn").addEventListener("click", () => {
        deleteDialogEl.dataset.id = savedConfiguration.id;
        deleteConfigNameEl.textContent = savedConfiguration.name;
        deleteDialogEl.showModal();
    });

    return fragment;
}

async function initSavedConfigs() {
    try {
        const savedConfigurations = await getConfigurations();
        if (savedConfigurations.length === 0) {
            container.innerHTML = `<p class="empty-configs">Nincsenek mentett konfigurációk.</p>`;
            return;
        }

        container.replaceChildren(
            ...savedConfigurations.map(createSavedConfigItem)
        );
    } catch (err) {
        console.error("Hiba a mentett konfigurációk betöltésekor:", err);
        container.innerHTML = `<p class="empty-configs">Hiba történt a konfigurációk betöltésekor.</p>`;
    }
}

deleteFormEl.addEventListener("submit", async (event) => {
    event.preventDefault();
    await deleteConfiguration(deleteDialogEl.dataset.id);
    deleteDialogEl.close();
    await initSavedConfigs();
});

cancelDeleteBtnEl.addEventListener("click", () => {
    deleteDialogEl.close();
});

initSavedConfigs();