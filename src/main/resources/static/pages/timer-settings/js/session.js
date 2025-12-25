// Импортируем всё нужное
import {postSession } from '../../../shared/api.js';
const PATH = 'http://localhost:8081/pages';
const PLAYER_ID = 1;


async function startSession(){

    const skillId = document.querySelector('.select-dropdown li[aria-selected="true"]')?.dataset.skillId || null
    const friendId = document.querySelector('.friend-card.selected')?.dataset.friendId || 1;
    const sessionData = {
        workMinutes: parseInt(document.getElementById('workValueText').value, 10),
        restMinutes: parseInt(document.getElementById('restValueText').value, 10),
        cycles: parseInt(document.getElementById('cyclesValueText').value, 10),
        playerId: PLAYER_ID,
        friendId: friendId,
        skillId: skillId
    };
    console.log(sessionData);
    await postSession(sessionData);
    localStorage.setItem('currentSession', JSON.stringify(sessionData));
    window.location.href = `${PATH}/timer/timer.html`;
}

window.startSession = startSession;

