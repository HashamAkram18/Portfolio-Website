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
    event.preventDefault(); // Prevent the default form submission
    
    const form = event.target;
    fetch(form.action, {
        method: form.method,
        body: new FormData(form),
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            alert('Message sent successfully!');
            form.reset(); // Optionally reset the form fields
        } else {
            response.json().then(data => {
                alert('Oops! There was a problem submitting your form.');
            });
        }
    }).catch(error => {
        alert('Oops! There was a problem submitting your form.');
    });
});


document.querySelector('.icons a').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default link behavior
    window.open('resume.html', '_blank'); // Open the resume in a new tab
});