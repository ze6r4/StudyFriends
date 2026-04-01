import { ADD_ITEM_ID, getSelectElements, selectItem } from './custom-select.dom.js';

/* =======================
   HTML generators
======================= */

export function generateSkillHtml(skills) {
  return skills.map(skill => `
    <li id="skillOption-${skill.skillId}"
        role="option"
        data-skill-id="${skill.skillId}"
        data-is-active="${skill.isActive}">
      <span class="item-text">${skill.name}</span>
      <button type="button"
              class="delete-item-btn"
              aria-label="Удалить ${skill.name}">✕</button>
    </li>
  `).join('');
}

export function generateAddSkillHtml() {
  return `
    <li id="${ADD_ITEM_ID}"
        class="add-skill-item"
        role="button"
        aria-label="Добавить навык">
      <span class="add-icon">+</span>
      <span class="item-text">Добавить навык</span>
    </li>
  `;
}

/* =======================
   Add new skill to DOM
======================= */

export function addNewSkillToDropdown(customSelect, skill) {
  const { dropdown } = getSelectElements(customSelect);

  const li = document.createElement('li');
  li.id = `skillOption-${skill.fakeId}`;
  li.dataset.fakeId = skill.fakeId;
  li.setAttribute('role', 'option');

  li.innerHTML = `
    <span class="item-text">${skill.name}</span>
    <button type="button"
            class="delete-item-btn"
            aria-label="Удалить ${skill.name}">✕</button>
  `;
  dropdown.insertBefore(li, dropdown.querySelector('.add-skill-item'));
  selectItem(customSelect, li);
}
