(() => {
  "use strict";

  // ── PARALLAX HERO ──────────────────────────────────────────────────────
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion) {
    const heroes = document.querySelectorAll(".hero");

    heroes.forEach((hero) => {
      hero.addEventListener("mousemove", (e) => {
        const { left, top, width, height } = hero.getBoundingClientRect();
        const x = Math.min(Math.max((e.clientX - left) / width, 0), 1);
        const y = Math.min(Math.max((e.clientY - top) / height, 0), 1);
        hero.style.setProperty("--hero-bg-x", `${50 + (x - 0.5) * 8}%`);
        hero.style.setProperty("--hero-bg-y", `${50 + (y - 0.5) * 8}%`);
      }, { passive: true });

      hero.addEventListener("mouseleave", () => {
        hero.style.setProperty("--hero-bg-x", "50%");
        hero.style.setProperty("--hero-bg-y", "50%");
      }, { passive: true });
    });
  }

  // ── MOBILE NAV TOGGLE ──────────────────────────────────────────────────
  const mobileToggle = document.querySelector(".mobile-nav-toggle");
  const navList = document.querySelector(".site-subnav__list");

  if (mobileToggle && navList) {
    mobileToggle.addEventListener("click", () => {
      const isExpanded = navList.classList.toggle("active");
      mobileToggle.setAttribute("aria-expanded", isExpanded);
    });
  }

  // ── MOBILE DROPDOWN ───────────────────────────────────────────────────
  const dropdown = document.querySelector(".dropdown");
  const dropdownToggle = document.querySelector(".dropdown-toggle");

  if (dropdown && dropdownToggle) {
    const handleDropdownToggle = (e) => {
      e.preventDefault();
      const isExpanded = dropdown.classList.toggle("active");
      dropdownToggle.setAttribute("aria-expanded", isExpanded);
    };

    // Use a resize observer so it responds if the window is resized
    const observer = new ResizeObserver(() => {
      if (window.innerWidth < 992) {
        dropdownToggle.addEventListener("click", handleDropdownToggle);
      } else {
        dropdownToggle.removeEventListener("click", handleDropdownToggle);
        dropdown.classList.remove("active");
        dropdownToggle.setAttribute("aria-expanded", "false");
      }
    });

    observer.observe(document.body);
  }

})();