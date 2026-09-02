// lightning.js - Lightning effect for Hero Section
(function () {
  const canvas = document.getElementById('lightning-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    const hero = document.getElementById('hero');
    canvas.width = hero ? hero.offsetWidth : window.innerWidth;
    canvas.height = hero ? hero.offsetHeight : window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  function drawLightning(ctx, startX, startY) {
    ctx.save();
    ctx.strokeStyle = '#c4b5fd';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#818cf8';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(startX, startY);

    let currentX = startX;
    let currentY = startY;

    while (currentY < canvas.height) {
      const stepY = 15 + Math.random() * 10; // turun 15-25px
      const stepX = (Math.random() - 0.5) * 40; // offset horizontal antara -20 sampai 20px

      currentX += stepX;
      currentY += stepY;

      // Keep within canvas bounds
      if (currentX < 10) currentX = 10;
      if (currentX > canvas.width - 10) currentX = canvas.width - 10;

      ctx.lineTo(currentX, currentY);
    }

    ctx.stroke();
    ctx.restore();
  }

  function triggerLightning() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Pick random startX between 10% and 90% of canvas width
    const startX = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
    const startY = 0;

    drawLightning(ctx, startX, startY);

    // Clear canvas after 200ms
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 200);
  }

  function scheduleNext() {
    const delay = Math.floor(Math.random() * 4000) + 5000; // 5000-9000ms
    setTimeout(() => {
      triggerLightning();
      scheduleNext();
    }, delay);
  }

  // Trigger initial lightning within 1.2s for quick verification
  setTimeout(() => {
    triggerLightning();
    scheduleNext();
  }, 1200);
})();
