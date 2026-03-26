(() => {
  /* =========================
     Config
  ========================= */
  const neuronsConfig = [
    {
      label: "Research",
      href: "./pages/research_page/index.html",
      color: "cyan",
      x: 10,
      y: 30
    },
    {
      label: "Visuals",
      href: "./pages/art_page/index.html",
      color: "magenta",
      x: 33,
      y: 20
    },
    {
      label: "Teaching",
      href: "./pages/teach_page/index.html",
      color: "green",
      x: 52,
      y: 25
    },
    {
      label: "Performance",
      href: "./pages/perform_page/index.html",
      color: "amber",
      x: 75,
      y: 20
    }
  ];

  /* =========================
     Utilities
  ========================= */
  function createNeuron({ label, href, x, y, color }) {
    const a = document.createElement("a");
    a.className = `neuron neuron-${color}`;
    a.href = href;

    // Random initial position if x/y not provided
    const rand = (min, max) => min + Math.random() * (max - min);

    const top = y != null ? (typeof y === "number" ? `${y}%` : y) : `${rand(10, 85)}%`;
    const left = x != null ? (typeof x === "number" ? `${x}%` : x) : `${rand(10, 85)}%`;

    a.style.left = left;
    a.style.top = top;

    const span = document.createElement("span");
    span.className = "neuron-label";
    span.textContent = label;

    a.appendChild(span);
    return a;
  }

  /* =========================
     Floating motion
  ========================= */
  function floatNeurons(neurons, container) {
    const bounds = () => container.getBoundingClientRect();
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const noise = isMobile ? 0.14 : 0.2; // 随机强度（越大越活跃）
    const smooth = 0.95; // 平滑程度（越接近1越“飘”）
    const maxSpeed = 100; // 防止突然窜
    const speedScale = isMobile ? 5 : 7;
    const wallBounce = 0.65;
    const collisionBounce = 0.75;

    const bodies = neurons.map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        el,
        baseX: el.offsetLeft,
        baseY: el.offsetTop,
        x: el.offsetLeft,
        y: el.offsetTop,
        w: rect.width,
        h: rect.height,
        r: Math.min(rect.width, rect.height) / 2,
        vx: 0,
        vy: 0
      };
    });

    function clampBody(body, width, height, edgePad) {
      const minX = edgePad;
      const minY = edgePad;
      const maxX = width - edgePad - body.w;
      const maxY = height - edgePad - body.h;

      if (body.x < minX) {
        body.x = minX;
        if (body.vx < 0) body.vx *= -wallBounce;
      } else if (body.x > maxX) {
        body.x = maxX;
        if (body.vx > 0) body.vx *= -wallBounce;
      }

      if (body.y < minY) {
        body.y = minY;
        if (body.vy < 0) body.vy *= -wallBounce;
      } else if (body.y > maxY) {
        body.y = maxY;
        if (body.vy > 0) body.vy *= -wallBounce;
      }
    }

    function resolveCollisions() {
      for (let i = 0; i < bodies.length; i += 1) {
        for (let j = i + 1; j < bodies.length; j += 1) {
          const a = bodies[i];
          const b = bodies[j];

          const ax = a.x + a.w / 2;
          const ay = a.y + a.h / 2;
          const bx = b.x + b.w / 2;
          const by = b.y + b.h / 2;

          const dx = bx - ax;
          const dy = by - ay;
          const dist = Math.hypot(dx, dy);
          const minDist = a.r + b.r;

          if (dist >= minDist || dist === 0) continue;

          const nx = dx / dist;
          const ny = dy / dist;
          const overlap = minDist - dist;

          // First separate them so they no longer overlap.
          a.x -= nx * overlap * 0.5;
          a.y -= ny * overlap * 0.5;
          b.x += nx * overlap * 0.5;
          b.y += ny * overlap * 0.5;

          // Then exchange velocity along the collision normal.
          const rvx = b.vx - a.vx;
          const rvy = b.vy - a.vy;
          const velAlongNormal = rvx * nx + rvy * ny;
          if (velAlongNormal > 0) continue;

          const impulse = (-(1 + collisionBounce) * velAlongNormal) / 2;
          const ix = impulse * nx;
          const iy = impulse * ny;

          a.vx -= ix;
          a.vy -= iy;
          b.vx += ix;
          b.vy += iy;
        }
      }
    }

    function tick() {
      const { width, height } = bounds();
      const edgePad = Math.max(12, Math.min(40, Math.min(width, height) * 0.06));

      for (const body of bodies) {
        body.vx = body.vx * smooth + (Math.random() - 0.5) * noise;
        body.vy = body.vy * smooth + (Math.random() - 0.5) * noise;

        body.vx = Math.max(-maxSpeed, Math.min(maxSpeed, body.vx));
        body.vy = Math.max(-maxSpeed, Math.min(maxSpeed, body.vy));

        body.x += body.vx * speedScale;
        body.y += body.vy * speedScale;

        clampBody(body, width, height, edgePad);
      }

      resolveCollisions();

      for (const body of bodies) {
        clampBody(body, width, height, edgePad);
        body.el.style.transform = `translate(${body.x - body.baseX}px, ${body.y - body.baseY}px)`;
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }





  /* =========================
     Init
  ========================= */
  function initNeurons() {

    const layer = document.getElementById("neurons-layer");
    if (!layer) return;
    layer.classList.add("neurons-layer");

    const section = document.getElementById("neurons-section");
    if (!section) return;

    const neurons = [];
    neuronsConfig.forEach(cfg => {
      const neuron = createNeuron(cfg);
      layer.appendChild(neuron);
      neurons.push(neuron);
    });

    floatNeurons(neurons, section);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNeurons);
  } else {
    initNeurons();
  }
})();
