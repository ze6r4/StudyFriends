import {
    getStatistics,
    getMe
} from '../../../../shared/api.js';

let book;
let currentSpread = 0;
let spreads = [];
let bookBlocks = [];

let YELLOW_THRESHOLD = 2;
let GREEN_THRESHOLD = 4;

const PAGE_HEIGHT = 800;

/* ---------------- INIT ---------------- */

document.addEventListener("DOMContentLoaded", () => {

    book = document.getElementById("book");
    document.getElementById("spreadScreen").style.display = "none";
    document.getElementById("coverScreen").style.display = "block";

    init();
});

async function init() {

    const player = await getMe();
    const playerId = player?.id;

    if (!playerId) return;

    document.getElementById("nickname").textContent = player.name;

    bookBlocks = await getStatistics(playerId);

    renderBook(bookBlocks);
}

/* ---------------- CORE ---------------- */

function renderBook(blocks) {

    const container = document.getElementById("spreadContainer");
    container.innerHTML = "";

    const elements = buildElements(blocks);

    const pages = paginate(elements);

    renderSpreads(pages, container);
//    initThresholdHandlers();
}

/* ---------------- BUILD CONTENT ---------------- */
function buildElements(blocks) {

     const elements = [];

     blocks.forEach(block => {

         switch (block.type) {

             case "COVER":
                 elements.push(createElement("toc", {
                     months: block.data.months,
                     totalSessions: block.data.totalSessions
                 }));
                 break;

             case "MONTH":
                 elements.push(createElement("month-header", {
                     month: {
                         ...block.data,
                         monthName: block.title
                     },
                     forceNewPage: true
                 }));
                 break;

             case "SESSION":

                 const session = block.data.session ?? block.data;

                 elements.push(createElement("session", {
                     session,
                     title: block.title // ✅ ВОТ ОН ФИКС
                 }));

                 if (block.data.dayTotal) {
                     elements.push(createElement("day-summary", {
                         dayTotal: block.data.dayTotal
                     }));
                 }

                 break;

             case "WEEK":
                 elements.push(createElement("week-summary", {
                     week: {
                         ...block.data,
                         weekName: block.title
                     },
                     forceNewPage: true
                 }));
                 break;
         }
     });

     return elements;
    }

/* ---------------- PAGINATION ---------------- */

function paginate(elements) {

    const pages = [];

    let currentPage = createEmptyPage();

    document.body.appendChild(currentPage);

    elements.forEach(el => {

        const node = renderElement(el);

        currentPage.appendChild(node);

        if (currentPage.scrollHeight > PAGE_HEIGHT) {

            currentPage.removeChild(node);

            pages.push(currentPage);

            currentPage = createEmptyPage();
            document.body.appendChild(currentPage);

            currentPage.appendChild(node);
        }
    });

    if (currentPage.children.length) {
        pages.push(currentPage);
    }

    pages.forEach(p => p.remove());

    return pages;
}

function createEmptyPage() {
    const page = document.createElement("div");
    page.className = "page";
    page.style.position = "absolute";
    page.style.visibility = "hidden";
    page.style.height = PAGE_HEIGHT + "px";
    page.style.overflow = "hidden";
    return page;
}

/* ---------------- RENDER SPREADS ---------------- */

function renderSpreads(pages, container) {

    spreads = [];
    container.innerHTML = "";

    for (let i = 0; i < pages.length; i += 2) {

        const spread = document.createElement("div");
        spread.className = "spread";
        spread.style.display = "none";

        spread.appendChild(preparePage(pages[i]));

        if (pages[i + 1]) {
            spread.appendChild(preparePage(pages[i + 1]));
        }

        container.appendChild(spread);
        spreads.push(spread);
    }

    showSpread(0);
}

function showSpread(index) {
    spreads.forEach(s => s.style.display = "none");

    if (spreads[index]) {
        spreads[index].style.display = "flex";
        currentSpread = index;
    }
}

function preparePage(page) {
    page.style.position = "";
    page.style.visibility = "";
    page.style.height = "";
    page.style.overflow = "";
    return page;
}

/* ---------------- ELEMENT FACTORY ---------------- */

function createElement(type, data) {
    return { type, ...data };
}

