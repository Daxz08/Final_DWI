const API_URL = "http://localhost:8080/api/ucv";
export async function changePassword(data) {
  const response = await fetch(`${API_URL}/change-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Error al cambiar la contraseña");
  }

  return response.json();
}
