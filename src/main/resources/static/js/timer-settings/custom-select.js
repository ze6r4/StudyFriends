document.addEventListener("DOMContentLoaded", () => {
  const customSelects = document.querySelectorAll(".custom-select");

  customSelects.forEach((customSelect) => {
    const selectButton = customSelect.querySelector(".select-button");
    const dropdown = customSelect.querySelector(".select-dropdown");
    const selectedValueSpan = customSelect.querySelector(".selected-value");
    // Важно: пересобираем listItems после потенциального удаления
    // или используем Event Delegation, но для этой структуры, QuerySelectorAll на каждой итерации forEach
    // внутри main DOMContentLoaded - это нормально, так как элементы не меняются после загрузки.
    const listItems = dropdown.querySelectorAll("li"); 

    // Функция для переключения видимости выпадающего списка
    const toggleDropdown = (expand = null) => {
      const willBeOpen = expand !== null ? expand : dropdown.classList.contains("hidden");

      dropdown.classList.toggle("hidden", !willBeOpen);
      selectButton.setAttribute("aria-expanded", willBeOpen);
    };

    // Инициализация: устанавливаем первое значение как выбранное по умолчанию
    if (listItems.length > 0) {
      const firstItem = listItems[0];
      const firstItemTextSpan = firstItem.querySelector(".item-text"); // Получаем span с текстом
      
      if (firstItemTextSpan) {
        selectedValueSpan.textContent = firstItemTextSpan.textContent; // Отображаем текст из span
      } else {
        // Запасной вариант, если item-text span отсутствует (хотя в нашем случае он будет)
        selectedValueSpan.textContent = firstItem.textContent.trim(); 
      }
      
      firstItem.setAttribute("aria-selected", "true");
      selectButton.setAttribute("aria-activedescendant", firstItem.id);
    } else {
        selectedValueSpan.textContent = "Выберите значение";
    }

    // Обработчик клика по кнопке - переключает видимость списка
    selectButton.addEventListener("click", (event) => {
      event.stopPropagation(); // Предотвращаем всплытие, чтобы click по документу не закрыл список
      toggleDropdown();
    });

    // Обработчики клика по элементам списка и кнопкам удаления
    listItems.forEach((item) => {
      const itemTextSpan = item.querySelector(".item-text"); // Элемент, содержащий текст
      const deleteButton = item.querySelector(".delete-item-btn"); // Кнопка удаления

      // 1. Обработчик клика по самому элементу списка (li) для выбора
      item.addEventListener("click", (event) => {
        // Проверяем, что клик был не по кнопке удаления
        if (event.target !== deleteButton) {
          // Получаем текст для отображения (из span)
          const selectedText = itemTextSpan ? itemTextSpan.textContent : item.textContent.trim();
          
          // !!! ВОТ ЭТА СТРОКА БЫЛА УПУЩЕНА !!!
          selectedValueSpan.textContent = selectedText; // Обновляем отображаемый текст в кнопке

          listItems.forEach((li) => {
            li.removeAttribute("aria-selected");
          });
          item.setAttribute("aria-selected", "true");

          // Обновляем aria-activedescendant на кнопке
          selectButton.setAttribute("aria-activedescendant", item.id);

          // Скрываем выпадающий список
          toggleDropdown(false);
        }
      });

      // 2. Обработчик клика по кнопке удаления
      if (deleteButton) {
        deleteButton.addEventListener("click", (event) => {
          event.stopPropagation(); // ОЧЕНЬ ВАЖНО: Остановить всплытие!
                                 // Это предотвратит срабатывание обработчика click на родительском <li>
                                 // и, следовательно, выбор элемента при нажатии на кнопку удаления.

          const itemName = itemTextSpan ? itemTextSpan.textContent : item.textContent.trim();
          // Исправлена синтаксическая ошибка: использованы обратные кавычки для шаблонной строки
          console.log(`Кнопка "Удалить" нажата для элемента: "${itemName}"`);
          // Здесь могла бы быть логика удаления элемента из DOM
          // Например: item.remove();
          // Если элемент удаляется, возможно, потребуется переинициализировать
          // выбранное значение, если удален текущий выбранный элемент.
        });
      }
    });
  });

  // Глобальный обработчик клика по документу для скрытия выпадающих списков
  document.addEventListener("click", (event) => {
    customSelects.forEach((customSelect) => {
      const dropdown = customSelect.querySelector(".select-dropdown");
      const selectButton = customSelect.querySelector(".select-button");

      // Проверяем, открыт ли список И был ли клик вне текущего custom-select
      if (!dropdown.classList.contains("hidden") && !customSelect.contains(event.target)) {
        dropdown.classList.add("hidden");
        selectButton.setAttribute("aria-expanded", "false");
      }
    });
  });
});
