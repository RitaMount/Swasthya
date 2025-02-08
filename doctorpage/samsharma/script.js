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
        renderChatHistory();
        restoreDoctorButton();
    }
}

// Sidebar Toggle Functionality
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
    messagesContainer.innerHTML = '';

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
        const regex = new RegExp(`\\b${doctor}\\b`, 'i');
        if (regex.test(message)) {
            foundDoctor = doctor;
        }
    });
    if (foundDoctor) {
        localStorage.setItem("savedDoctor", foundDoctor);
        updateDoctorButton(foundDoctor);
    }
}

// Update the doctor button
function updateDoctorButton(doctorType) {
    let existingButton = document.querySelector('.doctor-button');
    if (existingButton) {
        existingButton.remove();
    }
    const messagesContainer = document.querySelector('.chatbot-messages');
    const buttonDiv = document.createElement('div');
    buttonDiv.classList.add('doctor-button');

    let doctorPage = doctorType.toLowerCase().replace(/\s+/g, "-") + ".html";
    if (doctorType.toLowerCase() === "general physician") {
        doctorPage = "/Swasthya/general-physician/index.html";
    } else {
        doctorPage = "/Swasthya/under-construction.html";
    }

    buttonDiv.innerHTML = `<button onclick="window.location.href='${doctorPage}'">${doctorType}</button>`;
    messagesContainer.appendChild(buttonDiv);
    scrollToBottom();
}

// Restore the doctor button
function restoreDoctorButton() {
    const savedDoctor = localStorage.getItem("savedDoctor");
    if (savedDoctor && chatHistory.length > 1) {
        updateDoctorButton(savedDoctor);
    }
}

// Calendar and Booking Functionality
document.addEventListener('DOMContentLoaded', function () {
    const calendarGrid = document.getElementById('calendar-grid');
    const calendarMonth = document.getElementById('calendar-month');
    const prevMonthBtn = document.querySelector('.prev-month');
    const nextMonthBtn = document.querySelector('.next-month');
    const continueBtn = document.getElementById('continue-btn');
    const timeSelection = document.getElementById('time-selection');
    const timeGrid = document.getElementById('time-grid');
    const bookSlotBtn = document.getElementById('book-slot-btn');
    const confirmationModal = document.getElementById('confirmation-modal');
    const bookingDetailsEl = document.getElementById('booking-details');
    const closeModalBtn = document.querySelector('.close-modal');

    // Tabs and FAQs functionality
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const faqItems = document.querySelectorAll('.faq-item');

    let currentDate = new Date(2025, 0, 1);
    let selectedDate = null;
    let selectedTime = null;

    // Generate calendar
    function generateCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        calendarMonth.textContent = new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' });
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        calendarGrid.innerHTML = '';

        for (let i = 0; i < firstDay.getDay(); i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('disabled');
            calendarGrid.appendChild(emptyCell);
        }

        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            const cellDate = new Date(year, month, day);

            if (cellDate < new Date()) {
                dayElement.classList.add('disabled');
            } else {
                dayElement.addEventListener('click', () => selectDate(cellDate));
            }

            calendarGrid.appendChild(dayElement);
        }
    }

    // Select date
    function selectDate(date) {
        const selectedDays = calendarGrid.querySelectorAll('.selected');
        selectedDays.forEach(el => el.classList.remove('selected'));

        const dayElement = Array.from(calendarGrid.children)
            .find(el => el.textContent == date.getDate() && !el.classList.contains('disabled'));

        if (dayElement) {
            dayElement.classList.add('selected');
            selectedDate = date;
        }
    }

    // Generate time slots
    function generateTimeSlots() {
        const timeSlots = [
            '09:00 AM', '10:00 AM', '11:00 AM',
            '02:00 PM', '03:00 PM', '04:00 PM',
            '05:00 PM', '06:00 PM', '07:00 PM'
        ];

        timeGrid.innerHTML = '';
        timeSlots.forEach(time => {
            const slot = document.createElement('div');
            slot.textContent = time;
            slot.classList.add('time-slot');
            slot.addEventListener('click', () => selectTime(time));
            timeGrid.appendChild(slot);
        });
    }

    // Select time
    function selectTime(time) {
        const selectedSlots = timeGrid.querySelectorAll('.selected');
        selectedSlots.forEach(el => el.classList.remove('selected'));

        const timeSlot = Array.from(timeGrid.children)
            .find(el => el.textContent === time);

        if (timeSlot) {
            timeSlot.classList.add('selected');
            selectedTime = time;
        }
    }

    // Continue button
    continueBtn.addEventListener('click', function () {
        if (selectedDate) {
            calendarGrid.closest('.calendar-section').style.display = 'none';
            timeSelection.style.display = 'block';
            generateTimeSlots();
        }
    });

    // Book slot button
    bookSlotBtn.addEventListener('click', function () {
        if (selectedDate && selectedTime) {
            bookingDetailsEl.textContent = `${selectedDate.toDateString()} at ${selectedTime}`;
            confirmationModal.style.display = 'flex';
        }
    });

    // Close modal button
    closeModalBtn.addEventListener('click', function () {
        confirmationModal.style.display = 'none';
        timeSelection.style.display = 'none';
        calendarGrid.closest('.calendar-section').style.display = 'block';
        selectedDate = null;
        selectedTime = null;
    });

    // Previous month button
    prevMonthBtn.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() - 1);
        generateCalendar(currentDate);
    });

    // Next month button
    nextMonthBtn.addEventListener('click', function () {
        currentDate.setMonth(currentDate.getMonth() + 1);
        generateCalendar(currentDate);
    });

    // Tabs functionality
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            tabContents.forEach(content => content.classList.remove('active'));
            const targetTab = tab.getAttribute('data-tab');
            document.getElementById(`${targetTab}-content`).classList.add('active');
        });
    });

    // FAQs functionality
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', function () {
            item.classList.toggle('active');
        });
    });

    // Initialize
    generateCalendar(currentDate);
    restoreDoctorButton();
});

// Clear the saved doctor when the page loads
window.addEventListener("load", function () {
    setTimeout(() => {
        localStorage.removeItem("savedDoctor");
    }, 100);
});