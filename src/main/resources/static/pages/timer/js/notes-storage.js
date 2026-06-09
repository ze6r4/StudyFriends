const NOTES_STORAGE_KEY = 'userNotesContent';

document.addEventListener('DOMContentLoaded', () => {

    const notesEl = document.getElementById('notesContent');

    if (!notesEl) return;

    // загрузка сохранённых заметок
    const saved = localStorage.getItem(NOTES_STORAGE_KEY);

    if (saved) {
        notesEl.innerHTML = saved;
    }

    let timeout;

    notesEl.addEventListener('input', () => {

        clearTimeout(timeout);

        timeout = setTimeout(() => {

            const cleanHtml = cleanNotesHtml(
                notesEl.innerHTML
            );

            // очищаем DOM от мусора браузера
            if (cleanHtml !== notesEl.innerHTML) {
                notesEl.innerHTML = cleanHtml;
            }

            // сохраняем только очищённый html
            localStorage.setItem(
                NOTES_STORAGE_KEY,
                cleanHtml
            );

        }, 300);

    });

});

/**
 * Очищает html заметок:
 * - удаляет ВСЕ атрибуты
 * - оставляет только:
 *   DIV, BR, S
 * - распаковывает мусорные теги
 */
function cleanNotesHtml(html) {

    const wrapper = document.createElement('div');

    wrapper.innerHTML = html;

    const allowedTags = ['DIV', 'BR', 'S'];

    wrapper.querySelectorAll('*').forEach(el => {

        // удаляем все атрибуты
        [...el.attributes].forEach(attr => {
            el.removeAttribute(attr.name);
        });

        // удаляем ненужные теги,
        // но сохраняем их содержимое
        if (!allowedTags.includes(el.tagName)) {

            el.replaceWith(...el.childNodes);

        }

    });

    return wrapper.innerHTML.trim();
}