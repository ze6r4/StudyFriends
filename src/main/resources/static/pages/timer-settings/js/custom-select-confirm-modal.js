let pendingDeleteCallback = null;

export function showConfirmModal(message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const messageElement = document.getElementById('confirmMessage');

    if (!modal) {
        console.error('confirmModal не найден в DOM');
        return;
    }

    messageElement.textContent = message;
    pendingDeleteCallback = onConfirm;

    modal.classList.remove('hidden');
}

export function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    pendingDeleteCallback = null;
}

function confirmDelete() {
    if (pendingDeleteCallback) {
        pendingDeleteCallback();
    }
    closeConfirmModal();
}

// =========================
// 🔥 ИНИЦИАЛИЗАЦИЯ
// =========================
document.addEventListener('DOMContentLoaded', () => {
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const cancelBtn = document.querySelector('.btn-secondary');
    const closeBtn = document.querySelector('.modal-close');
    const modal = document.getElementById('confirmModal');

    // --- Удалить ---
    if (confirmBtn) {
        const newBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newBtn, confirmBtn);

        newBtn.addEventListener('click', confirmDelete);
    }

    // --- Отмена ---
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeConfirmModal);
    }

    // --- Крестик ---
    if (closeBtn) {
        closeBtn.addEventListener('click', closeConfirmModal);
    }

    // --- ESC закрытие ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeConfirmModal();
        }
    });
});