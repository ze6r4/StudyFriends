let scale = 1;
const minScale = 0.5;
const maxScale = 3;

let translateX = 0;

const zoomSensitivity = 0.001;   // плавность зума
const moveSensitivity = 1;       // скорость перемещения

roomContainer.addEventListener('wheel', (e) => {
  e.preventDefault();

  // Если зажат CTRL — это pinch (как на телефоне)
  if (e.ctrlKey) {
    // ЗУМ (жест приближения двумя пальцами)
    const delta = -e.deltaY * zoomSensitivity;
    scale += delta;

    scale = Math.min(Math.max(scale, minScale), maxScale);
  }
  else {
    // ДВИЖЕНИЕ ВЛЕВО / ВПРАВО двумя пальцами
    translateX -= e.deltaX * moveSensitivity;
  }

  updateTransform();
}, { passive: false });

function updateTransform() {
  room.style.transform = `
    translateX(${translateX}px)
    scale(${scale})
  `;
}
