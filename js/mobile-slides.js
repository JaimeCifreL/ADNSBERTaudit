function initMobileSlides() {
    if (typeof window === 'undefined') return;

    const mq = window.matchMedia('(max-width: 899px)');
    if (!mq.matches) return; // only enable on small screens

    const sections = Array.from(document.querySelectorAll('main > section'));
    if (!sections.length) return;

    // wrap section content in .slide-card for a unified slide appearance (if not already)
    sections.forEach((sec) => {
        if (!sec.querySelector('.slide-card')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'slide-card';
            // move all children into wrapper
            while (sec.firstChild) wrapper.appendChild(sec.firstChild);
            sec.appendChild(wrapper);
        }
    });

    let touchStartY = null;

    function scrollToIndex(i) {
        i = Math.max(0, Math.min(sections.length - 1, i));
        sections[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // keyboard nav (up/down)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            const current = getCurrentIndex();
            scrollToIndex(current + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            const current = getCurrentIndex();
            scrollToIndex(current - 1);
        }
    });

    function getCurrentIndex() {
        const viewportTop = window.scrollY + 2; // slight offset
        for (let i = 0; i < sections.length; i++) {
            const rect = sections[i].getBoundingClientRect();
            const top = rect.top + window.scrollY;
            if (top >= viewportTop - 10) return i;
        }
        return sections.length - 1;
    }

    // simple touch swipe vertical
    document.addEventListener('touchstart', (e) => {
        if (e.touches && e.touches.length === 1) touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (touchStartY === null) return;
        const touchEndY = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientY : null;
        if (touchEndY === null) return;
        const dy = touchStartY - touchEndY;
        if (Math.abs(dy) < 40) { touchStartY = null; return; }
        const current = getCurrentIndex();
        if (dy > 0) {
            scrollToIndex(current + 1);
        } else {
            scrollToIndex(current - 1);
        }
        touchStartY = null;
    }, { passive: true });
}

// expose init for include.js
if (typeof window !== 'undefined') window.initMobileSlides = initMobileSlides;
