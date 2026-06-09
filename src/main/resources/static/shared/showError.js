export function showError(error) {

    if (typeof error === 'string') {
        showToast(error);
        return;
    }

    const status = error.status || error.response?.status;
    let message = 'Неизвестная ошибка 😢';

    if (status === 409) {
        message = 'Никнейм уже занят';
    } else if (status === 401) {
        message = 'Неверный логин или пароль';
    } else if (error.response?.data?.message) {
        message = error.response.data.message;
    } else if (error.response?.data?.error) {
        message = error.response.data.error;
    } else if (error.message) {
        message = error.message;
    }

    showToast(message);
}
function showToast(text) {
    const toast = document.createElement('div');
    toast.className = 'toast-error';
    toast.innerText = text;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => toast.remove(), 4000);
}
