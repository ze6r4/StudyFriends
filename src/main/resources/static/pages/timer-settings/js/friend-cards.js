import { getFriends } from '../../../shared/api.js';

document.addEventListener("DOMContentLoaded", function() {
  initializeCustomSelectsFriends();
});

async function initializeCustomSelectsFriends() {
    const friendsGrid = document.querySelector(".friends-grid");

    try {
        const friends = await getFriends(1);
        console.log(friends.length)
        if (friends && friends.length > 0) {
            friendsGrid.innerHTML = generateFriendHtml(friends);
        }
    } catch (error) {
        console.error('💨 Ошибка загрузки друзей:', error);
        friendsGrid.innerHTML = '<p>Ошибка загрузки</p>';
    }
}
document.querySelectorAll('.friend-card').forEach(card => {
    card.addEventListener('click', function() {
        // Убираем выделение у всех друзей
        document.querySelectorAll('.friend-card').forEach(c => {
            c.classList.remove('selected');
        });

        // Выделяем текущего
        this.classList.add('selected');
    });
});
function generateFriendHtml(friends) {
    let html = '';
    const BASE_PATH = '../../assets/front/images/characters';

    friends.forEach((friend) => {
        html += `
            <div class="friend-card" data-friend-id="${friend.friendId}">
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
