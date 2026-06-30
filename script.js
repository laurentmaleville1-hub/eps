// Variables globales
let score1 = 0;
let score2 = 0;
let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;
let matchData = []; // Tableau pour stocker les données du match

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
const dataTableBody = document.getElementById('data-table-body');

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
    
    // Charger les données existantes
    loadMatchData();
    
    // Ajouter un enregistrement initial
    addMatchRecord('Initialisation');
    
    // Mettre à jour l'affichage du tableau
    updateDataTable();
}

// Mise à jour des noms d'équipes
function updateTeamNames() {
    team1NameDisplay.textContent = team1Input.value || 'Équipe A';
    team2NameDisplay.textContent = team2Input.value || 'Équipe B';
    addToHistory(`Noms mis à jour: ${team1Input.value || 'Équipe A'} vs ${team2Input.value || 'Équipe B'}`);
    addMatchRecord(`Changement de noms: ${team1Input.value || 'Équipe A'} vs ${team2Input.value || 'Équipe B'}`);
}

// Incrémentation du score
function incrementScore(team) {
    if (team === 1) {
        score1++;
        score1Display.textContent = score1;
        addToHistory(`+1 pour ${team1Input.value || 'Équipe A'} (${score1}-${score2})`);
        addMatchRecord(`+1 pour ${team1Input.value || 'Équipe A'}`);
    } else if (team === 2) {
        score2++;
        score2Display.textContent = score2;
        addToHistory(`+1 pour ${team2Input.value || 'Équipe B'} (${score1}-${score2})`);
        addMatchRecord(`+1 pour ${team2Input.value || 'Équipe B'}`);
    }
    animateScoreDisplay(team);
    updateScoreDisplay();
    updateDataTable();
}

// Décrémentation du score
function decrementScore(team) {
    if (team === 1 && score1 > 0) {
        score1--;
        score1Display.textContent = score1;
        addToHistory(`-1 pour ${team1Input.value || 'Équipe A'} (${score1}-${score2})`);
        addMatchRecord(`-1 pour ${team1Input.value || 'Équipe A'}`);
    } else if (team === 2 && score2 > 0) {
        score2--;
        score2Display.textContent = score2;
        addToHistory(`-1 pour ${team2Input.value || 'Équipe B'} (${score1}-${score2})`);
        addMatchRecord(`-1 pour ${team2Input.value || 'Équipe B'}`);
    }
    animateScoreDisplay(team);
    updateScoreDisplay();
    updateDataTable();
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
    addMatchRecord('Réinitialisation des scores');
    updateDataTable();
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
    addMatchRecord('Échange des équipes');
    updateDataTable();
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
        addMatchRecord('Chronomètre démarré');
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
        addMatchRecord(`Chronomètre en pause à ${formatTime(timerSeconds)}`);
    }
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 0;
    updateTimerDisplay();
    addToHistory('Chronomètre réinitialisé');
    addMatchRecord('Chronomètre réinitialisé');
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

// Gestion des données du match (CSV)
function addMatchRecord(action) {
    const timestamp = new Date();
    const date = timestamp.toLocaleDateString('fr-FR');
    const time = timestamp.toLocaleTimeString('fr-FR');
    
    const record = {
        date: date,
        time: time,
        team1: team1Input.value || 'Équipe A',
        score1: score1,
        team2: team2Input.value || 'Équipe B',
        score2: score2,
        duration: timerSeconds,
        action: action
    };
    
    matchData.push(record);
    updateDataTable();
}

