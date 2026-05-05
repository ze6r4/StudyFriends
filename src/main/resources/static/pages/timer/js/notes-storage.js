const NOTES_STORAGE_KEY = 'userNotesContent';

document.addEventListener('DOMContentLoaded', () => {
    const notesEl = document.getElementById('notesContent');
    if (!notesEl) return;

    // загрузка
    const saved = localStorage.getItem(NOTES_STORAGE_KEY);
    if (saved) {
        notesEl.innerHTML = saved;
    }

    // сохранение (debounce)
    let timeout;

    notesEl.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            localStorage.setItem(NOTES_STORAGE_KEY, notesEl.innerHTML);
        }, 300);
    });
});