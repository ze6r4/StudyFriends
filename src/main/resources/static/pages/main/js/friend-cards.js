import {
    getFriends,
    postVisitor,
    deleteVisitor
} from '../../../shared/api.js';

import { generateFriendHtml } from './friend-cards.html.js';

const PLAYER_ID = 1;

let allFriends = [];
let initialInRoom = new Set();
let friendsToAdd = new Set();
let friendsToRemove = new Set();

let isFriendsOpen = false;

document.addEventListener("DOMContentLoaded", initFriends);

/* ================= INIT ================= */

async function initFriends() {
    bindToggle();
    bindApply();
    bindOutsideClick();

    allFriends = await loadFriends();

    initialInRoom = new Set(
        allFriends.filter(f => f.inRoom).map(f => f.id)
    );

    renderInitialRoom();
    renderFriends();
}

async function loadFriends() {
    const friends = await getFriends(PLAYER_ID);
    return Array.isArray(friends) ? friends : [];
}

/* ================= RENDER ================= */

function renderFriends() {
    const grid = document
        .getElementById("friendsPanel")
        .querySelector(".items-grid");

    grid.innerHTML = generateFriendHtml(allFriends);

    highlightActive();
    bindCardClicks();
}

function highlightActive() {
    const cards = document
        .getElementById("friendsPanel")
        .querySelectorAll(".friend-card");

    cards.forEach(card => {
        const id = Number(card.dataset.friendId);

        if (initialInRoom.has(id) && !friendsToRemove.has(id)) {
            card.classList.add("selected");
        }
    });
}

/* ================= CLICK ================= */

function bindCardClicks() {
    const cards = document
        .getElementById("friendsPanel")
        .querySelectorAll(".friend-card");

    cards.forEach(card => {
        card.addEventListener("click", () => toggleFriend(card));
    });
}

function toggleFriend(card) {
    const id = Number(card.dataset.friendId);
    const friend = allFriends.find(f => f.id === id);

    const isInitially = initialInRoom.has(id);

    if (isInitially) {
        if (friendsToRemove.has(id)) {
            friendsToRemove.delete(id);
            card.classList.add("selected");
            addPreview(friend);
        } else {
            friendsToRemove.add(id);
            card.classList.remove("selected");
            removePreview(id);
        }
    } else {
        if (friendsToAdd.has(id)) {
            friendsToAdd.delete(id);
            card.classList.remove("selected");
            removePreview(id);
        } else {
            friendsToAdd.add(id);
            card.classList.add("selected");
            addPreview(friend);
        }
    }
}

/* ================= ROOM ================= */

function renderInitialRoom() {
    const container = document.getElementById("roomCharacters");
    container.innerHTML = "";

    allFriends
        .filter(f => f.inRoom)
        .forEach(addPreview);
}

function addPreview(friend) {
    const container = document.getElementById("roomCharacters");

    if (container.querySelector(`[data-preview-id="${friend.id}"]`)) return;

    const img = document.createElement("img");
    img.src = `../../assets/images/characters/${friend.cardImage}.png`;
    img.dataset.previewId = friend.id;

    container.appendChild(img);
}

function removePreview(id) {
    const el = document.querySelector(
        `#roomCharacters [data-preview-id="${id}"]`
    );
    if (el) el.remove();
}

/* ================= APPLY ================= */

function bindApply() {
    document
        .getElementById("applyFriendsBtn")
        .addEventListener("click", applyChanges);
}

async function applyChanges() {

    for (const id of friendsToRemove) {
        await deleteVisitor(id);
    }

    for (const id of friendsToAdd) {
        await postVisitor({});
    }

    allFriends = await loadFriends();

    initialInRoom = new Set(
        allFriends.filter(f => f.inRoom).map(f => f.id)
    );

    friendsToAdd.clear();
    friendsToRemove.clear();

    renderInitialRoom();
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

    if (!isFriendsOpen) {
        resetChanges();
    }
}

function closePanel() {
    const panel = document.getElementById("friendsPanel");
    isFriendsOpen = false;
    panel.classList.remove("open");
}

function bindOutsideClick() {
    document.addEventListener("click", e => {
        if (!isFriendsOpen) return;

        const panel = document.getElementById("friendsPanel");
        const btn = document.getElementById("toggleCharacterBtn");

        if (!panel.contains(e.target) && !btn.contains(e.target)) {
            togglePanel();
        }
    });
}

function resetChanges() {
    friendsToAdd.clear();
    friendsToRemove.clear();
    renderInitialRoom();
    renderFriends();
}