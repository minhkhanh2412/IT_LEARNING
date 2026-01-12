'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './not-found.module.scss';

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Hide header and footer
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const body = document.body;
    
    if (header) (header as HTMLElement).style.display = 'none';
    if (footer) (footer as HTMLElement).style.display = 'none';
    if (body) {
      body.style.overflow = 'hidden';
      body.style.margin = '0';
      body.style.padding = '0';
    }

    // Cleanup on unmount
    return () => {
      if (header) (header as HTMLElement).style.display = '';
      if (footer) (footer as HTMLElement).style.display = '';
      if (body) {
        body.style.overflow = '';
        body.style.margin = '';
        body.style.padding = '';
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle class
    class Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      text: boolean;
      time: number;
      offsetX: number;
      offsetY: number;
      glowIntensity: number;

      constructor(x: number, y: number, isText: boolean = false) {
        this.baseX = x;
        this.baseY = y;
        this.x = x;
        this.y = y;
        this.text = isText;
        this.radius = isText ? Math.random() * 2.5 + 1 : Math.random() * 4 + 2;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.alpha = Math.random() * 0.5 + 0.5;
        this.time = Math.random() * Math.PI * 2;
        this.offsetX = Math.random() * Math.PI * 2;
        this.offsetY = Math.random() * Math.PI * 2;
        this.glowIntensity = 0;
      }

      update(mouseX: number, mouseY: number) {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 120;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          const angle = Math.atan2(dy, dx);
          this.vx -= Math.cos(angle) * force * 0.6;
          this.vy -= Math.sin(angle) * force * 0.6;
          this.glowIntensity = Math.min(force * 1.5, 1);
        } else {
          this.glowIntensity *= 0.95;
        }

        // Tự chuyển động (floating animation)
        this.time += 0.02;
        const floatX = Math.sin(this.time + this.offsetX) * 1.5;
        const floatY = Math.cos(this.time + this.offsetY) * 1.5;

        // Return to base position với offset
        this.vx += (this.baseX + floatX - this.x) * 0.05;
        this.vy += (this.baseY + floatY - this.y) * 0.05;

        // Apply velocity with damping
        this.vx *= 0.95;
        this.vy *= 0.95;

        this.x += this.vx;
        this.y += this.vy;
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Glow effect khi hover
        if (this.glowIntensity > 0.1) {
          ctx.shadowBlur = 15 * this.glowIntensity;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;
      }
    }

    const particles: Particle[] = [];
    let mouseX = -1000;
    let mouseY = -1000;

    // Create particles from text
    const createParticles = () => {
      // Create temporary canvas for text
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      // Draw "404"
      tempCanvas.width = 500;
      tempCanvas.height = 350;
      tempCtx.fillStyle = '#000';
      tempCtx.font = 'bold 300px Arial';
      tempCtx.fillText('404', 0, 250);

      const imageData404 = tempCtx.getImageData(0, 0, 500, 350);
      const data404 = imageData404.data;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      for (let y = 0; y < imageData404.height; y += 12) {
        for (let x = 0; x < imageData404.width; x += 12) {
          const index = (y * imageData404.width + x) * 4;
          const alpha = data404[index + 3];

          if (alpha > 128) {
            particles.push(
              new Particle(
                x + centerX - 250,
                y + centerY - 175,
                false
              )
            );
          }
        }
      }

      // Draw "Not Found"
      tempCanvas.width = 400;
      tempCanvas.height = 120;
      tempCtx.clearRect(0, 0, 400, 120);
      tempCtx.fillStyle = '#000';
      tempCtx.font = 'bold 70px Arial';
      tempCtx.fillText('Not Found', 0, 70);

      const imageDataText = tempCtx.getImageData(0, 0, 400, 120);
      const dataText = imageDataText.data;

      for (let y = 0; y < imageDataText.height; y += 4) {
        for (let x = 0; x < imageDataText.width; x += 4) {
          const index = (y * imageDataText.width + x) * 4;
          const alpha = dataText[index + 3];

          if (alpha > 128) {
            particles.push(
              new Particle(
                x + centerX - 180,
                y + centerY + 100,
                true
              )
            );
          }
        }
      }
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update(mouseX, mouseY);
        particle.draw(ctx);
      });

      requestAnimationFrame(animate);
    };

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles.length = 0;
      createParticles();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    createParticles();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.notFoundContainer}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.content}>
        <Link href="/" className={styles.homeButton}>
          Về trang chủ
        </Link>
        <p className={styles.message}>
          Trang bạn tìm kiếm không tồn tại
        </p>
      </div>
    </div>
  );
}
