"use strict";
// 1. MENÚ LATERAL
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
