const DEV_EMAIL = 'ze6rarr';
const DEV_PASS = 'error';
const PATH = 'http://localhost:8081/pages';
const NICK_ID = 1;

import { postPlayer, loginPlayer, postFriend, getMe } from '../../shared/api.js';
import { showError } from '../../shared/showError.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    // РЕГИСТРАЦИЯ
    if (document.getElementById('submit')) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                showError({ message: 'Пароли не совпадают' });
                return;
            }

            const data = {
                name: document.getElementById('nickname').value,
                email: document.getElementById('email').value,
                password
            };

            try {
                await postPlayer(data);

                // логинимся после регистрации
                await loginPlayer({
                    name: data.name,
                    password: data.password
                });

                const player = await getMe();
                await postFriend(player.id, NICK_ID);

                window.location.href = '/pages/main/main.html';
            } catch (e) {
                showError(e);
            }
        });
    }

    // 🟢 ЛОГИН
    if (document.getElementById('submit-login')) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const data = {
                name: document.getElementById('nickname').value,
                password: document.querySelector('input[type="password"]').value
            };

            try {
                await loginPlayer(data);
                window.location.href = '/pages/main/main.html';
            } catch (e) {
                showError(e);
            }
        });
    }
});