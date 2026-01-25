// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');

    // Function to switch sections
    function switchSection(targetSection) {
        // Hide all sections
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetElement = document.getElementById(targetSection);
        if (targetElement) {
            targetElement.classList.add('active');
        }

        // Update active nav button
        navButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-target') === targetSection) {
                button.classList.add('active');
            }
        });
    }

    // Add click event listeners to nav buttons
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-target');
            switchSection(targetSection);
        });
    });

    // Set home as default active section
    switchSection('home');
});

// Simple form validation for future contact form
function validateForm(formData) {
    const errors = [];

    // Helper: Email validation
    const isValidEmail = (email) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(email.trim());
    };

    // Helper: Name validation (letters, spaces, hyphens only)
    const isValidName = (name) => {
        const pattern = /^[A-Za-z\s\-']{2,50}$/;
        return pattern.test(name.trim());
    };

    // ✅ Name validation
    if (!formData.name || formData.name.trim() === '') {
        errors.push('Name is required.');
    } else if (!isValidName(formData.name)) {
        errors.push('Name should contain only letters and spaces (2–50 characters).');
    }

    // ✅ Email validation
    if (!formData.email || formData.email.trim() === '') {
        errors.push('Email is required.');
    } else if (!isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address (e.g., name@example.com).');
    }

    // ✅ Message validation
    if (!formData.message || formData.message.trim() === '') {
        errors.push('Message is required.');
    } else if (formData.message.trim().length < 10) {
        errors.push('Message should be at least 10 characters long.');
    } else if (formData.message.trim().length > 1000) {
        errors.push('Message should not exceed 1000 characters.');
    }

    // ✅ (Optional) Phone number validation (if added in formData)
    if (formData.phone) {
        const phonePattern = /^[0-9+\-\s]{7,15}$/;
        if (!phonePattern.test(formData.phone.trim())) {
            errors.push('Please enter a valid phone number (digits, +, -, or spaces).');
        }
    }

    // ✅ (Optional) Subject field validation
    if (formData.subject && formData.subject.trim().length > 100) {
        errors.push('Subject should be less than 100 characters.');
    }

    // ✅ Return summary or individual errors
    return errors;
}


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Utility function for making API calls (for future CMS integration)
async function fetchData(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Image lazy loading for better performance
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Chatbot functionality
function initializeChatbot() {
    const chatContainer = document.getElementById('chatContainer');
    const openChatBtn = document.getElementById('openChat');
    const minimizeBtn = document.getElementById('minimizeChat');
    const sendBtn = document.getElementById('sendMessage');
    const userInput = document.getElementById('userInput');
    const chatMessages = document.getElementById('chatMessages');

    openChatBtn.addEventListener('click', () => {
        chatContainer.style.display = 'flex';
        openChatBtn.style.display = 'none';
        // Add initial greeting
        addMessage('Hello! How can I help you today?', 'bot');
    });

    minimizeBtn.addEventListener('click', () => {
        chatContainer.style.display = 'none';
        openChatBtn.style.display = 'block';
    });

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.textContent = text;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleUserMessage() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            userInput.value = '';
            // Process user message and get response
            processUserMessage(message);
        }
    }

    sendBtn.addEventListener('click', handleUserMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    function processUserMessage(message) {
        // Simple response logic based on keywords
        const lowerMessage = message.toLowerCase();
        let response = '';

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            response = 'Hello! How can I assist you today?';
        } else if (lowerMessage.includes('program') || lowerMessage.includes('course')) {
            response = 'We offer a Bachelor\'s degree in Computer Science and a Cybersecurity minor. Would you like to know more about our programs?';
        } else if (lowerMessage.includes('scholarship')) {
            response = 'We have several scholarship opportunities including the KCC Cybersecurity Scholarship and the NSF CyberCorps Scholarship. Would you like more details?';
        } else if (lowerMessage.includes('google clinic') || lowerMessage.includes('internship')) {
            response = 'Our Google Clinic provides hands-on experience through cybersecurity consultations for local businesses. Would you like to learn more about this opportunity?';
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
            response = 'You can contact our department through the Contact section on our website. Would you like specific contact information?';
        } else {
            response = 'I\'m here to help! Feel free to ask about our programs, scholarships, or any other aspects of our department.';
        }

        setTimeout(() => {
            addMessage(response, 'bot');
        }, 500);
    }
}

function initializeFeaturedAutoScroll() {
    const mediaGrid = document.querySelector('.featured-section .media-grid');
    if (!mediaGrid) return;

    const needsScroll = () => mediaGrid.scrollWidth > mediaGrid.clientWidth;
    if (!needsScroll()) return;

    let direction = 1;
    let intervalId = null;
    let resumeTimeout = null;

    const step = () => {
        const maxScroll = mediaGrid.scrollWidth - mediaGrid.clientWidth;
        if (mediaGrid.scrollLeft >= maxScroll) {
            direction = -1;
        } else if (mediaGrid.scrollLeft <= 0) {
            direction = 1;
        }
        mediaGrid.scrollBy({ left: direction * 2, behavior: 'auto' });
    };

    const start = () => {
        if (!intervalId && needsScroll()) {
            intervalId = setInterval(step, 20);
        }
    };

    const stop = () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    };

    const pauseAndResume = () => {
        stop();
        if (resumeTimeout) {
            clearTimeout(resumeTimeout);
        }
        resumeTimeout = setTimeout(() => {
            if (needsScroll()) {
                start();
            }
        }, 2000);
    };

    mediaGrid.addEventListener('mouseenter', stop);
    mediaGrid.addEventListener('mouseleave', start);
    mediaGrid.addEventListener('touchstart', stop, { passive: true });
    mediaGrid.addEventListener('touchend', pauseAndResume);
    mediaGrid.addEventListener('wheel', pauseAndResume, { passive: true });

    start();
}

function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLazyLoading();
    initializeChatbot();
    initializeFeaturedAutoScroll();
    initializeBackToTop();
});
