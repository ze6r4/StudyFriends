import { getSkills } from '../../../shared/api.js';

export let skillsChanged = false;
const PLAYER_ID = 1;
const ADD_ITEM_ID = 'add-skill-item';

document.addEventListener("DOMContentLoaded", () => {
  initializeCustomSelectsSkills();
});

async function initializeCustomSelectsSkills() {
  const customSelects = document.querySelectorAll(".custom-select");

  let skills = [];

   try {
      // пытаемся получить навыки с сервера
     skills = (await getSkills(PLAYER_ID))
       .filter(skill => skill.isActive === true); // только активные навыки
   } catch (error) {
     console.warn("Не удалось получить навыки с сервера, скорее всего, он не запущен");
   }


  customSelects.forEach(customSelect => {
    const dropdown = customSelect.querySelector(".select-dropdown");

    // генерируем список + кнопку "Добавить навык"
    dropdown.innerHTML =
      generateSkillHtml(skills) +
      generateAddSkillHtml();

    setupCustomSelect(customSelect);
    selectFirstItem(customSelect);

    // 🔥 автооткрытие, если навыков нет
    if (skills.length === 0) {
      toggleDropdown(customSelect, true);
    }
  });

  setupGlobalClickHandler(customSelects);
}


/* =======================
   Генерация HTML
======================= */

function generateSkillHtml(skills) {
  return skills.map(skill => `
    <li id="skillOption${skill.skillId}"
        role="option"
        data-skill-id="${skill.skillId}"
        data-progress="${skill.progress}">
      <span class="item-text">${skill.name}</span>
      <button type="button"
              class="delete-item-btn"
              aria-label="Удалить ${skill.name}">
        ✕
      </button>
    </li>
  `).join('');
}

function generateAddSkillHtml() {
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
   Основная инициализация
======================= */

function setupCustomSelect(customSelect) {
  const selectButton = customSelect.querySelector(".select-button");
  const dropdown = customSelect.querySelector(".select-dropdown");

  selectButton.addEventListener("click", event => {
    event.stopPropagation();
    toggleDropdown(customSelect);
  });

  dropdown.addEventListener("click", event => {
    const item = event.target.closest("li");
    if (!item) return;

    // КНОПКА "ДОБАВИТЬ НАВЫК"
    if (item.id === ADD_ITEM_ID) {
      handleAddSkill(customSelect);
      return;
    }

    const deleteBtn = event.target.closest(".delete-item-btn");
    if (deleteBtn) {
      handleDelete(item, customSelect);
      return;
    }

    selectItem(item, customSelect);
  });
}

/* =======================
   Выбор элементов
======================= */

function selectItem(item, customSelect) {
  if (item.id === ADD_ITEM_ID) return;

  const items = customSelect.querySelectorAll("li:not(.add-skill-item)");
  const selectedValueSpan = customSelect.querySelector(".selected-value");
  const selectButton = customSelect.querySelector(".select-button");

  items.forEach(li => li.removeAttribute("aria-selected"));

  const text = item.querySelector(".item-text").textContent;
  selectedValueSpan.textContent = text;

  item.setAttribute("aria-selected", "true");
  selectButton.setAttribute("aria-activedescendant", item.id);

  toggleDropdown(customSelect, false);
}

function selectFirstItem(customSelect) {
  const items = customSelect.querySelectorAll("li:not(.add-skill-item)");
  const selectedValueSpan = customSelect.querySelector(".selected-value");
  const selectButton = customSelect.querySelector(".select-button");

  if (!items.length) {
    selectedValueSpan.textContent = "Выберите навык";
    selectButton.removeAttribute("aria-activedescendant");
    return;
  }

  items.forEach(li => li.removeAttribute("aria-selected"));

  const first = items[0];
  selectedValueSpan.textContent =
    first.querySelector(".item-text").textContent;

  first.setAttribute("aria-selected", "true");
  selectButton.setAttribute("aria-activedescendant", first.id);
}

/* =======================
   Удаление элементов
======================= */

function handleDelete(item, customSelect) {
  item.remove();
  selectFirstItem(customSelect);
  skillsChanged = true;
}

/* =======================
   Добавление навыка
======================= */

function handleAddSkill(customSelect) {
  toggleDropdown(customSelect, false);

  // 🔥 здесь ты подключишь модалку / инпут / API


  // пример:
  // openAddSkillModal();
}

/* =======================
   Dropdown
======================= */

function toggleDropdown(customSelect, forceState) {
  const dropdown = customSelect.querySelector(".select-dropdown");
  const selectButton = customSelect.querySelector(".select-button");

  const isOpen = !dropdown.classList.contains("hidden");
  const shouldOpen = forceState !== undefined ? forceState : !isOpen;

  dropdown.classList.toggle("hidden", !shouldOpen);
  selectButton.setAttribute("aria-expanded", shouldOpen);
}

function setupGlobalClickHandler(customSelects) {
  document.addEventListener("click", event => {
    customSelects.forEach(customSelect => {
      if (!customSelect.contains(event.target)) {
        toggleDropdown(customSelect, false);
      }
    });
  });
}
