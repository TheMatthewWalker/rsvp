// Smooth scrolling for navigation links
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// RSVP form handling
const rsvpForm = document.getElementById('rsvp-form');
const attendingSelect = document.getElementById('attending');
const guestsGroup = document.getElementById('guests-group');
const foodGroup = document.getElementById('food-group');

attendingSelect.addEventListener('change', function() {
    if (this.value === 'yes') {
        guestsGroup.style.display = 'block';
        foodGroup.style.display = 'block';
    } else {
        guestsGroup.style.display = 'none';
        foodGroup.style.display = 'none';
    }
});

rsvpForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Collect form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // For now, just log to console and show alert
    // In a real application, you'd send this to a server
    console.log('RSVP Data:', data);
    
    alert('Thank you for your RSVP! We\'ve received your response.');
    
    // Reset form
    this.reset();
    guestsGroup.style.display = 'none';
    foodGroup.style.display = 'none';
});

// Add fade-in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animation
document.querySelectorAll('section > .container').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Header background change on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});