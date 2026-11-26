(function () {
  "use strict";

  const body = document.body;

  // If an externally hosted cover is unavailable, keep the layout intact with a local visual.
  document.addEventListener("error", function (event) {
    const img = event.target;
    if (!img || img.tagName !== "IMG") return;
    if (img.dataset.localFallback === "true") return;
    img.dataset.localFallback = "true";
    const isNote = Boolean(img.closest(".project-item, .home-note"));
    img.src = isNote ? "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='750'%3E%3Crect width='1200' height='750' fill='%23fff8f7'/%3E%3Ccircle cx='940' cy='150' r='260' fill='%23ffd9e4'/%3E%3Ccircle cx='250' cy='650' r='320' fill='%23e4ecf8'/%3E%3Ccircle cx='620' cy='360' r='170' fill='%23ffeef2'/%3E%3C/svg%3E" : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='750'%3E%3Crect width='1200' height='750' fill='%23fff8f7'/%3E%3Ccircle cx='940' cy='150' r='260' fill='%23ffd9e4'/%3E%3Ccircle cx='250' cy='650' r='320' fill='%23e4ecf8'/%3E%3Ccircle cx='620' cy='360' r='170' fill='%23ffeef2'/%3E%3C/svg%3E";
  }, true);
  const overlay = document.querySelector("[data-menu]");
  const openers = Array.from(document.querySelectorAll("[data-menu-toggle]"));
  const closers = Array.from(document.querySelectorAll("[data-menu-close]"));
  let lastFocus = null;

  function setMenu(open) {
    if (!overlay) return;
    overlay.classList.toggle("is-open", open);
    overlay.setAttribute("aria-hidden", open ? "false" : "true");
    body.classList.toggle("menu-open", open);
    openers.forEach(function (btn) {
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    if (open) {
      lastFocus = document.activeElement;
      const closeBtn = overlay.querySelector(".menu-close");
      if (closeBtn) window.setTimeout(function () { closeBtn.focus(); }, 120);
    } else if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  openers.forEach(function (btn) {
    btn.addEventListener("click", function () { setMenu(true); });
  });
  closers.forEach(function (btn) {
    btn.addEventListener("click", function () { setMenu(false); });
  });
  if (overlay) {
    overlay.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
  }
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && overlay && overlay.classList.contains("is-open")) {
      setMenu(false);
    }
  });

  // Hero visual switcher: two portrait key visuals, matching the reference site.
  const hero = document.querySelector("[data-hero-root]");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll("[data-hero-slide]"));
    const buttons = Array.from(hero.querySelectorAll("[data-hero-btn]"));
    function selectHero(id) {
      slides.forEach(function (slide) {
        slide.classList.toggle("is-select", slide.dataset.heroSlide === id);
      });
      buttons.forEach(function (btn) {
        const active = btn.dataset.heroBtn === id;
        btn.classList.toggle("is-select", active);
        btn.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () { selectHero(btn.dataset.heroBtn); });
    });
  }

  // Reading progress.
  const progress = document.querySelector(".scroll-progress");
  let ticking = false;
  function updateProgress() {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
    progress.style.width = (ratio * 100).toFixed(3) + "%";
    ticking = false;
  }
  function requestProgress() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateProgress);
  }
  updateProgress();
  window.addEventListener("scroll", requestProgress, { passive: true });
  window.addEventListener("resize", requestProgress);

  // Close menu when resizing back to desktop.
  let resizeTimer = 0;
  window.addEventListener("resize", function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () {
      if (window.innerWidth > 900 && overlay && overlay.classList.contains("is-open")) {
        setMenu(false);
      }
    }, 180);
  });
})();
