let scale = 1;
const minScale = 0.5;
const maxScale = 3;

let translateX = 0;
let translateY = 0;

const zoomSensitivity = 0.001;
const moveSensitivity = 1;

roomContainer.addEventListener('wheel', (e) => {
  e.preventDefault();

  if (e.ctrlKey) {
    // Zoom
    const delta = -e.deltaY * zoomSensitivity;
    scale += delta;
    scale = Math.min(Math.max(scale, minScale), maxScale);
  } else {
    // Pan movement (X + Y)
    translateX -= e.deltaX * moveSensitivity;
    translateY -= e.deltaY * moveSensitivity;
  }

  clampPan();
  updateTransform();
}, { passive: false });

function clampPan() {
  const containerWidth = roomContainer.clientWidth;
  const containerHeight = roomContainer.clientHeight;

  const scaledWidth = room.offsetWidth * scale;
  const scaledHeight = room.offsetHeight * scale;

  // Максимальное смещение от центра
  const maxX = Math.max(0, (scaledWidth - containerWidth) + 500 / 2);
  const maxY = Math.max(0, (scaledHeight - containerHeight) + 500/ 2);

  translateX = Math.min(Math.max(translateX, -maxX), maxX);
  translateY = Math.min(Math.max(translateY, -maxY), maxY);
}

function updateTransform() {
  room.style.transform = `
    translate(${translateX}px, ${translateY}px)
    scale(${scale})
  `;
}