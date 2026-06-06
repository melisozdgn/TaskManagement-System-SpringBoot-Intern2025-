const API_URL = "http://localhost:8080";

export async function getTasksByProjectId(projectId, token) {
    const response = await fetch(`${API_URL}/tasks/project/${projectId}`, {
        headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
}

export async function getTaskById(id, token) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch task");
    return response.json();
}

export async function createTask(task, token) {
    const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
}

export async function updateTask(id, task, token) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error("Failed to update task");
    return response.json();
}

export async function deleteTask(id, token) {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to delete task");
    // Don't try to parse response as JSON since it's empty
    return true;
}

