import {
    getStatistics,
    getMe,
    getSessionsOfWeek
} from '../../../../shared/api.js';

const SESSIONS_PER_PAGE = 4;
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

    const container = document.getElementById("spreadContainer");
    container.innerHTML = "";

    let pages = [];

    // 1. разбиваем дни на страницы
    daysData.forEach(day => {
        const dayPages = splitDayIntoPages(day);
        pages.push(...dayPages);
    });

    // 2. создаём развороты (по 2 страницы)
    for (let i = 0; i < pages.length; i += 2) {

        const spread = document.createElement("div");
        spread.className = "spread";

        // левая страница
        const leftPage = createPage(pages[i]);
        spread.appendChild(leftPage);

        // правая страница (если есть)
        if (pages[i + 1]) {
            const rightPage = createPage(pages[i + 1]);
            spread.appendChild(rightPage);
        }

        container.appendChild(spread);
    }
}
function createPage(pageData) {

    const page = document.createElement("div");
    page.className = "page";

    let html = `<h3 class="day-title">${pageData.dayName}</h3>`;

    if (!pageData.sessions.length) {
        html += `<div class="session">отдых!</div>`;
    } else {

        pageData.sessions.forEach(s => {

            const isReversed = Math.random() > 0.5;

            const total = (s.workMinutes + s.restMinutes) * s.cycles;

            html += `
            <div class="session ${isReversed ? "reverse" : ""}">

                <div class="time-line">
                    <b>${formatTime(s.date)} ${s.skillName}</b>
                </div>

                <div class="session-horizontal">

                    <div class="minutes">
                        <div>${s.workMinutes} мин работы</div>
                        <div>${s.restMinutes} мин отдыха</div>
                    </div>

                    <div class="session-cycles">
                        <img class="brace" src="../../assets/images/other/brace.png">
                        <div class="cycles">${formatCycles(s.cycles)}</div>
                    </div>

                    ${s.notes ? `
                        <div class="sticker">
                            <p>заметки:</p>
                            ${s.notes}
                        </div>
                    ` : ""}

                </div>

                <div>Всего: ${format(total)}</div>

            </div>`;
        });
    }

    page.innerHTML = html;
    return page;
}
function splitDayIntoPages(dayDto) {
    const pages = [];

    const sessions = dayDto.sessions || [];

    if (sessions.length === 0) {
        pages.push({
            dayName: dayDto.dayName,
            sessions: []
        });
        return pages;
    }

    for (let i = 0; i < sessions.length; i += SESSIONS_PER_PAGE) {
        pages.push({
            dayName: dayDto.dayName,
            sessions: sessions.slice(i, i + SESSIONS_PER_PAGE)
        });
    }

    return pages;
}
/* ---------------- STATS ---------------- */

async function loadStatistics(playerId) {
    const data = await getStatistics(playerId);

    let day = 0, week = 0, month = 0, total = 0;

    data.forEach(s => {
        day += s.minutesOfDay || 0;
        week += s.minutesOfWeek || 0;
        month += s.minutesOfMonth || 0;
        total += s.totalCountOfSessions || 0;
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

        if (m === 0) {
            return `${h} ч`;
        }

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