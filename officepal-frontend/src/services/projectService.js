const API_URL = "http://localhost:8080/projects";

export async function getProjects(token) {
    const response = await fetch(API_URL, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to fetch projects");
    return response.json();
}

export async function getProjectsByMember(token) {
    const response = await fetch(`${API_URL}/member`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to fetch member projects");
    return response.json();
}

export async function getProjectById(id, token) {
    const response = await fetch(`${API_URL}/${id}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to fetch project");
    return response.json();
}

export async function createProject(project, token) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error("Failed to create project");
    return response.json();
}

export async function updateProject(id, project, token) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error("Failed to update project");
    return response.json();
}

export async function deleteProject(id, token) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    if (!response.ok) throw new Error("Failed to delete project");
} 