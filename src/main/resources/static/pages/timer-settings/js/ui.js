
// заполнение значений ползунков
function bindSlider(sliderId, textId) {
    const slider = document.getElementById(sliderId);
    const text = document.getElementById(textId);

    function update() {
        text.textContent = slider.value;
    }

    slider.addEventListener("input", update);
    update();
}
bindSlider("workMinutes", "workValueText");
bindSlider("restMinutes", "restValueText");
bindSlider("cyclesAmount", "cyclesValueText");

// подсчет времени
function updateTotalTime() {
    const work = Number(document.getElementById("workMinutes").value);
    const rest = Number(document.getElementById("restMinutes").value);
    const cycles = Number(document.getElementById("cyclesAmount").value);

    const totalMinutes = (work + rest) * cycles;

    const text = document.getElementById("totalTime");

    // Формат красиво: "1 ч 30 мин" или "45 мин"
    if (totalMinutes >= 60) {
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        text.textContent = `Время сессии: ${h} ч ${m} мин`;
    } else {
        text.textContent = `Время сессии: ${totalMinutes} мин`;
    }
}
document.getElementById("workMinutes").addEventListener("input", updateTotalTime);
document.getElementById("restMinutes").addEventListener("input", updateTotalTime);
document.getElementById("cyclesAmount").addEventListener("input", updateTotalTime);

// Первоначальный расчёт
updateTotalTime();

// окрас ползунка
function colorTrack(sliderId) {
    const slider = document.getElementById(sliderId);

    function update() {
        const min = Number(slider.min);
        const max = Number(slider.max);
        const val = Number(slider.value);

        const percent = ((val - min) / (max - min)) * 100 + "%";

        slider.style.setProperty("--pos", percent);
    }

    slider.addEventListener("input", update);
    update();
}

colorTrack("workMinutes");
colorTrack("restMinutes");
colorTrack("cyclesAmount");
