"use strict";
// 1. MENÚ LATERAL
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
function toggleMenu() {
    if (!sidebar || !overlay)
        return;
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}
if (menuToggle) {
    menuToggle.addEventListener('click', toggleMenu);
}
if (overlay) {
    overlay.addEventListener('click', toggleMenu);
}
// 2. CONEXIÓN A LA API FLASK
const API_BASE = "http://127.0.0.1:5000";
function construirProducto(producto) {
    return `
        <div class="producto-card">
            <div class="producto-header">
                <strong>${producto.Description}</strong>
            </div>
            <div class="producto-body">
                <p>Tienda: ${producto.Store}</p>
                <p>Categoría: ${producto.Category}</p>
                <p>Precio: $${Number(producto.UnitPrice).toLocaleString("es-CL")}</p>
                <p>Rating: ${producto.Rating ?? "N/A"}</p>
                <p>SKU: ${producto.StockCode}</p>
            </div>
            <div class="producto-actions">
                <button class="btn-ir-tienda">Comprar</button>
                <button class="btn-fav">Añadir a Favorito</button>
            </div>
        </div>
    `;
}
async function buscarProductos(query) {
    const contenedor = document.getElementById("resultado-productos");
    if (!contenedor)
        return;
    contenedor.innerHTML = `<p>Cargando...</p>`;
    try {
        const url = `${API_BASE}/products?name=${encodeURIComponent(query)}`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (!data.ok) {
            contenedor.innerHTML = `<p>Error: ${data.error || "No se pudo obtener productos"}</p>`;
            return;
        }
        if (data.total === 0) {
            contenedor.innerHTML = `<p>Sin resultados para "${query}"</p>`;
            return;
        }
        const html = data.items
            .slice(0, 20)
            .map(construirProducto)
            .join("");
        contenedor.innerHTML = html;
    }
    catch (err) {
        contenedor.innerHTML = `<p>Error de red al contactar la API.</p>`;
        console.error(err);
    }
}
// Hacemos visible buscarProductos manualmente por si quieres probarla en consola
// @ts-ignore
;
window.buscarProductos = buscarProductos;
// 3. INICIALIZAR BUSCADOR
function inicializarBuscador() {
    const inputBusqueda = document.querySelector(".search-input");
    const iconoBusqueda = document.querySelector(".search-icon");
    if (!inputBusqueda)
        return;
    // ENTER en el input
    inputBusqueda.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") {
            buscarProductos(inputBusqueda.value.trim());
        }
    });
    // CLICK en la lupa
    if (iconoBusqueda) {
        iconoBusqueda.addEventListener("click", () => {
            buscarProductos(inputBusqueda.value.trim());
        });
    }
}
// Esperar a que el DOM esté cargado antes de enganchar
document.addEventListener("DOMContentLoaded", () => {
    inicializarBuscador();
});
