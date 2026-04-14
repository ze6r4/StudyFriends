// notes-storage.js

const NOTES_STORAGE_KEY = 'userNotesContent';

document.addEventListener('DOMContentLoaded', () => {
    const notesEl = document.getElementById('notesContent');
    if (!notesEl) return;

    // загрузка
    const saved = localStorage.getItem(NOTES_STORAGE_KEY);
    if (saved) {
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
    const lines = [];

    notesEl.querySelectorAll("p").forEach(p => {
        const checked = p.getAttribute("data-checked") === "true";
        const prefix = checked ? "✔ " : "• ";

        let html = p.innerHTML;

        // сохраняем зачёркивание как <s>
        html = html
            .replace(/<strike>/g, "<s>")
            .replace(/<\/strike>/g, "</s>");

        // если строка пустая
        if (p.innerText.trim() === "") {
            lines.push("");
        } else {
            lines.push(prefix + html);
        }
    });

    return lines.join("\n");
}
function deserializeNotes(text, notesEl) {
    notesEl.innerHTML = "";

    const lines = text.split("\n");

    lines.forEach(line => {
        const p = document.createElement("p");

        if (line.startsWith("✔ ")) {
            p.setAttribute("data-checked", "true");
            p.innerHTML = line.slice(2);
        } else if (line.startsWith("• ")) {
            p.setAttribute("data-checked", "false");
            p.innerHTML = line.slice(2);
        } else {
            // пустая строка
            p.setAttribute("data-checked", "false");
            p.innerHTML = "";
        }

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
        const checked = p.getAttribute("data-checked") === "true";
        p.setAttribute("data-checked", !checked);
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

    const wrapper = document.createElement("s");
    wrapper.appendChild(range.extractContents());
    range.insertNode(wrapper);

    // курсор после
    range.setStartAfter(wrapper);
    range.collapse(true);

    sel.removeAllRanges();
    sel.addRange(range);
}