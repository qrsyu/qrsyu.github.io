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

  // Email links: the mailto: link still opens the visitor's mail app if they
  // have one. Many people have none set up (e.g. they use Gmail in the
  // browser), so we also copy the address and show a short message.
  panel.querySelectorAll('a[href^="mailto:"]').forEach((link) => {
    link.addEventListener("click", () => {
      const address = link.getAttribute("href").slice("mailto:".length).split("?")[0];
      copyText(address).then(
        () => showToast("Email address copied: " + address),
        () => showToast(address)  // copy not allowed: at least show the address
      );
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  return true;
}

// Copy text to the clipboard. Uses the modern API when available
// (https / localhost), otherwise an older method that also works offline.
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    area.remove();
    ok ? resolve() : reject();
  });
}

// Small message at the bottom of the screen that fades out by itself.
function showToast(message) {
  let toast = document.getElementById("site-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "site-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3000);
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
