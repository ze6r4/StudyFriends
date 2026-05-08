const notes = document.getElementById('notesContent');
const strikeBtn = document.getElementById('strikeBtn');

strikeBtn.addEventListener('click', toggleStrike);

function toggleStrike() {

    const selection = window.getSelection();

    if (!selection || selection.rangeCount === 0) {
        return;
    }

    const text = selection.toString().trim();

    if (!text) {
        return;
    }

    const range = selection.getRangeAt(0);

    // выделение только внутри заметок
    if (!notes.contains(range.commonAncestorContainer)) {
        return;
    }

    const parentStrike = getStrikeParent(range);

    // если текст уже зачеркнут -> убираем <s>
    if (parentStrike) {

        const fragment = document.createDocumentFragment();

        while (parentStrike.firstChild) {
            fragment.appendChild(parentStrike.firstChild);
        }

        parentStrike.replaceWith(fragment);

    } else {

        // иначе добавляем зачеркивание
        const strike = document.createElement('s');

        strike.appendChild(range.extractContents());

        range.insertNode(strike);
    }

    selection.removeAllRanges();
}

function getStrikeParent(range) {

    let node = range.commonAncestorContainer;

    while (node && node !== notes) {

        if (
            node.nodeType === 1 &&
            node.tagName === 'S'
        ) {
            return node;
        }

        node = node.parentNode;
    }

    return null;
}