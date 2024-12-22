let h = [];
let targetH = [];
let particles = []; 

let treePositions = [
    { x: 400, y: 700 },
    { x: 576, y: 750 },
    { x: 752, y: 700 },
    { x: 928, y: 750 },
    { x: 1104, y: 700 },
    { x: 1280, y: 750 },
    { x: 1456, y: 700 },
    { x: 1632, y: 750 },
    { x: 1808, y: 700 },
    { x: 1984, y: 750 },
    { x: 2160, y: 700 },
];

let messages = [
    "자비는 나무처럼 자라납니다",
    "평화로운 마음이 자라나고 있습니다",
    "지혜의 씨앗이 싹틉니다",
    "마음의 정원이 풍성해집니다"
];
let showMessage = false; // 메시지 표시 여부
let currentMessage = ""; // 현재 메시지
let fadeAlpha = 0; // 페이드 효과를 위한 알파 값
let fadeDuration = 500; // 메시지가 사라지는 시간 (1.5초)
let fadeStartTime = 0; // 페이드 시작 시간

function setup() {
    createCanvas(windowWidth, windowHeight, P2D);
    cursor(HAND);

    for (let i = 0; i < treePositions.length; i++) {
        h.push(0);
        targetH.push(0);
    }
}

function draw() {
    clear();
    background(220, 220, 220, 0);
    let up = 1;
    if (mouseIsPressed) {
        up = 10;
    }

    for (let i = 0; i < treePositions.length; i++) {
        let pos = treePositions[i];
        h[i] = lerp(h[i], targetH[i] + up, 0.1);
        tree(pos.x, pos.y, h[i]); 
    }

    // 메시지 페이드 인/아웃 처리
    if (showMessage) {
        fadeAlpha += 5; // 페이드 인
        if (fadeAlpha > 255) {
            fadeAlpha = 255;
        }
        // 메시지가 나타난 후 1.5초 후에 사라지기 시작
        if (millis() - fadeStartTime > fadeDuration) {
            showMessage = false; // 메시지 사라지기 시작
        }
    } else {
        fadeAlpha -= 5; // 페이드 아웃
        if (fadeAlpha < 0) {
            fadeAlpha = 0;
        }
    }

    // 메시지 표시
    if (fadeAlpha > 0) {
        push();
        fill(0, fadeAlpha);
        textSize(24); // 텍스트 크기 줄임
        textAlign(CENTER);
        text(currentMessage, width / 2, height / 2 - 350); // 위치를 위로 조정
        pop();
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].show();
        if (particles[i].finished()) {
            particles.splice(i, 1); 
        }
    }
}

function tree(x, y, h) {
    let treeScales = [1.5];
    let ScaleFactor = treeScales[0];
    
    push();
    translate(x, y);
    scale(scaleFactor);
    strokeWeight(15);
    stroke(0); 
    line(0, 0, 0, -h);

    push();
    translate(0, -h);
    strokeWeight(5);
    stroke(0);

    if (h > 150) {
        ellipse(0, -10, 60, 60);
        ellipse(25, 95, 55, 55);
        ellipse(-25, 95, 50, 55);
        ellipse(30, 40, 60, 60);
        ellipse(-30, 40, 60, 60);
        strokeWeight(15);
        stroke(0); 
        line(0, 0, 0, 100);
    }

    if (h > 60) {
        stroke("black");
        strokeWeight(10);
        line(0,60,-30,45);
        line(0,60,30,45); 
    }

    pop();

    if (h >= 110) {
        push();
        translate(0, -h + 70);
        stroke("black");
        strokeWeight(10);
        line(0,40,-30,25);
        line(0,40,30,25);
        pop();
    }
    pop();
}

function mousePressed() {

    let allMaxed = true;

    for (let i = 0; i < treePositions.length; i++) {
        let pos = treePositions[i];
        let d = dist(mouseX, mouseY, pos.x, pos.y);
        
        if (d < 200) {
            targetH[i] += 30;
            if (targetH[i] > 200) {
                targetH[i] = 200;
            }
        }

        if (targetH[i] < 200) {
            allMaxed = false;
        }
    }

    if (allMaxed) {
        for (let i = 0; i < treePositions.length; i++) {
            targetH[i] = 0;
        }
    }

    for (let i = 0; i < 10; i++) {
        let p = new Particle(mouseX, mouseY);
        particles.push(p);
    }

    currentMessage = random(messages);
    showMessage = true;
    fadeStartTime = millis();

    let randomX = random(width);
    let randomY = random(height);
    text(currentMessage, randomX, randomY);
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = random(-1, 1); 
        this.vy = random(-2, 0); 
        this.alpha = 255; 
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.alpha -= 5;
    }

    show() {
        push(); 
        noStroke();
        fill(0, this.alpha);
        ellipse(this.x, this.y, 10);
        pop(); 
    }

    finished() {
        return this.alpha < 0;
    }
}
