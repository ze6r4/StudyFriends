const BASE_PATH = '../../assets/images/characters';

export function generateFriendHtml(friends) {
    let html = '';

    friends.forEach((friend) => {
        html += `
            <div class="friend-card" data-friend-id="${friend.id}">
                <img src="${BASE_PATH}/${friend.cardImage}.png"
                     alt="${friend.name}"
                     class="friend-avatar">

                <h3 class="friend-name">${friend.name}</h3>
                <p class="friend-description">${friend.description}</p>
                <p class="friend-description"><br>Уровень дружбы:</p>
                <div class="friendship-bar">
                    <div
                        class="friendship-bar-fill"
                        style="width: ${friend.friendshipLvl ?? 0}%">
                    </div>
                </div>
                <p class="friend-description">Бонус:</p>
            </div>
        `;
    });

    return html;
}
