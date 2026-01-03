// Импортируем всё нужное
import {postSession, getPlayerSkillsFull, updatePlayerSkill, deletePlayerSkill, postSkill } from '../../../shared/api.js';
const PATH = 'http://localhost:8081/pages';
const PLAYER_ID = 1;

import { mapSkillsFromDom } from './skills-mapper.js';
import { skillsChanged } from './skills-select-generation.js';

async function startSession(){
    if (skillsChanged === true) {
        await saveSkills();
    }

    const skillId = document.querySelector('.select-dropdown li[aria-selected="true"]')?.dataset.skillId || null
    const friendId = document.querySelector('.friend-card.selected')?.dataset.friendId || 1;
    const sessionData = {
        workMinutes: parseInt(document.getElementById('workMinutes').value, 10),
        restMinutes: parseInt(document.getElementById('restMinutes').value, 10),
        cycles: parseInt(document.getElementById('cyclesAmount').value, 10),
        playerId: PLAYER_ID,
        friendId: friendId,
        skillId: skillId
    };
    console.log(sessionData);
    await postSession(sessionData);
    localStorage.setItem('currentSession', JSON.stringify(sessionData));
    window.location.href = `${PATH}/timer/timer.html`;
}

async function saveSkills() {
    const customSelect = document.getElementById('selectSkill');
    //измененные навыки из фронта
    const newSkills = mapSkillsFromDom(customSelect, PLAYER_ID);

    // 1️⃣ старые навыки из бд
    const oldSkills = await getPlayerSkillsFull(PLAYER_ID);

    // 2️⃣ Обработка старых навыков
    for (const oldSkill of oldSkills) {
        const stillSelected = newSkills.some(n => n.skillId === oldSkill.skillId);
        if (!stillSelected) {
            if (oldSkill.usedInSessions) {
                // деактивируем (is_active = 0)
                await updatePlayerSkill(oldSkill.skillId, { is_active: 0 });
            } else {
                // полностью удаляем
                await deletePlayerSkill(oldSkill.skillId);
            }
        }
    }

    // 3️⃣ Добавление новых навыков
    for (const skill of newSkills) {
        const exists = oldSkills.some(o => o.skillId === skill.skillId);
        if (!exists) {
            await postSkill({ ...skill, is_active: 1 });
        }
    }
}
window.startSession = startSession;

