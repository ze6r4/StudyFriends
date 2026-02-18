import { apiPublic, apiAuth } from './apiRequest.js';

/* ================= AUTH ================= */

// регистрация
export function postPlayer(data) {
    return apiAuth('/register', {
        method: 'POST',
        body: data
    });
}

// логин
export function loginPlayer(data) {
    return apiAuth('/login', {
        method: 'POST',
        body: data
    });
}

// текущий пользователь
export function getMe() {
    return apiAuth('/me');
}

/* ================= SKILLS ================= */

// все навыки игрока
export function getSkills(playerId) {
    return apiPublic(`/skills?playerId=${playerId}`);
}

// навыки + сессии
export function getPlayerSkillsFull(playerId) {
    return apiPublic(`/skills/full?playerId=${playerId}`);
}

// сохранить навык
export function postSkill(skillData) {
    return apiPublic('/skills', {
        method: 'POST',
        body: skillData
    });
}

// обновить навык
export function updatePlayerSkill(skillId, data) {
    return apiPublic(`/skills/${skillId}`, {
        method: 'PATCH',
        body: data
    });
}

// удалить навык
export function deletePlayerSkill(skillId) {
    return apiPublic(`/skills/${skillId}`, {
        method: 'DELETE'
    });
}

/* ================= FRIENDS ================= */

export function getFriends(playerId) {
    return apiPublic(`/friends?playerId=${playerId}`);
}

export function getFriend(friendId) {
    return apiPublic(`/friend?friendId=${friendId}`);
}

export function patchFriend(id, data) {
    return apiPublic(`/friend/${id}`, {
        method: 'PATCH',
        body: data
    });
}

/* ================= CHARACTERS ================= */

export function getCharacter(characterId) {
    return apiPublic(`/characters/${characterId}`);
}
/* ================= ITEMS ================= */
export function getItems(playerId) {
    return apiPublic(`/items?playerId=${playerId}`);
}
/* ================= SESSIONS ================= */

export function postSession(sessionData) {
    return apiPublic('/sessions', {
        method: 'POST',
        body: sessionData
    });
}

export function patchSession(id, sessionData) {
    return apiPublic(`/sessions/${id}`, {
        method: 'PATCH',
        body: sessionData
    });
}
