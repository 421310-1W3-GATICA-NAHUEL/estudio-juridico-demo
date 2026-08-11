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

    // 4. FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            item.classList.toggle('active');
        });
    });

    // 5. Scroll Reveal Animation (Intersection Observer)
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

    // 6. Animated Counters for Stats
    const statsElements = document.querySelectorAll('.stat-number');
    let animated = false;
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statsElements.forEach(stat => {
                    const target = +stat.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            stat.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.innerText = target;
                        }
                    };
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });
    
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // 7. Hero Parallax Effect
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            heroBg.style.transform = `translateY(${scroll * 0.4}px)`;
        });
    }

    // 8. Services Modal
    const serviceData = {
        'corporativo': {
            title: 'Derecho Corporativo',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M3 7h18"/><path d="M6 7l-3 7s1 3 3 3 3-3 3-3l-3-7"/><path d="M18 7l-3 7s1 3 3 3 3-3 3-3l-3-7"/></svg>',
            body: '<p>Brindamos asesoramiento estratégico integral para empresas y corporaciones nacionales e internacionales.</p><ul><li>Fusiones y Adquisiciones (M&A).</li><li>Compliance y Auditoría Legal.</li><li>Estructuración de Sociedades Comerciales.</li><li>Contratos Comerciales y Financieros.</li></ul><p>Nuestro equipo actúa como un aliado estratégico, previniendo riesgos y optimizando la estructura jurídica de sus negocios.</p>'
        },
        'laboral': {
            title: 'Derecho Laboral',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
            body: '<p>Protegemos el capital humano y empresarial a través de estrategias preventivas y representación en conflictos.</p><ul><li>Negociaciones Sindicales complejas.</li><li>Desvinculaciones estratégicas y reestructuraciones.</li><li>Prevención de contingencias laborales.</li><li>Auditorías (Due Diligence laboral).</li></ul><p>Nos anticipamos a los problemas laborales para evitar litigios prolongados y costosos.</p>'
        },
        'civil': {
            title: 'Derecho Civil',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
            body: '<p>Atención personalizada para particulares de alto patrimonio en asuntos civiles complejos.</p><ul><li>Sucesiones y Planificación Patrimonial (Trusts, Fideicomisos).</li><li>Resolución de conflictos y mediación civil.</li><li>Derecho de Daños y Responsabilidad Civil.</li><li>Contratos Inmobiliarios de gran envergadura.</li></ul><p>Garantizamos confidencialidad absoluta y un trato humano y empático en situaciones delicadas.</p>'
        },
        'penal': {
            title: 'Derecho Penal Económico',
            icon: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-color)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
            body: '<p>Defensa técnica altamente especializada ante investigaciones y procesos penales complejos.</p><ul><li>Delitos de cuello blanco (White Collar Crimes).</li><li>Defensa en fraudes financieros, fiscales y corporativos.</li><li>Asesoramiento preventivo ante posibles delitos corporativos.</li><li>Prevención de lavado de activos.</li></ul><p>Representamos a directivos y corporaciones con el mayor nivel de discreción y pericia técnica.</p>'
        }
    };

    const modal = document.getElementById('service-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalIcon = document.getElementById('modal-icon');
    const closeBtn = document.querySelector('.modal-close');
    const modalCta = document.querySelector('.modal-cta');

    if(modal) {
        document.querySelectorAll('.service-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const service = link.getAttribute('data-service');
                const data = serviceData[service];
                
                if (data) {
                    modalTitle.innerText = data.title;
                    modalIcon.innerHTML = data.icon;
                    modalBody.innerHTML = data.body;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
                }
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        modalCta.addEventListener('click', () => {
            const currentService = modalTitle.innerText;
            const textarea = document.getElementById('mensaje');
            if (textarea && currentService) {
                textarea.value = `Deseo realizar una consulta confidencial con un especialista en ${currentService}.`;
                
                // Opcional: enfocar el primer campo del formulario después del scroll
                setTimeout(() => {
                    document.getElementById('nombre').focus();
                }, 800);
            }
            closeModal();
        });
    }

    // 9. Contact Form Logic (Captcha & Email Simulator)
    const contactForm = document.querySelector('.contact-form');
    const captchaCheckbox = document.getElementById('captcha-checkbox');
    const formError = document.getElementById('form-error');

    // Manejar Envío
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevenir recarga de página
            
            // Validar Captcha
            if (!captchaCheckbox.checked) {
                formError.innerText = "Error: Por favor, confirme que no es un robot.";
                formError.style.display = 'block';
                return;
            }
            formError.style.display = 'none';

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
                
                btnEmail.href = `mailto:${email}?subject=Respuesta a su solicitud - García & Asociados`;
                
                // Limpiar teléfono para WhatsApp (solo números)
                const cleanPhone = telefono.replace(/\D/g, '');
                if (cleanPhone) {
                    btnWa.href = `https://wa.me/${cleanPhone}?text=Hola%20${encodeURIComponent(nombre)},%20nos%20comunicamos%20del%20Estudio%20García%20%26%20Asociados...`;
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
            }
        });
    }
});
