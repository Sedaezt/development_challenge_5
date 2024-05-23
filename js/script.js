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

        // Kaart weergave
        const map = L.map(mapDiv).setView([50.8503, 4.3517], 8);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        quizLocations.forEach(location => {
            const circle = L.circle([location.lat, location.lng], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 10000
            }).addTo(map);

            circle.on('click', () => {
                showQuestion(location);
            });
        });
    }

    function showQuestion(location) {
        currentQuestion = location;
        questionDiv.textContent = location.question;
        messageDiv.textContent = '';
        answerInput.value = '';
        quizDiv.style.display = 'block';
        modal.classList.add('hidden');
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
});
