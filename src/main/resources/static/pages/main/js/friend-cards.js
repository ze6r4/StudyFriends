import {
    getVisitors
} from '../../../shared/api.js';

import { getCurrentPlayerId } from '../../../shared/current-player.js';
import { generateFriendHtml } from './friend-cards.html.js';

import {
    startCharacterPlacement,
    loadVisitorsToRoom,
    clearCardSelection
} from './visit-transform.js';

let visitFriends = [];
let notVisitFriends = [];
let selectedCard = null;

document.addEventListener("DOMContentLoaded", initFriends);

async function initFriends() {
    bindToggle();
    await loadData();
    renderFriends();
}

async function loadData() {

    const playerId = await getCurrentPlayerId();

    const panelDto = await getVisitors(playerId);

    visitFriends = panelDto.visit || [];
    notVisitFriends = panelDto.notVisit || [];
    console.log(panelDto);

    // загружаем персонажей в комнату
    loadVisitorsToRoom(visitFriends);
}

function renderFriends() {

    const grid = document
        .getElementById("friendsPanel")
        .querySelector(".items-grid");

    const all = [...visitFriends, ...notVisitFriends];

    grid.innerHTML = generateFriendHtml(all);

    bindCardClicks();
}

function bindCardClicks() {

    const cards = document.querySelectorAll("#friendsPanel .friend-card");

    cards.forEach(card => {
        card.addEventListener("click", () => selectCard(card));
    });
}

function selectCard(card) {

    // убираем старое выделение
    if (selectedCard) {
        selectedCard.classList.remove("selected");
    }

    selectedCard = card;
    selectedCard.classList.add("selected");

    const friendId = Number(card.dataset.friendId);

    const friend =
        [...visitFriends, ...notVisitFriends]
            .find(f => Number(f.id) === friendId);

    const isAlreadyInRoom =
        visitFriends.some(f => Number(f.id) === friendId);

    startCharacterPlacement(friend, isAlreadyInRoom);
}

/* ===== ПАНЕЛЬ ===== */

function bindToggle() {
    document
        .getElementById("toggleCharacterBtn")
        .addEventListener("click", togglePanel);
}

function togglePanel() {

    const panel = document.getElementById("friendsPanel");
    const btn = document.getElementById("toggleCharacterBtn");

    const isOpen = panel.classList.contains("open");

    if (isOpen) {
        clearCardSelection();
        panel.classList.remove("open");
        btn.classList.remove("shifted");
    } else {
        panel.classList.add("open");
        btn.classList.add("shifted");
    }
}