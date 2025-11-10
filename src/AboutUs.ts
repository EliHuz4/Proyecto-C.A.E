// 1. MENÚ LATERAL
(() => {
    const menuToggle = document.getElementById('menuToggle') as HTMLElement | null;
    const sidebar = document.getElementById('sidebar') as HTMLElement | null;
    const overlay = document.getElementById('overlay') as HTMLElement | null;

    function toggleMenu() {
    if (!sidebar || !overlay) return;
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
