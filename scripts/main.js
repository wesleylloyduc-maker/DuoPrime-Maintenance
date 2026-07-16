// ========================================
// DuoPrime Maintenance - Main JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeContactForm();
    initializeScrollAnimations();
});

// ========== NAVIGATION FUNCTIONS ==========
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                document.querySelector('.navbar-toggler').click();
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
}

// ========== CONTACT FORM FUNCTIONS ==========
function initializeContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const formElements = this.querySelectorAll('input, textarea');
    
    // Validate form
    if (!validateForm(formElements)) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    // Simulate form submission
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    // Simulate API call
    setTimeout(() => {
        showNotification('Thank you! Your message has been sent. We\'ll be in touch soon.', 'success');
        this.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
    }, 1500);
}

function validateForm(elements) {
    let isValid = true;
    
    elements.forEach(element => {
        if (element.required && !element.value.trim()) {
            isValid = false;
            element.classList.add('is-invalid');
        } else {
            element.classList.remove('is-invalid');
        }
        
        // Email validation
        if (element.type === 'email' && element.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(element.value)) {
                isValid = false;
                element.classList.add('is-invalid');
            }
        }
    });
    
    return isValid;
}

// ========== NOTIFICATION FUNCTION ==========
function showNotification(message, type = 'info') {
    const alertClass = type === 'success' ? 'alert-success' : type === 'error' ? 'alert-danger' : 'alert-info';
    const alertHtml = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert" style="position: fixed; top: 80px; right: 20px; z-index: 9999; max-width: 400px;">
            <strong>${type === 'success' ? 'Success!' : type === 'error' ? 'Error!' : 'Info'}</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const alertContainer = document.createElement('div');
    alertContainer.innerHTML = alertHtml;
    document.body.appendChild(alertContainer);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        const alert = alertContainer.querySelector('.alert');
        alert?.remove();
        alertContainer.remove();
    }, 5000);
}

// ========== SCROLL ANIMATIONS ==========
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: remove observer after animation
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add observer to elements that should animate
    document.querySelectorAll('.service-card, .why-card, .project-card, .contact-info').forEach(el => {
        el.classList.add('scroll-fade');
        observer.observe(el);
    });
}

// ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - 70;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========== UTILITY FUNCTIONS ==========

// Add animation to elements on page load
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Animate counters or numbers if present
    animateNumbers();
});

function animateNumbers() {
    const numberElements = document.querySelectorAll('[data-target]');
    
    numberElements.forEach(element => {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    });
}

// ========== MOBILE MENU HANDLING ==========
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                navbarCollapse.classList.remove('show');
            }
        });
    }
}

// ========== KEYBOARD ACCESSIBILITY ==========
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open modals or menus if needed
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
            document.querySelector('.navbar-toggler').click();
        }
    }
});

// ========== PERFORMANCE OPTIMIZATION ==========
let ticking = false;

window.addEventListener('scroll', function() {
    if (!ticking) {
        window.requestAnimationFrame(function() {
            updateActiveNavLink();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// ========== CONSOLE MESSAGES ==========
console.log('%cDuoPrime Maintenance', 'color: #D4AF37; font-size: 20px; font-weight: bold; text-shadow: 1px 1px #0B1E3D');
console.log('%cTransforming Spaces. Maintaining Standards.', 'color: #0B1E3D; font-size: 14px; font-style: italic');
console.log('📞 07759 656440 | 📧 DuoPrime@gmail.com | 🌐 www.duoprime247.co.uk');