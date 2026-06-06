const API_URL = "http://localhost:8080";

export async function getComments(taskId, token) {
    const response = await fetch(`${API_URL}/comments/task/${taskId}`, {
        headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch comments");
    return response.json();
}

export async function addComment(taskId, content, token) {
    const response = await fetch(`${API_URL}/comments/task/${taskId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error("Failed to add comment");
    return response.json();
}

export async function updateComment(commentId, content, token) {
    const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error("Failed to update comment");
    return response.json();
}

export async function deleteComment(commentId, token) {
    const response = await fetch(`${API_URL}/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to delete comment");
} 