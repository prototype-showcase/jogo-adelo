/* Game Logic */
let nRolls = 0;
let totalRolls = 12;
let missingOptions;
let playStage = 0;
let playStageChange = false;
let difficulty = 0; // 0 - Clássico; 1 - Desafio;
let classsicDifficulty = {
    text: "CLÁSSICO",
    textSize: 0,
    textLeading: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    marginW: 0,
    marginH: 0,
    radius: 0,
    color: 255
};

let challengeDifficulty = {
    text: "DESAFIO",
    textSize: 0,
    textLeading: 0,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    marginW: 0,
    marginH: 0,
    radius: 0,
    color: 255
};

let endGameMenu = {
    color: null,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    margin: 0,
    radius: 0,

    content: {
        text: {
            text: null,
            textSize: 0,
            textLeading: 0,
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            color: null
        },
        bad: {
            text: "Ainda há caminho a percorrer, mas estás a aprender!"
        },
        good: {
            text: "Estás quase lá! Bom trabalho!"
        },
        veryGood: {
            text: "Muito bom! Só faltou um pouco para a perfeição!"
        },
        perfect: {
            text: "És imbatível! Perfeito"
        }
    },

    answerBox: {
        color: null,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        margin: 0,
        radius: 0,

        topic: {
            text: "PONTUAÇÃO",
            color: null,
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            textSize: 0,
            textLeading: 0
        },

        amount: {
            text: "00/00",
            color: null,
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            textSize: 0,
            textLeading: 0
        }
    },

    button: {
        text: "CONTINUAR",
        textSize: 0,
        textLeading: 0,
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        marginW: 0,
        marginH: 0,
        radius: 0,
        color: null
    }
}

// 0 - Boot; 1 - Difficulty; 2 - Roulette; 3 - Question; 4 - End

let menuPosition = {
    x: 6890,
    y: 4850
};

let cursorPointer = false;

let timerText;

function draw() {
    cursorPointer = false;
    if (playStage == 0) {
        loadScreen();
    } else if (playStage == 1) {
        mainMenu();
    } else if (playStage >= 2) {
        updateMapMovement();
        updateRoulette();
        drawContent(); // Draw all map and assets content
    }

    if (playStage > 0) {
        // Info
        drawIcon(content.infoButton.d,
            content.infoButton.w, content.infoButton.h,
            content.infoButton.x, content.infoButton.y,
            "#589359", true);
        // Music
        drawIcon(content.music.status ? content.volumeUp.d : content.volumeMute.d,
            content.volumeUp.w, content.volumeUp.h,
            content.volumeUp.x, content.volumeUp.y,
            "#589359", true);
    }

    if (cursorPointer) {
        cursor('pointer');
    } else {
        cursor('default');
    }
}

function mouseRelease() {
    if (!content.infoButton.active) {
        if (playStage == 0 && loadPercentage == 1 &&
            mouseX > startButton.translateX - startButton.w / 2 &&
            mouseX < startButton.translateX + startButton.w / 2 &&
            mouseY > startButton.translateY - startButton.h / 2 &&
            mouseY < startButton.translateY + startButton.h / 2) {
            playStage = 1;
            playMusic();
            playSound(content.clickSound.d);
        } else if (playStage == 1) {
            // Dificulty
            if (mouseX > classsicDifficulty.translateX - classsicDifficulty.w / 2 &&
                mouseX < classsicDifficulty.translateX + classsicDifficulty.w / 2 &&
                mouseY > classsicDifficulty.translateY - classsicDifficulty.h / 2 &&
                mouseY < classsicDifficulty.translateY + classsicDifficulty.h / 2) {
                newGame(0);
                playSound(content.clickSound.d);
            } else if (mouseX > challengeDifficulty.translateX - challengeDifficulty.w / 2 &&
                mouseX < challengeDifficulty.translateX + challengeDifficulty.w / 2 &&
                mouseY > challengeDifficulty.translateY - challengeDifficulty.h / 2 &&
                mouseY < challengeDifficulty.translateY + challengeDifficulty.h / 2) {
                newGame(1);
                playSound(content.clickSound.d);
            }
        } else if (playStage == 2 && rouletteBlock &&
            // Spin Roulette
            dist(mouseX, mouseY, content.spinButton.x - offsetX, content.spinButton.y - offsetY) < content.spinButton.d.width / 2 * currentZoom) {
            rouletteRotation();
            rouletteBlock = false;
        } else if (playStage == 3) {
            answerSelection();
        } else if (playStage == 4) {
            if (mouseX > endGameMenu.button.translateX - endGameMenu.button.w / 2 &&
                mouseX < endGameMenu.button.translateX + endGameMenu.button.w / 2 &&
                mouseY > endGameMenu.button.translateY - endGameMenu.button.h / 2 &&
                mouseY < endGameMenu.button.translateY + endGameMenu.button.h / 2) {
                playStage = 1;
                score.right = 0;
                score.wrong = 0;
            }
        }

        if (playStage >= 2 && checkButtonClick(mouseX, mouseY, content.backButton)) {
            goBack();
            playSound(content.clickSound.d);
        }

        if (playStage > 0) {
            if (checkButtonClick(mouseX, mouseY, content.volumeUp)) playMusic();
            else if (checkButtonClick(mouseX, mouseY, content.infoButton)) displayInfo();
        }
    }
}

