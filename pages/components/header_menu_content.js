(async function () {
  const mount = document.getElementById("site-header");
  if (!mount) return;

  const res = await fetch("../../pages/components/header_menu_content.html");
  if (!res.ok) {
    console.error("Failed to load header:", res.status, res.statusText);
    return;
  }

  mount.innerHTML = await res.text();

  function initMenuWhenReady(retries = 60) {
    if (typeof window.initMenu === "function") {
      window.initMenu();
      return;
    }
    if (retries <= 0) {
      console.warn("initMenu not found (menu.js not loaded?)");
      return;
    }
    setTimeout(() => initMenuWhenReady(retries - 1), 50);
  }

  initMenuWhenReady();
})();
