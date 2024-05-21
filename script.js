document.addEventListener('DOMContentLoaded', () => {
    const map = L.map('map').setView([50.8503, 4.3517], 8); // Centrum van België

    //map van Leaflat
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    //vraagjes
    const quizLocations = [
        { lat: 50.8503, lng: 4.3517, city: 'Brussel', question: 'Wat is de hoofdstad van België?', answer: 'Brussel' },
        { lat: 51.0543, lng: 3.7174, city: 'Gent', question: 'Wat is de hoofdstad van Oost-Vlaaderen?', answer: 'Gent' },
        { lat: 51.2194, lng: 4.4025, city: 'Antwerpen', question: 'Wat is de hoofdstad van Antwerpen?', answer: 'Antwerpen' },
        // Voeg meer quizlocaties toe zoals gewenst
    ];

    // score bijhouden
    let score = 0;
    let currentQuestion = null;

    // declareren
    const messageDiv = document.querySelector('.message');
    const quizDiv = document.querySelector('.quiz');
    const questionDiv = document.querySelector('.quiz-question');
    const answerInput = document.querySelector('.quiz-answer');
    const submitButton = document.querySelector('.submit-answer');
    const scoreValue = document.querySelector('.score-value');

    // een rode marker toevoegen
    quizLocations.forEach(loc => {
        const circle = L.circle([loc.lat, loc.lng], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500 // Straal van de cirkel
        }).addTo(map);

        circle.bindPopup(`Klik om een vraag te beantwoorden over ${loc.city}`);
        circle.on('click', () => {
            showQuestion(loc);
        });
    });

    function updateScore() {
        scoreValue.innerText = score;
    }

    function showQuestion(loc) {
        currentQuestion = loc;
        messageDiv.innerText = `Je bent dichtbij ${loc.city}. Antwoord onderstaande vraag.`;
        questionDiv.innerText = loc.question;
        quizDiv.style.display = 'block';
    }

    function checkProximity(position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Controleert of de gebruiker in de buurt is van een quizlocatie
        quizLocations.forEach(loc => {
            const distance = calculateDistance(userLat, userLng, loc.lat, loc.lng);
            if (distance < 0.5) { // afstand in kilometers
                showQuestion(loc);
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
        const distance = R * c; // Afstand in kilometers
        return distance;
    }

    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }

    submitButton.addEventListener('click', () => {
        const userAnswer = answerInput.value.trim();
        if (currentQuestion && userAnswer.toLowerCase() === currentQuestion.answer.toLowerCase()) {
            score += 1;
            updateScore();
            messageDiv.innerText = `Juist! Je score is nu ${score}.`;
        } else {
            messageDiv.innerText = `Fount. Probeer opnieuw!`;
        }
        answerInput.value = '';
        quizDiv.style.display = 'none';
    });

    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(checkProximity, error, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });
    } else {
        alert('Geolocatie wordt niet ondersteund door je browser');
    }
});
