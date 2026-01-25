// =========================
// 🌐 WVSU Website Navigation
// =========================
document.addEventListener('DOMContentLoaded', function() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');

    function switchSection(targetSection) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });

        const targetElement = document.getElementById(targetSection);
        if (targetElement) {
            targetElement.classList.add('active');
        }

        navButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-target') === targetSection) {
                button.classList.add('active');
            }
        });
    }

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-target');
            switchSection(targetSection);
        });
    });

    // Set home as default active section
    switchSection('home');
});

// =========================
// ✉️ Simple Form Validation
// =========================
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim() === '') {
        errors.push('Name is required');
    }
    
    if (!formData.email || !isValidEmail(formData.email)) {
        errors.push('Valid email is required');
    }
    
    if (!formData.message || formData.message.trim() === '') {
        errors.push('Message is required');
    }
    
    return errors;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// =========================
// 🖼️ Image Lazy Loading
// =========================
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// =========================
// 💬 AI Chatbox Integration
// =========================
document.addEventListener("DOMContentLoaded", function() {
  const chatToggle = document.getElementById("chat-toggle");
  const chatWindow = document.getElementById("chat-window");
  const closeChat = document.getElementById("close-chat");
  const sendChat = document.getElementById("send-chat");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");

  if (!chatToggle || !chatWindow) return; // Prevents crash if HTML missing

  // Toggle chat open/close
  chatToggle.addEventListener("click", () => {
    chatWindow.classList.toggle("hidden");
  });

  closeChat.addEventListener("click", () => {
    chatWindow.classList.add("hidden");
  });

  // Send message
  sendChat.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
  });

  function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    appendMessage("user", message);
    chatInput.value = "";

    fetch("/chat_api", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => appendMessage("bot", data.reply))
    .catch(() => appendMessage("bot", "⚠️ Error connecting to AI server."));
  }

  function appendMessage(sender, text) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    msgDiv.innerText = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
