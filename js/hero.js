(() => {
  "use strict";

  // ── UTILITIES ──────────────────────────────────────────────────────────
  const reduceMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  const isTouchDevice = () =>
    window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  // ── PARALLAX HERO ──────────────────────────────────────────────────────
  // Mouse parallax on desktop; gyroscope tilt on mobile (if permitted)
  const heroes = document.querySelectorAll(".hero");

  if (!reduceMotion && heroes.length) {

    // Desktop: mouse-move parallax
    heroes.forEach((hero) => {
      hero.addEventListener("mousemove", (e) => {
        if (isTouchDevice()) return; // skip on touch screens
        const { left, top, width, height } = hero.getBoundingClientRect();
        const x = Math.min(Math.max((e.clientX - left) / width,  0), 1);
        const y = Math.min(Math.max((e.clientY - top)  / height, 0), 1);
        hero.style.setProperty("--hero-bg-x", `${50 + (x - 0.5) * 8}%`);
        hero.style.setProperty("--hero-bg-y", `${50 + (y - 0.5) * 8}%`);
      }, { passive: true });

      hero.addEventListener("mouseleave", () => {
        hero.style.setProperty("--hero-bg-x", "50%");
        hero.style.setProperty("--hero-bg-y", "50%");
      }, { passive: true });
    });

    // Mobile: subtle gyroscope tilt (requests permission on iOS 13+)
    if (isTouchDevice() && typeof DeviceOrientationEvent !== "undefined") {
      const requestGyro = () => {
        // iOS 13+ requires explicit permission
        if (typeof DeviceOrientationEvent.requestPermission === "function") {
          DeviceOrientationEvent.requestPermission()
            .then((state) => {
              if (state === "granted") attachGyro();
            })
            .catch(() => {}); // permission denied or unavailable — silent fail
        } else {
          // Android / older iOS — no permission needed
          attachGyro();
        }
      };

      const attachGyro = () => {
        window.addEventListener("deviceorientation", (e) => {
          // gamma: left/right tilt (-90 to 90), beta: front/back tilt (-180 to 180)
          const x = Math.min(Math.max((e.gamma ?? 0) / 45, -1), 1); // normalise to [-1, 1]
          const y = Math.min(Math.max((e.beta  ?? 0) / 90, -1), 1);
          heroes.forEach((hero) => {
            hero.style.setProperty("--hero-bg-x", `${50 + x * 4}%`);
            hero.style.setProperty("--hero-bg-y", `${50 + y * 4}%`);
          });
        }, { passive: true });
      };

      // Trigger permission on first meaningful touch (avoids autoplay-policy issues)
      document.addEventListener("touchstart", requestGyro, { once: true, passive: true });
    }
  }

  // ── MOBILE NAV TOGGLE ──────────────────────────────────────────────────
  const mobileToggle = document.querySelector(".mobile-nav-toggle");
  const navList      = document.querySelector(".site-subnav__list");

  if (mobileToggle && navList) {
    const openNav = () => {
      navList.classList.add("active");
      mobileToggle.setAttribute("aria-expanded", "true");
      mobileToggle.setAttribute("aria-label", "Close navigation");
      document.body.style.overflow = "hidden"; // prevent background scroll
    };

    const closeNav = () => {
      navList.classList.remove("active");
      mobileToggle.setAttribute("aria-expanded", "false");
      mobileToggle.setAttribute("aria-label", "Open navigation");
      document.body.style.overflow = "";
    };

    const isNavOpen = () => navList.classList.contains("active");

    mobileToggle.addEventListener("click", () => {
      isNavOpen() ? closeNav() : openNav();
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isNavOpen()) {
        closeNav();
        mobileToggle.focus(); // return focus to toggle
      }
    });

    // Close when clicking outside the nav
    document.addEventListener("click", (e) => {
      if (
        isNavOpen() &&
        !navList.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        closeNav();
      }
    });

    // Close nav if the viewport is resized to desktop width
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992 && isNavOpen()) closeNav();
    }, { passive: true });
  }

  // ── MOBILE DROPDOWN (BBC sub-menu etc.) ───────────────────────────────
  const dropdowns = document.querySelectorAll(".nav-links li.dropdown, .dropdown:not(li)");

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    if (!toggle) return;

    const menu       = dropdown.querySelector(".dropdown-menu");
    const isOpen     = () => dropdown.classList.contains("active");

    const openDropdown = () => {
      dropdown.classList.add("active");
      toggle.setAttribute("aria-expanded", "true");
      // Animate max-height for smooth open on mobile
      if (menu) {
        menu.style.maxHeight = menu.scrollHeight + "px";
      }
    };

    const closeDropdown = () => {
      dropdown.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      if (menu) menu.style.maxHeight = "0";
    };

    // Mobile: tap to toggle; Desktop: CSS :hover handles it
    toggle.addEventListener("click", (e) => {
      if (window.innerWidth < 992) {
        e.preventDefault();
        isOpen() ? closeDropdown() : openDropdown();
      }
    });

    // Close on Escape
    dropdown.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen()) {
        closeDropdown();
        toggle.focus();
      }
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {
      if (isOpen() && !dropdown.contains(e.target)) {
        closeDropdown();
      }
    });

    // Reset on resize to desktop
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992) {
        closeDropdown();
        if (menu) menu.style.maxHeight = ""; // let CSS take over
      }
    }, { passive: true });
  });

  // ── SMOOTH SCROLL for anchor links ────────────────────────────────────
  // Handles cases where CSS scroll-behavior isn't enough (e.g. hash links
  // from other pages like bbc.html#tv)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      // Update URL without jumping
      history.pushState(null, "", `#${id}`);
    });
  });

  // ── SCROLL RESTORE (index.html) ───────────────────────────────────────
  // Saves scroll position before navigating away; restores on return
  if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
    const saved = sessionStorage.getItem("home_scroll");
    if (saved !== null) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: parseInt(saved, 10), behavior: "instant" });
        sessionStorage.removeItem("home_scroll");
      });
    }

    document.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const isInternal =
        href &&
        !href.startsWith("#") &&
        !href.startsWith("http") &&
        !href.startsWith("//") &&
        !href.startsWith("mailto");
      if (isInternal) {
        sessionStorage.setItem("home_scroll", String(window.scrollY));
      }
    });
  }

  // ── ACTIVE NAV LINK ───────────────────────────────────────────────────
  // Highlights the current page in the nav
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .site-subnav__link").forEach((link) => {
    const linkPath = (link.getAttribute("href") || "").split("/").pop().split("#")[0];
    if (linkPath && linkPath === currentPath) {
      link.setAttribute("aria-current", "page");
      link.style.opacity = "1";
      link.style.borderBottom = "2px solid var(--accent, #5a3935)";
    }
  });

})();