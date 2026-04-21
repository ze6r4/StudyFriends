// notes-storage.js

const NOTES_STORAGE_KEY = 'userNotesContent';
let saveTimeout;

function triggerSave() {
    const notesEl = document.getElementById('notesContent');
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        const data = serializeNotes(notesEl);
        localStorage.setItem(NOTES_STORAGE_KEY, data);
    }, 200);
}

document.addEventListener('DOMContentLoaded', () => {
    const notesEl = document.getElementById('notesContent');
    if (!notesEl) return;

    // загрузка
    const saved = localStorage.getItem(NOTES_STORAGE_KEY);
    if (saved) {
        console.log("dsf");
        console.log(saved);
        deserializeNotes(saved, notesEl);
    }

    // сохранение
    let timeout;

    notesEl.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const data = serializeNotes(notesEl);
            localStorage.setItem(NOTES_STORAGE_KEY, data);
        }, 300);
    });
});
function serializeNotes(notesEl) {
    const data = [];

    notesEl.querySelectorAll("p").forEach(p => {
        data.push({
            checked: p.getAttribute("data-checked") === "true",
            html: p.innerHTML
        });
    });

    return JSON.stringify(data);
}
function deserializeNotes(text, notesEl) {
    notesEl.innerHTML = "";

    const data = JSON.parse(text);

    data.forEach(item => {
        const p = document.createElement("p");

        p.setAttribute("data-checked", item.checked);
        p.innerHTML = item.html;

        notesEl.appendChild(p);
    });
}
document.addEventListener("DOMContentLoaded", () => {
    const notes = document.getElementById("notesContent");

    ensureStructure();

    // === ввод ===
    notes.addEventListener("input", () => {
        normalize();
        ensureStructure();
    });

    // === enter ===
    notes.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const sel = window.getSelection();
            if (!sel.rangeCount) return;

            const range = sel.getRangeAt(0);
            const currentP = getCurrentParagraph();

            const newP = createLine();

            if (!currentP) {
                notes.appendChild(newP);
                placeCursor(newP);
                return;
            }

            // зачёркивание
            if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "x") {
                e.preventDefault();
                toggleStrike();
                triggerSave(); // 🔥 важно
            }
            // 🔥 ДЕЛИМ СТРОКУ
            const afterCursor = range.extractContents();
            newP.appendChild(afterCursor);

            currentP.after(newP);
            placeCursor(newP);
        }
    });



    // === чекбокс ===
    notes.addEventListener("click", (e) => {
        const p = e.target.closest("p");
        if (p) toggleCheck(p);
    });

    // =====================

    function createLine() {
        const p = document.createElement("p");
        p.setAttribute("data-checked", "false");
        p.innerHTML = "";
        return p;
    }

    function ensureStructure() {
        const paragraphs = notes.querySelectorAll("p");

        if (paragraphs.length === 0) {
            notes.appendChild(createLine());
        }
    }

    // 🔥 УБИРАЕМ ВЛОЖЕННОСТЬ
    function normalize() {
        const paragraphs = notes.querySelectorAll("p");

        paragraphs.forEach(p => {
            const nested = p.querySelectorAll("p");
            nested.forEach(inner => {
                p.after(inner);
            });
        });

        // ❌ БОЛЬШЕ НЕ УДАЛЯЕМ ПУСТЫЕ СТРОКИ
    }

    function toggleCheck(p) {
        if (notes.classList.contains("rewards-mode")) return;
        const checked = p.getAttribute("data-checked") === "true";
        const newChecked = !checked;

        p.setAttribute("data-checked", newChecked);

        // 🔥 ОБНОВЛЯЕМ ТЕКСТ ПРЯМО СРАЗУ
        const text = p.innerHTML.replace(/^✔ |^• /, "");

        if (newChecked) {
            p.innerHTML = text;
        } else {
            p.innerHTML = text;
        }

        triggerSave();
    }

    function getCurrentParagraph() {
        const sel = window.getSelection();
        if (!sel.rangeCount) return null;

        let node = sel.anchorNode;

        while (node && node !== notes) {
            if (node.tagName === "P") return node;
            node = node.parentNode;
        }

        return null;
    }

    function placeCursor(el) {
        const range = document.createRange();
        const sel = window.getSelection();

        range.setStart(el, 0);
        range.collapse(true);

        sel.removeAllRanges();
        sel.addRange(range);
    }
});
function toggleStrike() {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);

    if (range.collapsed) return;

    const parent = range.commonAncestorContainer;

    // если уже внутри <s> → снимаем
    let node = parent;
    while (node && node.tagName !== "S") {
        node = node.parentNode;
    }

    if (node && node.tagName === "S") {
        const text = document.createTextNode(node.textContent);
        node.replaceWith(text);
    } else {
        const wrapper = document.createElement("s");
        wrapper.appendChild(range.extractContents());
        range.insertNode(wrapper);
    }

    sel.removeAllRanges();
}