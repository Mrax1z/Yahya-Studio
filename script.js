// PhotoBooking System - Main JavaScript File
// Ini adalah sistem booking fotografi dan videografi dengan live chat

class PhotoBookingSystem {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.initializeBookingSystem();
        this.initializeTestimonials();
        this.checkAdminStatus();
        this.initializeAnimations();
    }

    initializeElements() {
        // DOM Elements
        this.mobileMenuBtn = document.getElementById('mobile-menu-btn');
        this.navLinks = document.getElementById('nav-links');
        this.header = document.getElementById('header');
        
        // Booking System Elements
        this.steps = document.querySelectorAll('.step');
        this.bookingForms = document.querySelectorAll('.booking-form');
        this.packageOptions = document.querySelectorAll('.package-option');
        this.btnSelectPackage = document.querySelectorAll('.btn-select-package');
        
        // Testimonial Slider Elements
        this.testimonialSlides = document.querySelectorAll('.testimonial-slide');
        this.sliderDots = document.querySelectorAll('.slider-dot');

        // Portfolio filters and items
        this.filterAllBtn = document.getElementById('filter-all');
        this.filterPhotoBtn = document.getElementById('filter-photo');
        this.filterVideoBtn = document.getElementById('filter-video');
        this.portfolioItems = document.querySelectorAll('.portfolio-item');
        
        // Admin Access
        this.adminAccessBtn = document.getElementById('admin-access-btn');
        this.adminLoginModal = document.getElementById('admin-login-modal');
        this.adminLoginClose = document.getElementById('admin-login-close');
        this.adminLoginBtn = document.getElementById('admin-login-btn');
        
        // Current state
        this.currentStep = 1;
        this.selectedPackage = 'professional';
        this.currentSlide = 0;
        this.isAdminLoggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    }

    setupEventListeners() {
        // Header scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Mobile menu toggle (guarded)
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Close mobile menu when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Portfolio filter events
        if (this.filterAllBtn) this.filterAllBtn.addEventListener('click', () => this.filterPortfolio('all'));
        if (this.filterPhotoBtn) this.filterPhotoBtn.addEventListener('click', () => this.filterPortfolio('photo'));
        if (this.filterVideoBtn) this.filterVideoBtn.addEventListener('click', () => this.filterPortfolio('video'));

        // Portfolio video play/pause handlers
        if (this.portfolioItems && this.portfolioItems.length) {
            this.portfolioItems.forEach(item => {
                const playIcon = item.querySelector('.play-icon');
                const videoEl = item.querySelector('video');
                if (videoEl) {
                    // If there's an explicit play icon, attach handler
                    if (playIcon) {
                        playIcon.addEventListener('click', (e) => {
                            e.stopPropagation();
                            this.toggleVideo(videoEl, playIcon);
                        });
                    }

                    // Clicking the video toggles play/pause even if there's no play-icon
                    videoEl.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.toggleVideo(videoEl, playIcon);
                    });

                    videoEl.addEventListener('ended', () => {
                        if (playIcon) playIcon.innerHTML = '<i class="fas fa-play"></i>';
                        videoEl.controls = false;
                    });
                }
            });
        }

        // Close mobile menu when clicking outside (mobile only)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && this.navLinks) {
                const isOpen = this.navLinks.classList.contains('active') || this.navLinks.classList.contains('open');
                if (!isOpen) return;
                const clickedInside = this.navLinks.contains(e.target) || (this.mobileMenuBtn && this.mobileMenuBtn.contains(e.target));
                if (!clickedInside) this.closeMobileMenu();
            }
        });
        
        // Admin access button
        this.adminAccessBtn.addEventListener('click', () => this.showAdminLogin());
        this.adminLoginClose.addEventListener('click', () => this.hideAdminLogin());
        this.adminLoginBtn.addEventListener('click', () => this.handleAdminLogin());
        
        // Close modal when clicking outside
        this.adminLoginModal.addEventListener('click', (e) => {
            if (e.target === this.adminLoginModal) {
                this.hideAdminLogin();
            }
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.handleSmoothScroll(e, anchor));
        });
        
        // Initialize animations on load
        window.addEventListener('load', () => this.initializeOnLoad());
    }

    initializeBookingSystem() {
        // Package selection
        this.packageOptions.forEach(option => {
            option.addEventListener('click', () => this.selectPackage(option));
        });
        
        // Package selection buttons in pricing section
        this.btnSelectPackage.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const packageType = btn.getAttribute('data-package');
                this.selectPackageFromButton(packageType);
                // Scroll to booking section
                document.getElementById('booking-flow').scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // Step navigation
        document.getElementById('next-to-step-2').addEventListener('click', () => this.goToStep(2));
        document.getElementById('next-to-step-3').addEventListener('click', () => this.goToStep(3));
        document.getElementById('next-to-step-4').addEventListener('click', () => this.goToStep(4));
        document.getElementById('back-to-step-1').addEventListener('click', () => this.goToStep(1));
        document.getElementById('back-to-step-2').addEventListener('click', () => this.goToStep(2));
        document.getElementById('back-to-step-3').addEventListener('click', () => this.goToStep(3));
        
        // Submit booking
        document.getElementById('submit-booking').addEventListener('click', () => this.submitBooking());
        
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('event-date').min = today;
    }

    initializeTestimonials() {
        // Testimonial slider functionality
        this.sliderDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.showSlide(index));
        });
        
        // Auto-advance slides every 5 seconds
        setInterval(() => {
            this.currentSlide = (this.currentSlide + 1) % this.testimonialSlides.length;
            this.showSlide(this.currentSlide);
        }, 5000);
    }

    initializeAnimations() {
        // Initialize elements with animation
        document.querySelectorAll('.service-card, .portfolio-item, .pricing-card').forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        });
    }

    handleScroll() {
        // Header scroll effect
        if (window.scrollY > 50) {
            this.header.classList.add('scrolled');
        } else {
            this.header.classList.remove('scrolled');
        }
        
        // Add fade-in animation on scroll
        const elements = document.querySelectorAll('.service-card, .portfolio-item, .pricing-card');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    toggleMobileMenu() {
        if (!this.navLinks) return;
        // Toggle both class variants used in CSS (.active older, .open newer)
        this.navLinks.classList.toggle('active');
        this.navLinks.classList.toggle('open');
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.innerHTML = (this.navLinks.classList.contains('open') || this.navLinks.classList.contains('active'))
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        }
    }

    closeMobileMenu() {
        if (!this.navLinks) return;
        this.navLinks.classList.remove('active');
        this.navLinks.classList.remove('open');
        if (this.mobileMenuBtn) this.mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }

    showAdminLogin() {
        this.adminLoginModal.classList.add('active');
        document.getElementById('admin-username').focus();
    }

    hideAdminLogin() {
        this.adminLoginModal.classList.remove('active');
    }

    handleAdminLogin() {
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;
        
        // Demo credentials - in production, this should be handled by a backend
        if (username === 'admin' && password === 'password123') {
            localStorage.setItem('isAdminLoggedIn', 'true');
            this.isAdminLoggedIn = true;
            this.hideAdminLogin();
            
            // Redirect to admin dashboard
            window.location.href = 'admin.html';
        } else {
            alert('Invalid credentials. Use admin / password123 for demo.');
        }
    }

    handleSmoothScroll(e, anchor) {
        e.preventDefault();
        
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (this.navLinks.classList.contains('active')) {
                this.closeMobileMenu();
            }
        }
    }

    selectPackage(option) {
        this.packageOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        this.selectedPackage = option.getAttribute('data-package');
    }

    selectPackageFromButton(packageType) {
        // Find and select the corresponding package option
        this.packageOptions.forEach(option => {
            if (option.getAttribute('data-package') === packageType.toLowerCase()) {
                option.classList.add('selected');
                this.selectedPackage = packageType.toLowerCase();
            } else {
                option.classList.remove('selected');
            }
        });
        
        // Go to booking step 1
        this.goToStep(1);
    }

    goToStep(step) {
        // Validate current step before proceeding
        if (step > 1 && !this.validateStep(step - 1)) {
            return;
        }
        
        // Update steps
        this.steps.forEach(s => {
            s.classList.remove('active', 'completed');
        });
        
        for (let i = 0; i < step; i++) {
            this.steps[i].classList.add('completed');
        }
        
        this.steps[step-1].classList.add('active');
        
        // Update forms
        this.bookingForms.forEach(form => form.classList.remove('active'));
        document.getElementById(`form-step-${step}`).classList.add('active');
        
        this.currentStep = step;
        
        // Update summary on last step
        if (step === 4) {
            this.updateBookingSummary();
        }
        
        // Scroll to top of booking form
        document.querySelector('.booking-form-container').scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }

    validateStep(step) {
        if (step === 1) {
            // Step 1 validation - package selected
            if (!this.selectedPackage) {
                alert('Please select a package before proceeding.');
                return false;
            }
            return true;
        } else if (step === 2) {
            // Step 2 validation - client details
            const name = document.getElementById('client-name').value;
            const email = document.getElementById('client-email').value;
            const phone = document.getElementById('client-phone').value;
            const eventType = document.getElementById('event-type').value;
            
            if (!name || !email || !phone || !eventType) {
                alert('Please fill in all required fields.');
                return false;
            }
            
            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return false;
            }
            
            return true;
        } else if (step === 3) {
            // Step 3 validation - date and time
            const date = document.getElementById('event-date').value;
            const time = document.getElementById('event-time').value;
            const location = document.getElementById('event-location').value;
            
            if (!date || !time || !location) {
                alert('Please fill in all required fields.');
                return false;
            }
            
            return true;
        }
        
        return true;
    }

    updateBookingSummary() {
        // Update package summary
        let packageText = '';
        let packagePrice = '';
        
        switch(this.selectedPackage) {
            case 'basic':
                packageText = 'Basic - $499';
                packagePrice = '$499';
                break;
            case 'professional':
                packageText = 'Professional - $899';
                packagePrice = '$899';
                break;
            case 'cinematic':
                packageText = 'Cinematic - $1,499';
                packagePrice = '$1,499';
                break;
        }
        
        document.getElementById('summary-package').textContent = packageText;
        
        // Update client details
        document.getElementById('summary-name').textContent = document.getElementById('client-name').value;
        document.getElementById('summary-email').textContent = document.getElementById('client-email').value;
        document.getElementById('summary-phone').textContent = document.getElementById('client-phone').value;
        
        // Update date and time
        const date = new Date(document.getElementById('event-date').value);
        const formattedDate = date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        document.getElementById('summary-date').textContent = formattedDate;
        document.getElementById('summary-time').textContent = document.getElementById('event-time').options[document.getElementById('event-time').selectedIndex].text;
        document.getElementById('summary-location').textContent = document.getElementById('event-location').value;
        
        // Save booking data to localStorage for admin access
        this.saveBookingToStorage(packageText, packagePrice);
    }

    saveBookingToStorage(packageText, packagePrice) {
        const bookingData = {
            id: Date.now(),
            package: packageText,
            price: packagePrice,
            clientName: document.getElementById('client-name').value,
            clientEmail: document.getElementById('client-email').value,
            clientPhone: document.getElementById('client-phone').value,
            eventType: document.getElementById('event-type').options[document.getElementById('event-type').selectedIndex].text,
            eventDate: document.getElementById('event-date').value,
            eventTime: document.getElementById('event-time').options[document.getElementById('event-time').selectedIndex].text,
            eventLocation: document.getElementById('event-location').value,
            eventNotes: document.getElementById('event-notes').value,
            status: 'pending',
            timestamp: new Date().toISOString()
        };
        
        // Get existing bookings from localStorage
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        
        // Add new booking
        bookings.push(bookingData);
        
        // Save back to localStorage
        localStorage.setItem('bookings', JSON.stringify(bookings));
        
        // Also add to recent bookings for admin dashboard
        let recentBookings = JSON.parse(localStorage.getItem('recentBookings')) || [];
        recentBookings.unshift(bookingData);
        
        // Keep only last 10 bookings
        if (recentBookings.length > 10) {
            recentBookings = recentBookings.slice(0, 10);
        }
        
        localStorage.setItem('recentBookings', JSON.stringify(recentBookings));
    }

    submitBooking() {
        // Validate all fields
        if (!this.validateStep(1) || !this.validateStep(2) || !this.validateStep(3)) {
            alert('Please complete all required fields correctly.');
            return;
        }
        
        // Show success message
        alert('Booking confirmed! Thank you for choosing Lumière Studio. We will contact you shortly to confirm details.');
        
        // Reset form and go back to step 1
        this.goToStep(1);
        
        // Clear form fields
        document.getElementById('booking-form').reset();
        
        // Reset package selection
        this.packageOptions.forEach(opt => opt.classList.remove('selected'));
        document.querySelector('.package-option[data-package="professional"]').classList.add('selected');
        this.selectedPackage = 'professional';
        
        // Show notification in admin chat if admin is online
        this.notifyAdminOfNewBooking();
    }

    notifyAdminOfNewBooking() {
        // Get client name for notification
        const clientName = document.getElementById('client-name').value;
        
        // Create notification for admin
        const notification = {
            type: 'new_booking',
            clientName: clientName,
            timestamp: new Date().toISOString(),
            read: false
        };
        
        // Save to localStorage for admin to see
        let adminNotifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
        adminNotifications.push(notification);
        localStorage.setItem('adminNotifications', JSON.stringify(adminNotifications));
        
        // Update admin notification count
        this.updateAdminNotificationCount();
    }

    updateAdminNotificationCount() {
        const notifications = JSON.parse(localStorage.getItem('adminNotifications')) || [];
        const unreadCount = notifications.filter(n => !n.read).length;
        
        // Update badge in admin interface if we're on admin page
        if (window.location.pathname.includes('admin.html')) {
            const notificationBadge = document.getElementById('admin-notification-badge');
            if (notificationBadge) {
                if (unreadCount > 0) {
                    notificationBadge.textContent = unreadCount;
                    notificationBadge.style.display = 'flex';
                } else {
                    notificationBadge.style.display = 'none';
                }
            }
        }
    }

    showSlide(index) {
        this.testimonialSlides.forEach(slide => slide.classList.remove('active'));
        this.sliderDots.forEach(dot => dot.classList.remove('active'));
        
        this.testimonialSlides[index].classList.add('active');
        this.sliderDots[index].classList.add('active');
        this.currentSlide = index;
    }

    /* Portfolio filtering: type = 'all' | 'photo' | 'video' */
    filterPortfolio(type) {
        if (!this.portfolioItems) return;

        // Toggle active class on buttons (if present)
        const setActive = (btn) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
        };

        if (type === 'all') setActive(this.filterAllBtn);
        if (type === 'photo') setActive(this.filterPhotoBtn);
        if (type === 'video') setActive(this.filterVideoBtn);

        this.portfolioItems.forEach(item => {
            const itemType = item.getAttribute('data-type') || 'photo';
            if (type === 'all' || itemType === type) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    }

    toggleVideo(videoEl, iconEl) {
        if (!videoEl) return;

        // If another video is playing, pause it (optional):
        document.querySelectorAll('.portfolio-item video').forEach(v => {
            if (v !== videoEl) {
                v.pause();
                v.controls = false;
                const otherIcon = v.closest('.portfolio-item')?.querySelector('.play-icon');
                if (otherIcon) otherIcon.innerHTML = '<i class="fas fa-play"></i>';
            }
        });

        if (videoEl.paused) {
            videoEl.play();
            videoEl.controls = true;
            if (iconEl) iconEl.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            videoEl.pause();
            videoEl.controls = false;
            if (iconEl) iconEl.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    checkAdminStatus() {
        // Check if admin is logged in and update UI
        if (this.isAdminLoggedIn) {
            // If we're on the main page and admin is logged in, show admin panel link
            if (!window.location.pathname.includes('admin.html')) {
                this.adminAccessBtn.innerHTML = '<button class="btn-primary" style="padding: 10px 20px;"><i class="fas fa-tachometer-alt"></i> Admin Panel</button>';
                this.adminAccessBtn.querySelector('button').addEventListener('click', () => {
                    window.location.href = 'admin.html';
                });
            }
        }
    }

    initializeOnLoad() {
        // Trigger scroll to activate scroll animations
        window.dispatchEvent(new Event('scroll'));
        
        // Initialize first testimonial slide
        this.showSlide(0);
        
        // Check for any admin notifications
        this.updateAdminNotificationCount();
    }
}

// Initialize the system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof flatpickr !== 'undefined') {
        try {
            flatpickr("#event-date", { dateFormat: "Y-m-d", minDate: "today", allowInput: true });
        } catch (e) {
            console.warn('flatpickr init failed:', e);
        }
    }
    window.bookingSystem = new PhotoBookingSystem();
});

