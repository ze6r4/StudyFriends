function scaleApp() {
    const baseWidth = 1920;

    const scale = Math.min(
        window.innerWidth / 1920,
        window.innerHeight / 1080
    );

    const app = document.getElementById("appWrapper");

    app.style.transform = `scale(${scale})`;
}
window.addEventListener('resize', scaleApp);
window.addEventListener("DOMContentLoaded", scaleApp);