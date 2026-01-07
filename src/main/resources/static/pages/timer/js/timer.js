import { postSession } from '../../../shared/api.js';

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

const STORAGE_KEY = 'timerEndTime';
const CYCLE_KEY = 'timerCurrentCycle';

let animationFrameId = null;
let currentPhase = 'WORK'; // WORK или BREAK
let currentCycle = 1;

// ==================== Таймер ====================

function startTimerPhase(phase, cycle) {
    currentPhase = phase;
    currentCycle = cycle;

    const seconds = phase === 'WORK' ? SESSION.workTime : SESSION.breakTime;
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

    const diff = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
    renderTime(diff);

    if (diff > 0) {
        animationFrameId = requestAnimationFrame(updateTimer);
    } else {
        // Фаза завершена
        timerPhaseFinished();
    }
}

function timerPhaseFinished() {
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
}

// ==================== События ====================
startBtn.addEventListener('click', () => startTimerPhase('WORK', currentCycle));
resetBtn.addEventListener('click', resetTimer);

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) updateTimer();
});

// ==================== Инициализация ====================
document.addEventListener('DOMContentLoaded', restoreTimer);