function touchEnded() {
    mouseRelease();
    return false;
}

function drawContent() { // Draw all map and assets content
    push();
    translate(width / 2, height / 2);
    scale(currentZoom);
    translate(-width / 2, -height / 2);
    drawMap();
    pop();

    drawObject(content.mill);
    drawRoulette();

    imageMode(CENTER);
    drawObject(content.pointer);
    drawObject(content.spinButton, rouletteBlock);
    if (playStage == 3) {
        drawQuestion();
        // Timer
        if (difficulty == 1) drawTimer();
    } else if (playStage == 4) {
        drawEndGame();
    }
    // Score
    textFont(content.HabitasBold.d);
    drawScore();

    // Back
    drawIcon(content.backButton.d,
        content.backButton.w, content.backButton.h,
        content.backButton.x, content.backButton.y,
        "#589359", true);
}

function drawEndGame() {
    push();
    translate(0, endGameMenu.translateY);
    rectMode(CORNER);
    textFont(content.HabitasSemibold.d);

    // Main Box
    fill(endGameMenu.color);
    rect(endGameMenu.x, endGameMenu.y, endGameMenu.w, endGameMenu.h, endGameMenu.radius);
    // Score Box
    fill(endGameMenu.answerBox.color);
    rect(endGameMenu.answerBox.x, endGameMenu.answerBox.y,
        endGameMenu.answerBox.w, endGameMenu.answerBox.h, endGameMenu.answerBox.radius);

    // Score Text
    textAlign(LEFT, CENTER);
    fill(endGameMenu.answerBox.topic.color);
    textSize(endGameMenu.answerBox.topic.textSize);
    textLeading(endGameMenu.answerBox.topic.textLeading);
    text(endGameMenu.answerBox.topic.text, endGameMenu.answerBox.topic.x, endGameMenu.answerBox.topic.y,
        endGameMenu.answerBox.topic.w);

    fill(endGameMenu.answerBox.amount.color);
    textSize(endGameMenu.answerBox.amount.textSize);
    textLeading(endGameMenu.answerBox.amount.textLeading);
    text(endGameMenu.answerBox.amount.text, endGameMenu.answerBox.amount.x, endGameMenu.answerBox.amount.y,
        endGameMenu.answerBox.amount.w);

    // Message
    textAlign(LEFT, TOP);
    fill(endGameMenu.content.text.color);
    textSize(endGameMenu.content.text.textSize);
    textLeading(endGameMenu.content.text.textLeading);

    text(endGameMenu.content.text.text, endGameMenu.content.text.x, endGameMenu.content.text.y,
        endGameMenu.content.text.w, endGameMenu.content.text.h);

    pop();

    textAlign(LEFT, TOP);
    textFont(content.HabitasSemibold.d);
    drawButton(endGameMenu.button.text, endGameMenu.button.y,
        endGameMenu.button.w, endGameMenu.button.h,
        endGameMenu.button.radius, endGameMenu.button.translateX, endGameMenu.button.translateY,
        endGameMenu.button.textSize, endGameMenu.button.color, true);
}

