// Импортируем всё нужное
import {postSession, getPlayerSkillsFull, updatePlayerSkill, deletePlayerSkill, postSkill } from '../../../shared/api.js';
const PATH = 'http://localhost:8081/pages';
const PLAYER_ID = 1;

import { skillsChanged } from './custom-select.logic.js';

async function startSession(){
    if (skillsChanged.value === true) {
        await saveSkills();
    }
    const skillId = document.querySelector('.select-dropdown li[aria-selected="true"]')?.dataset.skillId || null;
    const friendId = document.querySelector('.friend-card.selected')?.dataset.friendId || 1;
    const sessionData = {
        workMinutes: parseInt(document.getElementById('workMinutes').value, 10),
        restMinutes: parseInt(document.getElementById('restMinutes').value, 10),
        cycles: parseInt(document.getElementById('cyclesAmount').value, 10),
        playerId: PLAYER_ID,
        friendId: friendId,
        skillId: skillId
    };
    await postSession(sessionData);
    localStorage.setItem('currentSession', JSON.stringify(sessionData));
    window.location.href = `${PATH}/timer/timer.html`;
}

async function saveSkills() {
    const customSelect = document.getElementById('selectSkill');

    const newSkills = mapSkillsFromDom(customSelect, PLAYER_ID);
    console.log('НАВЫКИ ИЗ ДОМА', newSkills);

    const oldSkills = await getPlayerSkillsFull(PLAYER_ID);

    for (const oldSkill of oldSkills) {
        // Если навык есть в БД, но его нет в DOM
        const newContainsOld = newSkills.some(n => n.skillId === oldSkill.skillId);
        if (!newContainsOld) {
            if (oldSkill.usedInSessions) {
                // деактивируем (is_active = 0)
                await updatePlayerSkill(oldSkill.skillId, { is_active: 0 });
                console.log('архивирую навык', oldSkill.name)
            } else {
                // полностью удаляем
                await deletePlayerSkill(oldSkill.skillId);
                console.log('полностью удаляю навык', oldSkill.name)
            }
        }

    }

    // 3️⃣ Добавление новых навыков
    for (const skill of newSkills) {
        const exists = oldSkills.some(o => o.skillId === skill.skillId);
        if (!exists) {
            const skillToSend = {
                playerId: skill.playerId,
                name: skill.name,
                progress: skill.progress,
                isActive: true
            };

            const savedSkill = await postSkill(skillToSend);
            skill.skillId = savedSkill.skillId;

            updateFakeIdToRealHtml(skill.fakeId,skill.skillId);
        }
    }
}

function mapSkillsFromDom(customSelect, playerId) {
  return Array.from(
    customSelect.querySelectorAll('.select-dropdown li')
  )
    .filter(li => !li.classList.contains('add-skill-item'))
    .map(li => ({
      skillId: Number(li.dataset.skillId),
      fakeId: Number(li.dataset.fakeId),
      playerId: playerId,
      name: li.querySelector('.item-text')?.textContent.trim(),
      progress: Number(li.dataset.progress ?? 0),
      isActive: 1
    }));
}

function updateFakeIdToRealHtml(fakeId,realId) {
    const li = document.querySelector(`#skillOption-${fakeId}`);
    if (li) {
        li.dataset.skillId = realId;
    }
}

window.startSession = startSession;

