// GroqCloud API Key
const apiKey = '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';

// Store chat history in sessionStorage
let chatHistory = JSON.parse(sessionStorage.getItem('chatHistory')) || [];
let hasInitialGreeting = sessionStorage.getItem("hasInitialGreeting") === "true";


// Toggle chatbot window visibility
function toggleChatbot() {
    const chatbotWindow = document.getElementById('chatbot-window');
    const isChatbotOpen = chatbotWindow.style.display === 'flex';

    chatbotWindow.style.display = isChatbotOpen ? 'none' : 'flex';

    if (!isChatbotOpen) {
       if (!hasInitialGreeting) {
    addBotMessage('Hello! How can I assist you today?');
    hasInitialGreeting = true;
    sessionStorage.setItem("hasInitialGreeting", "true");
}

        renderChatHistory(); // Show previous session messages
        restoreDoctorButton(); // Restore doctor button when opening
    }
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.overlay');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Send message function
function sendMessage() {
    const userInput = document.querySelector('.user-input');
    const message = userInput.value.trim();

    if (message) {
        addUserMessage(message);
        userInput.value = '';
        getBotResponse(message);
    }
}

// Add event listener for Enter key
document.querySelector('.user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Add user message to chat and store in history
function addUserMessage(text) {
    addMessageToUI(text, 'user-message');
    chatHistory.push({ role: "user", content: text });
    updateSessionStorage();
}

// Add bot message to chat and store in history
function addBotMessage(text) {
    addMessageToUI(text, 'bot-message');
    chatHistory.push({ role: "assistant", content: text });
    updateSessionStorage();

    // Check for doctor recommendations
    checkForDoctorRecommendation(text);
}

// Generic function to add messages to UI
function addMessageToUI(text, className) {
    const messagesContainer = document.querySelector('.chatbot-messages');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', className);
    messageDiv.innerHTML = `<span class="message-content">${text}</span>`;
    messagesContainer.appendChild(messageDiv);
    scrollToBottom();
}

// Restore previous chat history on opening chatbot
function renderChatHistory() {
    const messagesContainer = document.querySelector('.chatbot-messages');
    messagesContainer.innerHTML = ''; // Clear before rendering

    chatHistory.forEach(msg => {
        addMessageToUI(msg.content, msg.role === 'user' ? 'user-message' : 'bot-message');
    });

    scrollToBottom();
}

// Update sessionStorage with latest chat history
function updateSessionStorage() {
    sessionStorage.setItem('chatHistory', JSON.stringify(chatHistory));
}

// Scroll to bottom of messages
function scrollToBottom() {
    const messagesContainer = document.querySelector('.chatbot-messages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Fetch response from GroqCloud API
async function getBotResponse(userInput) {
    const apiUrl = 'https://api.groq.com/openai/v1/chat/completions';

    const requestData = {
        model: 'llama-3.3-70b-versatile',
        messages: [
            { role: 'system', content: "Provide concise responses. Ask short, relevant questions to gather more details about their symptoms. Focus on diagnosing potential conditions without offering direct solutions. Suggest the appropriate specialist doctor based on the symptoms. Avoid jumping to conclusions quickly." },
            ...chatHistory,
            { role: 'user', content: userInput }
        ],
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: false
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        if (responseData.choices && responseData.choices.length > 0) {
            addBotMessage(responseData.choices[0].message.content);
        } else {
            addBotMessage('Sorry, I could not process your request.');
        }
    } catch (error) {
        console.error('Error fetching chatbot response:', error);
        addBotMessage('There was an error connecting to the server.');
    }
}

// Check if bot message suggests a doctor
function checkForDoctorRecommendation(message) {
    const doctorTypes = [
        "general physician", "dermatologist", "gynecologist", "family medicine doctor",
        "psychiatrist", "ENT", "ENT specialist", "pediatrician", "dentist",
        "endocrinologist", "gastroenterologist", "cardiologist", "orthopedic specialist",
        "pulmonologist", "urologist", "rheumatologist", "neurologist"
    ];
    let foundDoctor = null;
    doctorTypes.forEach(doctor => {
        const regex = new RegExp(`\\b${doctor}\\b`, 'i'); // Check for full word match
        if (regex.test(message)) {
            foundDoctor = doctor;
        }
    });
    if (foundDoctor) {
        localStorage.setItem("savedDoctor", foundDoctor);
        updateDoctorButton(foundDoctor);
    }
}


// Update the doctor button (remove old one and add a new one)
function updateDoctorButton(doctorType) {
    let existingButton = document.querySelector('.doctor-button');
    if (existingButton) {
        existingButton.remove();
    }
    const messagesContainer = document.querySelector('.chatbot-messages');
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('doctor-button');

    // Redirecting based on doctor type
let doctorPage = doctorType.toLowerCase().replace(/\s+/g, "-") + ".html";
if (doctorType.toLowerCase() === "general physician") {
    doctorPage = "/swasthya/general-physician/index.html"; // Use absolute path from the root
} else {
    doctorPage = "/swasthya/under-construction.html"; // Temporary redirect for all others
}

    buttonDiv.innerHTML = `<button onclick="window.location.href='${doctorPage}'">${doctorType}</button>`;
    messagesContainer.appendChild(buttonDiv);
    scrollToBottom();
}


// Restore the doctor button (only if chat has history)
function restoreDoctorButton() {
    const savedDoctor = localStorage.getItem("savedDoctor");

    // Only restore if chat history exists and chatbot was previously used
    if (savedDoctor && chatHistory.length > 1) {
        updateDoctorButton(savedDoctor);
    }
}



// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    if (!window.location.href.includes("general-physician")) {
        restoreDoctorButton();  // Prevents chatbot from auto-opening on General Physician page
    }
});


// Clear the saved doctor when the page loads (prevents persistent button)
window.addEventListener("load", function () {
    setTimeout(() => {
        localStorage.removeItem("savedDoctor");
    }, 100); // Small delay to ensure proper execution
});

