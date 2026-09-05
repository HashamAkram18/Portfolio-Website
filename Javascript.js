// ── Smooth scrolling for nav links ─────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
            // Close hamburger if open
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
        }
    });
});

// ── Contact form ────────────────────────────────────────────────────────────
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const form = event.target;
        fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                alert('Message sent successfully!');
                form.reset();
            } else {
                alert('Oops! There was a problem submitting your form.');
            }
        }).catch(() => {
            alert('Oops! There was a problem submitting your form.');
        });
    });
}

// ── Hamburger menu ──────────────────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
    });
}

// ── Scroll progress bar ─────────────────────────────────────────────────────
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
    if (progressBar) {
        const scrollTop  = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        progressBar.style.width = `${(scrollTop / scrollHeight) * 100}%`;
    }
}, { passive: true });

// ── Navbar glass effect on scroll ──────────────────────────────────────────
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 80);
    }
}, { passive: true });

// ── Active nav link detection ───────────────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navItems  = document.querySelectorAll('#nav-links a');

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navItems.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === `#${entry.target.id}`) {
                    link.classList.add('active-link');
                }
            });
        }
    });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

// ── Back to top button ──────────────────────────────────────────────────────
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
    if (backToTop) {
        backToTop.classList.toggle('visible', window.scrollY > 400);
    }
}, { passive: true });

if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ── Intersection Observer — fade-in sections ────────────────────────────────
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const fadeEls = document.querySelectorAll('section, .box, .experience-item, .skill-category, .stat-card');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fadeEls.forEach((el, i) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${(i % 4) * 80}ms`;
        fadeObserver.observe(el);
    });
}

// ── Stats counter animation ─────────────────────────────────────────────────
function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1500;
    const start    = performance.now();

    function update(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.floor(easeOutExpo(progress) * target);
        if (progress < 1) requestAnimationFrame(update);
        else el.textContent = target;
    }
    requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('.stat-number').forEach(animateCounter);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) statsObserver.observe(statsGrid);

// ── Typing effect (hero) ────────────────────────────────────────────────────
const roles  = ['AI/ML Engineer', 'LLM Developer', 'Deep Learning Specialist', 'RAG Systems Builder'];
const typedEl = document.getElementById('typed-text');

if (typedEl) {
    let roleIndex = 0, charIndex = 0, deleting = false;

    function type() {
        const current = roles[roleIndex];
        if (!deleting) {
            typedEl.textContent = current.slice(0, ++charIndex);
            if (charIndex === current.length) {
                deleting = true;
                setTimeout(type, 1800);
                return;
            }
        } else {
            typedEl.textContent = current.slice(0, --charIndex);
            if (charIndex === 0) {
                deleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
            }
        }
        setTimeout(type, deleting ? 40 : 80);
    }
    type();
}

// ── Hero particle canvas ────────────────────────────────────────────────────
(function () {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const COUNT = 70, MAX_DIST = 130;
    let W, H, particles = [], mouse = { x: null, y: null };

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    class Dot {
        constructor() { this.init(); }
        init() {
            this.x  = Math.random() * W;
            this.y  = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.55;
            this.vy = (Math.random() - 0.5) * 0.55;
            this.r  = Math.random() * 1.5 + 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W) this.vx *= -1;
            if (this.y < 0 || this.y > H) this.vy *= -1;
            if (mouse.x !== null) {
                const dx = mouse.x - this.x, dy = mouse.y - this.y;
                const d  = Math.hypot(dx, dy);
                if (d < 160) { this.x += dx * 0.012; this.y += dy * 0.012; }
            }
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(140,120,255,0.7)';
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = Array.from({ length: COUNT }, () => new Dot());
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        // Draw connection lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (d < MAX_DIST) {
                    const alpha = (1 - d / MAX_DIST) * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108,99,255,${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(loop);
    }

    canvas.addEventListener('mousemove', e => {
        const r = canvas.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });
    window.addEventListener('resize', () => { resize(); particles.forEach(p => p.init()); });

    init();
    loop();
})();

// ── BibTeX Citations Data & Modal Handlers ──────────────────────────────────
const bibtexEntries = {
    'sciml-pinn': `@article{akram2025sciml,
  title   = {SciML-PINN: Physics-Informed Neural Networks with Dynamically Balanced Residual Losses for Incompressible Fluid Dynamics},
  author  = {Akram, Hasham and SciML Research Group},
  journal = {arXiv preprint arXiv:2501.08942},
  year    = {2025},
  url     = {https://github.com/HashamAkram18}
}`,
    'adaptive-crag': `@techreport{akram2025adaptivecrag,
  title       = {Adaptive-CRAG: Self-Reflective Corrective RAG with Confidence-Gated Hybrid Retrieval for Regulatory Document Compliance},
  author      = {Akram, Hasham and Silicon Nexus AI Team},
  institution = {Silicon Nexus & Sprouto Groups Applied AI Lab},
  year        = {2025},
  url         = {https://github.com/HashamAkram18}
}`,
    'realtime-vton': `@article{akram2025vton,
  title   = {Real-Time Neural Virtual Try-On via Disentangled Latent Warping and TensorRT Quantization on Edge AR Mirrors},
  author  = {Akram, Hasham},
  journal = {Applied Computer Vision & AR Systems},
  year    = {2025},
  url     = {https://github.com/HashamAkram18}
}`,
    'seq2seq-urdu': `@article{akram2024crossattention,
  title   = {Cross-Attention Alignment in Low-Resource English-to-Urdu Sequence-to-Sequence Translation},
  author  = {Akram, Hasham},
  journal = {Deep Learning & NLP Research Notes},
  year    = {2024},
  url     = {https://github.com/HashamAkram18/CODXO_Translation_App_Using_Seq2Seq_Attention_PyTorchModel}
}`
};

function openBibtex(key) {
    const modal = document.getElementById('bibtex-modal');
    const codeEl = document.getElementById('bibtex-code');
    const titleEl = document.getElementById('modal-paper-title');
    if (!modal || !codeEl) return;
    
    const entry = bibtexEntries[key] || '';
    codeEl.textContent = entry;
    if (titleEl) {
        titleEl.textContent = `BibTeX Citation [${key}]`;
    }
    
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeBibtex() {
    const modal = document.getElementById('bibtex-modal');
    if (!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

function copyBibtex() {
    const codeEl = document.getElementById('bibtex-code');
    const btnText = document.getElementById('copy-btn-text');
    if (!codeEl) return;
    
    navigator.clipboard.writeText(codeEl.textContent).then(() => {
        if (btnText) {
            btnText.textContent = 'Copied to Clipboard!';
            setTimeout(() => {
                btnText.textContent = 'Copy to Clipboard';
            }, 2200);
        }
    }).catch(err => {
        console.error('Clipboard copy failed: ', err);
    });
}

// Close modal on click outside or Esc
window.addEventListener('click', (e) => {
    const modal = document.getElementById('bibtex-modal');
    if (e.target === modal) closeBibtex();
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeBibtex();
});

// ── Research Category Filter ────────────────────────────────────────────────
const filterButtons = document.querySelectorAll('.filter-btn');
const paperCards = document.querySelectorAll('.paper-card');

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        
        paperCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                card.classList.add('fade-in', 'visible');
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ── Render KaTeX Math when loaded ───────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    if (typeof renderMathInElement === 'function') {
        renderMathInElement(document.body, {
            delimiters: [
                {left: '$$', right: '$$', display: true},
                {left: '$', right: '$', display: false}
            ],
            throwOnError: false
        });
    }
});