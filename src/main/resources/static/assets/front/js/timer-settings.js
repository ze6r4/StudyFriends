
const API_BASE = 'http://localhost:8081/api';

// Элементы DOM
const workInput = document.getElementById('workMinutes');
const restInput = document.getElementById('restMinutes');
const cyclesInput = document.getElementById('cyclesAmount');
const friendSelect = document.getElementById('selectFriend');
const skillSelect = document.getElementById('selectSkill');

const workValue = document.getElementById('workValue');
const restValue = document.getElementById('restValue');
const cyclesValue = document.getElementById('cyclesValue');
const totalTime = document.getElementById('totalTime');
const totalCoins = document.getElementById('totalCoins');
const totalExp = document.getElementById('totalExp');

// Обновление отображения значений
function updateValues() {
    const work = parseInt(workInput.value);
    const rest = parseInt(restInput.value);
    const cycles = parseInt(cyclesInput.value);
    
    workValue.textContent = work;
    restValue.textContent = rest;
    cyclesValue.textContent = cycles;
    
    // Расчет общего времени
    const totalMinutes = (work + rest) * cycles;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    totalTime.textContent = `Время сессии: ${hours} часов ${minutes} минут`;
    
    // Расчет наград (примерные формулы)
    const coins = work * cycles * 2; // 2 монеты за минуту работы
    const exp = work * cycles * 3; // 3 EXP за минуту работы
    
    totalCoins.textContent = `Количество монет: ${coins}`;
    totalExp.textContent = `Очки навыка: ${exp} EXP`;
}

// Обработчики событий для ползунков
workInput.addEventListener('input', updateValues);
restInput.addEventListener('input', updateValues);
cyclesInput.addEventListener('input', updateValues);

// Функция отправки данных на сервер
async function startSession() {
    const sessionData = {
        workMinutes: parseInt(workInput.value),
        restMinutes: parseInt(restInput.value),
        cycles: parseInt(cyclesInput.value),
        characterId: parseInt(friendSelect.value),
        skillId: parseInt(skillSelect.value),
        // Можно добавить playerId, если пользователь авторизован
        playerId: 1 // Временное значение, потом из localStorage или cookies
    };
    
    console.log('Отправляемые данные:', sessionData);
    
    try {
        const response = await fetch(`${API_BASE}/session/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Если есть авторизация: 'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(sessionData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('Сессия создана:', result);
        
        // Переход на страницу таймера
        // window.location.href = `timer.html?sessionId=${result.sessionId}`;
        alert(`Сессия начата! ID: ${result.sessionId}`);
        
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка при создании сессии: ' + error.message);
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', updateValues);