function updateDataTable() {
    if (!dataTableBody) return;
    
    // Effacer le tableau
    dataTableBody.innerHTML = '';
    
    // Afficher les 10 derniers enregistrements
    const recordsToShow = matchData.slice(-10).reverse();
    
    recordsToShow.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${record.time}</td>
            <td>${record.team1}</td>
            <td>${record.score1}</td>
            <td>${record.team2}</td>
            <td>${record.score2}</td>
            <td>${record.action}</td>
        `;
        dataTableBody.appendChild(row);
    });
}

function exportToCSV() {
    if (matchData.length === 0) {
        alert('Aucune donnée à exporter');
        return;
    }
    
    // Créer le CSV
    let csv = 'Date,Heure,Équipe 1,Score 1,Équipe 2,Score 2,Durée (secondes),Action\n';
    
    matchData.forEach(record => {
        // Échapper les virgules dans les champs
        const escape = (str) => {
            if (typeof str === 'string' && str.includes(',')) {
                return `"${str}"`;
            }
            return str;
        };
        
        csv += `${escape(record.date)},${escape(record.time)},${escape(record.team1)},${record.score1},${escape(record.team2)},${record.score2},${record.duration},${escape(record.action)}\n`;
    });
    
    // Créer le fichier et le télécharger
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scoreboard_eps_${new Date().toLocaleDateString('fr-FR').replace(/\//g, '-')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addToHistory('Données exportées en CSV');
}

function importFromCSV(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const lines = content.split('\n');
        
        // Vérifier le format
        if (lines.length < 2) {
            alert('Fichier CSV invalide');
            return;
        }
        
        const headers = lines[0].split(',').map(h => h.trim());
        const expectedHeaders = ['Date', 'Heure', 'Équipe 1', 'Score 1', 'Équipe 2', 'Score 2', 'Durée (secondes)', 'Action'];
        
        // Vérification basique du format
        if (headers.length !== expectedHeaders.length) {
            alert('Format CSV incorrect. Attendu: Date,Heure,Équipe 1,Score 1,Équipe 2,Score 2,Durée (secondes),Action');
            return;
        }
        
        // Parser les données
        const importedData = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim() === '') continue;
            const values = lines[i].split(',');
            importedData.push({
                date: values[0] || '',
                time: values[1] || '',
                team1: values[2] || '',
                score1: parseInt(values[3]) || 0,
                team2: values[4] || '',
                score2: parseInt(values[5]) || 0,
                duration: parseInt(values[6]) || 0,
                action: values[7] || ''
            });
        }
        
        // Fusionner avec les données existantes
        matchData = [...importedData, ...matchData];
        
        // Mettre à jour l'interface avec les dernières données
        if (importedData.length > 0) {
            const lastRecord = importedData[importedData.length - 1];
            team1Input.value = lastRecord.team1 || 'Équipe A';
            team2Input.value = lastRecord.team2 || 'Équipe B';
            score1 = lastRecord.score1 || 0;
            score2 = lastRecord.score2 || 0;
            timerSeconds = lastRecord.duration || 0;
            
            updateTeamNames();
            updateScoreDisplay();
            updateTimerDisplay();
            updateDataTable();
            
            addToHistory(`Données importées depuis CSV (${importedData.length} enregistrements)`);
        }
        
        // Réinitialiser l'input file
        event.target.value = '';
    };
    reader.readAsText(file);
}

function saveMatchData() {
    // Sauvegarder dans le localStorage
    try {
        localStorage.setItem('eps_scoreboard_data', JSON.stringify(matchData));
        addToHistory('Données sauvegardées localement');
    } catch (e) {
        console.error('Erreur lors de la sauvegarde:', e);
    }
}

function loadMatchData() {
    // Charger depuis le localStorage
    try {
        const savedData = localStorage.getItem('eps_scoreboard_data');
        if (savedData) {
            matchData = JSON.parse(savedData);
            addToHistory(`Données chargées depuis le stockage local (${matchData.length} enregistrements)`);
            
            // Rétablir l'état depuis la dernière entrée
            if (matchData.length > 0) {
                const lastRecord = matchData[matchData.length - 1];
                team1Input.value = lastRecord.team1 || 'Équipe A';
                team2Input.value = lastRecord.team2 || 'Équipe B';
                score1 = lastRecord.score1 || 0;
                score2 = lastRecord.score2 || 0;
                timerSeconds = lastRecord.duration || 0;
                
                updateTeamNames();
                updateScoreDisplay();
                updateTimerDisplay();
            }
        }
    } catch (e) {
        console.error('Erreur lors du chargement:', e);
    }
}

function clearMatchData() {
    if (confirm('Êtes-vous sûr de vouloir effacer toutes les données du match ?')) {
        matchData = [];
        localStorage.removeItem('eps_scoreboard_data');
        addToHistory('Toutes les données du match ont été effacées');
        updateDataTable();
    }
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
        case 'e':
        case 'E':
            exportToCSV();
            break;
        case 'i':
        case 'I':
            document.getElementById('csv-import').click();
            break;
    }
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', init);
