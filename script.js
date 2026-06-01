const fieldCanvas = document.querySelector("#fieldCanvas");
const fieldCtx = fieldCanvas.getContext("2d");
const orbitCanvas = document.querySelector("#orbitCanvas");
const orbitCtx = orbitCanvas.getContext("2d");
const strengthInput = document.querySelector("#strength");
const strengthValue = document.querySelector("#strengthValue");

const fieldParticles = Array.from({ length: 130 }, () => ({
  x: Math.random(),
  y: Math.random(),
  phase: Math.random() * Math.PI * 2,
  speed: 0.0018 + Math.random() * 0.0032,
  radius: 0.8 + Math.random() * 2.4
}));

const orbitParticles = Array.from({ length: 42 }, (_, index) => ({
  angle: (index / 42) * Math.PI * 2,
  radius: 0.18 + Math.random() * 0.32,
  velocity: 0.003 + Math.random() * 0.006,
  hue: index % 3
}));

function fitCanvas(canvas, ctx) {
  const rect = canvas.getBoundingClientRect();
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * scale);
  canvas.height = Math.floor(rect.height * scale);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

function drawField(time) {
  fitCanvas(fieldCanvas, fieldCtx);
  const width = fieldCanvas.getBoundingClientRect().width;
  const height = fieldCanvas.getBoundingClientRect().height;

  fieldCtx.clearRect(0, 0, width, height);
  fieldCtx.fillStyle = "#111214";
  fieldCtx.fillRect(0, 0, width, height);

  const centerX = width * 0.68;
  const centerY = height * 0.48;
  const maxR = Math.min(width, height) * 0.58;

  for (let ring = 1; ring <= 7; ring += 1) {
    const radius = (ring / 7) * maxR;
    fieldCtx.beginPath();
    for (let step = 0; step <= 220; step += 1) {
      const angle = (step / 220) * Math.PI * 2;
      const wave = Math.sin(angle * 5 + time * 0.0012 + ring) * 8;
      const x = centerX + Math.cos(angle) * (radius + wave);
      const y = centerY + Math.sin(angle) * (radius * 0.62 + wave);
      if (step === 0) fieldCtx.moveTo(x, y);
      else fieldCtx.lineTo(x, y);
    }
    fieldCtx.closePath();
    fieldCtx.strokeStyle = `rgba(103, 208, 199, ${0.08 + ring * 0.018})`;
    fieldCtx.lineWidth = 1;
    fieldCtx.stroke();
  }

  fieldParticles.forEach((particle) => {
    particle.phase += particle.speed * time * 0.02;
    const drift = Math.sin(particle.phase) * 28;
    const x = particle.x * width + drift;
    const y = (particle.y * height + time * particle.speed * 22) % height;
    const distance = Math.hypot(x - centerX, y - centerY);
    const glow = Math.max(0.14, 1 - distance / (maxR * 1.2));

    fieldCtx.beginPath();
    fieldCtx.arc(x, y, particle.radius, 0, Math.PI * 2);
    fieldCtx.fillStyle = `rgba(231, 185, 87, ${glow})`;
    fieldCtx.fill();
  });

  fieldCtx.beginPath();
  fieldCtx.arc(centerX, centerY, 9, 0, Math.PI * 2);
  fieldCtx.fillStyle = "#e7673c";
  fieldCtx.fill();
}

function drawOrbit(time) {
  fitCanvas(orbitCanvas, orbitCtx);
  const rect = orbitCanvas.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  const strength = Number(strengthInput.value);
  const centerX = width * 0.5;
  const centerY = height * 0.52;
  const fieldScale = strength / 100;

  strengthValue.value = String(strength);
  orbitCtx.clearRect(0, 0, width, height);
  orbitCtx.fillStyle = "#15161a";
  orbitCtx.fillRect(0, 0, width, height);

  for (let x = -20; x < width + 80; x += 44) {
    orbitCtx.beginPath();
    for (let y = 0; y <= height; y += 10) {
      const bend = Math.sin(y * 0.022 + time * 0.002 + x * 0.02) * 18 * fieldScale;
      const px = x + bend + (y / height) * 24 * fieldScale;
      if (y === 0) orbitCtx.moveTo(px, y);
      else orbitCtx.lineTo(px, y);
    }
    orbitCtx.strokeStyle = "rgba(103, 208, 199, 0.22)";
    orbitCtx.lineWidth = 1;
    orbitCtx.stroke();
  }

  orbitCtx.beginPath();
  orbitCtx.arc(centerX, centerY, 18 + fieldScale * 5, 0, Math.PI * 2);
  orbitCtx.fillStyle = "rgba(231, 103, 60, 0.95)";
  orbitCtx.fill();

  orbitParticles.forEach((particle) => {
    particle.angle += particle.velocity * (0.45 + fieldScale);
    const wobble = Math.sin(time * 0.002 + particle.angle * 3) * 18 * fieldScale;
    const rx = width * particle.radius + wobble;
    const ry = height * particle.radius * 0.66 + wobble * 0.35;
    const x = centerX + Math.cos(particle.angle) * rx;
    const y = centerY + Math.sin(particle.angle) * ry;
    const colors = ["#e7b957", "#67d0c7", "#9c7df1"];

    orbitCtx.beginPath();
    orbitCtx.arc(x, y, 3.2, 0, Math.PI * 2);
    orbitCtx.fillStyle = colors[particle.hue];
    orbitCtx.fill();
  });
}

function animate(time) {
  drawField(time);
  drawOrbit(time);
  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  fitCanvas(fieldCanvas, fieldCtx);
  fitCanvas(orbitCanvas, orbitCtx);
});

strengthInput.addEventListener("input", () => {
  strengthValue.value = strengthInput.value;
});

requestAnimationFrame(animate);
