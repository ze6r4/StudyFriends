export function generateItemHtml(items) {
    let html = '';

    items.forEach(item => {
        html += `
            <div class="item-card" data-id="${item.id}">
                <img src="../../assets/images/items/${item.itemCard}.png" alt="${item.itemName}">
                <div>${item.itemName}</div>
                ${!item.isBought
                    ? `<div class="item-price">${item.itemPrice} 🪙</div>`
                    : ``}
            </div>
        `;
    });

    return html;
}
