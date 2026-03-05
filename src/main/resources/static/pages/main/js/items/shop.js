import {
    getShopItems,
    patchItem,
    buyItem,
    getCoinBalance,
    spendCoins
} from '../../../../shared/api.js';

import { getCurrentPlayerId } from '../../../../shared/current-player.js';
import { generateItemHtml } from './item-cards.html.js';

let allItems = [];              // объединённый список
let initialInRoom = new Set();  // Set<itemId>
let itemsToAdd = new Set();     // Set<itemId>
let itemsToRemove = new Set();  // Set<itemId>

let currentTab = "bought";
let isShopOpen = false;


export async function initShop() {
    bindTogglePanel();
    bindTabs();
    bindApplyButton();
    await loadData();
    await renderCoins();
    renderInitialRoom();
    renderCurrentTab();
}

async function loadData() {
    const playerId = await getCurrentPlayerId();
    const data = await getShopItems(playerId);

    const owned = data.owned ?? [];
    const available = data.available ?? [];

    allItems = [
        ...owned.map(i => ({
            playerItemId: i.id,
            itemId: i.itemId,
            itemName: i.itemName,
            itemImage: i.itemImage,
            itemPrice: i.itemPrice,
            inRoom: i.inRoom,
            itemCard: i.itemCard,
            isBought: true
        })),
        ...available.map(i => ({
            playerItemId: null,
            itemId: i.itemId,
            itemName: i.itemName,
            itemImage: i.itemImage,
            itemPrice: i.itemPrice,
            itemCard: i.itemCard,
            inRoom: false,
            isBought: false
        }))
    ];

    initialInRoom = new Set(
        allItems
            .filter(i => i.isBought && i.inRoom)
            .map(i => i.itemId)
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
        const item = allItems.find(i => i.itemId === id);
        if (item && !item.isBought) {
            total += item.itemPrice;
        }
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

function isItemSelected(itemId) {
    if (itemsToAdd.has(itemId)) return true;
    if (itemsToRemove.has(itemId)) return false;
    return initialInRoom.has(itemId);
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

        const playerId = await getCurrentPlayerId();

        // 1️⃣ Покупка новых
        for (const itemId of itemsToAdd) {
            const item = allItems.find(i => i.itemId === itemId);
            if (!item) continue;

            if (!item.isBought) {
                await buyItem(playerId, itemId);
            }
        }

        // 2️⃣ Обновление inRoom только у купленных
        for (const item of allItems) {
            if (!item.isBought) continue;

            const itemId = item.itemId;
            let shouldBeInRoom = initialInRoom.has(itemId);

            if (itemsToAdd.has(itemId)) shouldBeInRoom = true;
            if (itemsToRemove.has(itemId)) shouldBeInRoom = false;

            if (shouldBeInRoom === item.inRoom) continue;

            await patchItem(item.playerItemId, {
                inRoom: shouldBeInRoom
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
        console.error(e);
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
        .filter(i => i.isBought && i.inRoom)
        .forEach(item => addPreview(item));
}

function bindTogglePanel() {
    document.getElementById("toggleShopBtn")
        .addEventListener("click", toggleShop);
}

function toggleShop() {
    const panel = document.getElementById("shopPanel");
    const btn = document.getElementById("toggleShopBtn");

    const isOpen = panel.classList.contains("open");

    if (isOpen) {
        panel.classList.remove("open");
        btn.classList.remove("shifted");
        resetChanges();
    } else {
        panel.classList.add("open");
        btn.classList.add("shifted");
    }
}

function closeShop() {
    const panel = document.getElementById("shopPanel");
    const btn = document.getElementById("toggleShopBtn");

    isShopOpen = false;
    panel.classList.remove("open");
    btn.classList.remove("shifted"); // ← ВАЖНО

    resetChanges();
}

function resetChanges() {
    itemsToAdd.clear();
    itemsToRemove.clear();
    renderInitialRoom();
    updateSelectionHighlight();
    updateBottomBar();
}
function bindItemClicks() {
    document.querySelectorAll("#shopPanel .item-card")
        .forEach(card => {
            card.addEventListener("click", () => toggleItem(card));
        });
}

function toggleItem(card) {
    const itemId = Number(card.dataset.id);
    const item = allItems.find(i => i.itemId === itemId);
    if (!item) return;

    const isInitiallyInRoom = initialInRoom.has(itemId);

    if (isInitiallyInRoom) {
        if (itemsToRemove.has(itemId)) {
            itemsToRemove.delete(itemId);
            addPreview(item);
        } else {
            itemsToRemove.add(itemId);
            removePreview(itemId);
        }
    } else {
        if (itemsToAdd.has(itemId)) {
            itemsToAdd.delete(itemId);
            removePreview(itemId);
        } else {
            itemsToAdd.add(itemId);
            addPreview(item);
        }
    }

    updateSelectionHighlight();
    updateBottomBar();
}

function addPreview(item) {
    if (!item.itemImage) return;
    if (document.querySelector(`[data-preview-id="${item.itemId}"]`)) return;

    const img = document.createElement("img");
    img.src = `../../assets/images/items/${item.itemImage}.png`;
    img.dataset.previewId = item.itemId;
    img.alt = item.itemName;

    document.getElementById("roomItems").appendChild(img);
}

function removePreview(itemId) {
    const el = document.querySelector(`[data-preview-id="${itemId}"]`);
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

