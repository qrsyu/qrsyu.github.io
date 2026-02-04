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
      label: "Digital Art",
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

    const top = `${rand(10, 85)}%`;
    const left = `${rand(10, 85)}%`;

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
  function floatNeuron(el, container) {
    const bounds = () => container.getBoundingClientRect();

    let x = el.offsetLeft;
    let y = el.offsetTop;

    let vx = 0;
    let vy = 0;

    const noise = 0.2;     // 随机强度（越大越活跃）
    const smooth = 0.95;    // 平滑程度（越接近1越“飘”）
    const maxSpeed = 100;    // 防止突然窜
    const speedScale = 7; 
    const edgePad = 40;

    function tick() {
      // Brownian velocity update
      vx = vx * smooth + (Math.random() - 0.5) * noise;
      vy = vy * smooth + (Math.random() - 0.5) * noise;

      // clamp speed
      vx = Math.max(-maxSpeed, Math.min(maxSpeed, vx));
      vy = Math.max(-maxSpeed, Math.min(maxSpeed, vy));

      x += vx * speedScale;
      y += vy * speedScale;

      const { width, height } = bounds();
      const r = el.getBoundingClientRect();
      const rx = r.width / 2;
      const ry = r.height / 2;

      // soft boundary clamp
      x = Math.max(edgePad + rx, Math.min(width  - edgePad - rx, x));
      y = Math.max(edgePad + ry, Math.min(height - edgePad - ry, y));

      el.style.transform = `translate(${x - el.offsetLeft}px, ${y - el.offsetTop}px)`;

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

    neuronsConfig.forEach(cfg => {
      const neuron = createNeuron(cfg);
      layer.appendChild(neuron);
      floatNeuron(neuron, section);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNeurons);
  } else {
    initNeurons();
  }
})();
