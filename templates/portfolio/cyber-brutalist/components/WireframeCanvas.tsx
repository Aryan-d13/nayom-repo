'use client';

import React, { useEffect, useRef } from 'react';

export default function WireframeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      const dpr = window.devicePixelRatio || 1;
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // 3D Icosahedron Geometry Definition (Golden Ratio vertices)
    const phi = (1 + Math.sqrt(5)) / 2;
    const baseScale = Math.min(width, height) * 0.32;

    const rawVertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ];

    // Normalize and scale vertices
    const vertices = rawVertices.map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return [x / len, y / len, z / len];
    });

    // Edges between vertices
    const edges: [number, number][] = [];
    const threshold = 1.1; // Distance threshold for adjacent vertices on unit sphere
    for (let i = 0; i < vertices.length; i++) {
      for (let j = i + 1; j < vertices.length; j++) {
        const dx = vertices[i][0] - vertices[j][0];
        const dy = vertices[i][1] - vertices[j][1];
        const dz = vertices[i][2] - vertices[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < threshold) {
          edges.push([i, j]);
        }
      }
    }

    let rotX = 0.4;
    let rotY = 0.6;
    let targetRotX = 0.4;
    let targetRotY = 0.6;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevMouseX;
        const dy = e.clientY - prevMouseY;
        targetRotY += dx * 0.008;
        targetRotX += dy * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else {
        // Subtle mouse tracking
        const rect = canvas.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / width - 0.5;
        const ny = (e.clientY - rect.top) / height - 0.5;
        targetRotY += nx * 0.02;
        targetRotX -= ny * 0.02;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const canvasElem = canvas;
    canvasElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId: number;
    let radarAngle = 0;

    const render = () => {
      // Smooth interpolation & natural idle spin
      targetRotY += 0.004;
      targetRotX += 0.002;
      rotX += (targetRotX - rotX) * 0.1;
      rotY += (targetRotY - rotY) * 0.1;
      radarAngle += 0.02;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.min(width, height) * 0.38;

      // 1. Draw Tactical Concentric Radar Rings
      ctx.save();
      ctx.translate(cx, cy);

      ctx.strokeStyle = 'rgba(255, 230, 0, 0.1)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.25, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
      ctx.stroke();

      // Radar Crosshairs
      ctx.strokeStyle = 'rgba(255, 230, 0, 0.12)';
      ctx.beginPath();
      ctx.moveTo(-radius * 1.3, 0);
      ctx.lineTo(radius * 1.3, 0);
      ctx.moveTo(0, -radius * 1.3);
      ctx.lineTo(0, radius * 1.3);
      ctx.stroke();

      // Sweeping radar arc
      ctx.strokeStyle = 'rgba(255, 230, 0, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.1, radarAngle, radarAngle + 0.8);
      ctx.stroke();

      ctx.restore();

      // 2. Project 3D Vertices
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      const projected = vertices.map(([x, y, z]) => {
        // Y-axis rotation
        const x1 = x * cosY + z * sinY;
        const y1 = y;
        const z1 = -x * sinY + z * cosY;

        // X-axis rotation
        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        // Perspective projection
        const fov = 2.4;
        const scale = fov / (fov + z2);
        const px = cx + x2 * radius * scale;
        const py = cy + y2 * radius * scale;

        return { px, py, z: z2, scale };
      });

      // 3. Draw 3D Edges with depth lighting
      edges.forEach(([i, j]) => {
        const v1 = projected[i];
        const v2 = projected[j];
        const avgZ = (v1.z + v2.z) / 2;
        const alpha = Math.max(0.12, (avgZ + 1) / 2 * 0.85);

        ctx.strokeStyle = `rgba(255, 230, 0, ${alpha})`;
        ctx.lineWidth = avgZ > 0 ? 1.8 : 1;
        ctx.beginPath();
        ctx.moveTo(v1.px, v1.py);
        ctx.lineTo(v2.px, v2.py);
        ctx.stroke();
      });

      // 4. Draw Glowing Vertex Points
      projected.forEach((v) => {
        const nodeRadius = (v.z > 0 ? 3.5 : 2) * v.scale;
        const alpha = Math.max(0.2, (v.z + 1) / 2);

        // Core dot
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.arc(v.px, v.py, nodeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Cyber yellow halo for foreground nodes
        if (v.z > 0.2) {
          ctx.strokeStyle = '#FFE600';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(v.px, v.py, nodeRadius + 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // 5. Draw Tactical Corner Labels
      ctx.font = '9px monospace';
      ctx.fillStyle = 'rgba(255, 230, 0, 0.7)';
      ctx.fillText(`ROT.X: ${rotX.toFixed(2)}`, 16, height - 28);
      ctx.fillText(`ROT.Y: ${rotY.toFixed(2)}`, 16, height - 14);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fillText('SYS.POLYHEDRON // 12-VERTICES', width - 180, height - 14);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvasElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[340px] sm:min-h-[420px] lg:min-h-[480px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
