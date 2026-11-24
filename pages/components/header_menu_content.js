/*
  Shared header + slide-in menu for every subpage.
  The HTML is written here directly (not fetched from another file),
  so the header also shows when a page is opened straight from disk.
  All subpages live two folders deep (pages/<name>/), so links start with ../../
*/
(function () {
  const mount = document.getElementById("site-header");
  if (!mount) return;

  mount.innerHTML = `
    <!-- Site header with navigation -->
    <header class="site-header">
      <div class="nav-left">
        <a href="../../index.html" class="name-tag">Qiaorong Shannon Yu</a>
      </div>

      <button class="nav-menu" id="menuBtn" aria-expanded="false" aria-controls="menuPanel">
        MENU <span class="burger">☰</span>
      </button>
    </header>

    <!-- Slide-in menu panel -->
    <div class="menu-overlay" id="menuOverlay" hidden></div>

    <aside class="menu-panel" id="menuPanel" aria-hidden="true">
      <button class="menu-close" id="menuClose" aria-label="Close menu">×</button>

      <nav class="menu-links">
        <a href="../../index.html">Home</a>
        <a href="../../pages/research_page/index.html">Research</a>
        <!-- <a href="../../pages/teach_page/index.html">Teaching</a> -->
        <a href="../../pages/art_page/index.html">Visuals</a>
        <!-- <a href="../../pages/perform_page/index.html">Performance</a> -->

        <hr/>

        <a href="https://qrsyu.github.io/dict/files/qyu_cv.pdf"><i class="fas fa-file-alt"></i> CV</a>
        <a href="mailto:s.yu@nyu.edu"><i class="fas fa-envelope"></i> Email</a>
        <a href="https://github.com/qrsyu"><i class="fab fa-github"></i> Github</a>
        <a href="https://scholar.google.com/citations?user=2EaykxYAAAAJ&hl=en&oi=ao"><i class="fab fa-google"></i> Scholar</a>
        <a href="https://orcid.org/0009-0008-3761-3931" target="_blank" rel="noopener"><i class="fab fa-orcid"></i> ORCID</a>
        <a href="https://www.linkedin.com/in/qrsyu27315"><i class="fab fa-linkedin"></i> LinkedIn</a>
        <p><i class="fas fa-map-marker-alt"></i> New York, USA</p>
      </nav>
    </aside>
  `;

  // menu.js is loaded right after this script; it binds the button.
  // If it was already loaded, bind now.
  if (typeof window.initMenu === "function") window.initMenu();
})();
