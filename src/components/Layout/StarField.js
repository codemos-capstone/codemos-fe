import React, { useEffect, useRef } from 'react';

class Star {
  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.size = Math.random() * 1.8;
    this.speed = (Math.random() * 0.22);
    if (Math.random() <= 0.005) { this.color = "#faa"}
    else if (Math.random() >= 0.99) { this. color = "#ffa"}
    else if (Math.random() >= 0.499 && Math.random() <= 0.51) this.color = "#aaf"
    else this.color = "#fff"
  }

  move(ctx) {
    this.y += this.speed;
    if (this.y > window.innerHeight) {
      this.y = 0;
      this.x = Math.random() * window.innerWidth;
    }
    this.draw(ctx);
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath(); // Start a new path
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // Create a circle
    ctx.stroke(); // Outline the circle
    ctx.fill();
  }
}

class ShootingStar {
  constructor() {
    this.x = (Math.random() * 0.7 + 0.3) * window.innerWidth
    this.y = 0
    this.size = Math.random() + 2;
    this.sqrtSize = Math.sqrt(this.size + 1.2);
  }

  move(ctx) {
    this.y += 6;
    this.x -= 6;
    this.draw(ctx);
  }

  draw(ctx) {
    ctx.beginPath(); // Start a new path
    ctx.arc(this.x, this.y, this.size + 1.3, 0, Math.PI * 2); // Create a circle
    ctx.stroke(); // Outline the circle
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(this.x - this.sqrtSize, this.y - this.sqrtSize);
    ctx.lineTo(this.x - this.sqrtSize + 15, this.y - 15);
    ctx.lineTo(this.x + this.sqrtSize, this.y + this.sqrtSize);
    ctx.lineTo(this.x - this.sqrtSize, this.y + this.sqrtSize);
    ctx.stroke();
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() / 2 + 0.25})`;
    ctx.fill();

    ctx.beginPath(); // Start a new path
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); // Create a circle
    ctx.stroke(); // Outline the circle
    ctx.fillStyle = '#adf';
    ctx.fill();
  }
}

let shootingStars = []

const StarField = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas(); // 초기 설정

    const stars = Array.from({ length: 300 }, () => new Star());
    let animationFrameId;

    const render = () => {
      if (Math.random() > 0.997) {
        shootingStars.push(new ShootingStar());
      }
      if (shootingStars) shootingStars = shootingStars.filter(star => star.x > 0 && star.y < window.innerHeight);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => star.move(ctx));
      shootingStars.forEach(shootingStar => shootingStar.move(ctx))
      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        background: 'black',
        zIndex: -1
      }}
    />
  );
};

export default StarField;