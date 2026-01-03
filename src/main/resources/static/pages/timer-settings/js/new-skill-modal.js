import { addNewSkillToDropdown } from './skills-select-generation.js';

const addSkillModal = document.getElementById('addSkillModal');
const closeAddSkillModal = document.getElementById('closeAddSkillModal');
const newSkillLevel = document.getElementById('newSkillLevel');
const skillLevelValue = document.getElementById('skillLevelValue');
const saveSkillBtn = document.getElementById('saveSkillBtn');
const newSkillName = document.getElementById('newSkillName');

/**
 * Открывает модалку для добавления навыка
 * @param {HTMLElement} customSelect — dropdown, куда добавляем новый навык
 */
export function openAddSkillModal(customSelect) {
  addSkillModal.classList.remove('hidden');
  newSkillName.value = '';
  newSkillLevel.value = 5;
  skillLevelValue.textContent = '5';
  newSkillName.focus();

  saveSkillBtn.onclick = () => {
    const name = newSkillName.value.trim();
    const level = parseInt(newSkillLevel.value, 10);

    if (!name) {
      alert("Введите название навыка!");
      return;
    }

    addNewSkillToDropdown(customSelect, { name, level });
    addSkillModal.classList.add('hidden');
  };
}

// закрытие модалки
closeAddSkillModal.addEventListener('click', () => {
  addSkillModal.classList.add('hidden');
});

// обновление значения ползунка
newSkillLevel.addEventListener('input', () => {
  skillLevelValue.textContent = newSkillLevel.value;
});