function updateEndGame() {
    //Main Box
    endGameMenu.w = width - (width / 3 * inZoom) * 2;
    endGameMenu.y = 0;
    endGameMenu.x = (width - endGameMenu.w) / 2;
    endGameMenu.margin = max(min(30, (width / 1920) * 30), 20);
    endGameMenu.radius = max(min(50, (width / 1920) * 50), 25);
    endGameMenu.color = color("#6DB671");

    // Topic Box
    endGameMenu.answerBox.color = color("#589359");
    endGameMenu.answerBox.x = endGameMenu.x + endGameMenu.margin;
    endGameMenu.answerBox.y = endGameMenu.y + endGameMenu.margin;
    endGameMenu.answerBox.margin = max(min(15, (width / 1920) * 15), 10);
    endGameMenu.answerBox.radius = max(min(50, (width / 1920) * 50), 25);

    // Topic Content
    endGameMenu.answerBox.topic.textSize = max(min(25, (width / 1920) * 25), 10);
    endGameMenu.answerBox.topic.textLeading = endGameMenu.answerBox.topic.textSize * 1;
    endGameMenu.answerBox.topic.color = color("#EFD2AB");
    textSize(endGameMenu.answerBox.topic.textSize);
    textLeading(endGameMenu.answerBox.topic.textLeading);

    endGameMenu.answerBox.topic.w = textWidth(endGameMenu.answerBox.topic.text);
    endGameMenu.answerBox.topic.h = endGameMenu.answerBox.topic.textLeading;
    endGameMenu.answerBox.topic.x = endGameMenu.answerBox.x + endGameMenu.answerBox.margin;

    // Amount Content
    endGameMenu.answerBox.amount.text = score.right + "/" + score.total;
    endGameMenu.answerBox.amount.textSize = max(min(50, (width / 1920) * 50), 25);
    endGameMenu.answerBox.amount.textLeading = endGameMenu.answerBox.amount.textSize * 1;
    endGameMenu.answerBox.amount.color = color("#FFFFFF");
    textSize(endGameMenu.answerBox.amount.textSize);
    textLeading(endGameMenu.answerBox.amount.textLeading);

    endGameMenu.answerBox.amount.w = textWidth(endGameMenu.answerBox.amount.text);
    endGameMenu.answerBox.amount.h = endGameMenu.answerBox.amount.textLeading;
    endGameMenu.answerBox.amount.x = endGameMenu.answerBox.topic.x + endGameMenu.answerBox.topic.w + endGameMenu.answerBox.margin;
    endGameMenu.answerBox.amount.y = endGameMenu.answerBox.y + endGameMenu.answerBox.amount.h / 2.8 + endGameMenu.answerBox.margin;

    endGameMenu.answerBox.topic.y = endGameMenu.answerBox.amount.y + endGameMenu.answerBox.amount.h / 8;

    // Topic Box
    endGameMenu.answerBox.w = endGameMenu.answerBox.topic.w + endGameMenu.answerBox.amount.w + endGameMenu.answerBox.margin * 4;
    endGameMenu.answerBox.h = max(endGameMenu.answerBox.amount.h, endGameMenu.answerBox.topic.h) + endGameMenu.answerBox.margin * 2;

    // Message Content
    if (score.right < 5) endGameMenu.content.text.text = endGameMenu.content.bad.text;
    else if (score.right < 9) endGameMenu.content.text.text = endGameMenu.content.good.text;
    else if (score.right < 12) endGameMenu.content.text.text = endGameMenu.content.veryGood.text;
    else endGameMenu.content.text.text = endGameMenu.content.perfect.text;
    endGameMenu.content.text.color = color("#FFFFFF");
    endGameMenu.content.text.textSize = max(min(45, (width / 1920) * 45), 25);
    endGameMenu.content.text.textLeading = endGameMenu.content.text.textSize * 1;

    // Message Position
    textSize(endGameMenu.content.text.textSize);
    textLeading(endGameMenu.content.text.textLeading);
    endGameMenu.content.text.x = endGameMenu.x + endGameMenu.margin;
    endGameMenu.content.text.y = endGameMenu.answerBox.y + endGameMenu.answerBox.h + endGameMenu.margin;
    endGameMenu.content.text.w = endGameMenu.w - endGameMenu.margin * 2;
    endGameMenu.content.text.h = getTextHeight(endGameMenu.content.text);

    //Button Continue
    endGameMenu.button.color = color("#e27146");
    endGameMenu.button.textSize = max(min(45, (width / 1920) * 40), 20);
    endGameMenu.button.radius = max(min(50, (width / 1920) * 50), 25);
    endGameMenu.button.marginW = max(min(20, (width / 1920) * 20), 15);
    endGameMenu.button.marginH = max(min(15, (width / 1920) * 15), 10);

    textSize(endGameMenu.button.textSize);
    endGameMenu.button.w = textWidth(endGameMenu.button.text) + endGameMenu.button.marginW * 2;
    endGameMenu.button.h = endGameMenu.button.textSize + endGameMenu.button.marginH * 2;
    endGameMenu.button.y = -endGameMenu.button.h / 10;

    endGameMenu.button.translateX = width / 2;
    endGameMenu.button.translateY = endGameMenu.content.text.y + endGameMenu.content.text.h +
        endGameMenu.button.h + endGameMenu.margin / 2;

    endGameMenu.h = endGameMenu.button.translateY - endGameMenu.y + endGameMenu.button.h / 2 + endGameMenu.margin;

    endGameMenu.button.translateY = (height - endGameMenu.button.h) / 2 - endGameMenu.margin;

    endGameMenu.translateY = (height - endGameMenu.h) / 2;
    endGameMenu.button.translateY += endGameMenu.h / 2;
}

