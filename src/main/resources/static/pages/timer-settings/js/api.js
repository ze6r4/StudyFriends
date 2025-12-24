// Импортируем всё нужное
import { getSkills, getFriends, postSession } from '../../../shared/api.js';

// Функция заполнения выпадающего списка НАВЫКОВ
async function createSkillsList(playerId) {
    const select = document.getElementById('select-dropdown hidden');
    const skills = await getSkills(playerId);
    console.log(skills);
    // Очищаем текущие опции
    select.innerHTML = '';

    // Добавляем новые опции
    skills.forEach(skill => {
        const li = document.createElement('li');
        li.role = 'option';

        const option = document.createElement('option');
        option.value = skill.skillId; // ID навыка как value
        option.textContent = `${skill.name} (ID: ${skill.skillId}) - Уровень: ${skill.progress}`;
        select.appendChild(option);
    });
}

// Функция заполнения выпадающего списка ДРУЗЕЙ
async function createFriendsList(playerId) {
    const select = document.getElementById('selectFriend');
    const friends = await getFriends(playerId);
    console.log(friends);
    // Очищаем текущие опции
    select.innerHTML = '';

    // Добавляем новые опции
    friends.forEach(friend => {
        const option = document.createElement('option');
        option.value = friend.Id; // ID навыка как value
        option.textContent = `${friend.name} (ID: ${friend.id}) - ${friend.description}`;
        select.appendChild(option);
    });
}

// Загружаем навыки при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    createSkillsList(1); // playerId = 1
    createFriendsList(1);
});

async function startSession(){

    const sessionData = {
        workMinutes: parseInt(document.getElementById('workMinutes').value, 10),
        restMinutes: parseInt(document.getElementById('restMinutes').value, 10),
        cycles: parseInt(document.getElementById('cyclesAmount').value, 10),
        playerId: PLAYER_ID,
        friendId: parseInt(document.getElementById('selectFriend').value, 10),
        skillId: parseInt(document.getElementById('selectSkill').value, 10)
    };
    console.log(sessionData);
    await postSession(sessionData);
    localStorage.setItem('currentSession', sessionData);
    window.location.href = `${API_BASE}/timer.html`;
}

window.startSession = startSession;

