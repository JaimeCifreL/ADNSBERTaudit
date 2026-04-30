async function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return;

    try {
        const res = await fetch(file, { cache: "no-store" });
        const text = await res.text();
        element.innerHTML = text;
    } catch (error) {
        console.warn(`Error cargando ${file}:`, error);
    }
}

window.addEventListener("DOMContentLoaded", async () => {
    await loadComponent("header", "header.html");
    await loadComponent("footer", "footer.html");

    if (typeof initHeader === "function") {
        initHeader();
    }
    if (typeof initHeaderDropdowns === "function") {
    initHeaderDropdowns();
    }

    if (typeof initServiciosDropdown === "function") {
        initServiciosDropdown();
    }
});

(function enablePWA() {
    try {
        if (!document.querySelector('link[rel="manifest"]')) {
            const link = document.createElement('link');
            link.rel = 'manifest';
            link.href = 'manifest.json';
            document.head.appendChild(link);
        }

        if (!document.querySelector('meta[name="theme-color"]')) {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = '#002079';
            document.head.appendChild(meta);
        }

        if (!document.querySelector('link[rel="icon"]')) {
            const icon = document.createElement('link');
            icon.rel = 'icon';
            icon.href = 'styles/img/ADNSBERTpwa192.png';
            document.head.appendChild(icon);
        }

        if (!document.querySelector('link[rel="apple-touch-icon"]')) {
            const apple = document.createElement('link');
            apple.rel = 'apple-touch-icon';
            apple.href = 'styles/img/ADNSBERTpwa192.png';
            document.head.appendChild(apple);
        }

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', async () => {
                try {
                    const reg = await navigator.serviceWorker.register('sw.js');
                    console.log('Service Worker registrado:', reg.scope);
                } catch (err) {
                    console.warn('Registro SW falló:', err);
                }
            });
        }
    } catch (e) {
        console.warn('Error habilitando PWA:', e);
    }
})();