function newGame(dif) {
    updateScore();

    difficulty = dif;
    nRolls = 0;
    rouletteBlock = true;
    missingOptions = [...quizTopics];
    playStage = 2;
    score.right = 0;
    score.wrong = 0;

    startTime.totalTime = 0;

    bootZoom = max(width / (tileSize * (mapCols - 2)),
        height / (tileSize * (mapRows - 2)));

    currentZoom = bootZoom;
    targetZoom = bootZoom;

    targetX = (tileSize * mapCols) / 2 - width / 2;
    offsetX = targetX;
    targetY = (tileSize * mapRows) / 2 - height / 2;
    offsetY = targetY;

    setTimeout(function () {
        targetX = content.roulette.x - width / 2;
        targetY = content.roulette.y - height / 2;
        targetZoom = inZoom;
    }, 1500);
}

function windowResized() {
    targetX = targetX + width / 2;
    targetY = targetY + height / 2;

    resizeCanvas(windowWidth, windowHeight);

    scaleResize(windowWidth, windowHeight);

    targetX = targetX - windowWidth / 2;
    targetY = targetY - windowHeight / 2;

    if (playStage == 0 || playStage == 1) updateLoading();
    if (playStage == 3) updateQuestion();
    if (playStage == 4) updateEndGame();

    updateElements();
}

function scaleResize(windowWidth, windowHeight) {
    if (windowWidth > windowHeight) {
        inZoom = max(min(.9, windowWidth / 1500),
            max(width / (tileSize * (mapCols - 2)),
                height / (tileSize * (mapRows - 2))));
        outZoom = max(min(.4, windowWidth * .5 / 1500),
            max(width / (tileSize * (mapCols - 2)),
                height / (tileSize * (mapRows - 2))));
    } else {
        inZoom = min(0.6, windowHeight * 0.6 / 1000);
        outZoom = min(0.4, windowHeight * 0.4 / 1400);
    }
    targetZoom = inZoom;
}

