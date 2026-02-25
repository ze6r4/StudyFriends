import { patchSession, getCharacter, getFriend, getMe } from '../../../shared/api.js';

// ==================== КОНФИГУРАЦИЯ ====================
const sessionDataStr = localStorage.getItem('currentSession');
const sessionData = sessionDataStr ? JSON.parse(sessionDataStr) : null;
console.log(sessionData);

const PHASE_KEY = 'timerPhase';

const DEFAULTS = {
    WORK_TIME: 25 * 60,
    BREAK_TIME: 5 * 60,
    CYCLES: 4
};

let actualRest = 0;
let actualWork = 0;
export const SESSION = {
    workTime: sessionData?.workMinutes
        ? sessionData.workMinutes * 60
        : DEFAULTS.WORK_TIME,

    breakTime: sessionData?.restMinutes
        ? sessionData.restMinutes * 60
        : DEFAULTS.BREAK_TIME,
    cycles: sessionData?.cycles ?? DEFAULTS.CYCLES,
    playerId: sessionData?.playerId ?? null,
    skillId: sessionData?.skillId ?? null,
    friendId: sessionData?.friendId ?? null
};

// ==================== DOM ====================
const minutesEl = document.getElementById('timer-minutes');
const secondsEl = document.getElementById('timer-seconds');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('giveupBtn');
const phaseTitleEl = document.getElementById('phaseTitle');

const characterImg = document.getElementById('characterImg');
const tableImg = document.getElementById('tableImg');
const notesImg = document.getElementById('notesImg');

const STORAGE_KEY = 'timerEndTime';
const CYCLE_KEY = 'timerCurrentCycle';

let animationFrameId = null;
let currentPhase = 'WORK'; // WORK или BREAK
let currentCycle = 1;
let currentCharacter = null;

const notify = new Audio('/assets/audio/notify1.mp3');

notify.volume = 0.5;
// ==================== Инициализация персонажа ====================
async function initCharacter() {
    const friend = await getFriend(SESSION.friendId);
    const character = await getCharacter(friend.characterId);

    currentCharacter = character; // сохраняем

    updateCharacterImage(); // устанавливаем картинку по текущей фазе

    console.log('Персонаж загружен:', character.studyImage);
}

function setBackground(imageName) {
    characterImg.src = "/assets/images" + `/characters/${imageName}.png`;
}
function updateCharacterImage() {
    if (!currentCharacter) return;

    const imageName =
        currentPhase === 'WORK'
            ? currentCharacter.studyImage
            : currentCharacter.restImage;

    setBackground(imageName);
}


// ==================== Таймер ====================

function startTimerPhase(phase, cycle) {
    currentPhase = phase;
    currentCycle = cycle;

    updatePhaseTitle();
    updateCharacterImage(); // 👈 ВАЖНО

    const seconds = phase === 'WORK'
        ? SESSION.workTime
        : SESSION.breakTime;

    const endTime = Date.now() + seconds * 1000;

    localStorage.setItem(STORAGE_KEY, endTime);
    localStorage.setItem(CYCLE_KEY, currentCycle);
    localStorage.setItem(PHASE_KEY, currentPhase);

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
    notifyPhase(); // 🔔 уведомление

    playNotify();  // 🔊 звук (сыграет только при активной вкладке)

    if (currentPhase === 'WORK') {
        actualWork += SESSION.workTime;

        if (currentCycle < SESSION.cycles) {
            startTimerPhase('BREAK', currentCycle);
        } else {
            timerFinished(true);
        }

    } else {
        actualRest += SESSION.breakTime;
        startTimerPhase('WORK', currentCycle + 1);
    }
}

async function timerFinished(isCompleted) {
    alert('Сессия завершена!');
    resetTimer();
    const newData = {
        workTime: actualWork,
        restTime: actualRest,
        completed: isCompleted
    }
    console.log(newData);
    await patchSession(sessionData.sessionId,newData);
}

function restoreTimer() {
    let endTime = parseInt(localStorage.getItem(STORAGE_KEY));
    let phase = localStorage.getItem(PHASE_KEY);
    let cycle = parseInt(localStorage.getItem(CYCLE_KEY)) || 1;

    if (!endTime || !phase) {
        resetTimer();
        return;
    }

    let now = Date.now();

    while (endTime <= now) {
        if (phase === 'WORK') {
            actualWork += SESSION.workTime;
            phase = 'BREAK';
            endTime += SESSION.breakTime * 1000;
        } else {
            actualRest += SESSION.breakTime;
            cycle++;

            if (cycle > SESSION.cycles) {
                timerFinished(true);
                return;
            }

            phase = 'WORK';
            endTime += SESSION.workTime * 1000;
        }
    }


    currentPhase = phase;
    currentCycle = cycle;

    localStorage.setItem(STORAGE_KEY, endTime);
    localStorage.setItem(PHASE_KEY, phase);
    localStorage.setItem(CYCLE_KEY, cycle);

    updateCharacterImage();
    updatePhaseTitle();
    updateTimer();
}


// ==================== События ====================
startBtn.addEventListener('click', async () => {
    if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
    }

    startTimerPhase('WORK', currentCycle);
});


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
document.addEventListener('DOMContentLoaded', initDeveloperButtons);

// ==================== РЕЖИМ РАЗРАБОТЧИКА ====================

async function initDeveloperButtons() {
    try {
        const me = await getMe();

        if (!me?.developer) return;

        const footer = document.querySelector('.footer');
        if (!footer) return;

        // создаём кнопки
        const devModeBtn = document.createElement('button');
        devModeBtn.textContent = 'Режим разработчика';
        devModeBtn.id = 'devModeBtn';
        devModeBtn.addEventListener('click', developerMode);

        const resetTimerDevBtn = document.createElement('button');
        resetTimerDevBtn.textContent = 'Очистить localStorage';
        resetTimerDevBtn.id = 'resetTimerDevBtn';
        resetTimerDevBtn.addEventListener('click', resetTimerForTesting);

        footer.appendChild(devModeBtn);
        footer.appendChild(resetTimerDevBtn);

        console.log('Developer mode enabled');
    } catch (e) {
        console.error('Ошибка проверки developer:', e);
    }
}
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
function notifyPhase() {
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    const isWork = currentPhase === 'WORK';

    new Notification(
        isWork ? 'Рабочая фаза завершена' : 'Перерыв окончен',
        {
            body: isWork
                ? 'Отдихаем '
                : 'Возвращаемся к работе '
        }
    );
}

