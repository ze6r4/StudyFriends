const API_BASE = 'http://localhost:8081/api';
const PLAYER_ID = 1;

// GET - запрос НАВЫКИ ИГРОКА
export async function getSkills(playerId = 1) {
    try {
        const response = await fetch(`${API_BASE}/skills?playerId=${playerId}`);
        const skills = await response.json();
        return skills;
    } catch (error) {
        errorMessage(error);
    }
}
// GET - запрос ДРУЗЬЯ ИГРОКА
export async function getFriends(playerId = 1) {
    try {
        const response = await fetch(`${API_BASE}/friends?playerId=${playerId}`);
        const friends = await response.json();
        return friends;
    } catch (error) {
        errorMessage(error);
    }
}

//POST - запрос СЕССИЯ
export async function postSession(sessionData) {
    try {
        const response = await fetch(`${API_BASE}/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sessionData)
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        const result = await response.json();
        console.log('Сессия создана!', result);

    } catch (error) {
        errorMessage(error);
    }
}

function errorMessage(error) {
    console.error('Ошибка сервера:', error);
    alert(`🤕Ой-ой-ой... Вот что случилось:\n${error.message}`);
}