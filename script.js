

document.addEventListener('DOMContentLoaded', () => {
    // --- Initialize Theme Engine ---
    initThemeEngine();

    // --- Interactive Particle Canvas Backdrop ---
    initParticleCanvas();

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

    // --- Dynamic CV/Resume Actions Alert ---
    initResumeDownload();
});

/* 
========================================================================
   1. Theme Engine (Dark/Light Seamless Toggle)
========================================================================
*/
function initThemeEngine() {
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlNode = document.documentElement;

    // Check local storage or fallback to system defaults
    const cachedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const activeTheme = cachedTheme || (systemPrefersDark ? 'dark' : 'light');
    htmlNode.setAttribute('data-theme', activeTheme);

    // Toggle button listener
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlNode.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlNode.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Notify particle canvas of the theme swap to adjust colors dynamically
        if (window.updateCanvasColors) {
            window.updateCanvasColors(newTheme);
        }
    });
}

/* 
========================================================================
   2. Interactive Particle Canvas Backdrop
========================================================================
*/
function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let particleCount = 60;
    let maxDistance = 120;
    
    // Adjust colors depending on theme
    let particleColor = 'rgba(6, 182, 212, 0.4)';  // Neon Cyan
    let lineColor = 'rgba(139, 92, 246, 0.08)';    // Cyber Purple
    
    function setColorsByTheme(theme) {
        if (theme === 'dark') {
            particleColor = 'rgba(6, 182, 212, 0.4)';
            lineColor = 'rgba(139, 92, 246, 0.06)';
        } else {
            particleColor = 'rgba(59, 130, 246, 0.3)';   // Royal Cobalt Blue
            lineColor = 'rgba(99, 102, 241, 0.05)';     // Soft Indigo
        }
    }

    // Set initial colors
    setColorsByTheme(document.documentElement.getAttribute('data-theme'));

    // Expose color updater to the Theme Engine
    window.updateCanvasColors = (theme) => {
        setColorsByTheme(theme);
    };

    // Resize handler
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Adjust particle density for smaller viewports
        if (window.innerWidth < 768) {
            particleCount = 30;
            maxDistance = 80;
        } else {
            particleCount = 60;
            maxDistance = 120;
        }
        createParticles();
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce on boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = particleColor;
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < maxDistance) {
                    // Alpha based on proximity
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = lineColor;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        connectParticles();
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
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

    const phrases = [
        "BCA 5th Semester Student",
        "Full-Stack Web Developer",
        "Software Enthusiast",
        "Python Desktop Creator"
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            targetElement.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50; // Deletes faster
        } else {
            targetElement.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 100;
        }

        // State machines control timing
        if (!isDeleting && charIdx === currentPhrase.length) {
            typingSpeed = 1800; // Pause at end of writing
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typingSpeed = 500; // Small delay before starting next word
        }

        setTimeout(type, typingSpeed);
    }

    // Start loop
    setTimeout(type, 500);
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

    // Make Navbar Sticky & Compact on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Dynamic section scroll highlight
        let currentSectionId = 'home';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
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
   5. Mobile Drawer Navigation Menu (Hamburger Hamburger Toggle)
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
        
        // Prevent background scrolling while modal menu is open
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
                
                // If it is the skills panel section, animate the progress bars!
                const skillProgressBars = entry.target.querySelectorAll('.skill-progress');
                if (skillProgressBars.length > 0) {
                    skillProgressBars.forEach(bar => {
                        const progress = bar.getAttribute('data-progress');
                        bar.style.width = progress;
                    });
                }
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12, // Trigger when 12% visible
        rootMargin: '0px 0px -40px 0px'
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
            // Remove active states from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active state to clicked tab
            tab.classList.add('active');

            const targetPanelId = tab.getAttribute('data-target');
            
            // Toggle panels
            panels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.getAttribute('id') === targetPanelId) {
                    panel.classList.add('active');
                    
                    // Immediately trigger skill bar fills in this active tab
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
            // Remove active style from filters
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(10px)';

                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('fade-out');
                        
                        // Force brief layout cycle to re-animate cards gracefully
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 20);
                    } else {
                        card.classList.add('fade-out');
                    }
                }, 300);
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

    // Generate contribution cells for 53 columns * 7 rows (371 blocks)
    const totalCells = 53 * 7;
    
    // Seed high/low activity patterns to make simulation look highly authentic
    // e.g. weekends have slightly lower commits, mid-week has higher levels
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement('div');
        cell.classList.add('contrib-dot');
        
        // Generate random activity level with heavy skew towards level-0/1 (highly realistic)
        let level = 0;
        const seedVal = Math.random();
        
        if (seedVal > 0.90) {
            level = 4; // High activity
        } else if (seedVal > 0.78) {
            level = 3;
        } else if (seedVal > 0.60) {
            level = 2;
        } else if (seedVal > 0.28) {
            level = 1; // Small activity
        } else {
            level = 0; // Empty/No contributions
        }

        cell.classList.add(`level-${level}`);
        
        // Calculate dynamic dates for tooltips (purely details, premium quality)
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

        // Simple validation checks
        if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
            showToast("Please fill in all required inputs correctly.", false);
            return;
        }

        // Create standard submitting loader effect on submit button
        const submitBtn = form.querySelector('.submit-btn');
        const origContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Processing...</span>';

        // Mock network delay (1.5 seconds)
        setTimeout(() => {
            // Restore button
            submitBtn.disabled = false;
            submitBtn.innerHTML = origContent;

            // Trigger beautiful Toast popups
            showToast(`Thank you, ${nameInput.value.trim()}! Your message has been sent successfully.`, true);

            // Reset forms and trigger floating label resets
            form.reset();
        }, 1500);
    });

    function showToast(message, isSuccess) {
        toastMessage.textContent = message;
        toast.className = 'toast-banner'; // clear active state
        
        if (isSuccess) {
            toast.style.backgroundColor = '#10b981'; // Green
            toast.querySelector('.toast-icon').textContent = '✓';
        } else {
            toast.style.backgroundColor = '#ef4444'; // Red
            toast.querySelector('.toast-icon').textContent = '✗';
        }

        toast.classList.add('active');

        // Close after 4.5 seconds
        setTimeout(() => {
            toast.classList.remove('active');
        }, 4500);
    }
}

/* 
========================================================================
   11. Dynamic CV / Resume Download Trigger Actions
========================================================================
*/
function initResumeDownload() {
    const resumeBtn = document.getElementById('downloadResume');
    if (!resumeBtn) return;

    resumeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Show recruiter a clear, professional notification directing them to copy his profile
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = "Resume download initialized! Replace 'Resume' href in index.html with your actual CV link.";
        toast.style.backgroundColor = '#8b5cf6'; // Premium Purple
        toast.querySelector('.toast-icon').textContent = 'ℹ';
        
        toast.classList.add('active');
        setTimeout(() => {
            toast.classList.remove('active');
        }, 6000);
    });
}
