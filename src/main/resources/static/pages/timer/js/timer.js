import { postSession, getCharacter,getFriend } from '../../../shared/api.js';

// ==================== КОНФИГУРАЦИЯ ====================
const sessionDataStr = localStorage.getItem('currentSession');
const sessionData = sessionDataStr ? JSON.parse(sessionDataStr) : null;
console.log(sessionData);

const DEFAULTS = {
    WORK_TIME: 25 * 60,
    BREAK_TIME: 5 * 60,
    CYCLES: 4,
    PLAYER_ID: 1
};

export const SESSION = {
    workTime: sessionData?.workMinutes
        ? sessionData.workMinutes * 60
        : DEFAULTS.WORK_TIME,

    breakTime: sessionData?.restMinutes
        ? sessionData.restMinutes * 60
        : DEFAULTS.BREAK_TIME,

    cycles: sessionData?.cycles ?? DEFAULTS.CYCLES,
    playerId: sessionData?.playerId ?? DEFAULTS.PLAYER_ID,
    skillId: sessionData?.skillId ?? null,
    friendId: sessionData?.friendId ?? null
};

// ==================== DOM ====================
const minutesEl = document.getElementById('timer-minutes');
const secondsEl = document.getElementById('timer-seconds');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('giveupBtn');
const phaseTitleEl = document.getElementById('phaseTitle');

const bg = document.getElementById('bg');

const STORAGE_KEY = 'timerEndTime';
const CYCLE_KEY = 'timerCurrentCycle';

let animationFrameId = null;
let currentPhase = 'WORK'; // WORK или BREAK
let currentCycle = 1;

const notify = new Audio('static/assets/audio/notify1.mp3');
notify.volume = 0.5;
const PATH_IMAGE = "/assets/images/characters";
// ==================== Инициализация персонажа ====================
async function initCharacter() {
    const friend = await getFriend(SESSION.playerId, SESSION.friendId);
    const character = await getCharacter(friend.characterId);
    console.log(friend)
    setBackground(character);
    console.log('Персонаж загружен:', character);
}
function setBackground(character) {
    bg.src = PATH_IMAGE + `/${character.studyImage}.png`;
}

// ==================== Таймер ====================

function startTimerPhase(phase, cycle) {
    currentPhase = phase;
    currentCycle = cycle;

    updatePhaseTitle(); // ⬅️ ВАЖНО

    const seconds = phase === 'WORK'
        ? SESSION.workTime
        : SESSION.breakTime;

    const endTime = Date.now() + seconds * 1000;

    localStorage.setItem(STORAGE_KEY, endTime);
    localStorage.setItem(CYCLE_KEY, currentCycle);

    stopTimer();
    updateTimer();
}


function stopTimer() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

function resetTimer() {
    stopTimer();
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CYCLE_KEY);

    currentCycle = 1;
    currentPhase = 'WORK';

    updatePhaseTitle(); // ⬅️

    renderTime(SESSION.workTime);
}


function renderTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    minutesEl.textContent = minutes.toString().padStart(2, '0');
    secondsEl.textContent = seconds.toString().padStart(2, '0');
}

function updateTimer() {
    const endTime = parseInt(localStorage.getItem(STORAGE_KEY));
    if (!endTime) {
        renderTime(currentPhase === 'WORK' ? SESSION.workTime : SESSION.breakTime);
        return;
    }

    const diffMs = endTime - Date.now();
    const diffSeconds = Math.ceil(diffMs / 1000);

    if (diffSeconds <= 0) {
        // Фаза закончилась — НЕ рисуем 00
        stopTimer();
        timerPhaseFinished();
        return;
    }

    renderTime(diffSeconds);
    animationFrameId = requestAnimationFrame(updateTimer);
}
function updatePhaseTitle() {
    phaseTitleEl.textContent =
        currentPhase === 'WORK' ? 'Работа' : 'Отдых';
}


function timerPhaseFinished() {
    playNotify();
    if (currentPhase === 'WORK') {
        if (currentCycle < SESSION.cycles) {
            startTimerPhase('BREAK', currentCycle); // переходим на перерыв
        } else {
            timerFinished();
        }
    } else if (currentPhase === 'BREAK') {
        startTimerPhase('WORK', currentCycle + 1); // следующий рабочий цикл
    }
}

function timerFinished() {
    alert('Сессия завершена!');
    resetTimer();
    //sessionData.endTime =new Date().toISOString();
    //await postSession(sessionData);
}

function restoreTimer() {
    const endTime = parseInt(localStorage.getItem(STORAGE_KEY));
    const savedCycle = parseInt(localStorage.getItem(CYCLE_KEY)) || 1;

    currentCycle = savedCycle;

    if (endTime && endTime > Date.now()) {
        // Восстанавливаем текущую фазу и продолжаем
        const remainingSeconds = Math.floor((endTime - Date.now()) / 1000);
        currentPhase = remainingSeconds > SESSION.breakTime ? 'WORK' : 'BREAK';
        updateTimer();
    } else {
        renderTime(SESSION.workTime);
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(CYCLE_KEY);
        currentPhase = 'WORK';
        currentCycle = 1;
    }
    updatePhaseTitle();
}

// ==================== События ====================
startBtn.addEventListener('click', () => startTimerPhase('WORK', currentCycle));
//resetBtn.addEventListener('click', resetTimer);

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateTimer();
});

function playNotify() {
    notify.src = notify.src;
    notify.play();
}

// ==================== Инициализация ====================
document.addEventListener('DOMContentLoaded', restoreTimer);
document.addEventListener('DOMContentLoaded', initCharacter);

// ==================== РЕЖИМ РАЗРАБОТЧИКА ====================
const devModeBtn = document.getElementById('devModeBtn');
devModeBtn.addEventListener('click', developerMode);

function developerMode() {
    if (!confirm('Активировать режим разработчика?\nWORK: 10с\nBREAK: 5с\nCYCLES: 2')) {
        return;
    }
    // Устанавливаем значения для отладки
    SESSION.workTime = 10;
    SESSION.breakTime = 5;
    SESSION.cycles = 2;

    // Полный сброс таймера
    resetTimer();
}
const resetTimerDevBtn = document.getElementById('resetTimerDevBtn');
resetTimerDevBtn.addEventListener('click', resetTimerForTesting);

function resetTimerForTesting() {
    if (!confirm('Сбросить таймер и очистить сохранённое состояние?')) {
        return;
    }

    // Останавливаем анимацию
    stopTimer();

    // Полностью чистим сохранённое состояние таймера
    localStorage.clear();

    // Сбрасываем внутреннее состояние
    currentPhase = 'WORK';
    currentCycle = 1;

    // Отрисовываем стартовое состояние (текущие настройки SESSION)
    renderTime(SESSION.workTime);

    console.log('Таймер сброшен для тестирования');
}

