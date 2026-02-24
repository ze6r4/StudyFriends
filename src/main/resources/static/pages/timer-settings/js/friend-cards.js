import { getFriends } from '../../../shared/api.js';
import { getCurrentPlayerId } from '../../../shared/current-player.js';
import { generateFriendHtml } from './friend-cards.html.js';

let selectedFriendId = null;
let friendsGrid = null;

document.addEventListener("DOMContentLoaded", initFriends);

async function initFriends() {
    friendsGrid = document.querySelector(".friends-grid");

    const friends = await loadFriends();
    renderFriends(friends);

    bindFriendCardClick();
}

async function loadFriends() {
    const playerId = await getCurrentPlayerId();
    const friends = await getFriends(playerId);
    return Array.isArray(friends) ? friends : [];
}

function renderFriends(friends) {
    if (friends.length === 0) {
        friendsGrid.innerHTML = '<p>Ошибка загрузки 😃</p>';
        return;
    }

    friendsGrid.innerHTML = generateFriendHtml(friends);
}

/* =========================
   Обработка кликов
========================= */

function bindFriendCardClick() {
    friendsGrid.addEventListener('click', onFriendCardClick);
}

function onFriendCardClick(event) {
    const card = event.target.closest('.friend-card');
    if (!card) return;

    clearSelectedCards();
    selectCard(card);
}

/* =========================
   Работа с выделением
========================= */

function clearSelectedCards() {
    document
        .querySelectorAll('.friend-card.selected')
        .forEach(card => card.classList.remove('selected'));
}

function selectCard(card) {
    card.classList.add('selected');
    selectedFriendId = card.dataset.friendId;
    console.log('Выбран друг:', selectedFriendId);
}

/* =========================
   Сохранение состояния
========================= */

export { selectedFriendId };
