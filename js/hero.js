```javascript
(() => {
  "use strict";

  // ── UTILITIES ──────────────────────────────────────────────────────────
  const reduceMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  const isTouchDevice = () =>
    window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  // ── AUTO ADD SEO / SOCIAL SHARE / FAVICON ────────────────────────────
  // Uses the hero image as:
  // 1. Social share thumbnail
  // 2. Browser favicon
  (() => {

    const heroImage =
      document.querySelector("#heroImg")?.getAttribute("src") ||
      "assets/yusuf.jpeg";

    const pageTitle =
      document.title || "Yusuf Akinpelu — Storyteller";

    const pageDescription =
      document.querySelector('meta[name="description"]')?.content ||
      "I find stories from places no one wants to go, tell stories no one wants to tell, and give life to data.";

    const addMeta = (attr, name, content) => {
      let tag = document.head.querySelector(`meta[${attr}="${name}"]`);

      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }

      tag.setAttribute("content", content);
    };

    // Standard description
    addMeta("name", "description", pageDescription);

    // Open Graph
    addMeta("property", "og:title", pageTitle);
    addMeta("property", "og:description", pageDescription);
    addMeta("property", "og:type", "website");
    addMeta("property", "og:image", heroImage);
    addMeta("property", "og:image:alt", "Yusuf Akinpelu");

    // Twitter Card
    addMeta("name", "twitter:card", "summary_large_image");
    addMeta("name", "twitter:title", pageTitle);
    addMeta("name", "twitter:description", pageDescription);
    addMeta("name", "twitter:image", heroImage);

    // Favicon
    let favicon =
      document.querySelector('link[rel="icon"]');

    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }

    favicon.type = "image/jpeg";
    favicon.href = heroImage;

    // Apple touch icon
    let appleIcon =
      document.querySelector('link[rel="apple-touch-icon"]');

    if (!appleIcon) {
      appleIcon = document.createElement("link");
      appleIcon.rel = "apple-touch-icon";
      document.head.appendChild(appleIcon);
    }

    appleIcon.href = heroImage;

  })();

  // ── PARALLAX HERO ──────────────────────────────────────────────────────
  // Mouse parallax on desktop; gyroscope tilt on mobile (if permitted)
  const heroes = document.querySelectorAll(".hero");

  if (!reduceMotion && heroes.length) {

    // Desktop: mouse-move parallax
    heroes.forEach((hero) => {
      hero.addEventListener("mousemove", (e) => {
        if (isTouchDevice()) return;

        const { left, top, width, height } =
          hero.getBoundingClientRect();

        const x =
          Math.min(Math.max((e.clientX - left) / width, 0), 1);

        const y =
          Math.min(Math.max((e.clientY - top) / height, 0), 1);

        hero.style.setProperty(
          "--hero-bg-x",
          `${50 + (x - 0.5) * 8}%`
        );

        hero.style.setProperty(
          "--hero-bg-y",
          `${50 + (y - 0.5) * 8}%`
        );

      }, { passive: true });

      hero.addEventListener("mouseleave", () => {

        hero.style.setProperty("--hero-bg-x", "50%");
        hero.style.setProperty("--hero-bg-y", "50%");

      }, { passive: true });
    });

    // Mobile: subtle gyroscope tilt
    if (
      isTouchDevice() &&
      typeof DeviceOrientationEvent !== "undefined"
    ) {

      const requestGyro = () => {

        if (
          typeof DeviceOrientationEvent.requestPermission ===
          "function"
        ) {

          DeviceOrientationEvent.requestPermission()
            .then((state) => {

              if (state === "granted") {
                attachGyro();
              }

            })
            .catch(() => {});

        } else {

          attachGyro();

        }
      };

      const attachGyro = () => {

        window.addEventListener(
          "deviceorientation",
          (e) => {

            const x =
              Math.min(
                Math.max((e.gamma ?? 0) / 45, -1),
                1
              );

            const y =
              Math.min(
                Math.max((e.beta ?? 0) / 90, -1),
                1
              );

            heroes.forEach((hero) => {

              hero.style.setProperty(
                "--hero-bg-x",
                `${50 + x * 4}%`
              );

              hero.style.setProperty(
                "--hero-bg-y",
                `${50 + y * 4}%`
              );

            });

          },
          { passive: true }
        );
      };

      document.addEventListener(
        "touchstart",
        requestGyro,
        {
          once: true,
          passive: true
        }
      );
    }
  }

  // ── MOBILE NAV TOGGLE ──────────────────────────────────────────────────
  const mobileToggle =
    document.querySelector(".mobile-nav-toggle");

  const navList =
    document.querySelector(".site-subnav__list");

  if (mobileToggle && navList) {

    const openNav = () => {

      navList.classList.add("active");

      mobileToggle.setAttribute(
        "aria-expanded",
        "true"
      );

      mobileToggle.setAttribute(
        "aria-label",
        "Close navigation"
      );

      document.body.style.overflow = "hidden";
    };

    const closeNav = () => {

      navList.classList.remove("active");

      mobileToggle.setAttribute(
        "aria-expanded",
        "false"
      );

      mobileToggle.setAttribute(
        "aria-label",
        "Open navigation"
      );

      document.body.style.overflow = "";
    };

    const isNavOpen = () =>
      navList.classList.contains("active");

    mobileToggle.addEventListener("click", () => {

      isNavOpen()
        ? closeNav()
        : openNav();

    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {

      if (
        e.key === "Escape" &&
        isNavOpen()
      ) {

        closeNav();
        mobileToggle.focus();

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

    // Close nav on desktop resize
    window.addEventListener(
      "resize",
      () => {

        if (
          window.innerWidth >= 992 &&
          isNavOpen()
        ) {

          closeNav();

        }
      },
      { passive: true }
    );
  }

  // ── MOBILE DROPDOWN ───────────────────────────────────────────────────
  const dropdowns = document.querySelectorAll(
    ".nav-links li.dropdown, .dropdown:not(li)"
  );

  dropdowns.forEach((dropdown) => {

    const toggle =
      dropdown.querySelector(".dropdown-toggle");

    if (!toggle) return;

    const menu =
      dropdown.querySelector(".dropdown-menu");

    const isOpen = () =>
      dropdown.classList.contains("active");

    const openDropdown = () => {

      dropdown.classList.add("active");

      toggle.setAttribute(
        "aria-expanded",
        "true"
      );

      if (menu) {
        menu.style.maxHeight =
          menu.scrollHeight + "px";
      }
    };

    const closeDropdown = () => {

      dropdown.classList.remove("active");

      toggle.setAttribute(
        "aria-expanded",
        "false"
      );

      if (menu) {
        menu.style.maxHeight = "0";
      }
    };

    toggle.addEventListener("click", (e) => {

      if (window.innerWidth < 992) {

        e.preventDefault();

        isOpen()
          ? closeDropdown()
          : openDropdown();

      }
    });

    // Close on Escape
    dropdown.addEventListener("keydown", (e) => {

      if (
        e.key === "Escape" &&
        isOpen()
      ) {

        closeDropdown();
        toggle.focus();

      }
    });

    // Close when clicking outside
    document.addEventListener("click", (e) => {

      if (
        isOpen() &&
        !dropdown.contains(e.target)
      ) {

        closeDropdown();

      }
    });

    // Reset on resize
    window.addEventListener(
      "resize",
      () => {

        if (window.innerWidth >= 992) {

          closeDropdown();

          if (menu) {
            menu.style.maxHeight = "";
          }
        }
      },
      { passive: true }
    );
  });

  // ── SMOOTH SCROLL ─────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {

    anchor.addEventListener("click", (e) => {

      const id =
        anchor.getAttribute("href").slice(1);

      const target =
        document.getElementById(id);

      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: reduceMotion
          ? "auto"
          : "smooth",
        block: "start"
      });

      history.pushState(
        null,
        "",
        `#${id}`
      );
    });
  });

  // ── SCROLL RESTORE ────────────────────────────────────────────────────
  if (
    window.location.pathname.endsWith("index.html") ||
    window.location.pathname === "/"
  ) {

    const saved =
      sessionStorage.getItem("home_scroll");

    if (saved !== null) {

      requestAnimationFrame(() => {

        window.scrollTo({
          top: parseInt(saved, 10),
          behavior: "instant"
        });

        sessionStorage.removeItem("home_scroll");

      });
    }

    document.addEventListener("click", (e) => {

      const a = e.target.closest("a");

      if (!a) return;

      const href =
        a.getAttribute("href") || "";

      const isInternal =
        href &&
        !href.startsWith("#") &&
        !href.startsWith("http") &&
        !href.startsWith("//") &&
        !href.startsWith("mailto");

      if (isInternal) {

        sessionStorage.setItem(
          "home_scroll",
          String(window.scrollY)
        );

      }
    });
  }

  // ── ACTIVE NAV LINK ───────────────────────────────────────────────────
  const currentPath =
    window.location.pathname.split("/").pop() ||
    "index.html";

  document
    .querySelectorAll(
      ".nav-links a, .site-subnav__link"
    )
    .forEach((link) => {

      const linkPath =
        (link.getAttribute("href") || "")
          .split("/")
          .pop()
          .split("#")[0];

      if (
        linkPath &&
        linkPath === currentPath
      ) {

        link.setAttribute(
          "aria-current",
          "page"
        );

        link.style.opacity = "1";

        link.style.borderBottom =
          "2px solid var(--accent, #5a3935)";
      }
    });

})();
```