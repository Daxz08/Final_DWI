const API_URL = "http://localhost:8080/api/ucv";

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al registrar usuario");
  }
  
  return response.json();
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/authenticate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Credenciales incorrectas");
  }
  
  return response.json();
}