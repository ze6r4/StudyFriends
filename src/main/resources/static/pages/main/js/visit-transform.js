import { postVisitor } from '../../../shared/api.js';

const BASE_PATH = '../../assets/images/characters';

let isDragging = false;
let dragStartX = 0;
let activeFriend = null;

let placementMode = false;
let currentCharacter = null;

let currentAction = "SIT";     // SIT | STAND
let currentDirection = "RIGHT"; // RIGHT | LEFT

let posXPercent = null;
let posYPercent = null;

const room = document.getElementById("room");
const roomContainer = document.getElementById("roomContainer");
const roomCharacters = document.getElementById("roomCharacters");
const doneBtn = document.getElementById("doneBtn");
doneBtn.addEventListener("click", finishPlacement);
const startBtn = document.getElementById("startBtn");

document.addEventListener("mousedown", (e) => {
    const card = e.target.closest(".friend-card");
    if (!card) return;

    isDragging = true;
    dragStartX = e.clientX;
    activeFriend = card;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging || !activeFriend) return;

    const deltaX = e.clientX - dragStartX;

    // если потянули влево достаточно сильно — запускаем режим
    if (deltaX < -80) {
        startPlacement(activeFriend);
        isDragging = false;
        activeFriend = null;
    }
});

function startPlacement(card) {
    placementMode = true;

    resetRoomTransform();
    showDoneButton();

    const friendId = card.dataset.friendId;
    const img = card.querySelector("img");

    currentCharacter = document.createElement("img");
    currentCharacter.classList.add("placing-character");

    currentCharacter.dataset.friendId = friendId;
    currentCharacter.dataset.sit = img.src.replace(".png", "_sit.png");
    currentCharacter.dataset.stand = img.src.replace(".png", "_stand.png");

    currentCharacter.src = currentCharacter.dataset.sit;

    roomCharacters.appendChild(currentCharacter);

    room.addEventListener("click", placeCharacter);
    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKey);
}

function resetRoomTransform() {
    room.style.transform = `translateX(0px) scale(1)`;
}

function placeCharacter(e) {
    if (!placementMode) return;

    const rect = room.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    posXPercent = x / rect.width;
    posYPercent = y / rect.height;

    updateCharacterPosition();
}

function updateCharacterPosition() {
    if (!currentCharacter) return;

    currentCharacter.style.position = "absolute";
    currentCharacter.style.left = (posXPercent * 100) + "%";
    currentCharacter.style.top = (posYPercent * 100) + "%";
    currentCharacter.style.transform =
        currentDirection === "LEFT"
            ? "translate(-50%, -100%) scaleX(-1)"
            : "translate(-50%, -100%)";
}

function handleWheel(e) {
    if (!placementMode) return;

    e.preventDefault();

    togglePose();
}

function handleKey(e) {
    if (!placementMode) return;

    if (e.key === "ArrowLeft") {
        currentDirection = "LEFT";
        updateCharacterPosition();
    }

    if (e.key === "ArrowRight") {
        currentDirection = "RIGHT";
        updateCharacterPosition();
    }

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        togglePose();
    }
}

function togglePose() {
    if (!currentCharacter) return;

    currentAction = currentAction === "SIT" ? "STAND" : "SIT";

    currentCharacter.src =
        currentAction === "SIT"
            ? currentCharacter.dataset.sit
            : currentCharacter.dataset.stand;
}
function showDoneButton() {

    doneBtn.classList.remove("hidden");
    startBtn.classList.add("hidden");
}
async function finishPlacement() {
    if (!currentCharacter || posXPercent == null) return;

    const dto = {
        playerFriendId: Number(currentCharacter.dataset.friendId),
        friendAction: currentAction,
        direction: currentDirection,
        x: posXPercent,
        y: posYPercent
    };

    await postVisitor(dto);

    exitPlacementMode();
}

function exitPlacementMode() {
    placementMode = false;

    room.removeEventListener("click", placeCharacter);
    document.removeEventListener("wheel", handleWheel);
    document.removeEventListener("keydown", handleKey);

    doneBtn.classList.add("hidden");
    startBtn.classList.remove("hidden");

    if (startBtn) startBtn.style.display = "block";
}