// Expose a global function so inline onclick handlers keep working
window.toggleVideo = function(videoEl, iconEl) {
    const bs = window.bookingSystem;
    if (bs && typeof bs.toggleVideo === 'function') {
        bs.toggleVideo(videoEl, iconEl);
    } else if (videoEl) {
        // fallback
        if (videoEl.paused) videoEl.play(); else videoEl.pause();
    }
};

 // Search System
        class SearchSystem {
            constructor() {
                this.searchToggle = document.getElementById('search-toggle');
                this.searchBox = document.getElementById('search-box');
                this.searchInput = document.getElementById('search-input');
                this.searchBtn = document.getElementById('search-btn');
                this.searchModal = document.getElementById('search-modal');
                this.searchModalClose = document.getElementById('search-modal-close');
                this.searchResults = document.getElementById('search-results');

                this.init();
            }

            init() {
                // Toggle search box
                this.searchToggle.addEventListener('click', () => this.toggleSearch());

                // Search button click
                this.searchBtn.addEventListener('click', () => this.performSearch());

                // Search on Enter key
                this.searchInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.performSearch();
                    }
                });

                // Close search modal
                this.searchModalClose.addEventListener('click', () => this.closeSearchModal());

                // Close modal when clicking outside
                this.searchModal.addEventListener('click', (e) => {
                    if (e.target === this.searchModal) {
                        this.closeSearchModal();
                    }
                });

                // Close search box when clicking outside on mobile
                document.addEventListener('click', (e) => {
                    if (!this.searchBox.contains(e.target) &&
                        !this.searchToggle.contains(e.target) &&
                        window.innerWidth <= 768) {
                        this.searchBox.classList.remove('active');
                    }
                });
            }

            toggleSearch() {
                // On small screens open the full-screen search modal for better UX
                if (window.innerWidth <= 768) {
                    if (this.searchModal) {
                        this.searchModal.classList.add('active');
                        if (this.searchInput) this.searchInput.focus();
                    } else if (this.searchBox) {
                        this.searchBox.classList.toggle('active');
                        if (this.searchBox.classList.contains('active') && this.searchInput) this.searchInput.focus();
                    }
                } else {
                    if (this.searchBox) {
                        this.searchBox.classList.toggle('active');
                        if (this.searchBox.classList.contains('active') && this.searchInput) this.searchInput.focus();
                    }
                }
            }

            performSearch() {
                const query = this.searchInput.value.trim().toLowerCase();

                if (!query) {
                    this.showNoResults("Please enter a search term");
                    return;
                }

                // Clear previous results
                this.searchResults.innerHTML = '';

                // Perform search
                const results = this.searchContent(query);

                // Show results
                this.displayResults(results, query);

                // Clear input
                this.searchInput.value = '';

                // Close search box on mobile
                if (window.innerWidth <= 768) {
                    this.searchBox.classList.remove('active');
                }
            }

            searchContent(query) {
                const results = [];

                // Search in services
                const serviceCards = document.querySelectorAll('.service-card');
                serviceCards.forEach(card => {
                    const searchData = card.getAttribute('data-search') || '';
                    const title = card.querySelector('h3')?.textContent || '';
                    const description = card.querySelector('p')?.textContent || '';

                    const allText = (searchData + ' ' + title + ' ' + description).toLowerCase();

                    if (allText.includes(query)) {
                        results.push({
                            type: 'service',
                            title: title,
                            description: description,
                            element: card,
                            section: '#services'
                        });
                    }
                });

                // Search in portfolio
                const portfolioItems = document.querySelectorAll('.portfolio-item');
                portfolioItems.forEach(item => {
                    const searchData = item.getAttribute('data-search') || '';
                    const title = item.querySelector('h3')?.textContent || '';
                    const description = item.querySelector('p')?.textContent || '';

                    const allText = (searchData + ' ' + title + ' ' + description).toLowerCase();

                    if (allText.includes(query)) {
                        results.push({
                            type: 'portfolio',
                            title: title,
                            description: description,
                            element: item,
                            section: '#portfolio'
                        });
                    }
                });

                // Search in pricing
                const pricingCards = document.querySelectorAll('.pricing-card');
                pricingCards.forEach(card => {
                    const searchData = card.getAttribute('data-search') || '';
                    const title = card.querySelector('h3')?.textContent || '';
                    const price = card.querySelector('.pricing-price')?.textContent || '';

                    const allText = (searchData + ' ' + title + ' ' + price).toLowerCase();

                    if (allText.includes(query)) {
                        results.push({
                            type: 'pricing',
                            title: title,
                            description: `Package: ${price}`,
                            element: card,
                            section: '#pricing'
                        });
                    }
                });

                // Search in testimonials
                const testimonialSlides = document.querySelectorAll('.testimonial-slide');
                testimonialSlides.forEach(slide => {
                    const searchData = slide.getAttribute('data-search') || '';
                    const feedback = slide.querySelector('.client-feedback')?.textContent || '';
                    const name = slide.querySelector('.client-name')?.textContent || '';

                    const allText = (searchData + ' ' + feedback + ' ' + name).toLowerCase();

                    if (allText.includes(query)) {
                        results.push({
                            type: 'testimonial',
                            title: `Testimonial from ${name}`,
                            description: feedback.substring(0, 100) + '...',
                            element: slide,
                            section: '#testimonials'
                        });
                    }
                });

                // Search in navigation links
                const navLinks = document.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    const text = link.textContent.toLowerCase();
                    if (text.includes(query)) {
                        const href = link.getAttribute('href');
                        results.push({
                            type: 'navigation',
                            title: text.charAt(0).toUpperCase() + text.slice(1),
                            description: `Go to ${text} section`,
                            element: link,
                            section: href
                        });
                    }
                });

                return results;
            }

            displayResults(results, query) {
                if (results.length === 0) {
                    this.showNoResults(`No results found for "${query}"`);
                    return;
                }

                // Create results list
                const resultsList = document.createElement('div');
                resultsList.className = 'results-list';

                // Add results count
                const countElement = document.createElement('div');
                countElement.className = 'results-count';
                countElement.textContent = `${results.length} results found for "${query}"`;
                resultsList.appendChild(countElement);

                // Add each result
                results.forEach(result => {
                    const resultElement = document.createElement('div');
                    resultElement.className = 'result-item';
                    resultElement.innerHTML = `
                        <div class="result-type">${result.type}</div>
                        <h4 class="result-title">${result.title}</h4>
                        <p class="result-description">${result.description}</p>
                        <button class="result-action" data-section="${result.section}">View</button>
                    `;

                    // Add click event to result action button
                    const actionBtn = resultElement.querySelector('.result-action');
                    actionBtn.addEventListener('click', () => {
                        this.navigateToSection(result.section);
                        this.closeSearchModal();
                    });

                    // Also make the whole result item clickable
                    resultElement.addEventListener('click', (e) => {
                        if (!e.target.classList.contains('result-action')) {
                            this.navigateToSection(result.section);
                            this.closeSearchModal();
                        }
                    });

                    resultsList.appendChild(resultElement);
                });

                this.searchResults.appendChild(resultsList);
                this.searchModal.classList.add('active');
            }

            showNoResults(message) {
                this.searchResults.innerHTML = `
                    <div class="no-results">
                        <i class="fas fa-search fa-3x"></i>
                        <h4>${message}</h4>
                        <p>Try searching for: wedding, event, product, cinematic, basic, professional, portfolio</p>
                    </div>
                `;
                this.searchModal.classList.add('active');
            }

            navigateToSection(sectionId) {
                const section = document.querySelector(sectionId);
                if (section) {
                    window.scrollTo({
                        top: section.offsetTop - 100,
                        behavior: 'smooth'
                    });

                    // Add highlight effect
                    section.style.boxShadow = '0 0 0 3px var(--accent)';
                    setTimeout(() => {
                        section.style.boxShadow = '';
                    }, 2000);
                }
            }

            closeSearchModal() {
                this.searchModal.classList.remove('active');
            }
        }

        // Initialize search system when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            window.searchSystem = new SearchSystem();
        });

        // Update booking steps navigation
