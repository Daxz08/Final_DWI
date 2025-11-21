const API_URL = "http://localhost:8080/api/ucv";

// Función centralizada para todas las requests HTTP
export async function apiRequest(endpoint, options = {}) {
  // 1. Obtener token del localStorage
  const token = localStorage.getItem("token");
  
  // 2. Configurar headers con autenticación
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // ✅ AGREGA el token automáticamente
      ...options.headers,
    },
    ...options,
  };

  // 3. Convertir body a JSON si existe
  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  // 4. Hacer la request
  const response = await fetch(`${API_URL}${endpoint}`, config);
  
  // 5. Manejar errores de autenticación (token expirado)
  if (response.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    throw new Error("Sesión expirada - Por favor inicie sesión nuevamente");
  }
  
  // 6. Manejar otros errores HTTP
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error ${response.status}: ${response.statusText}`);
  }

  // 7. Para DELETE (204 No Content) no retornar JSON
  if (response.status === 204) {
    return null;
  }

  // 8. Retornar datos JSON
  return response.json();
}