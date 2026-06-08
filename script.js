
document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Theme Engine ---
    initThemeEngine();

    // --- Interactive Mesh Canvas Backdrop ---
    initMeshCanvas();

    // --- Typewriter Effect in Hero ---
    initTypewriter();

    // --- Header & Scroll Active Link Highlight ---
    initNavigationScroll();

    // --- Mobile Hamburger Menu ---
    initMobileMenu();

    // --- Scroll-Driven Reveal Animations (Intersection Observer) ---
    initScrollReveal();

    // --- Skill Tab Panel Switcher ---
    initSkillTabs();

    // --- Projects Category Filter ---
    initProjectFilters();

    // --- Dynamic Simulated GitHub Matrix ---
    initGitHubMatrix();

    // --- Contact Form Submission Handler ---
    initContactForm();
});



/* 
========================================================================
   1. Theme Engine (Dark/Light Seamless Toggle)
========================================================================
*/
function initThemeEngine() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlNode = document.documentElement;

    const cachedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const activeTheme = cachedTheme || (systemPrefersDark ? 'dark' : 'light');
    htmlNode.setAttribute('data-theme', activeTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlNode.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlNode.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Notify mesh canvas of the theme swap to adjust colors dynamically
        if (window.updateCanvasColors) {
            window.updateCanvasColors(newTheme);
        }
    });
}

/* 
========================================================================
   2. Slow Ambient Mesh Canvas Backdrop (Replacing Particles)
========================================================================
*/
function initMeshCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let meshNodes = [];
    const nodeCount = 4;
    
    // Warm tones corresponding to colors in dark/light mode
    let colors = [];
    
    function setColorsByTheme(theme) {
        if (theme === 'dark') {
            colors = [
                'rgba(212, 163, 115, 0.12)', // Warm Gold
                'rgba(163, 177, 155, 0.12)', // Sage Green
                'rgba(198, 138, 111, 0.08)', // Terracotta
                'rgba(181, 131, 90, 0.10)'   // Bronze
            ];
        } else {
            colors = [
                'rgba(181, 131, 90, 0.07)',  // Bronze
                'rgba(125, 140, 119, 0.07)', // Sage Green
                'rgba(169, 110, 91, 0.05)',  // Terracotta
                'rgba(140, 123, 108, 0.06)'  // Warm Gray
            ];
        }
        
        // Re-apply updated colors to existing nodes
        meshNodes.forEach((node, index) => {
            node.color = colors[index % colors.length];
        });
    }

    class MeshNode {
        constructor(index) {
            this.radius = Math.random() * 150 + 200; // Big soft nodes
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            // Extremely slow drift speed
            this.vx = (Math.random() - 0.5) * 0.15;
            this.vy = (Math.random() - 0.5) * 0.15;
            this.color = colors[index % colors.length];
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce on boundary boundaries with padding
            const pad = this.radius * 0.5;
            if (this.x < -pad || this.x > canvas.width + pad) this.vx = -this.vx;
            if (this.y < -pad || this.y > canvas.height + pad) this.vy = -this.vy;
        }

        draw() {
            // Draw a radial gradient circle to blend nicely
            const grad = ctx.createRadialGradient(this.x, this.y, 10, this.x, this.y, this.radius);
            grad.addColorStop(0, this.color);
            grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        }
    }

    function createNodes() {
        meshNodes = [];
        for (let i = 0; i < nodeCount; i++) {
            meshNodes.push(new MeshNode(i));
        }
    }

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // On very small screens, reduce the radius
        meshNodes.forEach(node => {
            if (window.innerWidth < 768) {
                node.radius = Math.random() * 100 + 130;
            } else {
                node.radius = Math.random() * 150 + 200;
            }
        });
    }

    // Set initial configuration
    setColorsByTheme(document.documentElement.getAttribute('data-theme'));
    createNodes();
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.updateCanvasColors = (theme) => {
        setColorsByTheme(theme);
    };

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw each blurred color cell
        meshNodes.forEach(node => {
            node.update();
            node.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

/* 
========================================================================
   3. Typewriter Effect in Hero Section
========================================================================
*/
function initTypewriter() {
    const targetElement = document.getElementById('typewriter');
    if (!targetElement) return;

    // Direct, natural copywriting phrases
    const phrases = [
        "writing clean code.",
        "building web tools.",
        "learning database design.",
        "studying systems development."
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            targetElement.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 40;
        } else {
            targetElement.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIdx === currentPhrase.length) {
            typingSpeed = 2200; // Pause at end of phrase
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typingSpeed = 400; // Pause before typing next phrase
        }

        setTimeout(type, typingSpeed);
    }

    setTimeout(type, 600);
}

/* 
========================================================================
   4. Navigation Active Section Scroll Highlighting
========================================================================
*/
function initNavigationScroll() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let currentSectionId = 'home';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 110;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
}

