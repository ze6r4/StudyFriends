// notes-storage.js

const NOTES_STORAGE_KEY = 'userNotesContent';

document.addEventListener('DOMContentLoaded', () => {
    const notesEl = document.getElementById('notesContent');
    if (!notesEl) return;

    notesEl.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'x') {
            e.preventDefault();
            document.execCommand('strikeThrough');
        }
    });
    // 🔹 Восстановление заметок
    const savedNotes = localStorage.getItem(NOTES_STORAGE_KEY);
    if (savedNotes) {
        notesEl.innerHTML = savedNotes;
    }

    // 🔹 Автосохранение при любом изменении
    let saveTimeout;

    notesEl.addEventListener('input', () => {
        // debounce — чтобы не писать в storage на каждый символ
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            localStorage.setItem(NOTES_STORAGE_KEY, notesEl.innerHTML);
        }, 300);
    });
});

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
                document.execCommand("strikeThrough");
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