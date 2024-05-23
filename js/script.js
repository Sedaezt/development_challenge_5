document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.querySelector('.start-button');

    startButton.addEventListener('click', startGame);
});

function startGame() {
    const startPageDiv = document.getElementById('start-page');
    const mapDiv = document.getElementById('map');
    const messageDiv = document.getElementById('message');
    const quizDiv = document.getElementById('quiz');
    const scoreDiv = document.getElementById('score');

    startPageDiv.classList.add('hidden');
    mapDiv.classList.remove('hidden');
    messageDiv.classList.remove('hidden');
    quizDiv.classList.remove('hidden');
    scoreDiv.classList.remove('hidden');

    // kaart weergave
    const map = L.map('map').setView([50.8503, 4.3517], 8); // Centrum van België

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const quizLocations = [
        { lat: 50.8503, lng: 4.3517, city: 'Brussel', question: 'Welke beroemde standbeeld wordt beschouwd als het symbool van de stad en staat bekend om zijn kleine formaat?', answer: 'Manneken Pis' },
        { lat: 51.0543, lng: 3.7174, city: 'Gent', question: 'Wat is de bekendste waterloop die door het centrum van Gent stroomt?', answer: 'De Leie' },
        { lat: 51.2194, lng: 4.4025, city: 'Antwerpen', question: 'Wat is de traditionele naam voor het ambacht van het maken van handgemaakte producten met behulp van naald en draad, een ambacht dat vaak wordt geassocieerd met de rijke geschiedenis van Antwerpen?', answer: 'Handwerpen' },
    ];

    let score = 0;
    let currentQuestion = null;
    let currentCircle = null;

    const questionDiv = document.querySelector('.quiz-question');
    const answerInput = document.getElementById('quiz-answer');
    const submitButton = document.querySelector('.submit-answer');
    const scoreValue = document.querySelector('.score-value');

    // Voegt een marker toe 
    quizLocations.forEach(loc => {
        const circle = L.circle([loc.lat, loc.lng], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 500 // Straal van de cirkel in meters
        }).addTo(map);

        circle.bindPopup(`Click to answer a question about ${loc.city}`);
        circle.on('click', () => {
            showQuestion(loc, circle);
        });
    });

    function updateScore() {
        scoreValue.innerText = score;
    }

    function showQuestion(loc, circle) {
        currentQuestion = loc;
        currentCircle = circle;
        messageDiv.innerText = `You are near ${loc.city}. Answer the question below.`;
        questionDiv.innerText = loc.question;
        quizDiv.style.display = 'block';
    }

    function checkProximity(position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        // Controleert of de gebruiker in de buurt
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
        const distance = R * c; // Afstand in km
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
            messageDiv.innerText = `Correct! Your score is now ${score}.`;
            map.removeLayer(currentCircle);
        } else {
            messageDiv.innerText = `Incorrect. Try again!`;
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
        alert('Geolocation is not supported by your browser');
    }
}