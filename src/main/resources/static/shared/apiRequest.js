const API_BASE = 'http://localhost:8081/api';

async function baseRequest(endpoint, options = {}, withAuth = false) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        },
        credentials: withAuth ? 'include' : 'same-origin',
        body: options.body ? JSON.stringify(options.body) : undefined
    });

    const text = await response.text();
    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = { message: text };
        }
    }

    if (!response.ok) {
        const error = new Error(data?.message || 'Ошибка сервера');
        error.status = response.status;
        error.code = data?.code || 'UNKNOWN_ERROR';

        // 🔥 глобальная реакция на 401
        if (response.status === 401) {
            window.location.href = '/pages/auth/auth.html';
        }
        if(response.status ===500) {
            window.location.href = '/pages/error.html';
        }

        throw error;
    }

    return data;
}

// 🔓 без сессии
export function apiPublic(endpoint, options) {
    return baseRequest(endpoint, options, false);
}

// 🔐 с сессией
export function apiAuth(endpoint, options) {
    return baseRequest(endpoint, options, true);
}
