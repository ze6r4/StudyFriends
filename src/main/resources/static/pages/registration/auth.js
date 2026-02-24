const DEV_EMAIL = 'ze6rarr';
const DEV_PASS = 'error'
const PATH = 'http://localhost:8081/pages';

import { postPlayer, loginPlayer } from '../../shared/api.js';
import { showError } from '../../shared/showError.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = {
            name: document.querySelector('input[type="text"]').value,
            email: document.querySelector('input[type="email"]').value,
            password: document.querySelectorAll('input[type="password"]')[0].value
        };

        try {
            await postPlayer(data);
            window.location.href = '/pages/main/main.html';
        } catch (e) {
            showError(e);
        }
    });
});


document.getElementById('submit-login').addEventListener('click', async (e) => {
    e.preventDefault();

    const data = {
        name: document.querySelector('input[type="text"]').value,
        password: document.querySelectorAll('input[type="password"]')[0].value
    };
    console.log(data);

    try {
        await loginPlayer(data);
        window.location.href = '/pages/main/main.html';
    } catch (e) {
        showError(e);
    }
});

