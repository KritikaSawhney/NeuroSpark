
export default function triggerConfetti() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return;
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  
  document.body.appendChild(canvas);
  
  const colors = [
    '#9b87f5', // neuro-purple
    '#7E69AB', // neuro-dark-purple
    '#D6BCFA', // neuro-light-purple
    '#F2FCE2', // neuro-soft-green
    '#FEF7CD', // neuro-soft-yellow
    '#E5DEFF', // neuro-soft-purple
  ];
  
  const confetti: {
    x: number;
    y: number;
    size: number;
    color: string;
    speed: number;
    angle: number;
    rotation: number;
    rotationSpeed: number;
  }[] = [];
  
  // Create confetti pieces
  for (let i = 0; i < 150; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * 100,
      size: 5 + Math.random() * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 2 + Math.random() * 5,
      angle: Math.random() * Math.PI * 2,
      rotation: 0,
      rotationSpeed: Math.random() * 0.2 - 0.1,
    });
  }
  
  function drawConfetti() {
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let stillActive = false;
    
    for (const piece of confetti) {
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      
      ctx.fillStyle = piece.color;
      ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
      
      ctx.restore();
      
      piece.x += Math.sin(piece.angle) * 2;
      piece.y += piece.speed;
      piece.rotation += piece.rotationSpeed;
      
      // Check if confetti is still on screen
      if (piece.y < canvas.height + 100) {
        stillActive = true;
      }
    }
    
    if (stillActive) {
      requestAnimationFrame(drawConfetti);
    } else {
      canvas.remove();
    }
  }
  
  drawConfetti();
}
