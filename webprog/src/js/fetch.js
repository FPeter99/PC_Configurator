const BASE_URL = "http://localhost:8888/api";

export let parts = [];

const VALID_PART_TYPES = [
    "processors", "gpus", "motherboards", "ram",
    "storage", "powerSupplies", "cases", "cpuCoolers"
];

export async function getParts(partType) {
    if (!VALID_PART_TYPES.includes(partType)) {
        throw new Error(`Invalid part type: ${partType}`);
    }

    const response = await fetch(`${BASE_URL}/${partType}`,
        {
            method: "GET",
            headers: { "Accept": "application/json" }
        }
    );
    if (!response.ok) {
        throw new Error(`Error while fetching: ${response.status}`);
    }

     return await response.json();
}

export async function postConfiguration(configData) {
    const response = await fetch(`${BASE_URL}/configurations`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(configData)
    });

    if (!response.ok) {
        throw new Error(`Error while saving configuration: ${response.status}`);
    }

    return await response.json();
}

export async function putConfiguration(id, configData) {
    const response = await fetch(`${BASE_URL}/configurations/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(configData)
    });

    if (!response.ok) {
        throw new Error(`Error while updating configuration: ${response.status}`);
    }

    return await response.json();
}

export async function getConfigurations() {
    const response = await fetch(`${BASE_URL}/configurations`, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
        throw new Error(`Error while fetching configurations: ${response.status}`);
    }

    return await response.json();
}

export async function deleteConfiguration(id) {
    const response = await fetch(`${BASE_URL}/configurations/${id}`, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });

    if (!response.ok) {
        throw new Error(`Error while deleting configuration: ${response.status}`);
    }

    return await response.json();
}