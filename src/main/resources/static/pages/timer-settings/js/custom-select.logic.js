import { getSkills } from '../../../shared/api.js';
import { getCurrentPlayerId } from '../../../shared/current-player.js';
import { openAddSkillModal } from './custom-select.modal.js';

import {
  getSelectElements,
  toggleDropdown,
  selectFirstItem,
  setDropdownState,
  selectItem,
  ADD_ITEM_ID
} from './custom-select.dom.js';

import {
  generateSkillHtml,
  generateAddSkillHtml
} from './custom-select.html.js';

/* =======================
   Shared state
======================= */

export const skillsChanged = { value: false };


/* =======================
   Init
======================= */

document.addEventListener('DOMContentLoaded', initialize);

async function initialize() {
  const customSelects = document.querySelectorAll('.custom-select');
  let skills = [];

  try {
    const playerId = await getCurrentPlayerId();
    skills = (await getSkills(playerId)).filter(s => s.isActive);
  } catch {
    console.warn('Не удалось получить навыки с сервера');
  }

  customSelects.forEach(customSelect => {
    const { dropdown } = getSelectElements(customSelect);

    dropdown.innerHTML =
      generateSkillHtml(skills) +
      generateAddSkillHtml();

    setupCustomSelect(customSelect);

    if (skills.length) {
      selectFirstItem(customSelect);
    }
  });

  setupGlobalClickHandler(customSelects);
}

/* =======================
   Global click Закрытие при нажатии вне списка
======================= */

function setupGlobalClickHandler(customSelects) {
  if (setupGlobalClickHandler.done) return;
  setupGlobalClickHandler.done = true;

  document.addEventListener('click', e => {
    customSelects.forEach(cs => {
      if (!cs.contains(e.target)) {
        setDropdownState(cs, false);
      }
    });
  });
}

/* =======================
   Logic / handlers
======================= */

function setupCustomSelect(customSelect) {
  const { button, dropdown } = getSelectElements(customSelect);

  button.addEventListener('click', e => {
    e.stopPropagation();
    toggleDropdown(customSelect);
  });

  dropdown.addEventListener('click', e => {
    const item = e.target.closest('li');
    if (!item) return;

    if (item.id === ADD_ITEM_ID) {
      handleAddSkill(customSelect);
      return;
    }

    if (e.target.closest('.delete-item-btn')) {
      handleDelete(item, customSelect);
      return;
    }

    selectItem(customSelect, item);
  });
}

function handleDelete(item, customSelect) {
  const name = item.querySelector('.item-text')?.textContent;
  if (!confirm(`Удалить навык "${name}"?`)) return;

  item.remove();
  selectFirstItem(customSelect);
  skillsChanged.value = true;
}

function handleAddSkill(customSelect) {
  setDropdownState(customSelect, false);
  openAddSkillModal(customSelect);
  skillsChanged.value = true;
}
