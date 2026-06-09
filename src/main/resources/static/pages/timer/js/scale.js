function scaleApp() {
    const baseWidth = 1920;
    const baseHeight = 1080;

    const scale = Math.min(
        window.innerWidth / baseWidth,
        window.innerHeight / baseHeight
    );

    const app = document.getElementById("appWrapper");

    app.style.transform = `scale(${scale})`;
    app.style.width = `${baseWidth}px`;
    app.style.height = `${baseHeight}px`;

    app.style.position = 'absolute';
    app.style.left = `${(window.innerWidth - baseWidth * scale) / 2}px`;
    app.style.top = `${(window.innerHeight - baseHeight * scale) / 2}px`;
}

window.addEventListener('resize', scaleApp);
window.addEventListener('DOMContentLoaded', scaleApp);