// 1. MENÚ LATERAL
(() => {
    const menuToggle = document.getElementById('menuToggle') as HTMLElement | null;
    const sidebar = document.getElementById('sidebar') as HTMLElement | null;
    const overlay = document.getElementById('overlay') as HTMLElement | null;

    function toggleMenu() {
        if (!sidebar || !overlay) return;
        sidebar.classList.toggle('open');
        overlay.classList.toggle('show');
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }

    if (overlay) {
        overlay.addEventListener('click', toggleMenu);
    }

})();