function drawScore() {
    drawButton(score.text, score.y, score.w, score.h, score.radius, score.translateX, score.translateY, score.textSize);

    push();
    translate(score.countdown.x - score.countdown.w / (2 * (isMobileDevice() ? 2 : 1)), score.countdown.translateY);
    for (let i = 0; i < score.total; i++) {
        if (i < score.countdown.result.length)
            if (score.countdown.result[i]) fill(score.countdown.rColor);
            else fill(score.countdown.wColor);
        else fill(score.countdown.dColor);
        strokeWeight(2);
        stroke(score.countdown.bColor);

        let def = isMobileDevice() ? (i >= score.total/2) : 0;
        let y = def * score.h/2 - (isMobileDevice() ? 1 : 0) * score.countdown.m;
        let x = score.countdown.r / 2 + (score.countdown.r + score.countdown.m) * (i - def*score.total/2) ;
        
        circle(x, y, score.countdown.r);
    }
    pop();
}

function drawButton(txt, y, w, h, radius, tX, tY, txtSize, color = "#589359", interact = false, textColor = "#FFFFFF", hAlign = CENTER, hMargin = 0) {
    textAlign(hAlign, CENTER);
    rectMode(CENTER);
    textSize(txtSize);
    textLeading(txtSize * 1.2);

    push();
    translate(tX, tY);

    if (!isMobileDevice() && interact &&
        mouseX > tX - w / 2 && mouseX < tX + w / 2 &&
        mouseY > tY - h / 2 && mouseY < tY + h / 2) {
        cursorPointer = true;
        scale(1.05);
    }

    noStroke();
    fill(color);
    rect(0, 0, w, h, radius);

    if (hAlign == LEFT) translate(-tX + hMargin, 0);
    fill(textColor);
    text(txt, 0, y);

    pop();
}

function drawTimer() {
    let elapsed = millis() - startTime.start;
    let remainingTime = countdownTime - floor(elapsed / 1000);
    let minutes = max(0, floor(remainingTime / 60));
    let seconds = max(0, remainingTime % 60);

    let displayMinutes = nf(minutes, 2);
    let displaySeconds = nf(seconds, 2);

    if (!playStageChange) timerText = displayMinutes + ":" + displaySeconds;

    textAlign(CENTER, CENTER);
    rectMode(CENTER);

    textSize(startTime.textSize);
    textLeading(startTime.textLeading);

    let txtColor;
    if (remainingTime % 60 > 10) txtColor = "#589359";
    else txtColor = "#B25757";

    drawButton(timerText, startTime.y, startTime.w, startTime.h, startTime.radius, startTime.translateX, startTime.translateY, startTime.textSize, txtColor)

    if (remainingTime < 0 && !playStageChange) setScore(false, -1);
}

function getTimer() {
    let elapsed = millis() - startTime.start;
    return countdownTime - floor(elapsed / 1000);
}

function drawIcon(img, w, h, x, y, color, interact = false) {
    imageMode(CENTER);
    rectMode(CENTER);
    noStroke();
    fill(color);

    push();
    translate(x, y);
    if (!isMobileDevice() && interact &&
        mouseX > x - w / 2 && mouseX < x + w / 2 &&
        mouseY > y - h / 2 && mouseY < y + h / 2) {
        cursorPointer = true;
        scale(1.05);
    }

    ellipse(0, 0, w, h);
    image(img, 0, 0, w, h);
    pop();
}

function updateElements() {
    // Timer
    updateTimer();
    // Score
    updateScore();
    // Buttons
    updateButtons();
    // Difficulty
    updateDifficultyButtons();
    // Highscore
    updateHighscore();
    // Logo
    content.logo.m = max(min(20, (width / 1920) * 20), 15);
    content.logo.h = max(min(50, (width / 1920) * 50), 25) + content.logo.m;
    content.logo.w = content.logo.d.width * content.logo.h / content.logo.d.height;
    content.logo.x = width - content.logo.w - content.logo.m;
    content.logo.y = content.logo.m;
}

