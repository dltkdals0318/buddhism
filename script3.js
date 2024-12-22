let particleSystems = [];
let messages = [
    "명상은 마음의 평화를 가져옵니다",
    "호흡에 집중하세요",
    "현재 순간에 머무르세요",
    "내면의 소리에 귀 기울이세요"
];
let showMessage = false; 
let currentMessage = "";
let fadeAlpha = 0; 
let fadeDuration = 2000; 
let fadeStartTime = 0;
let messageDisplayDuration = 5000;

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(255, 0);

    for (let i = 0; i < 3; i++) {
        particleSystems.push(new ParticleSystem(random(width), random(height)));
    }

    currentMessage = random(messages); 
    showMessage = true; 
    fadeStartTime = millis();
}

function draw() {
    clear();

    for (let system of particleSystems) {
        system.update();
        system.display();
    }

    if (showMessage) {
        fadeAlpha += 255 / (fadeDuration / 16);
        if (fadeAlpha > 255) {
            fadeAlpha = 255;
        }
    
        if (millis() - fadeStartTime > fadeDuration) {
            showMessage = false; 
        }
    } else {
        fadeAlpha -= 255 / (fadeDuration / 16);
        if (fadeAlpha < 0) {
            fadeAlpha = 0;
        }
    }

    // 메시지 표시
    fill(0, fadeAlpha);
    textSize(24); // 폰트 크기 설정
    textFont('Nanum Gothic');
    textAlign(CENTER);
    text(currentMessage, width / 2, height / 2 + 240); 

    // 메시지 표시 후 새로운 랜덤 메시지 설정
    if (!showMessage && millis() - fadeStartTime > messageDisplayDuration) {
        currentMessage = random(messages); // 새로운 랜덤 메시지 선택
        showMessage = true; // 메시지 표시 설정
        fadeStartTime = millis(); // 페이드 시작 시간 초기화
    }

    // 새 파티클 시스템 생성 주기 조정
    if (frameCount % 120 === 0) { // 매 120프레임마다 새로운 시스템 추가
        let x = random(width * 0.25, width * 0.75); // 화면 가로 중앙 50% 영역 내
        let y = random(height * 0.4, height * 0.6); // 화면 세로 중앙 50% 영역 내
        particleSystems.push(new ParticleSystem(x, y));

        // 시스템 개수 제한 (최대 6개)
        if (particleSystems.length > 6) {
            particleSystems.shift(); // 오래된 시스템 제거
        }
    }

    // 얼굴 그리기
    face(width / 4, height / 2 - 25);
    face(width / 2, height / 2 - 25);
    face((3 * width) / 4, height / 2 - 25);
}

// 파티클 시스템 클래스 (원형 퍼짐)
class ParticleSystem {
    constructor(x, y) {
        this.x = x; // 시스템 중심 X
        this.y = y; // 시스템 중심 Y
        this.particles = []; // 시스템 내 파티클들

        // 초기 파티클 생성
        for (let i = 0; i < 30; i++) { // 초기 파티클 수 감소
            this.particles.push(new Particle(this.x, this.y));
        }
    }

    update() {
        // 각 파티클 업데이트
        for (let particle of this.particles) {
            particle.update();
        }

        // 죽은 파티클 제거
        this.particles = this.particles.filter(p => !p.isDead());

        // 새로운 파티클 추가 빈도 조정
        if (this.particles.length < 50 && random() < 0.05) { // 추가 빈도 감소
            this.particles.push(new Particle(this.x, this.y));
        }
    }

    display() {
        // 각 파티클 표시
        for (let particle of this.particles) {
            particle.display();
        }
    }
}

// 파티클 클래스 (원형으로 퍼짐)
class Particle {
    constructor(x, y) {
        this.originX = x;
        this.originY = y;
        this.angle = random(TWO_PI); // 회전 각도
        this.radius = 0; // 반경 (중심에서 시작)
        this.speed = random(0.5, 1.5); // 반경 증가 속도 (느리게 설정)
        this.size = random(3, 7); // ��티클 크기
        this.alpha = 255; // 투명도
    }

