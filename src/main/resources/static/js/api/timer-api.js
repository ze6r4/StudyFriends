
const API_BASE = 'http://localhost:8081/api';
const PLAYER_ID = 1;

// GET - запрос
async function loadSkills(playerId = 1) {
    try {
        const response = await fetch(`${API_BASE}/skills?playerId=${playerId}`);
        const skills = await response.json();
        populateSkillSelect(skills);
    } catch (error) {
        errorMessage
    }
}

// Функция заполнения выпадающего списка
function populateSkillSelect(skills) {
    const select = document.getElementById('select-dropdown hidden');
    
    // Очищаем текущие опции
    select.innerHTML = '';
    
    // Добавляем новые опции
    skills.forEach(skill => {
        const li = document.createElement('li');
        li.role = 'option'

        const option = document.createElement('option');
        option.value = skill.skillId; // ID навыка как value
        option.textContent = `${skill.name} (ID: ${skill.skillId}) - Уровень: ${skill.progress}`;
        select.appendChild(option);
    });
}

// Загружаем навыки при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadSkills(1); // playerId = 1
});

//POST - запрос
async function startSession() {

    // Читаем значения прямо перед отправкой
    const sessionData = {
        workMinutes: parseInt(document.getElementById('workMinutes').value, 10),
        restMinutes: parseInt(document.getElementById('restMinutes').value, 10),
        cycles: parseInt(document.getElementById('cyclesAmount').value, 10),
        playerId: PLAYER_ID,
        friendId: parseInt(document.getElementById('selectFriend').value, 10),
        skillId: parseInt(document.getElementById('selectSkill').value, 10)
    };

    try {
        const response = await fetch(`${API_BASE}/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sessionData)
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const result = await response.json();
        console.log('Сессия создана!', result);

        // window.location.href = `timer.html?sessionId=${result.sessionId}`;

    } catch (error) {
        errorMessage(error);
    }

    localStorage.setItem(`currentSession${PLAYER_ID}`, JSON.stringify(sessionData));
}

window.startSession = startSession;

function errorMessage(error) {
    console.error('Ошибка:', error);
    alert(`🤕Ой-ой-ой... Вот что случилось:\n${error.message}`);
}