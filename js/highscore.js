let highscore = {
    value: 0,
    text: "RECORDE: 0/0",
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    radius: 0,
    translateX: 0,
    translateY: 0,
    textSize: 0
};

function saveHighscore(score) {
    if (score > highscore.value) {
        localStorage.setItem("highscore", JSON.stringify(score));
    }
    updateHighscore();
}

function getHighscore() {
    return JSON.parse(localStorage.getItem("highscore")) || 0;
}

function updateHighscore() {
    textFont(content.HabitasBold.d);
    highscore.value = getHighscore();
    highscore.text = "RECORDE: " + highscore.value + "/" + score.total;

    highscore.textSize = max(min(35, (width / 1920) * 35), 20);
    highscore.radius = max(min(50, (width / 1920) * 50), 25);
    highscore.marginW = max(min(30, (width / 1920) * 30), 20);
    highscore.marginH = max(min(15, (width / 1920) * 15), 10);

    textSize(highscore.textSize);
    highscore.w = textWidth(highscore.text) + highscore.marginW * 2;
    highscore.h = highscore.textSize + highscore.marginH * 2;
    highscore.y = -highscore.textSize / 8;

    highscore.translateX = highscore.marginW + highscore.w / 2;
    highscore.translateY = highscore.marginW + highscore.h / 2;
}