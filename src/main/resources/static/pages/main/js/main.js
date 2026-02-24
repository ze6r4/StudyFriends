import { getItems, patchItem, getCoinBalance, spendCoins } from '../../../shared/api.js';
import { getCurrentPlayerId } from '../../../shared/current-player.js';
import { generateItemHtml } from './item-cards.html.js';


let allItems = [];
let initialInRoom = new Set();

let itemsToAdd = new Set();
let itemsToRemove = new Set();

let currentTab = "bought";
let isShopOpen = false;

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

    await loadData();
    await renderCoins();
    renderInitialRoom();
    renderCurrentTab();
}

/* ========================= */

async function loadData() {
    allItems = await loadItems();

    initialInRoom = new Set(
        allItems.filter(i => i.inRoom).map(i => i.id)
    );
}

async function loadItems() {
    const playerId = await getCurrentPlayerId();
    const items = await getItems(playerId);
    return Array.isArray(items) ? items : [];
}


async function renderCoins() {
    const coinData = await getCoinBalance();
    const coins = Number(coinData?.coins ?? 0);

    const coinCount = document.querySelector('.coin-count');
    if (coinCount) {
        coinCount.textContent = String(coins);
    }

    return coins;
}

function getPendingPurchasePrice() {
    let totalPrice = 0;

    itemsToAdd.forEach(id => {
        const item = allItems.find(i => i.id === id);
        if (item && !item.isBought) {
            totalPrice += item.itemPrice;
        }
    });

    return totalPrice;
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

    updateSelectionHighlight();
    bindItemClicks();
    updateBottomBar();
}

function updateSelectionHighlight() {
    document
        .querySelectorAll("#shopPanel .item-card")
        .forEach(card => {
            const id = Number(card.dataset.id);

            // Проверяем, должен ли предмет быть выделен
            const shouldBeSelected = isItemSelected(id);

            if (shouldBeSelected) {
                card.classList.add("selected");
            } else {
                card.classList.remove("selected");
            }
        });
}

function isItemSelected(id) {
    // Если предмет есть в itemsToAdd - он выделен
    if (itemsToAdd.has(id)) {
        return true;
    }

    // Если предмет есть в itemsToRemove - он НЕ выделен
    if (itemsToRemove.has(id)) {
        return false;
    }

    // Иначе проверяем, был ли он изначально в комнате
    return initialInRoom.has(id);
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

    if (!item) return;

    const isInitiallyInRoom = initialInRoom.has(id);

    if (isInitiallyInRoom) {
        // Предмет уже в комнате
        if (itemsToRemove.has(id)) {
            // Отменяем удаление
            itemsToRemove.delete(id);
            addPreview(item);
        } else {
            // Помечаем на удаление
            itemsToRemove.add(id);
            removePreview(id);
        }
    } else {
        // Предмета нет в комнате
        if (itemsToAdd.has(id)) {
            // Отменяем добавление
            itemsToAdd.delete(id);
            removePreview(id);
        } else {
            // Помечаем на добавление
            itemsToAdd.add(id);
            addPreview(item);
        }
    }

    // Обновляем выделение на основе временных изменений
    updateSelectionHighlight();
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
    img.alt = item.name;

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

/* =========================
   ПРИМЕНЕНИЕ
========================= */

function bindApplyButton() {
    document
        .getElementById("applyBtn")
        .addEventListener("click", applyChanges);
}

async function applyChanges() {
    // Блокируем кнопку во время сохранения
    const applyBtn = document.getElementById("applyBtn");
    const originalText = applyBtn.textContent;

    applyBtn.textContent = "Сохранение...";
    applyBtn.disabled = true;

    try {
        const totalPrice = getPendingPurchasePrice();

        if (totalPrice > 0) {
            const coinData = await getCoinBalance();
            const currentCoins = Number(coinData?.coins ?? 0);

            if (currentCoins < totalPrice) {
                alert(`Недостаточно монет. Нужно ${totalPrice}, доступно ${currentCoins}`);
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

        // Перезагружаем данные
        await loadData();

        // Очищаем временные наборы
        itemsToAdd.clear();
        itemsToRemove.clear();

        // Обновляем отображение
        await renderCoins();
        renderInitialRoom();
        renderCurrentTab();

        closeShop();
    } catch (error) {
        console.error('Ошибка при сохранении:', error);
        alert('Не удалось сохранить изменения');
    } finally {
        // Разблокируем кнопку
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

    if (!isShopOpen) {
        resetChanges();
    }
}

function closeShop() {
    const panel = document.getElementById("shopPanel");
    isShopOpen = false;
    panel.classList.remove("open");
    resetChanges();
}

function resetChanges() {
    // Очищаем все временные изменения
    itemsToAdd.clear();
    itemsToRemove.clear();

    // Возвращаем оригинальное состояние комнаты
    renderInitialRoom();

    // Обновляем выделение карточек
    updateSelectionHighlight();

    // Обновляем нижнюю панель
    updateBottomBar();
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


startBtn.addEventListener('click', async () => {

    window.location.href = 'http://localhost:8081/pages/timer-settings/timer-settings.html';
});