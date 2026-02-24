import {
    getFriends,
    getVisitors,
    postVisitor,
    deleteVisitor
} from '../../../shared/api.js';
import { getCurrentPlayerId } from '../../../shared/current-player.js';

import { generateFriendHtml } from './friend-cards.html.js';

let allFriends = [];
let visitors = [];

let initialVisitorIds = new Set(); // playerFriendId
let visitorsToAdd = new Set();     // friendId
let visitorsToRemove = new Set();  // playerFriendId

let isFriendsOpen = false;

document.addEventListener("DOMContentLoaded", initFriends);

/* ================= INIT ================= */

async function initFriends() {
    bindToggle();
    bindApply();

    await loadData();
    renderFriends();
}

async function loadData() {
    const playerId = await getCurrentPlayerId();
    allFriends = await getFriends(playerId);
    visitors = await getVisitors(playerId);

    if (!Array.isArray(allFriends)) allFriends = [];
    if (!Array.isArray(visitors)) visitors = [];

    initialVisitorIds = new Set(
        visitors.map(v => v.playerFriendId)
    );
}

/* ================= RENDER ================= */

function renderFriends() {
    const grid = document
        .getElementById("friendsPanel")
        .querySelector(".items-grid");

    grid.innerHTML = generateFriendHtml(allFriends);

    highlightVisitors();
    bindCardClicks();
}

function highlightVisitors() {
    const cards = document.querySelectorAll("#friendsPanel .friend-card");

    cards.forEach(card => {
        const friendId = Number(card.dataset.friendId);

        const visitor = visitors.find(v => v.friendId === friendId);

        if (
            visitor &&
            initialVisitorIds.has(visitor.playerFriendId) &&
            !visitorsToRemove.has(visitor.playerFriendId)
        ) {
            card.classList.add("selected");
        }
    });
}

/* ================= CLICK ================= */

function bindCardClicks() {
    const cards = document.querySelectorAll("#friendsPanel .friend-card");

    cards.forEach(card => {
        card.addEventListener("click", () => toggleFriend(card));
    });
}

function toggleFriend(card) {
    const friendId = Number(card.dataset.friendId);

    const visitor = visitors.find(v => v.friendId === friendId);

    const isInitiallyInRoom = !!visitor;

    if (isInitiallyInRoom) {
        const playerFriendId = visitor.playerFriendId;

        if (visitorsToRemove.has(playerFriendId)) {
            visitorsToRemove.delete(playerFriendId);
            card.classList.add("selected");
        } else {
            visitorsToRemove.add(playerFriendId);
            card.classList.remove("selected");
        }

    } else {

        if (visitorsToAdd.has(friendId)) {
            visitorsToAdd.delete(friendId);
            card.classList.remove("selected");
        } else {
            visitorsToAdd.add(friendId);
            card.classList.add("selected");
        }
    }
}

/* ================= APPLY ================= */

function bindApply() {
    document
        .getElementById("applyFriendsBtn")
        .addEventListener("click", applyChanges);
}

async function applyChanges() {

    // Удаление
    for (const playerFriendId of visitorsToRemove) {
        await deleteVisitor(playerFriendId);
    }

    // Добавление
    for (const friendId of visitorsToAdd) {
        const playerId = await getCurrentPlayerId();
        await postVisitor({
            playerId: playerId,
            friendId: friendId
        });
    }

    await loadData();

    visitorsToAdd.clear();
    visitorsToRemove.clear();

    renderFriends();
    closePanel();
}

/* ================= PANEL ================= */

function bindToggle() {
    document
        .getElementById("toggleCharacterBtn")
        .addEventListener("click", togglePanel);
}

function togglePanel() {
    const panel = document.getElementById("friendsPanel");
    isFriendsOpen = !isFriendsOpen;
    panel.classList.toggle("open");
}

function closePanel() {
    const panel = document.getElementById("friendsPanel");
    isFriendsOpen = false;
    panel.classList.remove("open");
}

