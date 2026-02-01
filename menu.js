(() => {
  const btn = document.getElementById("menuBtn");
  const panel = document.getElementById("menuPanel");
  const overlay = document.getElementById("menuOverlay");
  const close = document.getElementById("menuClose");

  if (!btn || !panel || !overlay || !close) return;

  function openMenu(){
    panel.classList.add("open");
    overlay.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
  }

  function closeMenu(){
    panel.classList.remove("open");
    overlay.hidden = true;
    panel.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", openMenu);
  close.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();