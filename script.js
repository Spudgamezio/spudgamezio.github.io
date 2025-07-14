document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('starCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    let stars = [];

    class Star {
        constructor(x, y, velocityX, velocityY) {
            this.x = x;
            this.y = y;
            this.finalSize = Math.random() * 2;
            this.size = this.finalSize * 2; // Start larger and shrink
            this.alpha = 1;
            this.velocityX = velocityX * 0.05;
            this.velocityY = 1 + Math.random() + velocityY * 0.05;
            this.gravity = 0.02;
            this.drag = 0.97;
            this.turbulence = () => Math.random() * 0.5 - 0.25;
            this.timeElapsed = 0;
        }

        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }

        update(deltaTime) {
            this.x += this.velocityX + this.turbulence();
            this.velocityX *= this.drag;
            this.y += this.velocityY;
            this.velocityY += this.gravity;
            this.alpha = Math.max(0, this.alpha - 0.005);

            this.timeElapsed += deltaTime;
            if (this.timeElapsed < 2000) {
                this.size = this.finalSize * 2 - (this.finalSize * this.timeElapsed / 2000);
            } else {
                this.size = this.finalSize;
            }
        }
    }

    let lastMouseX = 0;
    let lastMouseY = 0;
    let mouseVelocityX = 0;
    let mouseVelocityY = 0;

    function addStar(e) {
        mouseVelocityX = e.clientX - lastMouseX;
        mouseVelocityY = e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        let randomOffsetX = (Math.random() - 0.5) * 100;
        let randomOffsetY = (Math.random() - 0.5) * 100;

        stars.push(new Star(e.clientX, e.clientY, mouseVelocityX + randomOffsetX, mouseVelocityY + randomOffsetY));
    }

    document.addEventListener('mousemove', addStar);

    let lastTime = 0;

    function update(time = 0) {
        const deltaTime = time - lastTime;
        lastTime = time;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        stars.forEach(star => star.update(deltaTime));
        stars.forEach(star => star.draw());
        stars = stars.filter(star =>
            star.alpha > 0 &&
            star.y < canvas.height &&
            star.x > 0 &&
            star.x < canvas.width
        );
        requestAnimationFrame(update);
    }

    update();
});
// --- SHARE MODAL CODE ---
const shareModal = document.getElementById('share-modal');
const shareLinkInput = document.getElementById('share-link');
const copyLinkBtn = document.getElementById('copy-link-btn');
const closeShareBtn = document.getElementById('close-share-btn');

function openShareModal() {
  let urlToShare = window.location.href; // default to current page

  // If a game is open, share that game's URL
  const gameFrame = document.getElementById('game-iframe');
  if (gameFrame && gameFrame.src) {
    urlToShare = gameFrame.src;
  }

  shareLinkInput.value = urlToShare;
  shareModal.style.display = 'block';
  document.body.style.overflow = 'hidden'; // prevent background scroll
}

function closeShareModal() {
  shareModal.style.display = 'none';
  document.body.style.overflow = 'auto';
}

copyLinkBtn.addEventListener('click', () => {
  shareLinkInput.select();
  document.execCommand('copy');
  copyLinkBtn.textContent = '✅ Copied!';
  setTimeout(() => copyLinkBtn.textContent = '📋 Copy Link', 2000);
});

closeShareBtn.addEventListener('click', closeShareModal);