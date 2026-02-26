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

export function isDeveloper(playerId) {
    const data = getMe();
    return data.role == ''
}
/* ================= COINS ================= */

export function getCoins(playerId) {
    return apiAuth(`/coins?playerId=${playerId}`);
}
export function updateCoinBalance(amount) {
    return apiAuth(`/coins/set?amount=${amount}`, {
        method: 'POST'
    });
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
/* ================= VISITORS ================= */
export function getVisitors(playerId) {
    return apiPublic(`/visitors-and-not?playerId=${playerId}`);
}
export function postVisitor(visitorData) {
    return apiPublic('/visitors', {
        method: 'POST',
        body: visitorData
    });
}
export function deleteVisitor(playerFriendId) {
    return apiPublic(`/visitors/${playerFriendId}`, {
        method: 'DELETE'
    });
}

/* ================= CHARACTERS ================= */

export function getCharacter(characterId) {
    return apiPublic(`/characters/${characterId}`);
}
/* ================= ITEMS ================= */
export function getShopItems(playerId) {
    return apiPublic(`/shop/items?playerId=${playerId}`);
}
export function buyItem(playerId,id){
    return apiPublic(`/shop/buy/${id}?playerId=${playerId}`, {
        method: 'POST'
    });
}
export function patchItem(id, itemData) {
    return apiPublic(`/items/${id}`, {
        method: 'PATCH',
        body: itemData
    });
}

/* ================= COINS ================= */

export function getCoinBalance() {
    return apiAuth('/coins');
}

export function spendCoins(amount) {
    return apiAuth(`/coins/spend?amount=${amount}`, {
        method: 'POST'
    });
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
