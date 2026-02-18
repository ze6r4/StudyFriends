import { getItems } from '../../../shared/api.js';
import { generateItemHtml } from './item-cards.html.js';

const PLAYER_ID = 1;

let itemsGrid = null;
let shopPanel = null;
let roomContainer = null;
let room = null;

let scale = 1;
let positionX = 0;
let isDragging = false;
let startX = 0;

document.addEventListener("DOMContentLoaded", initMain);

async function initMain() {
    itemsGrid = document.querySelector(".items-grid");
    shopPanel = document.getElementById("shopPanel");
    roomContainer = document.getElementById("roomContainer");
    room = document.getElementById("room");

    bindTogglePanel();
    bindZoom();
    bindDrag();

    const items = await loadItems();
    renderItems(items);
}

/* =========================
   Загрузка предметов
========================= */

async function loadItems() {
    const items = await getItems(PLAYER_ID);
    return Array.isArray(items) ? items : [];
}

function renderItems(items) {
    if (items.length === 0) {
        itemsGrid.innerHTML = "<p>Нет предметов</p>";
        return;
    }

    itemsGrid.innerHTML = generateItemHtml(items);
}

/* =========================
   Панель
========================= */

function bindTogglePanel() {
    document
        .getElementById("toggleShopBtn")
        .addEventListener("click", togglePanel);
}

function togglePanel() {
    shopPanel.classList.toggle("open");
    roomContainer.classList.toggle("shifted");
}

/* =========================
   Zoom
========================= */

function bindZoom() {
    roomContainer.addEventListener("wheel", (e) => {
        e.preventDefault();

        const delta = e.deltaY * -0.001;
        scale += delta;
        scale = Math.min(Math.max(0.5, scale), 2);

        updateTransform();
    });
}

/* =========================
   Drag
========================= */

function bindDrag() {
    room.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX - positionX;
    });

    window.addEventListener("mouseup", () => {
        isDragging = false;
    });

    window.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        positionX = e.clientX - startX;
        updateTransform();
    });
}

function updateTransform() {
    room.style.transform = `translateX(${positionX}px) scale(${scale})`;
}
