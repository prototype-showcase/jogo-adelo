let highscore = {
    text: "RECORDE\nCLÁSSICO: 0/0\nDESAFIO: 0/0 0s",
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    radius: 0,
    translateX: 0,
    translateY: 0,
    textSize: 0,
    classic: {
        value: 0
    },
    challenge: {
        value: 0,
        time: 0
    }
};

function saveHighscore(type, score, time = 0) {
    if (type) { // CLASSIC MODE (true)
        if (score > highscore.classic.value) {
            highscore.classic.value = score;
            localStorage.setItem("classic_highscore", JSON.stringify(highscore.classic));
        }
    } else { // CHALLENGE MODE (false)
        if (score > highscore.challenge.value || 
            (score === highscore.challenge.value && time < highscore.challenge.time)) {
            highscore.challenge.value = score;
            highscore.challenge.time = time;
            localStorage.setItem("challenge_highscore", JSON.stringify(highscore.challenge));
        }
    }
    updateHighscore();
}

function getHighscore(type) {
    if (type) { // CLASSIC MODE (true)
        return JSON.parse(localStorage.getItem("classic_highscore")) || { value: 0 };
    } else { // CHALLENGE MODE (false)
        return JSON.parse(localStorage.getItem("challenge_highscore")) || { value: 0, time: 0 };
    }
}

function updateHighscore() {
    textFont(content.HabitasBold.d);
    let classicHighscore = getHighscore(true);
    let challengeHighscore = getHighscore(false);

    highscore.classic.value = classicHighscore.value;
    highscore.challenge.value = challengeHighscore.value;
    highscore.challenge.time = challengeHighscore.time || 0; // Ensure time exists

    highscore.text = 
        "RECORDE" +
        "\nCLÁSSICO: " + highscore.classic.value + "/" + score.total +
        "\nDESAFIO: " + highscore.challenge.value + "/" + score.total + 
        " " + Math.round(highscore.challenge.time) + "s";

    highscore.textSize = Math.max(Math.min(35, (width / 1920) * 35), 20);
    highscore.radius = Math.max(Math.min(50, (width / 1920) * 50), 25);
    highscore.marginW = Math.max(Math.min(30, (width / 1920) * 30), 20);
    highscore.marginH = Math.max(Math.min(15, (width / 1920) * 15), 10);

    textSize(highscore.textSize);
    highscore.w = textWidth(highscore.text) + highscore.marginW * 2;
    highscore.h = highscore.textSize * 3 + highscore.marginH * 3;
    highscore.y = -highscore.textSize / 8;

    highscore.translateX = highscore.marginW + highscore.w / 2;
    highscore.translateY = height - highscore.marginW - highscore.h / 2;
}
