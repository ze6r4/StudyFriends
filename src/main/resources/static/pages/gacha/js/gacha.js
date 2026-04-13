import { rollGacha, postFriend, getMe,getCoinBalance } from '../../../../shared/api.js';
import { showError } from '../../../../shared/showError.js';
import {gachaAnimation} from './animation.js'
const btn = document.getElementById("startBtn");
const rewardImg = document.getElementById("rewardImg");
const nameEl = document.querySelector(".characterName");
const okBtn = document.getElementById("okBtn");
const coinsText = document.getElementById("coinCount");
const priceText = document.getElementById("textPrice");

let currentCharacter = null;
let playerId = null;

let coins = 0;

const PRICE = 350;

async function init() {
    try {
        const me = await getMe();
        playerId = me.id;
        const coinData = await getCoinBalance();
        coins = Number(coinData?.coins ?? 0);
        console.log(coins);
        coinsText.textContent = coins;
        priceText.textContent = "Купить билет "+ PRICE + "🪙";


    } catch (e) {
        console.error("Ошибка получения пользователя", e);
    }
}

document.addEventListener("DOMContentLoaded", init);
btn.addEventListener("click", playGacha);

async function playGacha() {
    try {
        currentCharacter = await rollGacha(playerId);

        rewardImg.src ="../../assets/images/characters/" + currentCharacter.standImage + ".png";
        nameEl.textContent = currentCharacter.name;
        gachaAnimation();

        await postFriend(playerId, currentCharacter.id);

    } catch (e) {
        console.log(e);
        showError({ message: e })
    }
}


okBtn.addEventListener("click", async () => {
    window.location.href = 'http://localhost:8081/pages/main/main.html';
});

/* ================= УТИЛИТА ================= */

function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}