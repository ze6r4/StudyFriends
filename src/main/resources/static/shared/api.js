const API_BASE = 'http://localhost:8081/api';
const PLAYER_ID = 1;

// GET - запрос все навыки
export async function getSkills(playerId = 1) {
    try {
        const response = await fetch(`${API_BASE}/skills?playerId=${playerId}`);
        const skills = await response.json();
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

        const result = await response.json();
        console.log('Навыки!', result);
        return result;
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

        } catch (error) {
            errorMessage(error.message);
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

function errorMessage(error) {
    console.error('Ошибка сервера!');
    alert(`🤕Ой-ой-ой... Вот что случилось:\n${error}`);
}