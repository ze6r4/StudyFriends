const BASE_PATH = '../../assets/images/characters';

export function generateFriendHtml(friends) {
    let html = '';

    friends.forEach(friend => {
        html += `
            <div class="item-card friend-card"
                 data-friend-id="${friend.id}">

                <img src="${BASE_PATH}/${friend.cardImage}.png"
                     alt="${friend.name}">

                <div>${friend.name}</div>
            </div>
        `;
    });

    return html;
}