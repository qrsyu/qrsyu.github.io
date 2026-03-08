function bindMenu() {
  const btn = document.getElementById("menuBtn");
  const panel = document.getElementById("menuPanel");
  const overlay = document.getElementById("menuOverlay");
  const close = document.getElementById("menuClose");

  if (!btn || !panel || !overlay || !close) return false;

  // 防重复绑定
  if (btn.dataset.bound === "1") return true;
  btn.dataset.bound = "1";

  function openMenu() {
    panel.classList.add("open");
    overlay.hidden = false;
    panel.setAttribute("aria-hidden", "false");
    btn.setAttribute("aria-expanded", "true");
    document.body.classList.add("menu-open");
  }

  function closeMenu() {
    panel.classList.remove("open");
    overlay.hidden = true;
    panel.setAttribute("aria-hidden", "true");
    btn.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-open");
  }

  btn.addEventListener("click", openMenu);
  close.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  return true;
}

// 1) 给“注入式页面”用：注入完成后会调用 window.initMenu()
window.initMenu = function initMenu() {
  bindMenu();
};

// 2) 给“主页这种静态 header”用：脚本加载后直接尝试绑定一次
// 如果 DOM 还没准备好，就等 DOMContentLoaded 再绑
if (!bindMenu()) {
  document.addEventListener("DOMContentLoaded", bindMenu, { once: true });
}
