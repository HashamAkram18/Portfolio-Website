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

document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var form = event.target;

    // Create a FormData object to capture form data
    var formData = new FormData(form);

    // Send the form data to Formspree using fetch
    fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            alert('Message sent successfully!');
            form.reset(); // Clear the form
        } else {
            alert('Oops! Something went wrong.');
        }
    }).catch(error => {
        alert('Oops! Something went wrong.');
    });
});


document.querySelector('.icons a').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    window.open('resume.html', '_blank'); // Open the resume in a new tab
});