document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    mobileBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // 3. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active');
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // 4. Acordeón genérico (situaciones, áreas y FAQ comparten el mismo patrón)
    document.querySelectorAll('.acc-list').forEach(list => {
        const items = list.querySelectorAll('.acc-item');
        items.forEach(item => {
            const trigger = item.querySelector('.acc-trigger');
            trigger.addEventListener('click', () => {
                items.forEach(other => {
                    if (other !== item) other.classList.remove('active');
                });
                item.classList.toggle('active');
            });
        });
    });

    // 5. Tabs (Cómo podemos ayudarte)
    const tabButtons = document.querySelectorAll('.help-tab-btn');
    const tabPanels = document.querySelectorAll('.help-tab-panel');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${target}`).classList.add('active');
        });
    });

    // 5b. Stepper "Cómo trabajamos": la línea se dibuja y los pasos se encienden en secuencia
    const timeline = document.querySelector('.process-timeline');
    if (timeline) {
        const steps = timeline.querySelectorAll('.process-step');
        const fill = timeline.querySelector('.process-track-fill');
        const timelineObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (fill) fill.style.width = '100%';
                    steps.forEach((step, i) => {
                        setTimeout(() => step.classList.add('active'), 300 + i * 260);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        timelineObserver.observe(timeline);
    }

    // 5c. Scroll-spy: resalta en el menú la sección que se está viendo
    const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
    const spySections = navAnchors
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);
    if (spySections.length) {
        const spyObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const link = navAnchors.find(a => a.getAttribute('href') === `#${entry.target.id}`);
                if (!link) return;
                if (entry.isIntersecting) {
                    navAnchors.forEach(a => a.classList.remove('active-link'));
                    link.classList.add('active-link');
                }
            });
        }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
        spySections.forEach(section => spyObserver.observe(section));
    }

    // 6. Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 6b. Vista previa de WhatsApp (demo de ventas): interceptar todos los links wa.me
    // del sitio y mostrar, antes de salir, cómo llega el mensaje al estudio.
    const waModal = document.getElementById('whatsapp-preview-modal');
    const waLinks = document.querySelectorAll('a[href^="https://wa.me/"]');
    if (waModal && waLinks.length) {
        const waText = document.getElementById('wa-preview-text');
        const waContinue = document.getElementById('wa-preview-continue');
        const waCloseBtn = waModal.querySelector('.wa-preview-close');

        const closeWaModal = () => {
            waModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        waLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                let msg = 'Hola, necesito hacer una consulta.';
                try {
                    const url = new URL(link.href);
                    msg = url.searchParams.get('text') || msg;
                } catch (err) { /* usar mensaje por defecto */ }

                waText.innerText = msg;
                waContinue.href = link.href;
                waModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        waCloseBtn.addEventListener('click', closeWaModal);
        waModal.addEventListener('click', (e) => {
            if (e.target === waModal) closeWaModal();
        });
        waContinue.addEventListener('click', () => {
            setTimeout(closeWaModal, 250);
        });
    }

    // 7. Contact Form Logic (Simulador de bandeja de entrada)
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevenir recarga de página

            // Obtener Datos
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value || 'No proporcionado';
            const mensaje = document.getElementById('mensaje').value || 'Sin descripción adicional.';

            // Mostrar en el Simulador
            const simModal = document.getElementById('email-simulator-modal');
            if (simModal) {
                document.getElementById('sim-nombre').innerText = nombre;
                document.getElementById('sim-email').innerText = email;
                document.getElementById('sim-telefono').innerText = telefono;
                document.getElementById('sim-mensaje').innerText = mensaje;

                // Configurar Botones
                const btnEmail = document.getElementById('sim-btn-email');
                const btnWa = document.getElementById('sim-btn-whatsapp');

                btnEmail.href = `mailto:${email}?subject=Respuesta a su consulta - Cejas & Asociados`;

                // Limpiar teléfono para WhatsApp (solo números)
                const cleanPhone = telefono.replace(/\D/g, '');
                if (cleanPhone) {
                    btnWa.href = `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(nombre)},%20nos%20comunicamos%20del%20Estudio%20Cejas%20%26%20Asociados...`;
                    btnWa.style.display = 'inline-block';
                } else {
                    btnWa.style.display = 'none'; // Ocultar si no hay teléfono
                }

                simModal.classList.add('active');
                document.body.style.overflow = 'hidden';

                // Lógica para cerrar el simulador
                const closeSimBtn = simModal.querySelector('.simulator-close');
                const closeSim = () => {
                    simModal.classList.remove('active');
                    document.body.style.overflow = '';
                    contactForm.reset();
                };

                // Remover listeners previos para evitar bugs si envían varias veces
                closeSimBtn.replaceWith(closeSimBtn.cloneNode(true));
                simModal.querySelector('.simulator-close').addEventListener('click', closeSim);
                simModal.addEventListener('click', (e) => {
                    if (e.target === simModal) closeSim();
                });
            }
        });
    }
});
