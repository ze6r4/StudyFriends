const API_BASE = 'http://localhost:8081/api';
const PLAYER_ID = 1;

// GET - запрос все навыки
export async function getSkills(playerId = 1) {
    try {
        const response = await fetch(`${API_BASE}/skills?playerId=${playerId}`);
        const skills = await response.json();
        console.log('Навыки из базы данных обычные', skills);
        return skills;
    } catch (error) {
        errorMessage('сервер не нашел твои навыки :(');
    }
}
// Получаем все навыки игрока с информацией о том, использовался ли навык в сессиях
export async function getPlayerSkillsFull(playerId=1) {
    try {
        const response = await fetch(`${API_BASE}/skills/full?playerId=${playerId}`);
        if (!response.ok) throw new Error('Ошибка при получении навыков игрока');

        const skills = await response.json();
        console.log('Навыки из базы данных в сложном get-запросе!', skills);
        return skills;
    } catch (error) {
        errorMessage('сервер не нашел активные навыки в сложном запросе')
    }
}

// POST - сохранить НАВЫК ИГРОКА
export async function postSkill(skillData) {
    try {
            const response = await fetch(`${API_BASE}/skills`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(skillData)
            });
            if (!response.ok) {
                throw new Error(await response.text());
            }
            const result = await response.json();
            console.log('Навыки сохранены!', result);
            return result;

        } catch (error) {
            errorMessage('Навыки не сохранены.. ' + error.message);
            return null;
        }
}
// Обновляем навык (например, деактивируем)
export async function updatePlayerSkill(skillId, data) {
    try {
        const response = await fetch(`${API_BASE}/skills/${skillId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Ошибка при обновлении навыка');
        return await response.json();
    } catch (error) {
        errorMessage('ошибка при обновлении навыка (для отправки в архив)');
    }
}

// Удаляем навык
export async function deletePlayerSkill(skillId) {
    try {
        const response = await fetch(`${API_BASE}/skills/${skillId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Ошибка при удалении навыка');
    } catch (error) {
        errorMessage('ошибка при удалении навыка')
    }
}

// GET - запрос ДРУЗЬЯ ИГРОКА
export async function getFriends(playerId = 1) {
    try {
        const response = await fetch(`${API_BASE}/friends?playerId=${playerId}`);
        const friends = await response.json();
        return friends;
    } catch (error) {
        errorMessage('сервер не нашел твоих друзей :(');
    }
}
// GET - запрос ДРУГ
export async function getFriend(playerId = 1, friendId) {
    try {
        const response = await fetch(`${API_BASE}/friend?playerId=${playerId}&friendId=${friendId}`);
        const friend = await response.json();
        return friend;
    } catch (error) {
        errorMessage('сервер не нашел твоего друга :(');
    }
}
// GET - запрос ПЕРСОНАЖ
export async function getCharacter(characterId) {
    try {
        const response = await fetch(`${API_BASE}/characters/${characterId}`);
        console.log(response);
        console.log("!!!",characterId);
        const character = await response.json();
        return character;
    } catch (error) {
        errorMessage('сервер не нашел персонажа :(');
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
        errorMessage(error.message);
    }
}
//PATCH - запрос СЕССИЯ
export async function patchSession(sessionData) {
    try {
        const response = await fetch(`${API_BASE}/sessions`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sessionData)
        });
        if (!response.ok) {
            throw new Error(await response.text());
        }
        const result = await response.json();
        console.log('Сессия обновлена!', result);

    } catch (error) {
        errorMessage(error.message);
    }
}

function errorMessage(error) {
    console.error('Ошибка сервера!');
    alert(`🤕Ой-ой-ой... Вот что случилось:\n${error}`);
}