function renderElement(el) {

    const wrapper = document.createElement("div");

    switch (el.type) {

        case "toc":
            wrapper.innerHTML = renderTOC(el.months, el.totalSessions);
            break;

        case "month-header":
            wrapper.innerHTML = renderMonth(el.month);
            break;

        case "week-summary":
            wrapper.innerHTML = `<div class="full-page">${renderWeekSummary(el.week)}</div>`;
            break;

        case "session":
            wrapper.innerHTML = renderSession(el.session, el.title);
            break;

        case "day-summary":
            wrapper.innerHTML = renderDaySummary(el.dayTotal);
            break;
    }

    return wrapper;
}

/* ---------------- RENDERERS ---------------- */

function renderTOC(months, totalSessions) {
    return `
        <h2>Оглавление</h2>
        ${months.map((m, i) => `
            <div>${i + 1}. ${m.month}/${m.year} — ${m.sessions}</div>
        `).join("")}
        <div>ВСЕГО СЕССИЙ: ${totalSessions}</div>
    `;
}

function renderMonth(month) {

    const days = month.daysHours;

    const firstDay = new Date(month.year, month.monthIndex, 1);
    let startOffset = (firstDay.getDay() + 6) % 7;

    const cells = [];

    for (let i = 0; i < startOffset; i++) {
        cells.push(`<div></div>`);
    }

    days.forEach(h => {
        const color = getColor(h);
        cells.push(`<div class="circle ${color}"></div>`);
    });

    return `
        <div class="month-header">
            <h2 style="text-align:center">${month.monthName}</h2>

            <div class="weekdays">
                <div>пн</div><div>вт</div><div>ср</div>
                <div>чт</div><div>пт</div><div>сб</div><div>вс</div>
            </div>

            <div class="circles">${cells.join("")}</div>

            <div class="legends">
                <div class="legend element">
                    <div class="circle none"></div> нет сессий
                </div>
                <div class="legend element">
                    <div class="circle red"></div> ${YELLOW_THRESHOLD}ч
                </div>
                <div class="legend element">
                    <div class="circle yellow"></div>
                    от <input class="threshold yellow-input" type="number" value="${YELLOW_THRESHOLD}"/>
                </div>
                <div class="legend element">
                    <div class="circle green"></div>
                    от <input class="threshold green-input" type="number" value="${GREEN_THRESHOLD}"/>
                </div>
            </div>
        </div>
    `;
}

function renderDaySummary(dayTotal) {

    if (!dayTotal?.skills?.length) return "";

    return `
        <div class="day-summary">
            ${dayTotal.skills.map(t => `
                <div class="row">
                    <span>${t.skill.name}</span>
                    <span>${format(t.minutes)}</span>
                </div>
            `).join("")}
        </div>
    `;
}

function renderWeekSummary(week) {

    return `
        <h2>${week.weekName}</h2>

        ${week.skills.map(t => `
            <div class="row">
                <span>${t.skill.name}</span>
                <span>${format(t.minutes)}</span>
            </div>
        `).join("")}

        <hr>
        <b>Всего: ${format(week.totalMinutes)}</b>
    `;
}

function renderSession(s, title) {

    const isReversed = Math.random() > 0.5;
    const total = (s.workMinutes + s.restMinutes) * s.cycles;
    return `
        <div class="session ${isReversed ? "reverse" : ""}">
            ${title ? `<h3 class="day-title">${title}</h3>` : ""}

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
}
/* ---------------- UTILS ---------------- */

function getColor(hours) {
    if (hours <= 0) return "none";
    if (hours >= GREEN_THRESHOLD) return "green";
    if (hours >= YELLOW_THRESHOLD) return "yellow";
    return "red";
}

function format(min) {
    if (min >= 60) {
        const h = Math.floor(min / 60);
        const m = min % 60;
        return m === 0 ? `${h} ч` : `${h} ч ${m} мин`;
    }
    return `${min} мин`;
}

function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString("ru-RU", {
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

/* ---------------- NAVIGATION ---------------- */

let opened = false;

document.addEventListener("keydown", (e) => {

    if (e.key === "ArrowRight") {
        if (!opened) return openBook();
        if (currentSpread < spreads.length - 1) showSpread(currentSpread + 1);
    }

    if (e.key === "ArrowLeft") {
        if (currentSpread > 0) return showSpread(currentSpread - 1);
        if (opened) closeBook();
    }
});

function openBook() {
    document.getElementById("coverScreen").style.display = "none";
    document.getElementById("spreadScreen").style.display = "block";
    opened = true;
}

function closeBook() {
    document.getElementById("coverScreen").style.display = "block";
    document.getElementById("spreadScreen").style.display = "none";
    opened = false;
}