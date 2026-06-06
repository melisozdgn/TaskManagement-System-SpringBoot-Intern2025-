const API_URL = "http://localhost:8080/auth";

export async function login(usernameOrEmail, password) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
    });
    if (!response.ok) throw new Error("login failed");
    return response.json();
}

export async function register(username, email, password) {
  const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) throw new Error("Registration failed");
    return response.json();
}

export async function getAllUsers(token) {
    const response = await fetch("http://localhost:8080/users", {
        headers: { "Authorization": `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("Failed to fetch users");
    return response.json();
}