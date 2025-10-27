(() => {
    // ====== MENÚ LATERAL ======
    const menuToggle = document.getElementById('menuToggle') as HTMLElement;
    const sidebar = document.getElementById('sidebar') as HTMLElement;
    const overlay = document.getElementById('overlay') as HTMLElement;
    // Función para alternar el menú lateral
    function toggleMenu() {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    }
    // Evento de clic para el botón del menú
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    // Evento de clic para el overlay
    if (overlay) {
        overlay.addEventListener('click', toggleMenu);
    }

    // ====== CONEXIÓN A LA API FLASK ======
    const API_BASE = "http://127.0.0.1:5000";

    // Construir producto
    function construirProducto(producto: any): string {
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
    async function buscarProductos(query: string) {
        // Crear contenedor de resultados
        const contenedor = document.getElementById("resultado-productos");
        if (!contenedor) return;
        // Mostrar mensaje de carga
        contenedor.innerHTML = `<p>Cargando...</p>`;
        // Realizar petición a la API
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
            // Construir HTML de productos, limitar a 50 resultados
            const html = data.items.slice(0, 50).map(construirProducto).join("");
            contenedor.innerHTML = html;

        } catch (err) {
            contenedor.innerHTML = `<p>Error de red al contactar la API.</p>`;
            console.error(err);
        }
    }
    // Inicializar buscador
    function inicializarBuscador() {
        // Obtener elementos del DOM
        const inputBusqueda = document.querySelector<HTMLInputElement>(".search-input");
        const iconoBusqueda = document.querySelector<HTMLImageElement>(".search-icon");

        if (!inputBusqueda) return;

        // enter en el input
        inputBusqueda.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter") {
                buscarProductos(inputBusqueda.value.trim());
            }
        });

        // click en la lupa
        if (iconoBusqueda) {
            iconoBusqueda.addEventListener("click", () => {
                buscarProductos(inputBusqueda.value.trim());
            });
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        inicializarBuscador();
    });
})();
