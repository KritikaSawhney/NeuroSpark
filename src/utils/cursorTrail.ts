
/**
 * Creates a cursor trail effect that follows the mouse
 */
export const initCursorTrail = () => {
  const trailDots: HTMLElement[] = [];
  const maxDots = 15;
  
  const createDot = (x: number, y: number, color: string = 'currentColor') => {
    const dot = document.createElement('div');
    dot.className = 'cursor-trail-dot';
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.backgroundColor = color;
    document.body.appendChild(dot);
    trailDots.push(dot);
    
    // Remove oldest dot if we've reached the maximum
    if (trailDots.length > maxDots) {
      const oldestDot = trailDots.shift();
      if (oldestDot) {
        oldestDot.style.opacity = '0';
        setTimeout(() => {
          oldestDot.remove();
        }, 300);
      }
    }
    
    // Remove this dot after animation completes
    setTimeout(() => {
      dot.style.opacity = '0';
      setTimeout(() => {
        dot.remove();
        const index = trailDots.indexOf(dot);
        if (index > -1) {
          trailDots.splice(index, 1);
        }
      }, 300);
    }, 800);
  };
  
  const getRandomColor = () => {
    // Use primary color with different opacities
    const hue = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-hue').trim();
    
    const saturation = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-saturation').trim();
      
    const lightness = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-lightness').trim()) + Math.floor(Math.random() * 20) - 10;
      
    return `hsl(${hue}, ${saturation}, ${lightness}%)`;
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    createDot(e.clientX, e.clientY, getRandomColor());
  };
  
  window.addEventListener('mousemove', handleMouseMove);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    trailDots.forEach(dot => dot.remove());
  };
};
