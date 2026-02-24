import { getMe } from './api.js';

let cachedPlayerId = null;

export async function getCurrentPlayerId() {
    if (cachedPlayerId !== null) {
        return cachedPlayerId;
    }

    const player = await getMe();
    cachedPlayerId = player?.id;

    if (!cachedPlayerId) {
        throw new Error('Не удалось определить id текущего игрока');
    }

    return cachedPlayerId;
}
