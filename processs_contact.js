// contact.js - Handle contact form submission

// Configuration - Replace with your EmailJS credentials
const EMAIL_CONFIG = {
    PUBLIC_KEY: "YOUR_PUBLIC_KEY_HERE",
    SERVICE_ID: "YOUR_SERVICE_ID_HERE", 
    TEMPLATE_ID: "YOUR_TEMPLATE_ID_HERE",
    TO_EMAIL: "nafiulaziz.na@gmail.com"
};

// Initialize EmailJS when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
    
    // Get form element
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Add submit event listener
        contactForm.addEventListener('submit', handleFormSubmit);
    }
});

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission
    
    // Get form data
    const formData = getFormData(event.target);
    
    // Validate form
    const validation = validateForm(formData);
    if (!validation.isValid) {
        displayMessage(validation.errors.join(", "), 'error');
        return;
    }
    
    // Send email
    sendEmail(formData, event.target);
}

// Get form data
function getFormData(form) {
    const formData = new FormData(form);
    return {
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        subject: formData.get('subject').trim(),
        message: formData.get('message').trim()
    };
}

// Validate form data
function validateForm(data) {
    const errors = [];
    
    if (!data.name) {
        errors.push("Name is required");
    }
    
    if (!data.email) {
        errors.push("Email is required");
    } else if (!isValidEmail(data.email)) {
        errors.push("Invalid email format");
    }
    
    if (!data.subject) {
        errors.push("Subject is required");
    }
    
    if (!data.message) {
        errors.push("Message is required");
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Send email via EmailJS
function sendEmail(data, form) {
    const submitBtn = form.querySelector('.submit-btn');
    
    // Show loading state
    setButtonLoading(submitBtn, true);
    
    // Prepare email template parameters
    const templateParams = {
        from_name: data.name,
        from_email: data.email,
        subject: data.subject,
        message: data.message,
        to_email: EMAIL_CONFIG.TO_EMAIL
    };
    
    // For testing without EmailJS setup
    if (EMAIL_CONFIG.PUBLIC_KEY === "YOUR_PUBLIC_KEY_HERE") {
        // Simulate email sending
        setTimeout(() => {
            displayMessage('✅ Test mode: Form validation passed! Set up EmailJS to actually send emails.', 'success');
            form.reset();
            setButtonLoading(submitBtn, false);
        }, 1500);
        return;
    }
    
    // Actually send email via EmailJS
    emailjs.send(EMAIL_CONFIG.SERVICE_ID, EMAIL_CONFIG.TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('Email sent successfully!', response.status, response.text);
            displayMessage('✅ Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
        })
        .catch(function(error) {
            console.error('Email sending failed:', error);
            displayMessage('❌ Failed to send message. Please try again or contact us directly.', 'error');
        })
        .finally(function() {
            setButtonLoading(submitBtn, false);
        });
}

// Set button loading state
function setButtonLoading(button, isLoading) {
    if (isLoading) {
        button.dataset.originalText = button.textContent;
        button.textContent = 'Sending...';
        button.disabled = true;
        button.classList.add('loading');
    } else {
        button.textContent = button.dataset.originalText || 'Send Message';
        button.disabled = false;
        button.classList.remove('loading');
    }
}

// Display success/error messages
function displayMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    // Insert message
    const form = document.getElementById('contactForm');
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-remove success messages
    if (type === 'success') {
        setTimeout(() => {
            if (messageDiv && messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 6000);
    }
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}