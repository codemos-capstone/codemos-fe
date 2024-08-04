import React, { useEffect, useRef } from 'react';

class Star {
  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.size = Math.floor(Math.random() * 2) + 1; // 1x1, 2x2 크기 선택
    this.speed = (Math.random() * 0.7) + 0.8;
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
    ctx.fillStyle = "#fff";
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}

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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(star => star.move(ctx));
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
        position: 'absolute',
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