function updateTimer() {
    // Timer
    startTime.textSize = max(min(35, (width / 1920) * 35), 20);
    startTime.radius = max(min(50, (width / 1920) * 50), 25);
    startTime.marginW = max(min(30, (width / 1920) * 30), 20);
    startTime.marginH = max(min(15, (width / 1920) * 15), 10);

    textSize(startTime.textSize);
    startTime.w = textWidth("88:88") + startTime.marginW * 2;
    startTime.h = startTime.textSize + startTime.marginH * 2;
    startTime.y = -startTime.textSize / 8;

    if (width > height) {
        startTime.translateX = width - startTime.marginW - startTime.w / 2;
        startTime.translateY = startTime.marginW + startTime.h / 2;
    } else {
        startTime.translateX = startTime.marginW * 2 + startTime.w / 2 + score.w;
        startTime.translateY = startTime.marginW + startTime.h / 2;
    }
}

function updateScore() {
    textFont(content.HabitasBold.d);
    // Score
    score.text = "PERGUNTA: " + (score.right + score.wrong) + "/" + score.total;

    score.textSize = max(min(35, (width / 1920) * 35), 20);
    score.radius = max(min(50, (width / 1920) * 50), 25);
    score.marginW = max(min(30, (width / 1920) * 30), 20);
    score.marginH = max(min(15, (width / 1920) * 15), 10);

    textSize(score.textSize);
    score.w = textWidth(score.text) + score.marginW * 2;
    score.h = score.textSize + score.marginH * 2;
    score.y = -score.textSize / 8;

    score.translateX = score.marginW + score.w / 2;
    score.translateY = score.marginW + score.h / 2;


    score.countdown.r = max(min(24, (width / 1920) * 24), 15);

    score.countdown.x = width / 2;
    score.countdown.y = score.translateY;
    score.countdown.w = score.countdown.r * score.total + score.countdown.m * (score.total - 1);


    if (width > height) score.countdown.translateY = score.marginW + score.h / 2;
    else score.countdown.translateY = height - score.marginW - score.h / 2;
}

function checkButtonClick(x, y, item) {
    if (x > item.x - item.w / 2 &&
        x < item.x + item.w / 2 &&
        y > item.y - item.h / 2 &&
        y < item.y + item.h / 2)
        return true;
    else return false;
}

function updateButtons() {
    // Info Button
    content.infoButton.margin = max(min(20, (width / 1920) * 20), 15);
    content.infoButton.w = max(min(50, (width / 1920) * 50), 25) + content.infoButton.margin;
    content.infoButton.h = content.infoButton.w;
    content.infoButton.x = width - content.infoButton.w / 2 - content.infoButton.margin;
    content.infoButton.y = height - content.infoButton.h / 2 - content.infoButton.margin;

    // Back Button
    content.backButton.margin = content.infoButton.margin;
    content.backButton.w = content.infoButton.w;
    content.backButton.h = content.backButton.w;
    content.backButton.x = content.backButton.w / 2 + content.backButton.margin;
    content.backButton.y = height - content.backButton.h / 2 - content.backButton.margin;

    // Volume Button
    content.volumeUp.margin = content.backButton.margin;
    content.volumeUp.w = content.backButton.w;
    content.volumeUp.h = content.backButton.w;
    content.volumeUp.x = content.infoButton.x - content.volumeUp.w - content.volumeUp.margin;
    content.volumeUp.y = content.backButton.y;

    content.volumeMute.margin = content.volumeUp.margin;
    content.volumeMute.w = content.volumeUp.w;
    content.volumeMute.h = content.volumeUp.h;
    content.volumeMute.x = content.volumeUp.x;
    content.volumeMute.y = content.volumeUp.y;
}

