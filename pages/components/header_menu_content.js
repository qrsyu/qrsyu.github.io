(async function () {
  const mount = document.getElementById("site-header");
  if (!mount) return;

  const res = await fetch("../../pages/components/header_menu_content.html");
  if (!res.ok) {
    console.error("Failed to load header:", res.status, res.statusText);
    return;
  }

  mount.innerHTML = await res.text();

  if (typeof window.initMenu === "function") window.initMenu();
})();
