function initHeader() {
    const header = document.getElementById("siteHeader");
    if (!header) return;

    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;

    function updateHeaderOnScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        if (currentScroll <= 0) {
            header.classList.remove("hidden");
            lastScrollTop = 0;
            return;
        }

        if (currentScroll > lastScrollTop) {
            header.classList.add("hidden");
        } else {
            header.classList.remove("hidden");
        }

        lastScrollTop = currentScroll;
    }

    updateHeaderOnScroll();
    window.addEventListener("scroll", updateHeaderOnScroll);
    // --- Mobile menu toggle: injects a button and toggles `nav-open` on header ---
    const headerContainer = header.querySelector('.header-container');
    const nav = header.querySelector('.nav');
    if (headerContainer && nav) {
        const btn = document.createElement('button');
        btn.className = 'mobile-menu-toggle';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Abrir menú');
        btn.innerHTML = '<svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg"><rect y="0" width="20" height="2" rx="1" fill="currentColor"/><rect y="6" width="20" height="2" rx="1" fill="currentColor"/><rect y="12" width="20" height="2" rx="1" fill="currentColor"/></svg>';
        // place button at the end of header-container
        headerContainer.appendChild(btn);

        function toggleNav() {
            const isOpen = header.classList.toggle('nav-open');
            btn.setAttribute('aria-expanded', String(isOpen));
        }

        btn.addEventListener('click', toggleNav);

        // close menu when clicking outside or pressing Escape
        document.addEventListener('click', (e) => {
            if (!isOpenElement(header, e.target) && header.classList.contains('nav-open')) {
                header.classList.remove('nav-open');
                btn.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && header.classList.contains('nav-open')) {
                header.classList.remove('nav-open');
                btn.setAttribute('aria-expanded', 'false');
            }
        });

        function isOpenElement(root, target) {
            return root.contains(target) || target === btn;
        }
    }
}

// Inicializar dropdowns que vienen desde header.html insertado dinámicamente
function initHeaderDropdowns() {
    const toggle = document.getElementById("dropdownToggle");
    const parent = document.getElementById("dropdownQuienes");
    if (!toggle || !parent) return;

    function isMobile() {
        return window.matchMedia('(max-width: 768px)').matches;
    }

    // Establecer href apropiado según tamaño (empresa en móvil, # en escritorio)
    toggle.setAttribute('href', isMobile() ? 'empresa.html' : '#');

    toggle.addEventListener("click", function (e) {
        if (isMobile()) {
            return; // permitir navegación en móvil
        }
        e.preventDefault();
        parent.classList.toggle("open");
    });

    // actualizar al redimensionar
    window.addEventListener('resize', function () {
        toggle.setAttribute('href', isMobile() ? 'empresa.html' : '#');
    });

    // cerrar si clic fuera
    document.addEventListener("click", function (e) {
        if (!parent.contains(e.target)) {
            parent.classList.remove("open");
        }
    });
}

// Exponer para que include.js pueda llamarlo si lo desea
if (typeof window !== 'undefined') {
    window.initHeaderDropdowns = initHeaderDropdowns;
    window.initServiciosDropdown = initServiciosDropdown;
}

function initServiciosDropdown() {
    const header = document.getElementById("siteHeader");
    const servicios = document.getElementById("dropdownServicios");
    const toggleServicios = document.getElementById("serviciosToggle");
    const opciones = document.querySelectorAll(".servicio-opcion");
    const contenidos = document.querySelectorAll(".subopciones-grid");

    if (!header || !servicios || !toggleServicios) return;

    toggleServicios.addEventListener("click", function (e) {
        e.preventDefault();
        e.stopPropagation();

        servicios.classList.toggle("open");
        header.classList.toggle("servicios-open", servicios.classList.contains("open"));
    });

    opciones.forEach(function (opcion) {
        opcion.addEventListener("click", function (e) {
            e.preventDefault();
            e.stopPropagation();

            const servicio = opcion.dataset.servicio;

            opciones.forEach(btn => btn.classList.remove("active"));
            opcion.classList.add("active");

            contenidos.forEach(function (contenido) {
                contenido.classList.remove("active");

                if (contenido.dataset.contenido === servicio) {
                    contenido.classList.add("active");
                }
            });
        });
    });

    servicios.addEventListener("click", function (e) {
        e.stopPropagation();
    });

    document.addEventListener("click", function () {
        servicios.classList.remove("open");
        header.classList.remove("servicios-open");
    });
}