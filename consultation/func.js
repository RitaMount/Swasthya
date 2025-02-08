// Categories Data Structure
const categories = [
    {
        title: "Primary Care & General Health",
        subcategories: [
            { name: "General Physician", description: "For common illnesses, fever, infections, and general health concerns.", color: "#FFB6C1" },
            { name: "Dermatologist", description: "For skin issues, acne, rashes, hair loss, and allergies.", color: "#ADD8E6" },
            { name: "Gynecologist", description: "For women's health, menstrual issues, pregnancy advice, and PCOS.", color: "#98FB98" },
            { name: "Family Medicine Doctor", description: "Primary care for patients of all ages.", color: "#DDA0DD" }
        ]
    },
    {
        title: "Urgent Care & Common Issues",
        subcategories: [
            { name: "Psychiatrist", description: "For mental health, anxiety, depression, and therapy sessions.", color: "#F0E68C" },
            { name: "ENT Specialist", description: "For ear, nose, and throat infections or sinus problems.", color: "#87CEEB" },
            { name: "Pediatrician", description: "For child healthcare, vaccinations, and common illnesses in kids.", color: "#FFB6C1" },
            { name: "Dentist", description: "For oral health, toothaches, cavities, and dental hygiene.", color: "#98FB98" }
        ]
    },
    {
        title: "Specialist Care",
        subcategories: [
            { name: "Endocrinologist", description: "For diabetes, thyroid disorders, and hormonal imbalances.", color: "#FFD700" },
            { name: "Gastroenterologist", description: "For digestive issues, acidity, bloating, and gut health.", color: "#FFA07A" },
            { name: "Cardiologist", description: "For heart health, hypertension, and cholesterol management.", color: "#FF6347" },
            { name: "Orthopedic Specialist", description: "For joint pain, fractures, arthritis, and mobility issues.", color: "#20B2AA" }
        ]
    },
    {
        title: "Advanced & Alternative Care",
        subcategories: [
            { name: "Pulmonologist", description: "For respiratory issues, asthma, and post-COVID recovery.", color: "#1E90FF" },
            { name: "Urologist", description: "For kidney health, urinary tract infections (UTIs), and prostate concerns.", color: "#8A2BE2" },
            { name: "Rheumatologist", description: "For arthritis, autoimmune diseases, and chronic joint pain.", color: "#FF4500" },
            { name: "Neurologist", description: "For headaches, migraines, epilepsy, and nerve disorders.", color: "#008B8B" }
        ]
    }
];

// Global variables for carousel
let currentPosition = 0;
const cardWidth = 220;

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
    console.log("Consultation page script loaded!");
    
    // Initialize categories
    initializeCategories();

    // Set up FAQ functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Set up smooth scroll for Consult Now button
    const consultBtn = document.querySelector(".consult-btn");
    const categoriesSection = document.querySelector(".specialities");
    if (consultBtn && categoriesSection) {
        consultBtn.addEventListener("click", function(event) {
            event.preventDefault();
            categoriesSection.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }
});

// Function to create and populate category cards
function initializeCategories() {
    const container = document.querySelector('.categories-container');
    if (!container) return;
    container.innerHTML = "";
    categories.forEach(category => {
        category.subcategories.forEach(subcat => {
            const card = document.createElement('div');
            card.className = 'category-card';
            const icon = document.createElement('div');
            icon.className = 'category-icon';
            icon.style.backgroundColor = subcat.color;

            // Redirect to general-physician.html for General Physician
            let link = "#";
            if (subcat.name.toLowerCase() === "general physician") {
                link = "../general-physician/index.html";
            } else {
                // Redirect all other categories to under-construction.html
                link = "../under-construction.html";
            }
            

            card.innerHTML = `
                ${icon.outerHTML}
                <div class="category-title">${subcat.name}</div>
                <div class="category-content">
                    <div class="category-description">${subcat.description}</div>
                    <a href="${link}" class="category-link">Consult now ></a>
                </div>
            `;
            container.appendChild(card);
        });
    });
}

// Category carousel navigation function
function slideCategories(direction) {
    const container = document.querySelector('.categories-container');
    if (!container) return;

    const maxScroll = container.scrollWidth - container.parentElement.clientWidth;
    
    if (direction === 'next' && currentPosition > -maxScroll) {
        currentPosition -= cardWidth;
    } else if (direction === 'prev' && currentPosition < 0) {
        currentPosition += cardWidth;
    }
    
    currentPosition = Math.max(Math.min(currentPosition, 0), -maxScroll);
    container.style.transform = `translateX(${currentPosition}px)`;
}

// Window resize handler for carousel
window.addEventListener('resize', () => {
    const container = document.querySelector('.categories-container');
    if (!container) return;

    const maxScroll = container.scrollWidth - container.parentElement.clientWidth;
    if (currentPosition < -maxScroll) {
        currentPosition = -maxScroll;
        container.style.transform = `translateX(${currentPosition}px)`;
    }
});
