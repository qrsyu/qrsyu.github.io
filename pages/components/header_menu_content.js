(async function () {
  const mount = document.getElementById("site-header");
  if (!mount) return;

  const res = await fetch("../../pages/components/header_menu_content.html");
  if (!res.ok) {
    console.error("Failed to load header:", res.status, res.statusText);
    return;
  }

  mount.innerHTML = await res.text();

  if (typeof window.initMenu !== "function") {
    await new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "../../menu.js"; 
      s.onload = resolve;
      s.onerror = () => reject(new Error("Failed to load menu.js"));
      document.head.appendChild(s);
    });
  }

  if (typeof window.initMenu === "function") window.initMenu();
  else console.error("initMenu still missing after loading menu.js");
})();