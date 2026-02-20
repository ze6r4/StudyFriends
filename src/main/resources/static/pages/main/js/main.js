import { getItems, patchItem } from '../../../shared/api.js';
import { generateItemHtml } from './item-cards.html.js';

const PLAYER_ID = 1;

let allItems = [];
let initialInRoom = new Set();

let itemsToAdd = new Set();
let itemsToRemove = new Set();

let currentTab = "bought";
let isShopOpen = false;

let panelOffset = 0;
let translateX = 0;
let scale = 1;

let room;

/* ========================= */

document.addEventListener("DOMContentLoaded", initMain);

async function initMain() {
    room = document.getElementById("room");

    bindTogglePanel();
    bindTabs();
    bindApplyButton();
    bindOutsideClick();

    allItems = await loadItems();

    initialInRoom = new Set(
        allItems.filter(i => i.inRoom).map(i => i.id)
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
   ТАБЫ
========================= */

function bindTabs() {
    document.querySelectorAll("#shopPanel .tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document
                .querySelectorAll("#shopPanel .tab")
                .forEach(t => t.classList.remove("active"));

            tab.classList.add("active");
            currentTab = tab.dataset.tab;
            renderCurrentTab();
        });
    });
}

function renderCurrentTab() {
    const grid = document
        .getElementById("shopPanel")
        .querySelector(".items-grid");

    const filtered = allItems.filter(item =>
        currentTab === "bought"
            ? item.isBought
            : !item.isBought
    );

    grid.innerHTML = generateItemHtml(filtered);

    highlightActiveItems();
    bindItemClicks();
}

function highlightActiveItems() {
    document
        .querySelectorAll("#shopPanel .item-card")
        .forEach(card => {

            const id = Number(card.dataset.id);

            if (initialInRoom.has(id) && !itemsToRemove.has(id)) {
                card.classList.add("selected");
            }
        });
}

/* =========================
   ВЫБОР ПРЕДМЕТОВ
========================= */

function bindItemClicks() {
    document
        .querySelectorAll("#shopPanel .item-card")
        .forEach(card => {
            card.addEventListener("click", () => toggleItem(card));
        });
}

function toggleItem(card) {

    const id = Number(card.dataset.id);
    const item = allItems.find(i => i.id === id);

    if (!item) return; // защита

    const isInitiallyInRoom = initialInRoom.has(id);
    const isMarkedToAdd = itemsToAdd.has(id);
    const isMarkedToRemove = itemsToRemove.has(id);

    if (isInitiallyInRoom) {

        if (isMarkedToRemove) {
            itemsToRemove.delete(id);
            card.classList.add("selected");
            addPreview(item);
        } else {
            itemsToRemove.add(id);
            card.classList.remove("selected");
            removePreview(id);
        }

    } else {

        if (isMarkedToAdd) {
            itemsToAdd.delete(id);
            card.classList.remove("selected");
            removePreview(id);
        } else {
            itemsToAdd.add(id);
            card.classList.add("selected");
            addPreview(item);
        }
    }

    updateBottomBar();
}

/* =========================
   ПРЕДПРОСМОТР
========================= */

function addPreview(item) {

    if (!item.itemImage) return;

    if (document.querySelector(`[data-preview-id="${item.id}"]`)) return;

    const img = document.createElement("img");
    img.src = `../../assets/images/items/${item.itemImage}.png`;
    img.dataset.previewId = item.id;

    document.getElementById("roomItems").appendChild(img);
}

function removePreview(id) {
    const el = document.querySelector(`[data-preview-id="${id}"]`);
    if (el) el.remove();
}

/* =========================
   НИЖНЯЯ ПАНЕЛЬ
========================= */

function updateBottomBar() {

    let totalPrice = 0;

    itemsToAdd.forEach(id => {
        const item = allItems.find(i => i.id === id);
        if (item && !item.isBought) {
            totalPrice += item.itemPrice;
        }
    });

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

/* =========================
   ПРИМЕНЕНИЕ
========================= */

function bindApplyButton() {
    document
        .getElementById("applyBtn")
        .addEventListener("click", applyChanges);
}

async function applyChanges() {

    for (const item of allItems) {

        const id = item.id;
        let shouldBeInRoom = initialInRoom.has(id);

        if (itemsToAdd.has(id)) shouldBeInRoom = true;
        if (itemsToRemove.has(id)) shouldBeInRoom = false;

        if (shouldBeInRoom === item.inRoom) continue;

        await patchItem(id, {
            inRoom: shouldBeInRoom,
            isBought: shouldBeInRoom ? true : item.isBought
        });
    }

    allItems = await loadItems();

    initialInRoom = new Set(
        allItems.filter(i => i.inRoom).map(i => i.id)
    );

    itemsToAdd.clear();
    itemsToRemove.clear();

    renderInitialRoom();
    renderCurrentTab();

    closeShop();
}

function renderInitialRoom() {

    const container = document.getElementById("roomItems");
    container.innerHTML = "";

    allItems
        .filter(i => i.inRoom)
        .forEach(item => addPreview(item));
}

/* =========================
   ПАНЕЛЬ
========================= */

function bindTogglePanel() {
    document
        .getElementById("toggleShopBtn")
        .addEventListener("click", toggleShop);
}

function toggleShop() {

    const panel = document.getElementById("shopPanel");

    isShopOpen = !isShopOpen;
    panel.classList.toggle("open");

    if (isShopOpen) {
        panelOffset = 80;
    } else {
        resetChanges();
        panelOffset = 0;
    }

    updateRoomTransform();
}

function closeShop() {
    const panel = document.getElementById("shopPanel");

    isShopOpen = false;
    panel.classList.remove("open");

    panelOffset = 0;
    updateRoomTransform();
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

function resetChanges() {

    itemsToAdd.clear();
    itemsToRemove.clear();

    renderInitialRoom();

    document
        .querySelectorAll("#shopPanel .item-card")
        .forEach(card => card.classList.remove("selected"));

    highlightActiveItems();
    updateBottomBar();
}

function updateRoomTransform() {
    room.style.transform = `
        translateX(${translateX + panelOffset}px)
        scale(${scale})
    `;
}