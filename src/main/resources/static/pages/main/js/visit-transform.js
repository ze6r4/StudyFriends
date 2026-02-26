import {
    postVisitor,
    deleteVisitor
} from '../../../shared/api.js';

const BASE_PATH = '../../assets/images/characters';

let placementMode = false;
let editingExisting = false;

let currentCharacter = null;
let selectedFriendId = null;

let currentAction = "SIT";
let currentDirection = "RIGHT";

let posXPercent = null;
let posYPercent = null;

const room = document.getElementById("room");
const roomCharacters = document.getElementById("roomCharacters");

const doneBtn = document.getElementById("doneBtn");
const deleteBtn = document.getElementById("deleteBtn");
const startBtn = document.getElementById("startBtn");

doneBtn.addEventListener("click", finishPlacement);
deleteBtn.addEventListener("click", removeCharacter);

/* ================= LOAD EXISTING ================= */

export function loadVisitorsToRoom(visitFriends) {

    visitFriends.forEach(friend => {

        const img = document.createElement("img");
        img.classList.add("room-character");

        img.dataset.friendId = friend.id;
        img.dataset.sitImage =
            `${BASE_PATH}/${friend.sitImage}.png`;

        img.dataset.standImage =
            `${BASE_PATH}/${friend.standImage}.png`;

        img.src =
            friend.friendAction === "STAND"
                ? img.dataset.standImage
                : img.dataset.sitImage;

        img.style.position = "absolute";
        img.style.left = (friend.x * 100) + "%";
        img.style.top = (friend.y * 100) + "%";

        img.style.transform =
            friend.direction === "LEFT"
                ? "translate(-50%, -100%) scaleX(-1)"
                : "translate(-50%, -100%)";

        roomCharacters.appendChild(img);
    });
}

/* ================= START ================= */

export function startCharacterPlacement(friend, alreadyInRoom) {

    resetRoomTransform();

    placementMode = true;
    editingExisting = alreadyInRoom;

    selectedFriendId = friend.id;

    const existing =
        document.querySelector(
            `.room-character[data-friend-id="${friend.id}"]`
        );

    if (existing) {
        currentCharacter = existing;
        posXPercent = parseFloat(existing.style.left) / 100;
        posYPercent = parseFloat(existing.style.top) / 100;

        doneBtn.textContent = "Переместить";
        deleteBtn.classList.remove("hidden");
    } else {
        currentCharacter = createCharacter(friend);
        doneBtn.textContent = "Готово";
        deleteBtn.classList.add("hidden");
    }

    showButtons();

    room.addEventListener("click", placeCharacter);
    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKey);
}

function createCharacter(friend) {

    const img = document.createElement("img");

    img.classList.add("room-character");

    img.dataset.friendId = friend.id;
    img.dataset.sitImage =
        `${BASE_PATH}/${friend.sitImage}.png`;

    img.dataset.standImage =
        `${BASE_PATH}/${friend.standImage}.png`;

    img.src = img.dataset.sitImage;

    roomCharacters.appendChild(img);

    return img;
}

/* ================= DELETE ================= */

async function removeCharacter() {

    if (!selectedFriendId) return;

    await deleteVisitor(selectedFriendId);

    currentCharacter.remove();

    exitPlacementMode();
}

/* ================= POSITION ================= */

function placeCharacter(e) {

    const rect = room.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    posXPercent = x / rect.width;
    posYPercent = y / rect.height;

    updatePosition();
}

function updatePosition() {

    currentCharacter.style.position = "absolute";
    currentCharacter.style.left = (posXPercent * 100) + "%";
    currentCharacter.style.top = (posYPercent * 100) + "%";

    currentCharacter.style.transform =
        currentDirection === "LEFT"
            ? "translate(-50%, -100%) scaleX(-1)"
            : "translate(-50%, -100%)";
}

/* ================= CONTROLS ================= */

function handleWheel(e) {
    e.preventDefault();
    togglePose();
}

function handleKey(e) {

    if (e.key === "ArrowLeft") {
        currentDirection = "LEFT";
        updatePosition();
    }

    if (e.key === "ArrowRight") {
        currentDirection = "RIGHT";
        updatePosition();
    }

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        togglePose();
    }
}

function togglePose() {

    currentAction =
        currentAction === "SIT" ? "STAND" : "SIT";

    currentCharacter.src =
        currentAction === "SIT"
            ? currentCharacter.dataset.sitImage
            : currentCharacter.dataset.standImage;
}

/* ================= SAVE ================= */

async function finishPlacement() {

    if (!posXPercent) return;

    const dto = {
        playerFriendId: Number(selectedFriendId),
        friendAction: currentAction,
        direction: currentDirection,
        x: posXPercent,
        y: posYPercent
    };

    await postVisitor(dto);

    exitPlacementMode();
}

/* ================= EXIT ================= */

function exitPlacementMode() {

    placementMode = false;

    room.removeEventListener("click", placeCharacter);
    document.removeEventListener("wheel", handleWheel);
    document.removeEventListener("keydown", handleKey);

    hideButtons();
}

function showButtons() {
    doneBtn.classList.remove("hidden");
    startBtn.classList.add("hidden");
}

function hideButtons() {
    doneBtn.classList.add("hidden");
    deleteBtn.classList.add("hidden");
    startBtn.classList.remove("hidden");
}

function resetRoomTransform() {
    room.style.transform = `translateX(0px) scale(1)`;
}

/* ===== очистка выделения ===== */

export function clearCardSelection() {

    const cards =
        document.querySelectorAll(".friend-card");

    cards.forEach(c => c.classList.remove("selected"));
}