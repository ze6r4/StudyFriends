import { getFriends } from '../../../shared/api.js';

document.addEventListener("DOMContentLoaded", function() {
  initializeCustomSelectsFriends();
});

async function initializeCustomSelectsFriends() {
    const friendsGrid = document.querySelector(".friends-grid");

    try {
        const friends = await getFriends(1);

        if (friends && friends.length > 0) {
            friendsGrid.innerHTML = generateFriendHtml(friends);
        }
    } catch (error) {
        console.error('💨 Ошибка загрузки друзей:', error);
        friendsGrid.innerHTML = '<p>Ошибка загрузки</p>';
    }
}

function generateFriendHtml(friends) {
    let html = '';
    const BASE_PATH = '../../assets/front/images/characters';

    friends.forEach((friend) => {
        html += `
            <div class="friend-card">
                <img src="${BASE_PATH}/${friend.cardImage}.png"
                     alt="${friend.name}"
                     class="friend-avatar">
                <h3 class="friend-name">${friend.name}</h3>
                <p class="friend-description">${friend.description}</p>
            </div>
        `;
    });

    return html;
}
