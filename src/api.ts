import type { Generation } from "./types";

const API_BASE = "http://localhost:5000";

export async function generateCode(prompt: string, language: string): Promise<Generation> {
    const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, language }),
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "Failed to generate code" }));
        throw new Error(error.error || "Failed to generate code");
    }

    const data: Generation = await res.json();
    return data;
}

export async function fetchHistory(page = 1, search = ""): Promise<Generation[]> {
    const params = new URLSearchParams({ page: page.toString() });
    if (search) {
        params.append("search", search);
    }

    const res = await fetch(`${API_BASE}/api/history?${params}`);

    if (!res.ok) {
        throw new Error("Failed to fetch history");
    }

    const data: Generation[] = await res.json();
    return data;
}

export async function toggleStar(id: number, starred: boolean): Promise<Generation> {
    const res = await fetch(`${API_BASE}/api/generation/${id}/star`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ starred }),
    });

    if (!res.ok) {
        throw new Error("Failed to update star status");
    }

    const data: Generation = await res.json();
    return data;
}