/* 
========================================================================
   5. Mobile Drawer Navigation Menu
========================================================================
*/
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!hamburger || !navMenu) return;

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        if (navMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }

    hamburger.addEventListener('click', toggleMenu);

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
}

/* 
========================================================================
   6. Scroll-Driven Reveal Animations (Native IntersectionObserver)
========================================================================
*/
function initScrollReveal() {
    const scrollItems = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate progress bars if present
                const skillProgressBars = entry.target.querySelectorAll('.skill-progress');
                if (skillProgressBars.length > 0) {
                    skillProgressBars.forEach(bar => {
                        const progress = bar.getAttribute('data-progress');
                        bar.style.width = progress;
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
    });

    scrollItems.forEach(item => {
        revealObserver.observe(item);
    });
}

/* 
========================================================================
   7. Skill Category panel Tabs Navigation
========================================================================
*/
function initSkillTabs() {
    const tabs = document.querySelectorAll('.skills-tab');
    const panels = document.querySelectorAll('.skills-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetPanelId = tab.getAttribute('data-target');
            
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.getAttribute('id') === targetPanelId) {
                    panel.classList.add('active');
                    
                    const progressBars = panel.querySelectorAll('.skill-progress');
                    progressBars.forEach(bar => {
                        const progress = bar.getAttribute('data-progress');
                        bar.style.width = progress;
                    });
                }
            });
        });
    });
}

/* 
========================================================================
   8. Projects Categories Filtering logic
========================================================================
*/
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                card.style.opacity = '0';
                card.style.transform = 'scale(0.97) translateY(5px)';

                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('fade-out');
                        
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 20);
                    } else {
                        card.classList.add('fade-out');
                    }
                }, 200);
            });
        });
    });
}

/* 
========================================================================
   9. Simulated Realistic GitHub Contribution Matrix
========================================================================
*/
function initGitHubMatrix() {
    const contribGrid = document.getElementById('contribGrid');
    if (!contribGrid) return;

    // 53 columns * 7 rows
    const totalCells = 53 * 7;
    
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('contrib-dot');
        
        let level = 0;
        const seedVal = Math.random();
        
        if (seedVal > 0.92) {
            level = 4;
        } else if (seedVal > 0.82) {
            level = 3;
        } else if (seedVal > 0.65) {
            level = 2;
        } else if (seedVal > 0.35) {
            level = 1;
        } else {
            level = 0;
        }

        cell.classList.add(`level-${level}`);
        
        // Tooltip dates calculation
        const daysAgo = totalCells - i;
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - daysAgo);
        
        const dateStr = targetDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        const commitCount = level === 0 ? 'No commits' : `${level * 2 - 1 + Math.floor(Math.random() * 2)} commits`;
        cell.setAttribute('title', `${commitCount} on ${dateStr}`);
        
        contribGrid.appendChild(cell);
    }
}

/* 
========================================================================
   10. Contact Form Submissions with Beautiful Toast Trigger
========================================================================
*/
function initContactForm() {
    const form = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    if (!form || !toast) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('formName');
        const emailInput = document.getElementById('formEmail');
        const subjectInput = document.getElementById('formSubject');
        const messageInput = document.getElementById('formMessage');

        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            showToast("Please fill in the required fields.", false);
            return;
        }

        const submitBtn = form.querySelector('.submit-btn');
        const origContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending...</span>';

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = origContent;

            showToast(`Thank you, ${nameInput.value.trim()}. Your message was sent successfully.`, true);
            form.reset();
        }, 1200);
    });

    function showToast(message, isSuccess) {
        toastMessage.textContent = message;
        toast.className = 'toast-banner';
        
        if (isSuccess) {
            toast.style.backgroundColor = 'var(--color-primary)';
            toast.style.color = 'var(--bg-main)';
            toast.querySelector('.toast-icon').textContent = '✓';
        } else {
            toast.style.backgroundColor = '#d35252';
            toast.style.color = '#ffffff';
            toast.querySelector('.toast-icon').textContent = '✗';
        }

        toast.classList.add('active');

        setTimeout(() => {
            toast.classList.remove('active');
        }, 4000);
    }
}


