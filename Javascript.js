// scripts.js

// Smooth scrolling for navigation links
document.querySelectorAll('nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Contact form submission alert
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Thank you for your message! I will get back to you soon.');
});

document.querySelector('.icons a').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    window.open('resume.html', '_blank'); // Open the resume in a new tab
});