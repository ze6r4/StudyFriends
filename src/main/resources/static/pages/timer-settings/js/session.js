// Импортируем всё нужное
import {postSession } from '../../../shared/api.js';
const API_BASE = 'http://localhost:8081/api';
const PLAYER_ID = 1;


async function startSession(){

    const sessionData = {
        workMinutes: parseInt(document.getElementById('workMinutes').value, 10),
        restMinutes: parseInt(document.getElementById('restMinutes').value, 10),
        cycles: parseInt(document.getElementById('cyclesAmount').value, 10),
        playerId: PLAYER_ID,
        friendId: parseInt(document.getElementById('selectFriend').value, 10),
        skillId: parseInt(document.getElementById('selectSkill').value, 10)
    };
    console.log(sessionData);
    await postSession(sessionData);
    localStorage.setItem('currentSession', sessionData);
    window.location.href = `${API_BASE}/timer.html`;
}

window.startSession = startSession;

