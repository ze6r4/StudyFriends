import { getItems, patchItem } from '../../../shared/api.js';
import { generateItemHtml } from './item-cards.html.js';

const PLAYER_ID = 1;

let allItems = [];
let initialInRoom = new Set();

// 👇 ВАЖНО — ЭТИ ДВЕ СТРОКИ
let itemsToAdd = new Set();
let itemsToRemove = new Set();

let currentTab = "bought";
let isShopOpen = false;


document.addEventListener("DOMContentLoaded", initMain);

async function initMain() {
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
    console.log("ALL ITEMS:", allItems);

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
    highlightActiveItems();
    bindItemClicks();
}
function highlightActiveItems() {

    document.querySelectorAll(".item-card").forEach(card => {

        const id = Number(card.dataset.id);

        if (initialInRoom.has(id) && !itemsToRemove.has(id)) {
            card.classList.add("selected");
        }
    });
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

    const id = Number(card.dataset.id);
    const item = allItems.find(i => i.id === id);

    const isInitiallyInRoom = initialInRoom.has(id);
    const isMarkedToAdd = itemsToAdd.has(id);
    const isMarkedToRemove = itemsToRemove.has(id);

    // ===== Если предмет был в комнате =====
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
        // ===== Если предмета не было =====

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
   Предпросмотр
========================= */

function addPreview(item) {
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
   Нижняя панель
========================= */

function updateBottomBar() {

    let totalPrice = 0;

    itemsToAdd.forEach(id => {
        const item = allItems.find(i => i.id === id);
        if (!item.isBought) totalPrice += item.itemPrice;
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


function bindApplyButton() {
    document.getElementById("applyBtn")
        .addEventListener("click", applyChanges);
}
async function applyChanges() {

    for (const item of allItems) {

        const id = item.itemId;

        let shouldBeInRoom = initialInRoom.has(id);

        if (itemsToAdd.has(id)) shouldBeInRoom = true;
        if (itemsToRemove.has(id)) shouldBeInRoom = false;

        if (shouldBeInRoom === item.inRoom) continue;

        const updatedData = {
            inRoom: shouldBeInRoom,
            isBought: shouldBeInRoom ? true : item.isBought
        };

        await patchItem(item.id, updatedData);
    }

    // 🔥 ПОЛНОСТЬЮ ПЕРЕЗАГРУЖАЕМ СЕРВЕРНОЕ СОСТОЯНИЕ
    allItems = await loadItems();

    initialInRoom = new Set(
        allItems
            .filter(i => i.inRoom)
            .map(i => i.itemId)
    );

    itemsToAdd.clear();
    itemsToRemove.clear();

    // Перерисовываем комнату и вкладку
    renderInitialRoom();
    renderCurrentTab();

    // Закрываем панель без reset
    closeShopAfterApply();
}
function closeShopAfterApply() {

    const panel = document.getElementById("shopPanel");
    const room = document.getElementById("room");

    isShopOpen = false;

    panel.classList.remove("open");
    room.style.transform = "translateX(0)";
}

function resetChanges() {

    itemsToAdd.clear();
    itemsToRemove.clear();

    document.getElementById("roomItems").innerHTML = "";

    allItems.forEach(item => {
        if (initialInRoom.has(item.id)) {
            addPreview(item);
        }
    });

    document.querySelectorAll(".item-card")
        .forEach(card => card.classList.remove("selected"));

    highlightActiveItems();
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
