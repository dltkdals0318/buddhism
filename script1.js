document.addEventListener('DOMContentLoaded', function() {
    let isMessageVisible = false;

    function moveIcon(img) {
        let posX = parseFloat(img.style.left);
        let posY = parseFloat(img.style.top);
        const speed = 2.2;
        
        let directionX = Math.random() * 2 - 1;
        let directionY = Math.random() * 2 - 1;
        
        const length = Math.sqrt(directionX * directionX + directionY * directionY);
        directionX /= length;
        directionY /= length;
        
        function createParticle(x, y) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.width = Math.random() * 5 + 2 + 'px';
            particle.style.height = particle.style.width;
            document.getElementById('game-container').appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
        
        function animate() {
            if (!img.parentElement) return;
            
            posX += speed * directionX;
            posY += speed * directionY;

            const rightBound = window.innerWidth - 60;
            const bottomBound = window.innerHeight - 60;

            if (posX < 0) {
                posX = 0;
                directionX = -directionX;
            } else if (posX > rightBound) {
                posX = rightBound;
                directionX = -directionX;
            }

            if (posY < 0) {
                posY = 0;
                directionY = -directionY;
            } else if (posY > bottomBound) {
                posY = bottomBound;
                directionY = -directionY;
            }

            img.style.left = posX + 'px';
            img.style.top = posY + 'px';

            // Create particles
            if (Math.random() < 0.5) {
                createParticle(
                    posX + Math.random() * 40,
                    posY + Math.random() * 40
                );
            }

            requestAnimationFrame(animate);
        }
        
        requestAnimationFrame(animate);
    }

    const afflictions = [
        { name: 'tam', src: 'tam.png', message: '탐욕을 내려놔 마음이 편안해집니다...' },
        { name: 'jin', src: 'jin.png', message: '분노를 내려놔 마음이 평화로워집니다...' },
        { name: 'chi', src: 'chi.png', message: '어리석음에서 벗어나 지혜가 생깁니다...' }
    ];

    function createAffliction() {
        const affliction = afflictions[Math.floor(Math.random() * afflictions.length)];
        
        const container = document.createElement('div');
        container.className = 'affliction-image-container';
        container.style.left = Math.random() * (window.innerWidth - 40) + 'px';
        container.style.top = Math.random() * (window.innerHeight - 40) + 'px';
        
        const img = document.createElement('img');
        img.src = affliction.src;
        img.className = 'affliction-image';
        
        container.appendChild(img);
        
        container.addEventListener('click', function() {
            if (!isMessageVisible) {
                this.style.opacity = '0';
                setTimeout(() => this.remove(), 300);
                showMessage(affliction.message);
            }
        });

        document.getElementById('game-container').appendChild(container);
        moveIcon(container);
    }

    function showMessage(message) {
        if (isMessageVisible) return;
        
        isMessageVisible = true;
        const messageDiv = document.getElementById('message');
        
        messageDiv.style.display = 'block';
        messageDiv.textContent = message;
        
        requestAnimationFrame(() => {
            messageDiv.style.opacity = '1';
        });

        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                messageDiv.style.display = 'none';
                isMessageVisible = false;
            }, 650);
        }, 1300);
    }

    createAffliction();
    
    setInterval(createAffliction, 2500);
});
