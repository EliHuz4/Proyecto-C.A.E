"use strict";
// Página de resultados de búsqueda
// 1. MENÚ LATERAL (misma lógica que en otras páginas)
(() => {
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
})();
const API_BASE_SEARCH = window.API_BASE ?? "http://127.0.0.1:5000";
function construirProductoSearch(producto) {
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
async function buscarProductosEnAPI(query) {
    const contenedor = document.getElementById("resultado-productos");
    if (!contenedor)
        return;
    contenedor.innerHTML = `<p>Cargando resultados para "${query}"...</p>`;
    try {
        const url = `${API_BASE_SEARCH}/products?name=${encodeURIComponent(query)}`;
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
        // Ordenar por UnitPrice ascendente como ejemplo de orden
        const items = data.items.slice().sort((a, b) => Number(a.UnitPrice) - Number(b.UnitPrice));
        const html = items
            .slice(0, 50)
            .map(construirProductoSearch)
            .join("");
        contenedor.innerHTML = html;
    }
    catch (err) {
        contenedor.innerHTML = `<p>Error de red al contactar la API.</p>`;
        console.error(err);
    }
}
function readQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}
function inicializarPagina() {
    const q = readQueryParam('q');
    const inputBusqueda = document.querySelector(".search-input");
    const iconoBusqueda = document.querySelector(".search-icon");
    if (inputBusqueda && q) {
        inputBusqueda.value = q;
    }
    if (q && q.trim().length > 0) {
        buscarProductosEnAPI(q.trim());
    }
    else {
        const contenedor = document.getElementById("resultado-productos");
        if (contenedor)
            contenedor.innerHTML = `<p>Escribe algo en la barra de búsqueda para ver resultados.</p>`;
    }
    // permitir buscar otra cosa desde esta página (sin recargar): redirige hacia la misma página con nuevo q
    if (inputBusqueda) {
        inputBusqueda.addEventListener('keydown', (ev) => {
            if (ev.key === 'Enter') {
                const newQ = inputBusqueda.value.trim();
                if (!newQ)
                    return;
                window.location.href = `./Search.html?q=${encodeURIComponent(newQ)}`;
            }
        });
    }
    if (iconoBusqueda) {
        iconoBusqueda.addEventListener('click', () => {
            const newQ = inputBusqueda?.value.trim() || '';
            if (!newQ)
                return;
            window.location.href = `./Search.html?q=${encodeURIComponent(newQ)}`;
        });
    }
}
document.addEventListener('DOMContentLoaded', () => {
    inicializarPagina();
});
// @ts-ignore
;
window.buscarProductosEnAPI = buscarProductosEnAPI;
