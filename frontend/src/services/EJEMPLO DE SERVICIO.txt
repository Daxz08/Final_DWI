const BASE_URL = "http://localhost:80/market/api/products";
export async function getAllProducts() {
    const res = await fetch(`${BASE_URL}/all`);
    if (!res.ok) throw new Error("Error al listar");
    return res.json();
}
export async function saveProduct(product) {
    const res = await fetch(`${BASE_URL}/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Error al guardar");
    return res.json();
}
export async function updateProduct(id, product) {
    const res = await fetch(`${BASE_URL}/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error("Error al actualizar");
    return res.json();
}
export async function deleteProduct(id) {
    const res = await fetch(`${BASE_URL}/delete/${id}`, { method: "DELETE" });
    if (res.status !== 204 && res.status !== 200) {
        throw new Error("No se pudo eliminar");
    }
}