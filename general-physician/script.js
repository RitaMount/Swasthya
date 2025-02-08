const doctors = [
    { name: "Dr. Sam Sharma", specialty: "General Physician", experience: 14, location: "Patia, Bhubaneswar", rating: 4.5, image: "https://i.imgur.com/mJisOCd.jpeg" },
    { name: "Dr. Vishal Verma", specialty: "General Physician", experience: 15, location: "M I Colony, Bhubaneswar", rating: 4.7, image: "https://i.imgur.com/W8LFN7R.jpeg" },
    { name: "Dr. Rohit Mehta", specialty: "General Physician", experience: 18, location: "Gayatri Vihar, Bhubaneswar", rating: 4.6, image: "https://i.imgur.com/SX9gck9.jpeg" },
    { name: "Dr. Priya Rao", specialty: "General Physician", experience: 12, location: "G L Colony, Bhubaneswar", rating: 4.3, image: "https://i.imgur.com/hzarTCn.jpeg" },
    { name: "Dr. Aisha Gupta", specialty: "General Physician", experience: 22, location: "Utkala Nagar, Bhubaneswar", rating: 4.9, image: "https://i.imgur.com/CVsvSj4.jpeg" },
    { name: "Dr. Kavita Das", specialty: "General Physician", experience: 20, location: "Chennai, India", rating: 4.4, image: "https://i.imgur.com/5q3GPVi.jpeg" },
    { name: "Dr. Raj Malhotra", specialty: "General Physician", experience: 16, location: "Pune, India", rating: 4.8, image: "https://i.imgur.com/KEnHOPK.jpeg" },
    { name: "Dr. Rina Patel", specialty: "General Physician", experience: 14, location: "Bangalore, India", rating: 4.5, image: "https://i.imgur.com/nfKXLnP.jpeg" },
    { name: "Dr. Neeraj Joshi", specialty: "General Physician", experience: 19, location: "Hyderabad, India", rating: 4.7, image: "https://i.imgur.com/Vyaj4Tg.jpeg" }
];

function createDoctorCard(doctor) {
    
   // Check if the doctor is Dr. Sam Sharma
    const isSamSharma = doctor.name === "Dr. Sam Sharma";
    
    // If it's Dr. Sam Sharma, wrap the card in a link to his page
    if (isSamSharma) {
        return `
            <a href="../doctorpage/samsharma/index.html" class="doctor-card-link">
                <div class="card">
                    <div class="rating">
                        <img src="https://i.imgur.com/E3NNfJD.png" alt="Star">${doctor.rating}
                    </div>
                    <img src="${doctor.image}" alt="${doctor.name}">
                    <h3>${doctor.name}</h3>
                    <p>${doctor.specialty} | ${doctor.experience} yrs of Exp</p>
                    <div class="location">
                        <img src="https://i.imgur.com/nK1mYn6.png" alt="Location">
                        ${doctor.location}
                    </div>
                </div>
            </a>
        `;
    } else {
        // For other doctors, return the card without a link
        return `
            <div class="card">
                <div class="rating">
                    <img src="https://i.imgur.com/E3NNfJD.png" alt="Star">${doctor.rating}
                </div>
                <img src="${doctor.image}" alt="${doctor.name}">
                <h3>${doctor.name}</h3>
                <p>${doctor.specialty} | ${doctor.experience} yrs of Exp</p>
                <div class="location">
                    <img src="https://i.imgur.com/nK1mYn6.png" alt="Location">
                    ${doctor.location}
                </div>
            </div>
        `;
    }
}

function createHorizontalCard(doctor) {
    return `
        <div class="horizontal-card">
            <img src="${doctor.image}" alt="${doctor.name}">
            <div class="details">
                <h3>${doctor.name}</h3>
                <p>${doctor.specialty} | ${doctor.experience} Years</p>
                <div class="location">
                    <img src="https://i.imgur.com/nK1mYn6.png" alt="Location">
                    ${doctor.location}
                </div>
            </div>
            <div class="rating">
                <img src="https://i.imgur.com/E3NNfJD.png" alt="Star">${doctor.rating}
            </div>
        </div>
    `;
}

document.getElementById('bhubaneswar-doctors').innerHTML = doctors.slice(0, 5).map(createDoctorCard).join('');
document.getElementById('india-doctors').innerHTML = doctors.slice(5).map(createDoctorCard).join('');
document.getElementById('other-doctors').innerHTML = doctors.map(createHorizontalCard).join('');
