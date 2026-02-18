const BASE_PATH = '../../assets/images/items';

export function generateItemHtml(items) {
    let html = '';

    items.forEach(item => {
        html += `
            <div class="item-card" data-item-id="${item.itemId}">
                <img src="${BASE_PATH}/${item.itemCard}.png" alt="${item.itemName}">
                <div class="item-name">${item.itemName}</div>
                <div class="item-price">
                    ${item.itemPrice} 🪙
                </div>
            </div>
        `;
    });

    return html;
}