    update() {
        this.radius += this.speed; // 반경 증가
        this.alpha -= 2; // 점점 투명해짐
    }

    display() {
        let x = this.originX + cos(this.angle) * this.radius;
        let y = this.originY + sin(this.angle) * this.radius;

        noStroke();
        fill(0, this.alpha); // 검은색 파티클
        ellipse(x, y, this.size);
    }

    isDead() {
        return this.alpha <= 0; // 투명도가 0이 되면 죽은 것으로 간주
    }
}

function face(x, y) {
    push();
    translate(x, y);

    let center = createVector(x, y);
    let mouse = createVector(mouseX, mouseY);

    let move = p5.Vector.sub(mouse, center);
    move.mult(0.1);

    let pupilMove = move.copy();
    pupilMove.limit(20);

    let eyeMove = move.copy();
    eyeMove.mult(0.5);
    eyeMove.limit(25);

    let noseMove = move.copy();
    noseMove.mult(0.7);
    noseMove.limit(30);

    let mouthMove = move.copy();
    mouthMove.mult(0.4);
    mouthMove.limit(20);

    let hairMove = move.copy();
    hairMove.mult(0.3);
    hairMove.limit(15);

    let eyebrowMove = move.copy();
    eyebrowMove.mult(0.6);
    eyebrowMove.limit(30);

    let earMove = move.copy();
    earMove.mult(-0.5);
    earMove.limit(20);

    let spotMove = move.copy();
    spotMove.mult(0.55);
    spotMove.limit(30);

    fill("black");

    push();
    translate(earMove.x, earMove.y);
    ellipse(-120, 0, 100, 100); // Left ear
    ellipse(120, 0, 100, 100); // Right ear
    ellipse(-125, 55, 40, 70); // Left earlobe
    ellipse(125, 55, 40, 70); // Right earlobe
    pop();

    rectMode(CENTER);
    rect(0, 0, 250, 300, 110); // Face

    push();
    translate(eyeMove.x, eyeMove.y);

    if (mouseIsPressed) {
        fill("white");
        rectMode(CENTER);
        rect(-60, 5, 80, 10, 5);
        rect(60, 5, 80, 10, 5);
    } else {
        fill("white");
        rectMode(CENTER);
        rect(-60, 0, 80, 20, 7);
        rect(60, 0, 80, 20, 7);

        push();
        translate(pupilMove.x, pupilMove.y);
        fill("black");
        ellipse(-60, 0, 40, 40);
        ellipse(60, 0, 40, 40);
        pop();
    }

    pop();

    push();
    translate(mouthMove.x, mouthMove.y);
    stroke("white");
    strokeWeight(5);
    noFill();
    curveTightness(0.5);
    curve(-65, -60, -40, 75, 40, 75, 60, -65); // Mouth
    pop();

    push();
    translate(noseMove.x, noseMove.y);
    stroke("white");
    strokeWeight(5);
    line(0, 50, -15, 45); // Nose
    line(0, 50, 15, 45);
    pop();

    push();
    translate(spotMove.x, spotMove.y);
    fill("white");
    ellipse(0, -70, 14, 14); // Spot
    pop();

    push();
    translate(eyebrowMove.x, eyebrowMove.y);
    stroke("white");
    strokeWeight(5);
    noFill();
    curveTightness(-0.2);
    curve(0, 70, 20, -40, 100, -40, 120, 70); // Left eyebrow
    curve(0, 70, -20, -40, -100, -40, -120, 70); // Right eyebrow
    pop();

    push();
    translate(hairMove.x, hairMove.y);
    noStroke();
    fill("white");
    ellipse(0, -160, 60, 60); // Hair
    ellipse(-55, -145, 60, 60);
    ellipse(55, -145, 60, 60);
    ellipse(-100, -115, 50, 50);
    ellipse(100, -115, 50, 50);
    ellipse(-125, -80, 40, 40);
    ellipse(125, -80, 40, 40);
    ellipse(-130, -45, 30, 30);
    ellipse(130, -45, 30, 30);
    ellipse(-40, -188, 55, 55);
    ellipse(40, -188, 55, 55);
    ellipse(0, -208, 60, 60);
    pop();

    pop();
}