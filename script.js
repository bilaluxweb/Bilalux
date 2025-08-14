// --- Element Selectors ---
const navLinks = document.querySelectorAll('header nav a');
const logoLink = document.querySelector('.logo');
const sections = document.querySelectorAll('section');
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('header nav');
const header = document.querySelector('header');
const resumeBtns = document.querySelectorAll('.resume-btn');
const arrowRight = document.querySelector('.portfolio-box .navigation .arrow-right');
const arrowLeft = document.querySelector('.portfolio-box .navigation .arrow-left');
// Dark Mode Toggle Element
const darkModeToggle = document.querySelector('#dark-mode-toggle');

// --- Mobile Menu Toggle ---
menuIcon.addEventListener('click', () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
});

// --- Smooth Scroll & Active Navigation Link Highlighting ---
navbar.addEventListener('click', function(e) {
    const clickedLink = e.target.closest('a');

    // Check if the clicked element is one of the main nav links
    if (clickedLink && Array.from(navLinks).includes(clickedLink)) {
        e.preventDefault(); // Prevent default anchor jump

        // Deactivate all nav links and activate the clicked one
        navLinks.forEach(item => item.classList.remove('active'));
        clickedLink.classList.add('active');

        // Close mobile menu if open
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');

        // Scroll to the target section
        const targetId = clickedLink.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        }
    }
});

// --- Logo Click to Home Section ---
logoLink.addEventListener('click', function(e) {
    e.preventDefault();

    // Set 'Home' link as active
    navLinks.forEach(item => item.classList.remove('active'));
    if (navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }

    // Close mobile menu if open
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');

    // Scroll to the top of the Home section
    const homeSection = document.querySelector('#home');
    if (homeSection) {
        window.scrollTo({
            top: homeSection.offsetTop,
            behavior: 'smooth'
        });
    } else {
        // Fallback to absolute top if #home not found
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// --- Update Active Nav Link on Scroll & Sticky Header ---
window.addEventListener('scroll', () => {
    let currentSectionId = '';
    const headerHeight = header.offsetHeight;
    const scrollPosition = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight; // Adjusted top based on header height
        const sectionHeight = section.offsetHeight;
        const offset = 50; // A buffer to change active state slightly before reaching top

        if (scrollPosition >= sectionTop - offset && scrollPosition < sectionTop + sectionHeight - offset) {
            currentSectionId = '#' + section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSectionId) {
            link.classList.add('active');
        }
    });

    // Sticky header effect
    if (scrollPosition > 100) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});

// --- Section Scroll-in Animations (Intersection Observer) ---
const animatedSections = new Set(); // Tracks sections that have already been animated

const observerOptions = {
    root: null, // Viewport as the root
    rootMargin: '0px',
    threshold: 0.3 // Trigger when 30% of the section is visible
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (!animatedSections.has(entry.target.id)) {
                entry.target.classList.add('show-animate');
                animatedSections.add(entry.target.id); // Mark as animated

                // Staggered animation for Services section boxes
                if (entry.target.id === 'services') {
                    const serviceBoxes = entry.target.querySelectorAll('.services-box');
                    serviceBoxes.forEach((box, index) => {
                        box.style.setProperty('--delay', `${index * 0.08}s`); // Slightly faster stagger
                    });
                }
                // Staggered animation for Resume section items
                if (entry.target.id === 'resume') {
                    const resumeItems = entry.target.querySelectorAll('.resume-list .resume-item');
                    resumeItems.forEach((item, index) => {
                        item.style.setProperty('--delay', `${index * 0.06}s`); // Even faster stagger
                    });
                }
                observer.unobserve(entry.target); // Stop observing after animation
            }
        }
    });
}, observerOptions);

// Observe all sections for animations
sections.forEach(section => {
    sectionObserver.observe(section);
});

// --- Dark/Light Mode Toggle Logic ---
const enableDarkMode = () => {
    document.body.classList.remove('light-mode');
    darkModeToggle.classList.remove('bx-sun');
    darkModeToggle.classList.add('bx-moon');
    localStorage.setItem('theme', 'dark');
};

