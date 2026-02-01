(() => {
  /* =========================
     Config
  ========================= */
  const neuronsConfig = [
    {
      label: "Research",
      href: "./pages/research_page/index.html",
      color: "cyan"
    },
    {
      label: "Art",
      href: "./pages/art_page/index.html",
      color: "magenta"
    },
    {
      label: "Community",
      href: "./pages/comm_page/index.html",
      color: "amber"
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

    const left = (x ?? `${rand(10, 85).toFixed(2)}vw`);
    const top  = (y ?? `${rand(18, 80).toFixed(2)}vh`);

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
  function floatNeuron(el) {
  // --- Tunables (feel free to tweak) ---
  const speedScale = 1.5;        // overall speed multiplier
  const maxSpeed = 100;           // px/s  (higher = faster)
  const steering = 1.2;          // how quickly direction changes (0..2)
  const damping = 0.985;         // inertia (closer to 1 = smoother, floatier)
  const edgePadding = 30;        // keep away from edges a bit

  // --- State ---
  const w = () => window.innerWidth;
  const h = () => window.innerHeight;

  // base position: read initial left/top (vw/vh) -> px
  const baseLeftPx = el.offsetLeft;
  const baseTopPx = el.offsetTop;

  let x = baseLeftPx;
  let y = baseTopPx;

  // initial velocity
  let vx = (Math.random() * 2 - 1) * (maxSpeed * 0.35);
  let vy = (Math.random() * 2 - 1) * (maxSpeed * 0.35);

  // slow-changing random target force
  let ax = 0;
  let ay = 0;
  let nextSteer = 0;

  let last = performance.now();

  function tick(now) {
    const dt = Math.min(0.05, (now - last) / 1000); // cap dt
    last = now;

    // every ~0.3–1.0s, pick a new gentle "wind" direction
    nextSteer -= dt;
    if (nextSteer <= 0) {
      nextSteer = 0.3 + Math.random() * 0.7;
      const ang = Math.random() * Math.PI * 2;
      const force = (maxSpeed * 0.6) * steering;
      ax = Math.cos(ang) * force;
      ay = Math.sin(ang) * force;
    }

    // integrate velocity with damping (inertia)
    vx = (vx + ax * dt) * damping;
    vy = (vy + ay * dt) * damping;

    // clamp speed
    const sp = Math.hypot(vx, vy);
    if (sp > maxSpeed) {
      vx = (vx / sp) * maxSpeed;
      vy = (vy / sp) * maxSpeed;
    }

    // integrate position
    x += vx * dt * speedScale;
    y += vy * dt * speedScale;

    // bounce off edges (keep bubble fully on-screen-ish)
    const rect = el.getBoundingClientRect();
    const radiusX = rect.width / 2;
    const radiusY = rect.height / 2;

    const minX = edgePadding + radiusX;
    const maxX = w() - edgePadding - radiusX;
    const minY = edgePadding + radiusY;
    const maxY = h() - edgePadding - radiusY;

    if (x < minX) { x = minX; vx *= -0.9; }
    if (x > maxX) { x = maxX; vx *= -0.9; }
    if (y < minY) { y = minY; vy *= -0.9; }
    if (y > maxY) { y = maxY; vy *= -0.9; }

    // place element by transform only (so layout stays stable)
    // We want transform relative to its original left/top.
    const dx = x - baseLeftPx;
    const dy = y - baseTopPx;

    el.style.transform = `translate(${dx}px, ${dy}px)`;

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

    neuronsConfig.forEach(cfg => {
      const neuron = createNeuron(cfg);
      layer.appendChild(neuron);

      floatNeuron(
        neuron,
        0.8 + Math.random(),      /* speedX */
        0.8 + Math.random(),      /* speedY */
        45 + Math.random() * 35,  /* ampX */
        45 + Math.random() * 35   /* ampY */
      );
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNeurons);
  } else {
    initNeurons();
  }
})();
