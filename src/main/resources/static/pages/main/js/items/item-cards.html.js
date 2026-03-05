export function generateItemHtml(items) {
    let html = '';

    items.forEach(item => {
        html += `
            <div class="item-card" data-id="${item.itemId}">
                <img src="../../assets/images/items/${item.itemCard}.png"
                     alt="${item.itemName}">

                <div class="item-name">${item.itemName}</div>

                ${
                    !item.isBought
                        ? `<div class="item-price">${item.itemPrice} 🪙</div>`
                        : ``
                }
            </div>
        `;
    });

    return html;
}