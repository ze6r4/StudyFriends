export function showError(error) {
    let message = 'Что-то пошло не так 😢';

    if (error.status === 409) {
        message = 'Никнейм уже занят';
    } else if (error.status === 401) {
        message = 'Неверный логин или пароль';
    } else if (error.message) {
        message = error.message;
    }

    showToast(message);
    alert(message);
}
function showToast(text) {
    const toast = document.createElement('div');
    toast.className = 'toast-error';
    toast.innerText = text;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => toast.remove(), 4000);
}
