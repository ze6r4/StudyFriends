import { getRandomCharacter, postFriend, getMe } from '../../../../shared/api.js';

const btn = document.getElementById("startBtn");
const rewardImg = document.getElementById("rewardImg");
const nameEl = document.querySelector(".characterName");
const okBtn = document.getElementById("okBtn");

let currentCharacter = null;
let playerId = null;

// получаем игрока
init();

async function init() {
    try {
        const me = await getMe();
        playerId = me.id;
    } catch (e) {
        console.error("Ошибка получения пользователя", e);
    }
}

btn.addEventListener("click", async () => {
    // 🎲 получаем случайного персонажа
    try {
        currentCharacter = await getRandomCharacter(playerId);

        // обновляем UI
        rewardImg.src ="../../assets/images/characters/" + currentCharacter.standImage + ".png";
        nameEl.textContent = currentCharacter.name;

    } catch (e) {
        console.error("Ошибка получения персонажа", e);
    }
    if (!currentCharacter || !playerId) return;

    try {
        await postFriend(playerId, currentCharacter.id);
        console.log("Персонаж добавлен");

    } catch (e) {
        console.error("Ошибка добавления персонажа", e);
    }
});

/* ================= КНОПКА ВЕРНУТЬСЯ ================= */

okBtn.addEventListener("click", async () => {
    window.location.href = 'http://localhost:8081/pages/main/main.html';
});

/* ================= УТИЛИТА ================= */

function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}