function updateDifficultyButtons() {
    textFont(content.HabitasBold.d);
    // Classic
    classsicDifficulty.textSize = max(min(50, (width / 1920) * 50), 35);
    classsicDifficulty.radius = max(min(50, (width / 1920) * 50), 25);
    classsicDifficulty.marginW = max(min(30, (width / 1920) * 30), 20);
    classsicDifficulty.marginH = max(min(15, (width / 1920) * 15), 10);

    textSize(classsicDifficulty.textSize);
    classsicDifficulty.w = textWidth(classsicDifficulty.text) + classsicDifficulty.marginW * 2;
    classsicDifficulty.h = classsicDifficulty.textSize + classsicDifficulty.marginH * 2;
    classsicDifficulty.y = -classsicDifficulty.h / 10;

    if (width > height) {
        classsicDifficulty.translateX = max(classsicDifficulty.marginW + classsicDifficulty.w / 2,
            width / 2 - classsicDifficulty.marginW * 3 - classsicDifficulty.w / 2);
        classsicDifficulty.translateY = height / 2;
    } else {
        classsicDifficulty.translateX = width / 2;
        classsicDifficulty.translateY = height / 2 + classsicDifficulty.h / 2 + classsicDifficulty.marginW;
    }

    //Challenge
    challengeDifficulty.textSize = max(min(50, (width / 1920) * 50), 35);
    challengeDifficulty.radius = max(min(50, (width / 1920) * 50), 25);
    challengeDifficulty.marginW = max(min(20, (width / 1920) * 20), 15);
    challengeDifficulty.marginH = max(min(15, (width / 1920) * 15), 10);

    textSize(challengeDifficulty.textSize);
    challengeDifficulty.w = textWidth(challengeDifficulty.text) + challengeDifficulty.marginW * 2;
    challengeDifficulty.h = challengeDifficulty.textSize + challengeDifficulty.marginH * 2;
    challengeDifficulty.y = -challengeDifficulty.h / 10;

    if (width > height) {
        challengeDifficulty.translateX = min(width - challengeDifficulty.w / 2 - challengeDifficulty.marginW,
            width / 2 + challengeDifficulty.marginW * 3 + challengeDifficulty.w / 2);
        challengeDifficulty.translateY = classsicDifficulty.translateY;
    } else {
        challengeDifficulty.translateX = classsicDifficulty.translateX;
        challengeDifficulty.translateY = classsicDifficulty.translateY + classsicDifficulty.h + classsicDifficulty.marginW;
    }
}

function goBack() {
    if (playStage >= 2) {
        playStage = 1;
        goToObject(menuPosition, false, bootZoom);
        isSpinning = false;
        rouletteAngle = rouletteAngle % TWO_PI;
        score.countdown.result = [];
        score.right = 0;
        score.wrong = 0;
    }
}

function mainMenu() {
    menuWheelRot += 0.01;
    menuScreen();
    textFont(content.HabitasBold.d);
    drawButton(classsicDifficulty.text, classsicDifficulty.y,
        classsicDifficulty.w, classsicDifficulty.h,
        classsicDifficulty.radius, classsicDifficulty.translateX, classsicDifficulty.translateY,
        classsicDifficulty.textSize, "#4DA0C1", true);
    drawButton(challengeDifficulty.text, challengeDifficulty.y,
        challengeDifficulty.w, challengeDifficulty.h,
        challengeDifficulty.radius, challengeDifficulty.translateX, challengeDifficulty.translateY,
        challengeDifficulty.textSize, "#B25757", true);
    // Highscore
    drawButton(highscore.text, highscore.y,
        highscore.w, highscore.h,
        highscore.radius, highscore.translateX,
        highscore.translateY, highscore.textSize,
        undefined, undefined, undefined, LEFT, highscore.marginW * 2);

    image(content.logo.d, content.logo.x, content.logo.y, content.logo.w, content.logo.h);
}

function playMusic() {
    if (content.music.status) {
        content.music.d.stop();
    } else {
        let initialVolume = 0;
        let defaultVolume = 0.15;
        let duration = 5000;

        content.music.d.loop();

        let volumeInterval = setInterval(() => {
            if (initialVolume < defaultVolume) {
                initialVolume += 0.01;
                content.music.d.setVolume(initialVolume);
            } else {
                content.music.d.setVolume(defaultVolume);
                clearInterval(volumeInterval);
            }
        }, duration / 100);
    }
    content.music.status = !content.music.status;
}

function playSound(sound) {
    if(content.music.status) sound.play();
}

function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function displayInfo() {
    if (content.infoButton.active) content.infoButton.html.classList.add("hide");
    else content.infoButton.html.classList.remove("hide");

    content.infoButton.active = !content.infoButton.active;
}