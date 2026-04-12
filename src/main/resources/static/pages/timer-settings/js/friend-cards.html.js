const BASE_PATH = '../../assets/images/characters';

export function generateFriendHtml(friends,lvls) {
    let html = '';

    friends.forEach((friend) => {
        const lvlData = lvls[friend.friendshipLvl];

        const maxExp = lvlData?.totalExpForLvl ?? 1;
        const percent = (friend.expAmount / maxExp) * 100;
        const bonus = Math.round((lvlData?.coinsBonus ?? 0) * 100);
        html += `
            <div class="friend-card" data-friend-id="${friend.id}">
                <img src="${BASE_PATH}/${friend.cardImage}.png"
                     alt="${friend.name}"
                     class="friend-avatar">

                <h3 class="friend-name">${friend.name}</h3>
                <p class="friend-description">${friend.description}</p>

                <p class="friend-lvl">
                    Уровень дружбы: ${friend.friendshipLvl}
                </p>

                <div class="friendship-bar">
                    <div
                        class="friendship-bar-fill"
                        style="width: ${percent}%">
                    </div>
                </div>

                <p class="friend-description">
                    Бонус: +${bonus}%
                </p>
            </div>
        `;
    });

    return html;
}
