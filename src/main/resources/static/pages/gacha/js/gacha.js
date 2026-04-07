import { getRandomCharacter, postFriend, getMe,getCoinBalance,spendCoins } from '../../../../shared/api.js';
import { showError } from '../../../../shared/showError.js';
import {gachaAnimation} from './animation.js'
const btn = document.getElementById("startBtn");
const rewardImg = document.getElementById("rewardImg");
const nameEl = document.querySelector(".characterName");
const okBtn = document.getElementById("okBtn");
const coinsText = document.getElementById("coinCount");
const priceText = document.getElementById("rewardPrice");

let currentCharacter = null;
let playerId = null;

init();

const PRICE = 350;

async function init() {
    try {
        const me = await getMe();
        playerId = me.id;
        const coinData = await getCoinBalance();
        const coins = Number(coinData?.coins ?? 0);
        coinsText.textContent = coins;
        priceText.textContent = PRICE;

    } catch (e) {
        console.error("Ошибка получения пользователя", e);
    }
}

btn.addEventListener("click", playGacha);

async function playGacha() {
    try {
        if (!(await tryToBuy())) return;
        currentCharacter = await getRandomCharacter(playerId);

        rewardImg.src ="../../assets/images/characters/" + currentCharacter.standImage + ".png";
        nameEl.textContent = currentCharacter.name;
        gachaAnimation();

        await postFriend(playerId, currentCharacter.id);

    } catch (e) {
        console.log(e);
        showError({ message: 'Ошибка получения персонажа' })
    }
}

async function tryToBuy() {
    try{
        const coinData = await getCoinBalance();
        const coins = Number(coinData?.coins ?? 0);
        if(coins < PRICE) {
            showError({ message: 'Не хватает монет! Нужно поработать' })
            return false;
        }
        await spendCoins(PRICE);
        return true;
    } catch(e){
        console.log(e)
        return false;
    }

}

okBtn.addEventListener("click", async () => {
    window.location.href = 'http://localhost:8081/pages/main/main.html';
});

/* ================= УТИЛИТА ================= */

function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}