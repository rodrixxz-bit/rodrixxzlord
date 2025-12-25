// Dark Mode Toggle
function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    
    // Toggle the theme
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    
    // Save the preference to localStorage
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    
    // Update the button icon
    updateThemeButton();
}

// Update the theme toggle button icon
function updateThemeButton() {
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    const themeToggle = document.getElementById('darkModeToggle');
    
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (isDark) {
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
}

// Check for saved user preference or use system preference
function initTheme() {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeButton();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Close the mobile menu when clicking outside
            if (navLinks.classList.contains('active')) {
                document.addEventListener('click', closeMobileMenu);
            } else {
                document.removeEventListener('click', closeMobileMenu);
            }
        });
    }
    
    // Close mobile menu when clicking outside
    function closeMobileMenu(e) {
        if (!e.target.closest('.nav-links') && !e.target.closest('.hamburger')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.removeEventListener('click', closeMobileMenu);
        }
    }

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Lightbox functionality
    function initLightbox() {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox) return;

        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const closeBtn = lightbox.querySelector('.close-lightbox');
        const prevBtn = lightbox.querySelector('.lightbox-nav.prev');
        const nextBtn = lightbox.querySelector('.lightbox-nav.next');
        
        let currentImageIndex = 0;
        let images = [];
        
        // Get all gallery images
        const galleryItems = document.querySelectorAll('.gallery-item img');
        galleryItems.forEach((img, index) => {
            if (img.dataset.full) {
                images.push({
                    src: img.dataset.full,
                    alt: img.alt,
                    caption: img.nextElementSibling?.textContent || ''
                });
                
                // Add click event to open lightbox
                img.addEventListener('click', (e) => {
                    e.preventDefault();
                    openLightbox(index);
                });
            }
        });

        // Open lightbox with specific image
        function openLightbox(index) {
            if (index >= 0 && index < images.length) {
                currentImageIndex = index;
                updateLightbox();
                lightbox.classList.add('show');
                document.body.style.overflow = 'hidden';
            }
        }
        
        // Update lightbox content
        function updateLightbox() {
            if (!images[currentImageIndex]) return;
            
            const image = images[currentImageIndex];
            lightboxImg.src = image.src;
            lightboxImg.alt = image.alt;
            lightboxCaption.textContent = image.caption;
            
            // Update button states
            if (prevBtn) prevBtn.style.display = currentImageIndex === 0 ? 'none' : 'flex';
            if (nextBtn) nextBtn.style.display = currentImageIndex === images.length - 1 ? 'none' : 'flex';
        }
        
        // Close lightbox
        function closeLightbox() {
            lightbox.classList.remove('show');
            document.body.style.overflow = '';
        }
        
        // Navigation functions
        function showPrev() {
            if (currentImageIndex > 0) {
                currentImageIndex--;
                updateLightbox();
            }
        }
        
        function showNext() {
            if (currentImageIndex < images.length - 1) {
                currentImageIndex++;
                updateLightbox();
            }
        }
        
        // Event listeners
        if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
        if (prevBtn) prevBtn.addEventListener('click', showPrev);
        if (nextBtn) nextBtn.addEventListener('click', showNext);
        
        // Close when clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('show')) return;
            
            switch (e.key) {
                case 'Escape':
                    closeLightbox();
                    break;
                case 'ArrowLeft':
                    showPrev();
                    break;
                case 'ArrowRight':
                    showNext();
                    break;
            }
        });
        
        // Touch events for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;
        
        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, false);
        
        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);
        
        function handleSwipe() {
            const swipeThreshold = 50;
            
            if (touchStartX - touchEndX > swipeThreshold) {
                showNext();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                showPrev();
            }
        }
    }
    
    // Initialize lightbox
    initLightbox();
    
    // Video click functionality
    const videoContainers = document.querySelectorAll('.video-container');
    videoContainers.forEach(container => {
        container.addEventListener('click', function() {
            const iframe = this.querySelector('iframe');
            const src = iframe.getAttribute('src');
            const videoId = src.match(/embed\/([^?]+)/);
            if (videoId) {
                // Open YouTube video in new tab
                window.open(`https://www.youtube.com/watch?v=${videoId[1]}`, '_blank');
            }
        });
    });

    // Mods Scrolling Frame Functionality
    const scrollFrame = document.getElementById('modsScrollFrame');
    const scrollPrev = document.getElementById('scrollPrev');
    const scrollNext = document.getElementById('scrollNext');
    const indicators = document.querySelectorAll('.indicator');
    const modItems = document.querySelectorAll('.mod-item');
    
    if (scrollFrame && scrollPrev && scrollNext && modItems.length > 0) {
        // Add click handlers to mod items
        modItems.forEach(item => {
            item.addEventListener('click', function() {
                const link = this.getAttribute('data-link');
                if (link) {
                    window.open(link, '_blank');
                }
            });
        });
        
        // Scroll functionality
        const itemHeight = 90; // Height of each mod item including margin
        const visibleItems = Math.floor(scrollFrame.offsetHeight / itemHeight);
        const maxScroll = modItems.length - visibleItems;
        
        function updateScrollPosition() {
            const currentScroll = scrollFrame.scrollTop;
            const currentIndex = Math.round(currentScroll / itemHeight);
            
            // Update indicators
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === currentIndex);
            });
            
            // Update button states
            scrollPrev.disabled = currentScroll <= 0;
            scrollNext.disabled = currentScroll >= maxScroll * itemHeight;
        }
        
        // Previous button click
        scrollPrev.addEventListener('click', function() {
            const currentScroll = scrollFrame.scrollTop;
            const newScroll = Math.max(0, currentScroll - itemHeight);
            scrollFrame.scrollTo({
                top: newScroll,
                behavior: 'smooth'
            });
        });
        
        // Next button click
        scrollNext.addEventListener('click', function() {
            const currentScroll = scrollFrame.scrollTop;
            const newScroll = Math.min(maxScroll * itemHeight, currentScroll + itemHeight);
            scrollFrame.scrollTo({
                top: newScroll,
                behavior: 'smooth'
            });
        });
        
        // Update scroll position on scroll
        scrollFrame.addEventListener('scroll', updateScrollPosition);
        
        // Initial update
        updateScrollPosition();
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (e.target.closest('#modsScrollFrame')) {
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    scrollPrev.click();
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    scrollNext.click();
                }
            }
        });
        
        // Mouse wheel support
        scrollFrame.addEventListener('wheel', function(e) {
            e.preventDefault();
            const delta = e.deltaY > 0 ? 1 : -1;
            const currentScroll = scrollFrame.scrollTop;
            const newScroll = Math.max(0, Math.min(maxScroll * itemHeight, currentScroll + (delta * itemHeight)));
            scrollFrame.scrollTo({
                top: newScroll,
                behavior: 'smooth'
            });
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.style.transform = 'translateY(0)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            return;
        }
        
        if (currentScroll > lastScroll && !navLinks.classList.contains('active')) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
            navbar.style.boxShadow = 'none';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
        
        lastScroll = currentScroll;
    });

    // Enhanced stats counter with smooth animation
    class Counter {
        constructor(element, target, duration = 2000) {
            this.element = element;
            this.target = parseInt(target);
            this.duration = duration;
            this.startTime = null;
            this.current = 0;
            this.easeOutQuart = t => 1 - (--t) * t * t * t;
            this.hasPlus = this.element.textContent.includes('+');
            
            // Clear the element and prepare for animation
            this.element.innerHTML = '';
            this.counterSpan = document.createElement('span');
            this.counterSpan.className = 'counter';
            this.counterSpan.textContent = '0';
            this.element.appendChild(this.counterSpan);
            
            if (this.hasPlus) {
                const plusSpan = document.createElement('span');
                plusSpan.className = 'plus';
                plusSpan.textContent = '+';
                this.element.appendChild(plusSpan);
            }
            
            // Add animation class
            this.counterSpan.classList.add('counter-animate');
        }
        
        start() {
            this.startTime = performance.now();
            this.animate();
        }
        
        animate() {
            const now = performance.now();
            const progress = Math.min((now - this.startTime) / this.duration, 1);
            const easeProgress = this.easeOutQuart(progress);
            
            this.current = Math.floor(this.target * easeProgress);
            this.counterSpan.textContent = this.current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(this.animate.bind(this));
            } else {
                this.counterSpan.textContent = this.target.toLocaleString();
                this.element.classList.add('completed');
            }
        }
    }

    // Initialize stats animation when they come into view
    function initStatsAnimation() {
        const statsSection = document.querySelector('.world-section');
        if (!statsSection) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stats = document.querySelectorAll('.stat-number');
                    let delay = 200; // Stagger delay between counters
                    
                    stats.forEach(stat => {
                        const target = stat.getAttribute('data-count');
                        if (target) {
                            setTimeout(() => {
                                const counter = new Counter(stat, target, 1800);
                                counter.start();
                            }, delay);
                            delay += 150; // Add delay for next counter
                        }
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observer.observe(statsSection);
    }

    initStatsAnimation();
});