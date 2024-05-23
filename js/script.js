import { quizLocations } from "./vraagjes.js";

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.querySelector('.start-button');
    const submitButton = document.querySelector('.submit-answer');
    const answerInput = document.getElementById('quiz-answer');
    const messageDiv = document.getElementById('message');
    const quizDiv = document.getElementById('quiz');
    const questionDiv = document.querySelector('.quiz-question');
    const modal = document.getElementById('answer-modal');
    const modalMessage = document.querySelector('.modal-message');
    const modalImage = document.querySelector('.modal-image');
    const closeModalButton = document.querySelector('.close-modal');
    const popupText = document.getElementById('popup-text');
    const mapDiv = document.getElementById('map');
    const title = document.getElementById('title'); // Voeg deze regel toe

    let currentQuestion = null;

    startButton.addEventListener('click', startGame);
    submitButton.addEventListener('click', submitAnswer);
    closeModalButton.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    function startGame() {
        const startPageDiv = document.getElementById('start-page');
        startPageDiv.classList.add('hidden');
        mapDiv.classList.remove('hidden');
        messageDiv.classList.remove('hidden');
        quizDiv.classList.remove('hidden');
        title.classList.remove('hidden'); // Voeg deze regel toe

        // Kaart weergave
        const map = L.map(mapDiv).setView([50.8503, 4.3517], 8);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        quizLocations.forEach(location => {
            const circle = L.circle([location.lat, location.lng], {
                color: 'black', // Zwart in plaats van rood
                fillColor: '#000', // Zwart in plaats van rood
                fillOpacity: 0.5,
                radius: 200
            }).addTo(map);

            circle.on('click', () => {
                showQuestion(location);
            });
        });

        // Controleer de nabijheid bij het laden van de kaart
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(checkProximity, error, {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 5000
            });
        } else {
            alert('Geolocation is niet ondersteund door je browser');
        }
    }

    function showQuestion(location) {
        currentQuestion = location;
        questionDiv.textContent = location.question;
        messageDiv.textContent = '';
        answerInput.value = '';
        quizDiv.classList.remove('hidden');
        modal.classList.add('hidden');
        
        console.log(`Showing question for ${location.city}`);
    }
    

    function submitAnswer() {
        const userAnswer = answerInput.value.trim();
        if (!currentQuestion) return;

        if (userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
            modalMessage.textContent = 'Correct!';
        } else {
            modalMessage.textContent = `Incorrect. Het juiste antwoord is ${currentQuestion.answer}.`;
        }

        modalImage.src = currentQuestion.image;
        modalImage.alt = currentQuestion.city;
        popupText.textContent = currentQuestion.additionalText;
        modal.classList.remove('hidden');
    }

    function checkProximity(position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
    
        console.log(`Current position: Lat ${userLat}, Lng ${userLng}`);
    
        quizLocations.forEach(location => {
            const distance = calculateDistance(userLat, userLng, location.lat, location.lng);
            console.log(`Distance to ${location.city}: ${distance} km`);
            if (distance < 0.5) { // afstand in kilometers
                showQuestion(location);
            }
        });
    }
    

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Straal van de aarde in km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Afstand in km
        return distance;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
});
