const btn = document.getElementById("startBtn");
const bus = document.getElementById("bus");
const zoom = document.getElementById("zoomLayer");
const flash = document.getElementById("flash");
const reward = document.getElementById("reward");
const scene = document.getElementById("scene");

btn.addEventListener("click", async () => {
    btn.disabled = true;
    await wait(500);
    btn.hidden = true;
    btn.classList.add("fade-out");
    await wait(1000);


    // 1. автобус едет
    bus.style.animation = "busEnter 2s cubic-bezier(.2,.8,.4,1) forwards";

    await wait(2000);


    // 3. зум в двери автобуса
    scene.style.transform = "scale(1.5) translate(0%, 0%)";

    zoom.style.opacity = 0.7;

    await wait(300);
    bus.src = "../../assets/images/other/BUS_OPENED.png"
    await wait(1200);
    // 4. вспышка
    const circle = document.querySelector(".flash-circle");

    circle.style.animation = "circleFlash 0.9s ease-out";
    circle.style.animation = "circleFlash 0.9s ease-out forwards";

    setTimeout(() => {
        circle.style.animation = "glowPulse 2.5s ease-in-out infinite";
    }, 900);

    // 5. показать персонажа
    reward.style.animation = "rewardAppear 1.5s ease forwards";
});

function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}
