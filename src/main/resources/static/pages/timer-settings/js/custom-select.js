import { getSkills} from '../../../shared/api.js';

document.addEventListener("DOMContentLoaded", function() {
  initializeCustomSelectsSkills();
});

async function initializeCustomSelectsSkills() {
    const customSelects = document.querySelectorAll(".custom-select");
    const skills = await getSkills(1);

    customSelects.forEach(customSelect => {
        const dropdown = customSelect.querySelector(".select-dropdown");
        const selectButton = customSelect.querySelector(".select-button");
        const selectedValueSpan = customSelect.querySelector(".selected-value");

        dropdown.innerHTML = generateSkillHtml(skills);

        // Обновляем выбранное значение по умолчанию
        if (skills.length > 0) {
            selectedValueSpan.textContent = skills[0].name;
            selectButton.setAttribute("aria-activedescendant", `skillOption${skills[0].skillId}`);

            // Отмечаем первый элемент как выбранный
            const firstListItem = dropdown.querySelector('li');
            if (firstListItem) {
                firstListItem.setAttribute("aria-selected", "true");
            }
        } else {
            selectedValueSpan.textContent = "Выберите навык";
        }

        setupCustomSelect(customSelect);
    });
    setupGlobalClickHandler(customSelects);
}
function generateSkillHtml(skills) {
    let html = '';

    skills.forEach((skill) => {
        html += `
            <li id="skillOption${skill.skillId}" role="option" data-skill-id="${skill.skillId}">
                <span class="item-text">${skill.name}</span>
                <button type="button" class="delete-item-btn" aria-label="Удалить ${skill.name}">✕</button>
            </li>
        `;
    });

    return html;
}

function setupCustomSelect(customSelect) {
  const selectButton = customSelect.querySelector(".select-button");
  const dropdown = customSelect.querySelector(".select-dropdown");
  const selectedValueSpan = customSelect.querySelector(".selected-value");
  const listItems = dropdown.querySelectorAll("li");

  initializeDefaultValues(selectedValueSpan, listItems, selectButton);
  setupSelectButtonHandler(selectButton, dropdown);
  setupListItemsHandlers(listItems, selectedValueSpan, selectButton, dropdown);
}

function initializeDefaultValues(selectedValueSpan, listItems, selectButton) {
  if (listItems.length > 0) {
    const firstItem = listItems[0];
    const firstItemTextSpan = firstItem.querySelector(".item-text");

    if (firstItemTextSpan) {
      selectedValueSpan.textContent = firstItemTextSpan.textContent;
    } else {
      selectedValueSpan.textContent = firstItem.textContent.trim();
    }

    firstItem.setAttribute("aria-selected", "true");
    selectButton.setAttribute("aria-activedescendant", firstItem.id);
  } else {
    selectedValueSpan.textContent = "Выберите навык";
  }
}

function setupSelectButtonHandler(selectButton, dropdown) {
  selectButton.addEventListener("click", function(event) {
    event.stopPropagation();
    toggleDropdown(dropdown, selectButton);
  });
}

function toggleDropdown(dropdown, selectButton, forceState) {
  const isCurrentlyOpen = !dropdown.classList.contains("hidden");
  const shouldBeOpen = forceState !== undefined ? forceState : !isCurrentlyOpen;

  dropdown.classList.toggle("hidden", !shouldBeOpen);
  selectButton.setAttribute("aria-expanded", shouldBeOpen);
}

function setupListItemsHandlers(listItems, selectedValueSpan, selectButton, dropdown) {
  listItems.forEach(function(item) {
    setupListItemHandler(item, selectedValueSpan, selectButton, listItems, dropdown);
  });
}

function setupListItemHandler(item, selectedValueSpan, selectButton, allListItems, dropdown) {
  const itemTextSpan = item.querySelector(".item-text");
  const deleteButton = item.querySelector(".delete-item-btn");

  item.addEventListener("click", function(event) {
    if (event.target !== deleteButton && !deleteButton.contains(event.target)) {
      selectListItem(item, itemTextSpan, selectedValueSpan, selectButton, allListItems, dropdown);
    }
  });

  if (deleteButton) {
    setupDeleteButtonHandler(deleteButton, itemTextSpan, item);
  }
}

function selectListItem(item, itemTextSpan, selectedValueSpan, selectButton, allListItems, dropdown) {
  const selectedText = itemTextSpan ? itemTextSpan.textContent : item.textContent.trim();

  selectedValueSpan.textContent = selectedText;

  allListItems.forEach(function(li) {
    li.removeAttribute("aria-selected");
  });

  item.setAttribute("aria-selected", "true");
  selectButton.setAttribute("aria-activedescendant", item.id);
  toggleDropdown(dropdown, selectButton, false);
}

function setupDeleteButtonHandler(deleteButton, itemTextSpan, item) {
  deleteButton.addEventListener("click", function(event) {
    event.stopPropagation();

    const itemName = itemTextSpan ? itemTextSpan.textContent : item.textContent.trim();
    console.log('Кнопка "Удалить" нажата для элемента: "' + itemName + '"');

    // Удаляем элемент из DOM
    item.remove();

    // Обновляем выбранное значение, если удалили выбранный элемент
    const customSelect = item.closest('.custom-select');
    const selectedValueSpan = customSelect.querySelector('.selected-value');
    const remainingItems = customSelect.querySelectorAll('li');

    if (remainingItems.length > 0) {
      const firstRemaining = remainingItems[0];
      const firstTextSpan = firstRemaining.querySelector('.item-text');
      selectedValueSpan.textContent = firstTextSpan ? firstTextSpan.textContent : firstRemaining.textContent.trim();
      firstRemaining.setAttribute("aria-selected", "true");
    } else {
      selectedValueSpan.textContent = "Выберите навык";
    }
  });
}

function setupGlobalClickHandler(customSelects) {
  document.addEventListener("click", function(event) {
    customSelects.forEach(function(customSelect) {
      const dropdown = customSelect.querySelector(".select-dropdown");
      const selectButton = customSelect.querySelector(".select-button");

      const isOpen = !dropdown.classList.contains("hidden");
      const isClickOutside = !customSelect.contains(event.target);

      if (isOpen && isClickOutside) {
        dropdown.classList.add("hidden");
        selectButton.setAttribute("aria-expanded", "false");
      }
    });
  });
}