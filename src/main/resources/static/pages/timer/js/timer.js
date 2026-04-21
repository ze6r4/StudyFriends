import { patchSession,postRewards, getCharacter, getFriend, getSkill,getMe } from '../../../shared/api.js';
import { showError } from '../../../shared/showError.js';
import {showFinalNotes} from './rewards.js';
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
const ORIGINAL_SESSION = {
    workTime: SESSION.workTime,
    breakTime: SESSION.breakTime,
    cycles: SESSION.cycles
};

// ==================== DOM ====================
const minutesEl = document.getElementById('timer-minutes');
const secondsEl = document.getElementById('timer-seconds');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('giveupBtn');
const phaseTitleEl = document.getElementById('phaseTitle');
const exitBtn = document.getElementById('exitBtn');
const finishNowBtn = document.getElementById('finishNowBtn');
const devModeBtn = document.getElementById('devModeBtn');
const resetTimerDevBtn = document.getElementById('resetTimerDevBtn');

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
function updateCharacterImage() {
    if (!currentCharacter) return;

    const imageName =
        currentPhase === 'WORK'
            ? currentCharacter.studyImage
            : currentCharacter.restImage;

     characterImg.src = "/assets/images" + `/characters/${imageName}.png`;
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

    exitBtn.style.display = 'block'; // оставить кнопку выхода
    startBtn.style.display = 'none';

    resetTimer();

    const newData = {
        workTime: actualWork,
        restTime: actualRest,
        completed: isCompleted,
        notes: trimNotes()
    }
    console.log(newData);

    const session = await patchSession(sessionData.sessionId,newData);
    // 🔥 получаем АКТУАЛЬНЫЕ данные
    const [skillData, friendData] = await Promise.all([
        getSkill(SESSION.skillId),
        getFriend(SESSION.friendId)
    ]);

    const rewards = await postRewards(session);

    if(!rewards) {
        showError({ message:'не удалось загрузить награды!'});
    }
    else if(!skillData){
        showError({message:'не удалось получить навык!'})
    }
    else if(!friendData){
        showError({message:'не удалось получить друга!'})
    }
    else {
        console.log("fdksfksdf");
        await showFinalNotes(rewards, skillData, friendData);
    }

}

function trimNotes() {
    let notes = document.getElementById('notesContent');
    let notesContent = notes.innerHTML;
    notesContent = notesContent.replace(/<\/p>/g, '\n');
    notesContent = notesContent.replace(/<p>/g, '');
    notesContent = notesContent.trim();
    return notesContent;
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
            actualWork += ORIGINAL_SESSION.workTime;
            phase = 'BREAK';
            endTime += SESSION.breakTime * 1000;
        } else {
            actualRest += ORIGINAL_SESSION.breakTime;
            cycle++;

            if (cycle > SESSION.cycles) {
                timerFinished(true);
                return;
            }

            phase = 'WORK';
            endTime += ORIGINAL_SESSION.workTime * 1000;
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

    startBtn.style.display = 'none';
    exitBtn.style.display = 'block';

    startTimerPhase('WORK', currentCycle);
});

exitBtn.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CYCLE_KEY);
    localStorage.removeItem(PHASE_KEY);

    window.location.href =  'http://localhost:8081/pages/main/main.html'; // или куда тебе нужно
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
devModeBtn?.addEventListener('click', developerMode);
resetTimerDevBtn?.addEventListener('click', resetTimerForTesting);
finishNowBtn?.addEventListener('click', finishSessionDev);



// ==================== РЕЖИМ РАЗРАБОТЧИКА ====================

async function initDeveloperButtons() {
    try {
        const me = await getMe();

        if (!me?.developer) return;

        const footer = document.querySelector('.footer');
        if (!footer) return;

        footer.classList.remove('hidden');

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
function finishSessionDev() {
    if (!confirm('Завершить сессию мгновенно?')) return;

    stopTimer();

    // имитируем полностью завершённую сессию
    actualWork = ORIGINAL_SESSION.workTime * ORIGINAL_SESSION.cycles;
    actualRest = ORIGINAL_SESSION.breakTime * (ORIGINAL_SESSION.cycles - 1);

    timerFinished(true);
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

