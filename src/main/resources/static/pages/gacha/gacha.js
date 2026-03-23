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
    //едет автобус и останавливается
    bus.src = "../../assets/images/other/bus_stop.png"
    bus.style.animation = "busEnter 2s cubic-bezier(.2,.8,.4,1) forwards";
    await wait(1500);
    bus.src = "../../assets/images/other/bus.png"
    await wait(1500);
    //затемнение, приближение камеры и открытие дверей
     zoom.style.opacity = 0.7;
     scene.style.transform = "scale(1.5) translate(0%, 0%)";
     await wait(2600);
     bus.src = "../../assets/images/other/bus_open_1.png"
     await wait(400);
    bus.src = "../../assets/images/other/bus_open_2.png"
    await wait(1700);

    //появление персонажа со вспышкой
    reward.style.animation = "rewardBlack 3s ease forwards";
    await wait(3000);
    const circle = document.querySelector(".flash-circle");
    circle.style.animation = "circleFlash 2s ease-out forwards, glowPulse 2.5s ease-in-out 1.2s infinite";
    reward.style.animation = "rewardAppear 6s ease forwards";
    await wait(1200);
});

function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}