function updateBookingSteps(currentStep) {
    // Update step indicators
    document.querySelectorAll('.step').forEach((step, index) => {
        if (index < currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Show corresponding form step
    document.querySelectorAll('.booking-form').forEach((form, index) => {
        if (index === currentStep - 1) {
            form.classList.add('active');
        } else {
            form.classList.remove('active');
        }
    });
    
    // Scroll to booking section on mobile
    if (window.innerWidth < 768) {
        document.getElementById('booking-flow').scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize booking steps
document.addEventListener('DOMContentLoaded', function() {
    // Package selection
    document.querySelectorAll('.package-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.package-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Update payment summary
            updatePaymentSummary();
        });
    });
    
    // Payment method selection
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.classList.remove('selected');
                opt.querySelector('.payment-radio i').className = 'far fa-circle';
            });
            this.classList.add('selected');
            this.querySelector('.payment-radio i').className = 'fas fa-check-circle';
            
            // Show corresponding payment instructions
            const method = this.getAttribute('data-method');
            document.querySelectorAll('.payment-instructions').forEach(instruction => {
                instruction.classList.remove('active');
            });
            document.getElementById(`${method}-instructions`).classList.add('active');
            
            // Update payment method in summary
            updatePaymentSummary();
        });
    });
    
    // Next to step 2
    document.getElementById('next-to-step-2')?.addEventListener('click', () => updateBookingSteps(2));
    
    // Back to step 1
    document.getElementById('back-to-step-1')?.addEventListener('click', () => updateBookingSteps(1));
    
    // Next to step 3
    document.getElementById('next-to-step-3')?.addEventListener('click', () => {
        // Validate form step 2
        const name = document.getElementById('client-name').value;
        const email = document.getElementById('client-email').value;
        const phone = document.getElementById('client-phone').value;
        const eventType = document.getElementById('event-type').value;
        
        if (!name || !email || !phone || !eventType) {
            alert('Please fill all required fields in Your Details');
            return;
        }
        
        updateBookingSteps(3);
    });
    
    // Back to step 2
    document.getElementById('back-to-step-2')?.addEventListener('click', () => updateBookingSteps(2));
    
    // Next to step 4 (Payment)
    document.getElementById('next-to-step-4')?.addEventListener('click', () => {
        // Validate form step 3
        const eventDate = document.getElementById('event-date').value;
        const eventTime = document.getElementById('event-time').value;
        const eventLocation = document.getElementById('event-location').value;
        
        if (!eventDate || !eventTime || !eventLocation) {
            alert('Please fill all required fields in Date & Time');
            return;
        }
        
        // Update payment summary before showing payment step
        updatePaymentSummary();
        updateBookingSteps(4);
    });
    
    // Back to step 3
    document.getElementById('back-to-step-3')?.addEventListener('click', () => updateBookingSteps(3));
    
    // Next to step 5 (Confirmation)
    document.getElementById('next-to-step-5')?.addEventListener('click', () => {
        // Validate payment confirmation
        const paymentConfirm = document.getElementById('payment-confirm');
        
        if (!paymentConfirm.checked) {
            alert('Please confirm that you have made the payment');
            return;
        }
        
        // Update final summary
        updateFinalSummary();
        updateBookingSteps(5);
    });
    
    // Back to step 4
    document.getElementById('back-to-step-4')?.addEventListener('click', () => updateBookingSteps(4));
    
    // Submit booking (Finish)
    document.getElementById('submit-booking')?.addEventListener('click', submitBooking);
});

