async function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (!element) return;

    try {
        const res = await fetch(file, { cache: "no-store" });
        const text = await res.text();

        // Parse the fetched HTML so we can handle <link>, <style> and <script>
        const tpl = document.createElement('template');
        tpl.innerHTML = text.trim();

        // Move/link <link rel="stylesheet"> and other head links to document.head (dedupe by href)
        const links = tpl.content.querySelectorAll('link[rel]');
        links.forEach(l => {
            const href = l.getAttribute('href');
            if (!href) return;
            const rel = l.getAttribute('rel');
            // avoid duplicating identical links
            const exists = Array.from(document.head.querySelectorAll('link[rel]')).some(h => h.getAttribute('href') === href && h.getAttribute('rel') === rel);
            if (!exists) document.head.appendChild(l.cloneNode(true));
            l.remove();
        });

        // Move any <style> blocks into document.head to ensure styles apply
        const styles = tpl.content.querySelectorAll('style');
        styles.forEach(s => {
            const styleEl = document.createElement('style');
            // preserve type if present
            if (s.type) styleEl.type = s.type;
            styleEl.textContent = s.textContent;
            document.head.appendChild(styleEl);
            s.remove();
        });

        // Collect scripts to execute after inserting markup
        const scripts = Array.from(tpl.content.querySelectorAll('script'));
        // Remove scripts from the fragment so they are not inert when we insert
        scripts.forEach(s => s.remove());

        // Insert remaining HTML into the target element
        element.innerHTML = tpl.innerHTML;

        // Execute scripts sequentially (await external script loads)
        for (const s of scripts) {
            const script = document.createElement('script');
            // copy common attributes
            if (s.type) script.type = s.type;
            if (s.hasAttribute('nomodule')) script.setAttribute('nomodule', '');
            if (s.hasAttribute('async')) script.async = true;
            if (s.hasAttribute('defer')) script.defer = true;
            if (s.integrity) script.integrity = s.integrity;
            if (s.crossOrigin) script.crossOrigin = s.crossOrigin;

            if (s.src) {
                script.src = s.src;
                // append to body so it executes and wait for load (don't fail hard on error)
                await new Promise((resolve) => {
                    script.onload = () => resolve();
                    script.onerror = () => resolve();
                    document.body.appendChild(script);
                });
            } else {
                script.textContent = s.textContent;
                document.body.appendChild(script);
            }
        }
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
    if (typeof initMobileSlides === "function") {
        try { initMobileSlides(); } catch (e) { console.warn('initMobileSlides error', e); }
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