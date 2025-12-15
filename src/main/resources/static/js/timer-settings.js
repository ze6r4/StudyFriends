
// заполнение значений ползунков
function bindSlider(sliderId, textId) {
    const slider = document.getElementById(sliderId);
    const text = document.getElementById(textId);

    function update() {
        text.textContent = slider.value;
    }

    slider.addEventListener("input", update);
    update();
}
bindSlider("workMinutes", "workValueText");
bindSlider("restMinutes", "restValueText");
bindSlider("cyclesAmount", "cyclesValueText");

// подсчет времени
function updateTotalTime() {
    const work = Number(document.getElementById("workMinutes").value);
    const rest = Number(document.getElementById("restMinutes").value);
    const cycles = Number(document.getElementById("cyclesAmount").value);

    const totalMinutes = (work + rest) * cycles;

    const text = document.getElementById("totalTime");

    // Формат красиво: "1 ч 30 мин" или "45 мин"
    if (totalMinutes >= 60) {
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        text.textContent = `Время сессии: ${h} ч ${m} мин`;
    } else {
        text.textContent = `Время сессии: ${totalMinutes} мин`;
    }
}
document.getElementById("workMinutes").addEventListener("input", updateTotalTime);
document.getElementById("restMinutes").addEventListener("input", updateTotalTime);
document.getElementById("cyclesAmount").addEventListener("input", updateTotalTime);

// Первоначальный расчёт
updateTotalTime();


// окрас ползунка
function colorTrack(sliderId) {
    const slider = document.getElementById(sliderId);

    function update() {
        const min = Number(slider.min);
        const max = Number(slider.max);
        const val = Number(slider.value);

        const percent = ((val - min) / (max - min)) * 100 + "%";

        slider.style.setProperty("--pos", percent);
    }

    slider.addEventListener("input", update);
    update();
}

colorTrack("workMinutes");
colorTrack("restMinutes");
colorTrack("cyclesAmount");

const API_BASE = 'http://localhost:8081/api/sessions';
const PLAYER_ID = 1;

async function startSession() {

    // Читаем значения прямо перед отправкой
    const sessionData = {
        workMinutes: parseInt(document.getElementById('workMinutes').value, 10),
        restMinutes: parseInt(document.getElementById('restMinutes').value, 10),
        cycles: parseInt(document.getElementById('cyclesAmount').value, 10),
        playerId: PLAYER_ID,
        friendId: parseInt(document.getElementById('selectFriend').value, 10),
        skillId: parseInt(document.getElementById('selectSkill').value, 10)
    };

    try {
        const response = await fetch(API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sessionData)
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const result = await response.json();
        console.log('Сессия создана!', result);

        // window.location.href = `timer.html?sessionId=${result.sessionId}`;

    } catch (error) {
        console.error('Ошибка:', error);
        alert(`🤕Ой-ой-ой... Вот что случилось:\n${error.message}`);
    }

    localStorage.setItem(`currentSession${PLAYER_ID}`, JSON.stringify(sessionData));
}

window.startSession = startSession;
