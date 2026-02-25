import {
    getItems,
    patchItem,
    getCoinBalance,
    spendCoins,
    updateCoinBalance,
    getMe
} from '../../../shared/api.js';

import { getCurrentPlayerId } from '../../../shared/current-player.js';
import { generateItemHtml } from './item-cards.html.js';

let allItems = [];
let initialInRoom = new Set();
let itemsToAdd = new Set();
let itemsToRemove = new Set();

let currentTab = "bought";
let isShopOpen = false;

let room;

document.addEventListener("DOMContentLoaded", initMain);

async function initMain() {
    room = document.getElementById("room");

    bindTogglePanel();
    bindTabs();
    bindApplyButton();
    bindStartButton();
    initBalanceButton();

    await loadData();
    await renderCoins();
    renderInitialRoom();
    renderCurrentTab();
}

async function loadData() {
    const playerId = await getCurrentPlayerId();
    const items = await getItems(playerId);
    allItems = Array.isArray(items) ? items : [];

    initialInRoom = new Set(
        allItems.filter(i => i.inRoom).map(i => i.id)
    );
}

async function renderCoins() {
    const coinData = await getCoinBalance();
    const coins = Number(coinData?.coins ?? 0);

    const coinCount = document.querySelector('.coin-count');
    if (coinCount) coinCount.textContent = String(coins);

    return coins;
}

function getPendingPurchasePrice() {
    let total = 0;

    itemsToAdd.forEach(id => {
        const item = allItems.find(i => i.id === id);
        if (item && !item.isBought) total += item.itemPrice;
    });

    return total;
}

function bindTabs() {
    document.querySelectorAll("#shopPanel .tab").forEach(tab => {
        tab.addEventListener("click", () => {
            document.querySelectorAll("#shopPanel .tab")
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

    updateSelectionHighlight();
    bindItemClicks();
    updateBottomBar();
}

function updateSelectionHighlight() {
    document.querySelectorAll("#shopPanel .item-card")
        .forEach(card => {
            const id = Number(card.dataset.id);
            card.classList.toggle("selected", isItemSelected(id));
        });
}

function isItemSelected(id) {
    if (itemsToAdd.has(id)) return true;
    if (itemsToRemove.has(id)) return false;
    return initialInRoom.has(id);
}

function bindItemClicks() {
    document.querySelectorAll("#shopPanel .item-card")
        .forEach(card => {
            card.addEventListener("click", () => toggleItem(card));
        });
}

function toggleItem(card) {
    const id = Number(card.dataset.id);
    const item = allItems.find(i => i.id === id);
    if (!item) return;

    const isInitiallyInRoom = initialInRoom.has(id);

    if (isInitiallyInRoom) {
        if (itemsToRemove.has(id)) {
            itemsToRemove.delete(id);
            addPreview(item);
        } else {
            itemsToRemove.add(id);
            removePreview(id);
        }
    } else {
        if (itemsToAdd.has(id)) {
            itemsToAdd.delete(id);
            removePreview(id);
        } else {
            itemsToAdd.add(id);
            addPreview(item);
        }
    }

    updateSelectionHighlight();
    updateBottomBar();
}

function addPreview(item) {
    if (!item.itemImage) return;
    if (document.querySelector(`[data-preview-id="${item.id}"]`)) return;

    const img = document.createElement("img");
    img.src = `../../assets/images/items/${item.itemImage}.png`;
    img.dataset.previewId = item.id;
    img.alt = item.name;

    document.getElementById("roomItems").appendChild(img);
}

function removePreview(id) {
    const el = document.querySelector(`[data-preview-id="${id}"]`);
    if (el) el.remove();
}

function updateBottomBar() {
    const totalPrice = getPendingPurchasePrice();
    const priceEl = document.getElementById("totalPrice");
    const applyBtn = document.getElementById("applyBtn");

    if (totalPrice > 0) {
        priceEl.textContent = `Стоимость: ${totalPrice} 🪙`;
        applyBtn.textContent = "Купить";
    } else {
        priceEl.textContent = "";
        applyBtn.textContent = "Применить";
    }
}

function bindApplyButton() {
    document.getElementById("applyBtn")
        .addEventListener("click", applyChanges);
}

async function applyChanges() {
    const applyBtn = document.getElementById("applyBtn");
    const originalText = applyBtn.textContent;

    applyBtn.textContent = "Сохранение...";
    applyBtn.disabled = true;

    try {
        const totalPrice = getPendingPurchasePrice();

        if (totalPrice > 0) {
            const currentCoins = await renderCoins();

            if (currentCoins < totalPrice) {
                alert("Не хватает монет");
                return;
            }

            await spendCoins(totalPrice);
        }

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

        await loadData();
        itemsToAdd.clear();
        itemsToRemove.clear();

        await renderCoins();
        renderInitialRoom();
        renderCurrentTab();
        closeShop();

    } catch (e) {
        alert("Ошибка сохранения");
    } finally {
        applyBtn.textContent = originalText;
        applyBtn.disabled = false;
    }
}

function renderInitialRoom() {
    const container = document.getElementById("roomItems");
    container.innerHTML = "";

    allItems
        .filter(i => i.inRoom)
        .forEach(item => addPreview(item));
}

function bindTogglePanel() {
    document.getElementById("toggleShopBtn")
        .addEventListener("click", toggleShop);
}

function toggleShop() {
    const panel = document.getElementById("shopPanel");
    isShopOpen = !isShopOpen;
    panel.classList.toggle("open");

    if (!isShopOpen) resetChanges();
}

function closeShop() {
    const panel = document.getElementById("shopPanel");
    isShopOpen = false;
    panel.classList.remove("open");
    resetChanges();
}

function resetChanges() {
    itemsToAdd.clear();
    itemsToRemove.clear();
    renderInitialRoom();
    updateSelectionHighlight();
    updateBottomBar();
}

function bindStartButton() {
    document.getElementById("startBtn")
        .addEventListener("click", () => {
            window.location.href =
                'http://localhost:8081/pages/timer-settings/timer-settings.html';
        });
}

async function initBalanceButton() {
    try {
        const me = await getMe();
        if (!me || !me.developer) return;

        const btn = document.getElementById("devBalanceBtn");
        if (!btn) return;

        btn.classList.remove("hidden");

        btn.addEventListener("click", async () => {
            const value = prompt("Введите новое количество монет:");
            if (value === null) return;

            const amount = Number(value);

            if (isNaN(amount) || amount < 0) {
                alert("Введите корректное число");
                return;
            }

            await updateCoinBalance(amount);
            await renderCoins();
        });

    } catch (e) {
        console.error("Ошибка получения пользователя", e);
    }
}
// Обработчик клика вне панелей
document.addEventListener("click", (e) => {
    const shopPanel = document.getElementById("shopPanel");
    const friendsPanel = document.getElementById("friendsPanel");
    const shopBtn = document.getElementById("toggleShopBtn");
    const friendsBtn = document.getElementById("toggleCharacterBtn");

    const clickInsideShop = shopPanel.contains(e.target) || shopBtn.contains(e.target);
    const clickInsideFriends = friendsPanel.contains(e.target) || friendsBtn.contains(e.target);

    if (!clickInsideShop && !clickInsideFriends) {
        if (shopPanel.classList.contains("open")) {
            resetChanges();
            shopPanel.classList.remove("open");
        }
        if (friendsPanel.classList.contains("open")) {
            // Здесь можно добавить reset для друзей, если нужно
            friendsPanel.classList.remove("open");
        }
    }
});
