// Variables globales
let score1 = 0;
let score2 = 0;
let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;

// DOM Elements
const score1Display = document.getElementById('score1');
const score2Display = document.getElementById('score2');
const team1NameDisplay = document.getElementById('team1-name');
const team2NameDisplay = document.getElementById('team2-name');
const team1Input = document.getElementById('team1');
const team2Input = document.getElementById('team2');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const historyList = document.getElementById('history-list');

// Initialisation
function init() {
    updateScoreDisplay();
    updateTeamNames();
    updateTimerDisplay();
    
    // Écouteurs pour les noms d'équipes
    team1Input.addEventListener('change', updateTeamNames);
    team2Input.addEventListener('change', updateTeamNames);
    
    // Écouteurs pour les touches du clavier
    document.addEventListener('keydown', handleKeyboardShortcuts);
}

// Mise à jour des noms d'équipes
function updateTeamNames() {
    team1NameDisplay.textContent = team1Input.value || 'Équipe A';
    team2NameDisplay.textContent = team2Input.value || 'Équipe B';
    addToHistory(`Noms mis à jour: ${team1Input.value || 'Équipe A'} vs ${team2Input.value || 'Équipe B'}`);
}

// Incrémentation du score
function incrementScore(team) {
    if (team === 1) {
        score1++;
        score1Display.textContent = score1;
        addToHistory(`+1 pour ${team1Input.value || 'Équipe A'} (${score1}-${score2})`);
    } else if (team === 2) {
        score2++;
        score2Display.textContent = score2;
        addToHistory(`+1 pour ${team2Input.value || 'Équipe B'} (${score1}-${score2})`);
    }
    animateScoreDisplay(team);
    updateScoreDisplay();
}

// Décrémentation du score
function decrementScore(team) {
    if (team === 1 && score1 > 0) {
        score1--;
        score1Display.textContent = score1;
        addToHistory(`-1 pour ${team1Input.value || 'Équipe A'} (${score1}-${score2})`);
    } else if (team === 2 && score2 > 0) {
        score2--;
        score2Display.textContent = score2;
        addToHistory(`-1 pour ${team2Input.value || 'Équipe B'} (${score1}-${score2})`);
    }
    animateScoreDisplay(team);
    updateScoreDisplay();
}

// Animation du score
function animateScoreDisplay(team) {
    const display = team === 1 ? score1Display : score2Display;
    display.style.transform = 'scale(1.2)';
    display.style.color = '#e74c3c';
    setTimeout(() => {
        display.style.transform = 'scale(1)';
        display.style.color = '#3498db';
    }, 300);
}

// Mise à jour de l'affichage des scores
function updateScoreDisplay() {
    score1Display.textContent = score1;
    score2Display.textContent = score2;
    
    // Changement de couleur en fonction du leader
    if (score1 > score2) {
        score1Display.style.color = '#27ae60';
        score2Display.style.color = '#e74c3c';
    } else if (score2 > score1) {
        score1Display.style.color = '#e74c3c';
        score2Display.style.color = '#27ae60';
    } else {
        score1Display.style.color = '#3498db';
        score2Display.style.color = '#3498db';
    }
}

// Réinitialisation des scores
function resetScores() {
    score1 = 0;
    score2 = 0;
    updateScoreDisplay();
    addToHistory(`Scores réinitialisés: 0-0`);
}

// Échange des équipes
function swapTeams() {
    // Échange des noms
    const tempName = team1Input.value;
    team1Input.value = team2Input.value;
    team2Input.value = tempName;
    updateTeamNames();
    
    // Échange des scores
    const tempScore = score1;
    score1 = score2;
    score2 = tempScore;
    updateScoreDisplay();
    
    addToHistory(`Équipes échangées: ${team1Input.value || 'Équipe A'} (${score1}) vs ${team2Input.value || 'Équipe B'} (${score2})`);
}

// Chronomètre
function startTimer() {
    if (!isTimerRunning) {
        isTimerRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        
        timerInterval = setInterval(() => {
            timerSeconds++;
            updateTimerDisplay();
        }, 1000);
        
        addToHistory('Chronomètre démarré');
    }
}

function pauseTimer() {
    if (isTimerRunning) {
        isTimerRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        
        clearInterval(timerInterval);
        timerInterval = null;
        
        addToHistory(`Chronomètre en pause à ${formatTime(timerSeconds)}`);
    }
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 0;
    updateTimerDisplay();
    addToHistory('Chronomètre réinitialisé');
}

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timerSeconds);
}

function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0')
    ].join(':');
}

// Historique
function addToHistory(message) {
    const timestamp = new Date().toLocaleTimeString('fr-FR');
    const listItem = document.createElement('li');
    listItem.textContent = `[${timestamp}] ${message}`;
    historyList.prepend(listItem);
    
    // Limiter l'historique à 50 entrées
    if (historyList.children.length > 50) {
        historyList.removeChild(historyList.lastChild);
    }
}

function clearHistory() {
    historyList.innerHTML = '';
    addToHistory('Historique effacé');
}

// Raccourcis clavier
function handleKeyboardShortcuts(event) {
    // Ignorer si on est dans un champ de texte
    if (event.target.tagName === 'INPUT') return;
    
    switch(event.key) {
        case '1':
            incrementScore(1);
            break;
        case '2':
            incrementScore(2);
            break;
        case 'q':
        case 'Q':
            decrementScore(1);
            break;
        case 'w':
        case 'W':
            decrementScore(2);
            break;
        case 'r':
        case 'R':
            resetScores();
            break;
        case ' ':
            // Espace pour démarrer/pauser le chronomètre
            event.preventDefault();
            if (isTimerRunning) {
                pauseTimer();
            } else {
                startTimer();
            }
            break;
        case 't':
        case 'T':
            resetTimer();
            break;
        case 's':
        case 'S':
            swapTeams();
            break;
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', init);
