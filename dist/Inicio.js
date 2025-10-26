"use strict";
// Elementos del DOM
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
// Función para alternar el menú
function toggleMenu() {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}
// Event listeners
menuToggle.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);
// Cerrar el menú con la tecla Escape
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && sidebar.classList.contains('active')) {
        toggleMenu();
    }
});
