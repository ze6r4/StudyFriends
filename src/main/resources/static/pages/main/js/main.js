import { getItems, patchItem } from '../../../shared/api.js';

import { generateItemHtml } from './item-cards.html.js';

const PLAYER_ID = 1;

let initialInRoom = new Set();   // что было изначально
let selectedItems = new Map();   // текущий предпросмотр
let isShopOpen = false;
let allItems = [];

let currentTab = "bought";

document.addEventListener("DOMContentLoaded", initMain);

async function initMain() {
    bindTogglePanel();
    bindTabs();
    bindApplyButton();
    bindOutsideClick();

    allItems = await loadItems();

    initialInRoom = new Set(
        allItems.filter(i => i.inRoom).map(i => i.itemId)
    );

    renderInitialRoom();
    renderCurrentTab();
}


/* ========================= */

async function loadItems() {
    const items = await getItems(PLAYER_ID);
    return Array.isArray(items) ? items : [];
}

/* =========================
   Табы
========================= */

function bindTabs() {
    document.querySelectorAll(".tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            currentTab = tab.dataset.tab;
            renderCurrentTab();
        });
    });
}

function renderCurrentTab() {
    const grid = document.querySelector(".items-grid");

    const filtered = allItems.filter(item =>
        currentTab === "bought"
            ? item.isBought
            : !item.isBought
    );

    grid.innerHTML = generateItemHtml(filtered);
    bindItemClicks();
}

/* =========================
   Выбор предметов
========================= */

function bindItemClicks() {
    document.querySelectorAll(".item-card").forEach(card => {
        card.addEventListener("click", () => toggleItem(card));
    });
}

function toggleItem(card) {
    const id = Number(card.dataset.itemId);
    const item = allItems.find(i => i.itemId === id);

    if (selectedItems.has(id)) {
        selectedItems.delete(id);
        card.classList.remove("selected");
        removePreview(id);
    } else {
        selectedItems.set(id, item);
        card.classList.add("selected");
        addPreview(item);
    }

    updateBottomBar();
}

/* =========================
   Предпросмотр
========================= */

function addPreview(item) {
    const img = document.createElement("img");
    img.src = `../../assets/images/items/${item.itemImage}.png`;
    img.dataset.previewId = item.itemId;
    document.getElementById("roomItems").appendChild(img);
}

function removePreview(id) {
    const el = document.querySelector(`[data-preview-id="${id}"]`);
    if (el) el.remove();
}

/* =========================
   Нижняя панель
========================= */

function updateBottomBar() {
    const totalPrice = [...selectedItems.values()]
        .filter(i => !i.isBought)
        .reduce((sum, i) => sum + i.itemPrice, 0);

    const priceEl = document.getElementById("totalPrice");
    const btn = document.getElementById("applyBtn");

    if (totalPrice > 0) {
        priceEl.textContent = `Стоимость: ${totalPrice} 🪙`;
        btn.textContent = "Купить";
    } else {
        priceEl.textContent = "";
        btn.textContent = "Применить";
    }
}

function bindApplyButton() {
    document.getElementById("applyBtn")
        .addEventListener("click", applyChanges);
}

async function applyChanges() {

    const selectedIds = new Set(selectedItems.keys());

    for (const item of allItems) {

        const shouldBeInRoom = selectedIds.has(item.itemId);

        const updatedData = new FormData();
        updatedData.append("in_room", shouldBeInRoom);
        updatedData.append("is_bought", shouldBeInRoom ? true : item.isBought);

        await patchItem(item.id, updatedData);
    }

    initialInRoom = new Set(selectedIds);

    selectedItems.clear();
    toggleShop();
}
function resetChanges() {

    selectedItems.clear();

    document.getElementById("roomItems").innerHTML = "";

    allItems.forEach(item => {
        if (initialInRoom.has(item.itemId)) {
            addPreview(item);
        }
    });

    document.querySelectorAll(".item-card")
        .forEach(card => card.classList.remove("selected"));

    updateBottomBar();
}


/* =========================
   Панель
========================= */

function bindTogglePanel() {
    document
        .getElementById("toggleShopBtn")
        .addEventListener("click", toggleShop);
}

function toggleShop() {
    const panel = document.getElementById("shopPanel");
    const room = document.getElementById("room");

    isShopOpen = !isShopOpen;

    panel.classList.toggle("open");

    if (isShopOpen) {
        room.style.transform = "translateX(80px)";
    } else {
        resetChanges();
        room.style.transform = "translateX(0)";
    }
}
function bindOutsideClick() {
    document.addEventListener("click", (e) => {
        if (!isShopOpen) return;

        const panel = document.getElementById("shopPanel");
        const button = document.getElementById("toggleShopBtn");

        if (!panel.contains(e.target) && !button.contains(e.target)) {
            toggleShop();
        }
    });
}


/* =========================
   Загрузка inRoom
========================= */

function renderInitialRoom() {
    const inRoomItems = allItems.filter(i => i.inRoom);

    inRoomItems.forEach(item => {
        addPreview(item);
    });
}
