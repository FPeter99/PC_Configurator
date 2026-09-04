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
}