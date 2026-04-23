import {
    getStatistics,
    getMe,
    getSessionsOfWeek
} from '../../../../shared/api.js';

const days = ["Понедельник","Вторник","Среда","Четверг","Пятница","Суббота","Воскресенье"];

let book;
let opened = false;

document.addEventListener("DOMContentLoaded", () => {

    book = document.getElementById("book");

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" && !opened) {
            book.classList.add("open");
            opened = true;
        }

        if (e.key === "ArrowLeft" && opened) {
            book.classList.remove("open");
            opened = false;
        }
    });

    init();
});

async function init() {
    const player = await getMe();
    const playerId = player?.id;

    if (!playerId) {
        console.error("Игрок не найден");
        return;
    }

    await loadStatistics(playerId);
    await loadWeek(playerId);
}

/* ---------------- WEEK ---------------- */

async function loadWeek(playerId) {
    const sessions = await getSessionsOfWeek(playerId);

    renderWeek(sessions);

    document.getElementById("totalStats").textContent = sessions.length;
}

function renderWeek(daysData) {

    const left = document.getElementById("leftPage");
    const right = document.getElementById("rightPage");

    left.innerHTML = "";
    right.innerHTML = "";

    daysData.forEach((dayDto, i) => {

        const container = document.createElement("div");
        container.className = "day-block";
        let html = `<h3 class="day-title">${dayDto.dayName}</h3>`;

        if (!dayDto.sessions || dayDto.sessions.length === 0) {
            html += `<div class="session">
                        <div class="row">
                            <span>отдых!</span>
                        </div>
                    </div>`;
        } else {

            dayDto.sessions.forEach(s => {

                const total = (s.workMinutes + s.restMinutes) * s.cycles;

                html += `
                <div class="session">

                    <div class="time-line">
                        <b>${formatTime(s.date)} ${s.skillName}</b>

                        <div class="row">
                            <span>${s.workMinutes} мин работы</span>
                        </div>

                        <div class="row">
                            <span>${s.restMinutes} мин отдыха</span>
                        </div>

                    </div>

                    <div class="session-meta">

                        <img class="brace" src="/../../assets/images/other/brace.png" alt="}" />
                        <div class="cycles">
                            ${formatCycles(s.cycles)}
                        </div>



                    </div>

                </div>
                `;
            });
        }

        container.innerHTML = html;

        if (i < 4) left.appendChild(container);
        else right.appendChild(container);
    });
}
/* ---------------- STATS ---------------- */

async function loadStatistics(playerId) {
    const data = await getStatistics(playerId);

    let day = 0, week = 0, month = 0, total = 0;

    data.forEach(s => {
        day += s.minutesOfDay || 0;
        week += s.minutesOfWeek || 0;
        month += s.minutesOfMonth || 0;
        total += s.totalMinutes || 0;
    });

    document.getElementById("dayStats").textContent = format(day);
    document.getElementById("weekStats").textContent = format(week);
    document.getElementById("monthStats").textContent = format(month);
    document.getElementById("totalStats").textContent = format(total);
}

/* ---------------- UTILS ---------------- */

function format(min) {
    if (min >= 60) {
        const h = Math.floor(min / 60);
        const m = min % 60;
        return `${h} ч ${m} мин`;
    }
    return `${min} мин`;
}

function formatTime(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit"
    });
}
function formatCycles(n) {
    const last = n % 10;
    const last2 = n % 100;

    if (last2 >= 11 && last2 <= 14) return `${n} раз`;

    if (last === 1) return `${n} раз`;
    if (last >= 2 && last <= 4) return `${n} раза`;

    return `${n} раз`;
}