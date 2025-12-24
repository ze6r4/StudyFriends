document.addEventListener("DOMContentLoaded", function() {

  const customSelects = document.querySelectorAll(".custom-select");

  function initializeCustomSelects() {
    customSelects.forEach(function(customSelect) {
      const selectButton = customSelect.querySelector(".select-button");
      const dropdown = customSelect.querySelector(".select-dropdown");
      const selectedValueSpan = customSelect.querySelector(".selected-value");
      const listItems = dropdown.querySelectorAll("li");

      initializeDefaultValues(selectedValueSpan, listItems, selectButton);
      setupSelectButtonHandler(selectButton, dropdown);
      setupListItemsHandlers(listItems, selectedValueSpan, selectButton, dropdown);
    });
  }

  // Инициализация значений из сервера
  // Функция инициализации значений по умолчанию
  function initializeDefaultValues(selectedValueSpan, listItems, selectButton) {
    if (listItems.length > 0) {
      const firstItem = listItems[0];
      const firstItemTextSpan = firstItem.querySelector(".item-text");

      // Устанавливаем текст выбранного значения
      if (firstItemTextSpan) {
        selectedValueSpan.textContent = firstItemTextSpan.textContent;
      } else {
        selectedValueSpan.textContent = firstItem.textContent.trim();
      }

      // Устанавливаем атрибуты доступности
      firstItem.setAttribute("aria-selected", "true");
      selectButton.setAttribute("aria-activedescendant", firstItem.id);
    } else {
      selectedValueSpan.textContent = "Выберите значение";
    }
  }

  // Функция настройки обработчика для кнопки селекта
  function setupSelectButtonHandler(selectButton, dropdown) {
    selectButton.addEventListener("click", handleSelectButtonClick);

    function handleSelectButtonClick(event) {
      event.stopPropagation();
      toggleDropdown(dropdown, selectButton);
    }
  }

  // Функция переключения видимости выпадающего списка
  function toggleDropdown(dropdown, selectButton, forceState) {
    const isCurrentlyOpen = !dropdown.classList.contains("hidden");
    const shouldBeOpen = forceState !== undefined ? forceState : !isCurrentlyOpen;

    dropdown.classList.toggle("hidden", !shouldBeOpen);
    selectButton.setAttribute("aria-expanded", shouldBeOpen);
  }

  // Функция настройки обработчиков для элементов списка
  function setupListItemsHandlers(listItems, selectedValueSpan, selectButton, dropdown) {
    listItems.forEach(function(item) {
      const itemTextSpan = item.querySelector(".item-text");
      const deleteButton = item.querySelector(".delete-item-btn");

      // Обработчик выбора элемента списка
      item.addEventListener("click", handleListItemClick);

      function handleListItemClick(event) {
        // Если клик не по кнопке удаления
        if (event.target !== deleteButton && !deleteButton.contains(event.target)) {
          selectListItem(item, itemTextSpan, selectedValueSpan, selectButton, listItems, dropdown);
        }
      }

      // Обработчик для кнопки удаления, если она есть
      if (deleteButton) {
        deleteButton.addEventListener("click", handleDeleteButtonClick);

        function handleDeleteButtonClick(event) {
          event.stopPropagation();

          const itemName = itemTextSpan ? itemTextSpan.textContent : item.textContent.trim();
          console.log('Кнопка "Удалить" нажата для элемента: "' + itemName + '"');

          // Здесь может быть логика удаления элемента из DOM
          //item.remove();
        }
      }
    });
  }

  // Функция выбора элемента списка
  function selectListItem(item, itemTextSpan, selectedValueSpan, selectButton, allListItems, dropdown) {
    // Получаем текст выбранного элемента
    const selectedText = itemTextSpan ? itemTextSpan.textContent : item.textContent.trim();

    // Обновляем отображаемое значение
    selectedValueSpan.textContent = selectedText;

    // Сбрасываем выделение у всех элементов
    allListItems.forEach(function(li) {
      li.removeAttribute("aria-selected");
    });

    // Устанавливаем выделение на текущем элементе
    item.setAttribute("aria-selected", "true");

    // Обновляем атрибут доступности
    selectButton.setAttribute("aria-activedescendant", item.id);

    // Закрываем выпадающий список
    toggleDropdown(dropdown, selectButton, false);
  }

  // Глобальный обработчик клика для закрытия выпадающих списков
  function setupGlobalClickHandler(customSelects) {
    document.addEventListener("click", handleGlobalClick);

    function handleGlobalClick(event) {
      customSelects.forEach(function(customSelect) {
        const dropdown = customSelect.querySelector(".select-dropdown");
        const selectButton = customSelect.querySelector(".select-button");

        // Проверяем, открыт ли список и был ли клик вне его
        const isOpen = !dropdown.classList.contains("hidden");
        const isClickOutside = !customSelect.contains(event.target);

        if (isOpen && isClickOutside) {
          dropdown.classList.add("hidden");
          selectButton.setAttribute("aria-expanded", "false");
        }
      });
    }
  }

  // Инициализация всех функций
  initializeCustomSelects();
  setupGlobalClickHandler(customSelects);
});