import { ADD_ITEM_ID, getSelectElements, selectItem } from './custom-select.dom.js';

/* =======================
   HTML generators
======================= */
const SKILL_ICON_PATH = '/assets/images/icons/';

function getSkillStageByLevel(level) {
  if (level >= 0 && level <= 10) return 'начинающий';
  if (level >= 11 && level <= 20) return 'продолжающий';
  if (level >= 21 && level <= 30) return 'опытный';
  return 'мастер';
}

export function generateSkillHtml(skills,stages) {
  return skills.map(skill => {
    const stage = getSkillStageByLevel(skill.level);
    const iconSrc = `${SKILL_ICON_PATH}${stage}_icon.png`;

    return `
      <li id="skillOption-${skill.skillId}"
          role="option"
          data-skill-id="${skill.skillId}"
          data-is-active="${skill.isActive}">

        <img class="skill-icon" src="${iconSrc}" alt="${stage}">

        <span class="item-text">
          ${skill.name} | LVL ${skill.level}
        </span>

        <button type="button"
                class="delete-item-btn"
                aria-label="Удалить ${skill.name}">✕</button>
      </li>
    `;
  }).join('');
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

  const stage = getSkillStageByLevel(skill.level);
  const iconSrc = `${SKILL_ICON_PATH}${stage}_icon.png`;

  const li = document.createElement('li');
  li.id = `skillOption-${skill.fakeId}`;
  li.dataset.fakeId = skill.fakeId;
  li.setAttribute('role', 'option');

  li.innerHTML = `
    <img class="skill-icon" src="${iconSrc}" alt="${stage}">

    <span class="item-text">
      ${skill.name} | LVL ${skill.level}
    </span>

    <button type="button"
            class="delete-item-btn"
            aria-label="Удалить ${skill.name}">✕</button>
  `;

  dropdown.insertBefore(li, dropdown.querySelector('.add-skill-item'));
  selectItem(customSelect, li);
}