const enableLightMode = () => {
    document.body.classList.add('light-mode');
    darkModeToggle.classList.remove('bx-moon');
    darkModeToggle.classList.add('bx-sun');
    localStorage.setItem('theme', 'light');
};

darkModeToggle.addEventListener('click', () => {
    if (document.body.classList.contains('light-mode')) {
        enableDarkMode();
    } else {
        enableLightMode();
    }
});

// Check for saved theme preference on load
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    enableLightMode();
} else {
    enableDarkMode(); // Default to dark mode if no preference or preference is 'dark'
}


// --- Initial Page Load Setup ---
// Ensures page starts at Home, activates Home link, and triggers initial animations
window.addEventListener('load', () => {
    // Force scroll to top with a slight delay to combat browser scroll restoration
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);

    // Set 'Home' nav link as active on load
    if (navLinks.length > 0) {
        navLinks[0].classList.add('active');
    }

    // Manually trigger animation for the Home section immediately
    const homeSection = document.querySelector('#home');
    if (homeSection) {
        homeSection.classList.add('show-animate');
        animatedSections.add(homeSection.id); // Ensure it's marked as animated
    }

    // Initialize the portfolio carousel state
    activePortfolio();
});

// --- Resume Section Button Functionality ---
resumeBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
        const resumeDetails = document.querySelectorAll('.resume-detail');

        // Remove active class from all buttons and their corresponding details
        resumeBtns.forEach(item => item.classList.remove('active'));
        resumeDetails.forEach(item => item.classList.remove('active'));

        // Add active class to the clicked button and its detail
        btn.classList.add('active');
        resumeDetails[idx].classList.add('active');
    });
});

// --- Portfolio Carousel Functionality ---
let portfolioIndex = 0;

const activePortfolio = () => {
    const imgSlide = document.querySelector('.portfolio-carousel .img-slide');
    const portfolioDetails = document.querySelectorAll('.portfolio-detail');

    const imgSlideStyle = getComputedStyle(imgSlide);
    const gap = parseFloat(imgSlideStyle.getPropertyValue('gap')) || 0;

    const slideItem = imgSlide.querySelector('.img-item');
    const slideWidth = slideItem ? slideItem.offsetWidth : 0;

    // Adjust the transform to slide the correct image into view
    imgSlide.style.transform = `translateX(-${portfolioIndex * (slideWidth + gap)}px)`;

    // Update active portfolio detail
    portfolioDetails.forEach(detail => {
        detail.classList.remove('active');
    });
    if (portfolioDetails[portfolioIndex]) {
        portfolioDetails[portfolioIndex].classList.add('active');
    }

    // Update navigation arrow states (disabled if at start/end)
    const totalSlides = document.querySelectorAll('.portfolio-carousel .img-item').length;
    arrowLeft.classList.toggle('disabled', portfolioIndex === 0);
    arrowRight.classList.toggle('disabled', portfolioIndex === totalSlides - 1);
};

arrowRight.addEventListener('click', () => {
    const totalSlides = document.querySelectorAll('.portfolio-carousel .img-item').length;
    if (portfolioIndex < totalSlides - 1) {
        portfolioIndex++;
        activePortfolio();
    }
});

arrowLeft.addEventListener('click', () => {
    if (portfolioIndex > 0) {
        portfolioIndex--;
        activePortfolio();
    }
});


function sendEmail() {
    const templateParams = {
        name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        phone: document.querySelector("#phone").value,
        subject: document.querySelector("#subject").value,
        message: document.querySelector("#message").value, 
    };

    emailjs.send("service_f00w9c9", "template_p1v0u7h", templateParams)
        .then(
            (response) => {
                console.log('SUCCESS!', response.status, response.text);
                alert("Message sent successfully!");
            },
            (error) => {
                console.log('FAILED...', error);
                alert("Failed to send the message. Please try again.");
            }
        );
}