function updatePaymentSummary() {
    // Get selected package
    const selectedPackage = document.querySelector('.package-option.selected');
    const packageName = selectedPackage.querySelector('h4').textContent;
    const packagePrice = selectedPackage.querySelector('.package-price').textContent;
    
    // Get selected payment method
    const selectedPayment = document.querySelector('.payment-option.selected');
    const paymentMethod = selectedPayment?.querySelector('h5').textContent || 'Bank Transfer';
    
    // Update payment summary
    document.getElementById('payment-package').textContent = `${packageName} - ${packagePrice}`;
    document.getElementById('payment-total').textContent = packagePrice;
    document.getElementById('payment-amount').textContent = packagePrice;
    
    // Update amounts in payment instructions
    document.getElementById('bank-amount').textContent = packagePrice;
    document.getElementById('qris-amount').textContent = packagePrice;
    document.getElementById('dana-amount').textContent = packagePrice;
    document.getElementById('gopay-amount').textContent = packagePrice;
}

function updateFinalSummary() {
    // Update summary with form data
    const selectedPackage = document.querySelector('.package-option.selected');
    const packageName = selectedPackage.querySelector('h4').textContent;
    const packagePrice = selectedPackage.querySelector('.package-price').textContent;
    
    const selectedPayment = document.querySelector('.payment-option.selected');
    const paymentMethod = selectedPayment?.querySelector('h5').textContent || 'Bank Transfer';
    
    document.getElementById('summary-package').textContent = `${packageName} - ${packagePrice}`;
    document.getElementById('summary-name').textContent = document.getElementById('client-name').value;
    document.getElementById('summary-email').textContent = document.getElementById('client-email').value;
    document.getElementById('summary-phone').textContent = document.getElementById('client-phone').value;
    document.getElementById('summary-date').textContent = formatDate(document.getElementById('event-date').value);
    document.getElementById('summary-time').textContent = document.getElementById('event-time').options[document.getElementById('event-time').selectedIndex].text;
    document.getElementById('summary-location').textContent = document.getElementById('event-location').value;
    document.getElementById('summary-payment-method').textContent = paymentMethod;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

async function submitBooking() {
    // Collect all booking data
    const bookingData = {
        package: document.querySelector('.package-option.selected h4').textContent,
        price: document.querySelector('.package-option.selected .package-price').textContent,
        name: document.getElementById('client-name').value,
        email: document.getElementById('client-email').value,
        phone: document.getElementById('client-phone').value,
        eventType: document.getElementById('event-type').value,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        location: document.getElementById('event-location').value,
        notes: document.getElementById('event-notes').value,
        paymentMethod: document.querySelector('.payment-option.selected h5').textContent,
        status: 'pending_payment_confirmation',
        createdAt: new Date().toISOString()
    };
    
    // Simulate sending data to server
    try {
        // In real app, you would send this to your backend
        console.log('Booking submitted:', bookingData);
        
        // Show success message
        alert('Booking submitted successfully! Admin will contact you to confirm payment.');
        
        // Reset form
        setTimeout(() => {
            window.location.href = 'index.html'; // Redirect to homepage
        }, 3000);
        
    } catch (error) {
        console.error('Error submitting booking:', error);
        alert('Error submitting booking. Please try again.');
    }
}

// Auto-fill today's date as minimum for date picker
document.addEventListener('DOMContentLoaded', function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('event-date').min = today;
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('event-date').value = tomorrow.toISOString().split('T')[0];
});

