(() => {
  const canvas = document.getElementById("fx-canvas");
  const ctx = canvas.getContext("2d", { alpha: true });

  // ====== Config ======
  const START_SPAWN_AFTER_VH = 0.6;     // start spawning after 60vh scroll
  const MAX_DESKTOP = 12;
  const MAX_MOBILE = 6;

  const THEMES = [
    { label: "Research", href: "./pages/research_page/index.html", type: "galaxy", color: "#7CFF6B" },
    { label: "Art", href: "./pages/art_page/index.html", type: "string", color: "#FF62D6" },
    { label: "Community", href: "./pages/comm_page/index.html", type: "neuron", color: "#56D7FF" },
  ];

  // ====== Helpers ======
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (a, b) => a + Math.random() * (b - a);
  const lerp = (a, b, t) => a + (b - a) * t;

  function isMobile() {
    return matchMedia("(max-width: 768px)").matches;
  }

  function resize() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // Very lightweight "noise": smooth sin mix
  function driftNoise(t, seed) {
    return Math.sin(t * 0.7 + seed) * 0.6 + Math.sin(t * 1.1 + seed * 2.3) * 0.4;
  }

  // ====== State ======
  let objects = [];
  let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
  let hoveredId = null;

  // Spawn control
  let spawnBudget = 0;
  let lastTime = performance.now();

  function maxObjects() {
    return isMobile() ? MAX_MOBILE : MAX_DESKTOP;
  }

  function scrollProgress() {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    const h = window.innerHeight || 1;
    // progress after START_SPAWN_AFTER_VH, scaled
    const p = (y / h - START_SPAWN_AFTER_VH) / 2.5; // slow ramp
    return clamp(p, 0, 1);
  }

  function pickTheme(i) {
    return THEMES[i % THEMES.length];
  }

  function trySpawn() {
    if (objects.length >= maxObjects()) return;

    // avoid spawning too early
    const p = scrollProgress();
    if (p <= 0) return;

    // spawn rate increases with scroll depth
    // accumulate "budget" rather than spawning every frame
    spawnBudget += 0.02 + p * 0.12; // tune here

    while (spawnBudget >= 1 && objects.length < maxObjects()) {
      spawnBudget -= 1;

      const theme = pickTheme(objects.length);

      // Spawn positions biased to sides / lower area (like your sketch)
      const w = window.innerWidth;
      const h = window.innerHeight;

      const side = Math.random() < 0.5 ? -1 : 1;
      const x = side < 0 ? rand(60, w * 0.45) : rand(w * 0.55, w - 60);
      const y = rand(h * 0.35, h * 0.9);

      const scale = rand(0.85, 1.25);
      const radius = rand(26, 44) * scale;

      objects.push({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
        type: theme.type,
        label: theme.label,
        href: theme.href,
        color: theme.color,
        x, y,
        vx: rand(-0.10, 0.10),
        vy: rand(-0.06, 0.06),
        rot: rand(0, Math.PI * 2),
        vr: rand(-0.002, 0.002),
        scale,
        radius,         // for hit test
        alpha: 0,
        seed: rand(0, 1000),
        sparkle: rand(0, Math.PI * 2),
      });
    }
  }

  function hitTest(px, py) {
    // simple radius hit-test (good enough for squiggly neon drawings)
    for (let i = objects.length - 1; i >= 0; i--) {
      const o = objects[i];
      const dx = px - o.x;
      const dy = py - o.y;
      if (dx * dx + dy * dy <= (o.radius + 10) * (o.radius + 10)) {
        return o;
      }
    }
    return null;
  }

  // ====== Drawing primitives ======
  function withGlow(color, strength, drawFn) {
    ctx.save();
    ctx.shadowColor = color;
    ctx.shadowBlur = strength;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    drawFn();
    ctx.restore();
  }

  function drawLabel(o, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.textAlign = "center";
    ctx.fillText(o.label, o.x, o.y + o.radius + 18);
    ctx.restore();
  }

  function drawString(o, t, glow) {
    const amp = 10 * o.scale;
    const len = 140 * o.scale;

    ctx.beginPath();
    for (let i = 0; i <= 40; i++) {
      const u = i / 40;
      const x = o.x + (u - 0.5) * len;
      const y = o.y + Math.sin(u * Math.PI * 2 + t * 1.4 + o.seed) * amp * 0.7
                    + Math.sin(u * Math.PI * 4 + t * 0.9) * amp * 0.3;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // small sparkle dot
    const sx = o.x + Math.cos(t * 2 + o.seed) * (len * 0.18);
    const sy = o.y + Math.sin(t * 2 + o.seed) * (amp * 0.9);
    ctx.beginPath();
    ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawGalaxy(o, t) {
    const r = 34 * o.scale;
    const arms = 3;

    ctx.lineWidth = 2.0;
    for (let a = 0; a < arms; a++) {
      const phase = (a / arms) * Math.PI * 2;
      ctx.beginPath();
      for (let i = 0; i <= 70; i++) {
        const u = i / 70;        // 0..1
        const theta = u * Math.PI * 4 + phase + o.rot;
        const rr = r * (0.2 + u);
        const x = o.x + Math.cos(theta) * rr;
        const y = o.y + Math.sin(theta) * rr * 0.75;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // core
    ctx.beginPath();
    ctx.arc(o.x, o.y, 5.5 * o.scale, 0, Math.PI * 2);
    ctx.fill();

    // twinkle ring
    ctx.save();
    ctx.globalAlpha *= 0.35;
    ctx.beginPath();
    ctx.arc(o.x, o.y, (12 + 2 * Math.sin(t * 3 + o.seed)) * o.scale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function drawNeuron(o, t) {
    const somaR = 10 * o.scale;

    // soma
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.arc(o.x, o.y, somaR, 0, Math.PI * 2);
    ctx.stroke();

    // dendrites (hand-drawn-ish)
    const branches = 5;
    for (let b = 0; b < branches; b++) {
      const ang = (b / branches) * Math.PI * 2 + o.rot;
      const L = rand(38, 70) * o.scale;
      ctx.beginPath();
      ctx.moveTo(o.x, o.y);
      for (let i = 1; i <= 7; i++) {
        const u = i / 7;
        const wobble = Math.sin(t * 2 + o.seed + u * 7 + b) * 6 * o.scale;
        const x = o.x + Math.cos(ang) * (u * L) + Math.cos(ang + Math.PI / 2) * wobble * 0.25;
        const y = o.y + Math.sin(ang) * (u * L) + Math.sin(ang + Math.PI / 2) * wobble * 0.25;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // nucleus sparkle
    ctx.beginPath();
    ctx.arc(o.x + Math.cos(t * 3 + o.seed) * 2, o.y + Math.sin(t * 3 + o.seed) * 2, 2.2 * o.scale, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawObject(o, t, parallaxX, parallaxY) {
    const isHover = hoveredId === o.id;
    const baseGlow = isHover ? 22 : 14;
    const glow = baseGlow + 6 * (0.5 + 0.5 * Math.sin(t * 2 + o.sparkle));

    ctx.save();
    ctx.globalAlpha = o.alpha;

    // parallax shift
    ctx.translate(parallaxX, parallaxY);

    // draw a faint “halo” circle to make it feel shiny
    ctx.save();
    ctx.globalAlpha *= isHover ? 0.25 : 0.14;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.radius * 1.2, 0, Math.PI * 2);
    ctx.fillStyle = o.color;
    ctx.fill();
    ctx.restore();

    // main neon stroke
    withGlow(o.color, glow, () => {
      if (o.type === "string") drawString(o, t, glow);
      else if (o.type === "galaxy") drawGalaxy(o, t);
      else drawNeuron(o, t);
    });

    // label on hover
    if (isHover) drawLabel(o, 0.95);

    ctx.restore();
  }

  // ====== Animation loop ======
  function tick(now) {
    const t = now * 0.001;
    const dt = Math.min(0.033, (now - lastTime) * 0.001);
    lastTime = now;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Spawn based on scroll
    trySpawn();

    // Slight parallax from mouse
    const parX = (mouse.x / window.innerWidth - 0.5) * 10;
    const parY = (mouse.y / window.innerHeight - 0.5) * 10;

    // Update + draw objects
    const p = scrollProgress();
    const fadeInSpeed = 1.6;

    for (const o of objects) {
      // fade in
      o.alpha = clamp(o.alpha + dt * fadeInSpeed, 0, 1);

      // gentle drift
      const nx = driftNoise(t, o.seed);
      const ny = driftNoise(t, o.seed + 31.7);

      o.x += (o.vx + nx * 0.05) * (1 + p * 0.6);
      o.y += (o.vy + ny * 0.05) * (1 + p * 0.6);
      o.rot += o.vr;

      // keep within screen bounds (soft)
      const pad = 60;
      o.x = clamp(o.x, pad, window.innerWidth - pad);
      o.y = clamp(o.y, pad, window.innerHeight - pad);

      drawObject(o, t, parX, parY);
    }

    // hover state
    if (mouse.active) {
      const hit = hitTest(mouse.x, mouse.y);
      hoveredId = hit ? hit.id : null;
      canvas.style.cursor = hit ? "pointer" : "default";
    }

    requestAnimationFrame(tick);
  }

  // ====== Events ======
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("scroll", () => {
    // remove some objects if user scrolls back to top (optional)
    const p = scrollProgress();
    if (p === 0 && objects.length > 0) {
      // keep a couple so it doesn't feel like it "resets too hard"
      objects = objects.slice(0, Math.min(objects.length, 2));
    }
  }, { passive: true });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.active = true;
  }, { passive: true });

  window.addEventListener("mouseleave", () => {
    mouse.active = false;
    hoveredId = null;
    canvas.style.cursor = "default";
  }, { passive: true });

  window.addEventListener("click", (e) => {
    const hit = hitTest(e.clientX, e.clientY);
    if (!hit) return;

    // quick “ripple” feedback: bump alpha / sparkle
    hit.alpha = 1;
    hit.sparkle += 1.5;

    // navigate
    window.location.href = hit.href;
  });

  // Touch support
  window.addEventListener("touchstart", (e) => {
    if (!e.touches || e.touches.length === 0) return;
    const touch = e.touches[0];
    const hit = hitTest(touch.clientX, touch.clientY);
    if (hit) window.location.href = hit.href;
  }, { passive: true });

  // Init
  resize();
  requestAnimationFrame(tick);
})();
