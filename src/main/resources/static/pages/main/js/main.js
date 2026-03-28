import {
    updateCoinBalance,
    getMe
} from '../../../../shared/api.js';
import { getCurrentPlayerId } from '../../../../shared/current-player.js';

import {initShop,renderCoins } from './items/shop.js';
import {initFriends } from './friends/friend-cards.js';


document.addEventListener("DOMContentLoaded", initMain);

async function initMain() {
    await initShop();
    await initFriends();
    binButtns();
    initBalanceButton();
}


function binButtns() {
    document.getElementById("startBtn")
        .addEventListener("click", () => {
            window.location.href =
                'http://localhost:8081/pages/timer-settings/timer-settings.html';
        });
    document.getElementById("gachaCharacterBtn")
            .addEventListener("click", () => {
                window.location.href =
                    'http://localhost:8081/pages/gacha/gacha.html';
        });
}

// монеты для разработчика
async function initBalanceButton() {
    try {
        const me = await getMe();
        if (!me || !me.developer) return;

        const btn = document.getElementById("devBalanceBtn");
        if (!btn) return;

        btn.classList.remove("hidden");

        btn.addEventListener("click", async () => {
            const value = prompt("Введите новое количество монет:");
            if (value === null) return;

            const amount = Number(value);

            if (isNaN(amount) || amount < 0) {
                alert("Введите корректное число");
                return;
            }

            await updateCoinBalance(amount);
            await renderCoins();
        });

    } catch (e) {
        console.error("Ошибка получения пользователя", e);
    }
}