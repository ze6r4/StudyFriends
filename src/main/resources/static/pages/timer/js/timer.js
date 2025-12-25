// Тестовые данные (в дальнейшем будут получаться с сервера)

const sessionDataStr = localStorage.getItem('currentSession');
const sessionData = sessionDataStr ? JSON.parse(sessionDataStr) : null;

if (sessionData) {
    const WORK_TIME = sessionData.workMinutes * 60;
    const BREAK_TIME = sessionData.restMinutes * 60;
    const TOTAL_CYCLES = sessionData.cycles;
    const PLAYER_ID = sessionData.playerId;
    const SKILL_ID = sessionData.skillId;
    const FRIEND_ID = sessionData.friendId;
} else {
    console.error("Нет данных сессии в localStorage");
}

// Состояние таймера
let state = {
    isRunning: false,
    isBreak: false,
    currentCycle: 1,
    completedBreaks: 0,
    timeLeft: WORK_TIME,
    totalTime: WORK_TIME
};

// Элементы DOM
const timerDisplay = document.getElementById('timerDisplay');
const timerStatus = document.getElementById('timerStatus');
const cycleInfo = document.getElementById('cycleInfo');
const progressFill = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');
const timerElement = document.getElementById('timer');
const mainButton = document.getElementById('mainButton');

let timerInterval = null;

// Форматирование времени в MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Обновление отображения таймера
function updateDisplay() {
    timerDisplay.textContent = formatTime(state.timeLeft);
    
    // Обновление статуса
    if (state.isRunning) {
        timerStatus.textContent = state.isBreak ? "Перерыв :3" : "Время работать!";
    } else {
        timerStatus.textContent = state.isBreak ? "Перерыв приостановлен" : "Готовы начать?";
    }
    
    // Обновление информации о циклах
    cycleInfo.textContent = `Цикл: ${state.currentCycle}/${TOTAL_CYCLES} • Перерыв: ${state.completedBreaks}/${TOTAL_CYCLES}`;
    
    // Обновление прогресс-бара
    const progressPercent = ((state.totalTime - state.timeLeft) / state.totalTime) * 100;
    progressFill.style.width = `${progressPercent}%`;
    
    // Обновление текста прогресс-бара
    if (state.isBreak) {
        progressLabel.textContent = `Прогресс перерыва: ${Math.round(progressPercent)}%`;
    } else {
        progressLabel.textContent = `Прогресс работы: ${Math.round(progressPercent)}%`;
    }
    
    // Добавление/удаление класса для перерыва
    if (state.isBreak) {
        timerElement.classList.add('break-active');
    } else {
        timerElement.classList.remove('break-active');
    }
    
    // Обновление кнопки
    if (state.isRunning) {
        mainButton.textContent = "Сдаться";
        mainButton.className = "main-button give-up";
    } else {
        mainButton.textContent = "Начать";
        mainButton.className = "main-button";
    }
}

// Обработчик основной кнопки
function handleMainButton() {
    if (state.isRunning) {
        // Если таймер работает - сдаемся
        if (confirm("Вы уверены, что хотите сдаться? Весь прогресс будет потерян.")) {
            resetTimer();
            timerStatus.textContent = "Не сдавайтесь в следующий раз!";
        }
    } else {
        // Если таймер не работает - начинаем
        startTimer();
    }
}

// Запуск таймера
function startTimer() {
    if (state.isRunning) return;
    
    state.isRunning = true;
    
    timerInterval = setInterval(() => {
        state.timeLeft--;
        
        // Когда время истекло
        if (state.timeLeft <= 0) {
            clearInterval(timerInterval);
            
            // Воспроизведение звука уведомления
            playNotificationSound();
            
            if (state.isBreak) {
                // Завершился перерыв
                state.completedBreaks++;
                
                // Проверяем, завершены ли все циклы
                if (state.currentCycle >= TOTAL_CYCLES && state.completedBreaks >= TOTAL_CYCLES) {
                    // Все циклы завершены
                    state.isBreak = false;
                    state.isRunning = false;
                    timerStatus.textContent = "Все циклы завершены!";
                    mainButton.disabled = true;
                    return;
                }
                
                // Начинаем новый рабочий период
                state.isBreak = false;
                state.timeLeft = WORK_TIME;
                state.totalTime = WORK_TIME;
                state.currentCycle = Math.min(state.currentCycle + 1, TOTAL_CYCLES);
                
                // Показываем уведомление
                showNotification("Перерыв завершен", "Время вернуться к работе!");
            } else {
                // Завершился рабочий период
                state.isBreak = true;
                state.timeLeft = BREAK_TIME;
                state.totalTime = BREAK_TIME;
                
                // Показываем уведомление
                showNotification("Работа завершена", "Время для перерыва!");
            }
            
            updateDisplay();
            startTimer(); // Автоматически запускаем следующий период
            return;
        }
        
        updateDisplay();
    }, 1000);
    
    updateDisplay();
}

// Сброс таймера
function resetTimer() {
    state.isRunning = false;
    state.isBreak = false;
    state.currentCycle = 1;
    state.completedBreaks = 0;
    state.timeLeft = WORK_TIME;
    state.totalTime = WORK_TIME;
    
    clearInterval(timerInterval);
    updateDisplay();
}

// Воспроизведение звука уведомления
function playNotificationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log("Аудио не поддерживается в этом браузере");
    }
}

// Показать уведомление
function showNotification(title, message) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, { body: message });
    } else if ("Notification" in window && Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, { body: message });
            }
        });
    }
}

// Запрос разрешения на уведомления при загрузке страницы
if ("Notification" in window) {
    if (Notification.permission !== "granted" && Notification.permission !== "denied") {
        setTimeout(() => {
            Notification.requestPermission();
        }, 1000);
    }
}

// Инициализация
function init() {
    updateDisplay();
    
    // Обработчик события для основной кнопки
    mainButton.addEventListener('click', handleMainButton);
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', init);