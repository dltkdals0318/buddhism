let flowers = [];
let flowerPositions = [];
let flowerScales = [];
let particles = []; // 파티클 저장

function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();

    flowerPositions = [
        { x: width * 0.2, y: height * 0.5 }, // 왼쪽 연꽃
        { x: width * 0.5, y: height * 0.5 }, // 중앙 연꽃
        { x: width * 0.8, y: height * 0.5 }, // 오른쪽 연꽃
    ];

    flowerScales = [1.5, 1.7, 1.5];

    for (let i = 0; i < flowerPositions.length; i++) {
        flowers.push(new Flower(flowerPositions[i].x, flowerPositions[i].y, flowerScales[i]));
    }
}

function draw() {
    clear();

    // 파티클 업데이트 및 표시
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].display();

        if (particles[i].isDead()) {
            particles.splice(i, 1); // 죽은 파티클 제거
        }
    }

    // 연꽃 업데이트 및 표시
    for (let flower of flowers) {
        flower.update();
        flower.display();

        // 연꽃 주위에서 파티클 생성
        if (frameCount % 15 === 0) { // 매 15프레임마다 파티클 생성
            particles.push(new FloatingParticle(flower.x, flower.y));
        }
    }
}

// 연꽃 주위에서 생성되는 파티클 클래스
class FloatingParticle {
    constructor(x, y) {
        this.x = x + random(-150, 150); // 연꽃 주위 넓은 범위에서 생성
        this.y = y + random(-150, 150);
        this.vx = random(-2.5, 2.5); // 가로 방향 이동 속도 (더 넓게 퍼짐)
        this.vy = random(-1.5, -0.5); // 위쪽으로 이동
        this.size = random(15, 30); // 꽃잎 크기 (크기 증가)
        this.alpha = 255; // 투명도
        this.rotation = random(TWO_PI); // 회전 각도
        this.rotationSpeed = random(-0.02, 0.02); // 회전 속도
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;

        // 파티클의 투명도 천천히 감소
        this.alpha -= 2;
    }

    display() {
        push();
        translate(this.x, this.y);
        rotate(this.rotation); // 회전 적용
        fill(0, this.alpha); // 검은색 파티클
        noStroke();
        beginShape();
        vertex(-this.size / 2, 0);
        bezierVertex(
            -this.size / 4, -this.size / 2,
            this.size / 4, -this.size / 2,
            this.size / 2, 0
        );
        bezierVertex(
            this.size / 4, this.size / 2,
            -this.size / 4, this.size / 2,
            -this.size / 2, 0
        );
        endShape(CLOSE);
        pop();
    }

    isDead() {
        return this.alpha <= 0; // 투명도가 0이 되면 죽은 것으로 간주
    }
}

class Flower {
    constructor(x, y, scale) {
        this.x = x;
        this.y = y;
        this.scale = scale;
        this.petals = [];
        this.rotationAngle = 0;
        this.baseCircleSize = 220;
        this.circleSize = this.baseCircleSize * this.scale;
        this.targetSize = this.circleSize;
        this.isResetting = false;
        this.resetTimer = 0;
        this.isInitial = true;
        this.petalLayers = 2;
        this.initializePetals(true);
    }

    initializePetals(noMotion) {
        this.petals = [];
        let numPetals = 7;
        for (let layer = 0; layer < this.petalLayers; layer++) {
            let radius = (60 - layer * 15) * this.scale;
            let offsetAngle = (TWO_PI / numPetals) / 2 * (layer % 2);
            for (let i = 0; i < numPetals; i++) {
                this.addPetal(i, noMotion, layer, offsetAngle, radius);
            }
        }
    }

    addPetal(index, noMotion, layer, offsetAngle, radius) {
        let numPetals = 7;
        let angle = TWO_PI / numPetals * index + offsetAngle;
        let size = (90 - layer * 10) * this.scale;
        let petal = new Petal(angle, radius, size, noMotion);
        this.petals.push(petal);
    }

    update() {
        this.circleSize = lerp(this.circleSize, this.targetSize, 0.2);

        if (this.isResetting) {
            this.resetTimer++;
            if (this.resetTimer % 10 === 0 && this.petals.length < this.petalLayers * 7) {
                let currentLayer = Math.floor(this.petals.length / 7);
                let layerIndex = this.petals.length % 7;
                let offsetAngle = (TWO_PI / 7) / 2 * (currentLayer % 2);
                let radius = (60 - currentLayer * 15) * this.scale;
                this.addPetal(layerIndex, false, currentLayer, offsetAngle, radius);
            }
            if (this.petals.length === this.petalLayers * 7) {
                this.isResetting = false;
                this.resetTimer = 0;
                for (let petal of this.petals) {
                    petal.resetGrowth();
                }
            }
        }

        for (let petal of this.petals) {
            petal.update();
        }

        this.rotationAngle += 0.01;

        if (this.petals.every(petal => petal.alpha === 0) && !this.isResetting) {
            this.isResetting = true;
            this.initializePetals(false);
        }
    }

    display() {
        push();
        translate(this.x, this.y);

        // 중앙 원
        stroke(0);
        strokeWeight(5);
        fill(0);
        ellipse(0, 0, this.circleSize, this.circleSize);

        rotate(this.rotationAngle);

        // 꽃잎 표시
        for (let petal of this.petals) {
            petal.display();
        }

        pop();
    }

    handleMousePressed(mx, my) {
        let d = dist(mx, my, this.x, this.y);
        if (d < this.circleSize / 2) {
            this.targetSize = this.baseCircleSize * this.scale * 1.05;
        }

        for (let petal of this.petals) {
            if (petal.isClicked(mx - this.x, my - this.y, this.rotationAngle)) {
                petal.isFalling = true;
            }
        }
    }

    handleMouseReleased() {
        this.targetSize = this.baseCircleSize * this.scale;
    }
}

class Petal {
    constructor(angle, radius, size, noMotion) {
        this.angle = angle;
        this.radius = radius;
        this.size = size;
        this.isFalling = false;
        this.alpha = 255;
        this.growth = noMotion ? 1 : 0;
    }

    display() {
        push();
        rotate(this.angle);
        translate(this.radius, 0);
        stroke(0, this.alpha);
        strokeWeight(5);
        fill(255, this.alpha);
        beginShape();
        vertex(-this.size / 2 * this.growth, 0);
        bezierVertex(
            -this.size / 4 * this.growth,
            -this.size / 2 * this.growth,
            this.size / 4 * this.growth,
            -this.size / 2 * this.growth,
            this.size / 2 * this.growth,
            0
        );
        bezierVertex(
            this.size / 4, this.size / 2,
            -this.size / 4, this.size / 2,
            -this.size / 2, 0
        );
        endShape(CLOSE);
        pop();
    }

    update() {
        if (this.isFalling) {
            this.radius += 2;
            this.alpha -= 5;
            if (this.alpha <= 0) {
                this.alpha = 0;
            }
        } else {
            this.growth = lerp(this.growth, 1, 0.1);
        }
    }

    resetGrowth() {
        this.growth = 0;
    }

    isClicked(mx, my, rotationAngle) {
        let xPetal = cos(this.angle + rotationAngle) * this.radius;
        let yPetal = sin(this.angle + rotationAngle) * this.radius;
        return dist(mx, my, xPetal, yPetal) < this.size / 2;
    }
}

function mousePressed() {
    for (let flower of flowers) {
        flower.handleMousePressed(mouseX, mouseY);
    }
}

function mouseReleased() {
    for (let flower of flowers) {
        flower.handleMouseReleased();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    setup();
}

