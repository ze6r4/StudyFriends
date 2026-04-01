import { addNewSkillToDropdown } from './custom-select.html.js';
import { updateSliderUi } from './ui.js';

const addSkillModal = document.getElementById('addSkillModal');
const closeAddSkillModal = document.getElementById('closeAddSkillModal');
const saveSkillBtn = document.getElementById('saveSkillBtn');
const newSkillName = document.getElementById('newSkillName');

/**
 * Открывает модалку для добавления навыка
 * @param {HTMLElement} customSelect — dropdown, куда добавляем новый навык
 */
export function openAddSkillModal(customSelect) {
  addSkillModal.classList.remove('hidden');
  newSkillName.value = '';
  newSkillName.focus();

  saveSkillBtn.onclick = () => {
    const enterName = newSkillName.value.trim();
    const skill = {
                fakeId: Date.now(),
                name: enterName,
                isActive: true
            };
    if (!enterName) {
      alert("Введите название навыка!");
      return;
    }
    addNewSkillToDropdown(customSelect, skill);
    addSkillModal.classList.add('hidden');
  };
}

// закрытие модалки
closeAddSkillModal.addEventListener('click', () => {
  addSkillModal.classList.add('hidden');
});

