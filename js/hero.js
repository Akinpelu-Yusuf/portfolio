(() => {
  "use strict";

  /* ==========================================================
     UTILITIES
  ========================================================== */

  const reduceMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)")
      ?.matches ?? false;

  const isTouchDevice = () =>
    window.matchMedia &&
    window.matchMedia("(hover:none) and (pointer:coarse)").matches;


  /* ==========================================================
     SEO / SOCIAL / FAVICON FALLBACK
     
     NOTE:
     Real OG tags should exist in HTML <head>.
  ========================================================== */

  (() => {

    const heroImage =
      document.querySelector("#heroImg")
        ?.getAttribute("src")
      || "assets/yusuf.jpeg";


    const title =
      document.title ||
      "Yusuf Akinpelu — Storyteller";


    const description =
      document.querySelector(
        'meta[name="description"]'
      )?.content ||
      "I find stories from places no one wants to go, tell stories no one wants to tell, and give life to data.";


    function addMeta(attribute, name, content){

      let tag =
        document.head.querySelector(
          `meta[${attribute}="${name}"]`
        );


      if(!tag){

        tag =
          document.createElement("meta");

        tag.setAttribute(
          attribute,
          name
        );

        document.head.appendChild(tag);
      }


      tag.setAttribute(
        "content",
        content
      );

    }



    addMeta(
      "name",
      "description",
      description
    );


    addMeta(
      "property",
      "og:title",
      title
    );


    addMeta(
      "property",
      "og:description",
      description
    );


    addMeta(
      "property",
      "og:type",
      "website"
    );


    addMeta(
      "property",
      "og:image",
      heroImage
    );


    addMeta(
      "property",
      "og:image:alt",
      "Yusuf Akinpelu"
    );



    addMeta(
      "name",
      "twitter:card",
      "summary_large_image"
    );


    addMeta(
      "name",
      "twitter:title",
      title
    );


    addMeta(
      "name",
      "twitter:description",
      description
    );


    addMeta(
      "name",
      "twitter:image",
      heroImage
    );



    // Favicon fallback

    let favicon =
      document.querySelector(
        'link[rel="icon"]'
      );


    if(!favicon){

      favicon =
        document.createElement("link");

      favicon.rel = "icon";

      document.head.appendChild(
        favicon
      );

    }


    favicon.type =
      "image/png";

    favicon.href =
      "assets/favicon.png";



    // Apple icon

    let appleIcon =
      document.querySelector(
        'link[rel="apple-touch-icon"]'
      );


    if(!appleIcon){

      appleIcon =
        document.createElement("link");

      appleIcon.rel =
        "apple-touch-icon";

      document.head.appendChild(
        appleIcon
      );

    }


    appleIcon.href =
      "assets/favicon.png";


  })();



  /* ==========================================================
     HERO PARALLAX
  ========================================================== */


  const heroes =
    document.querySelectorAll(
      ".hero"
    );


  if(
    !reduceMotion &&
    heroes.length
  ){


    heroes.forEach(hero => {


      hero.addEventListener(
        "mousemove",
        e => {


          if(isTouchDevice())
            return;



          const rect =
            hero.getBoundingClientRect();



          const x =
            (
              (e.clientX - rect.left)
              /
              rect.width
            );


          const y =
            (
              (e.clientY - rect.top)
              /
              rect.height
            );



          hero.style.setProperty(
            "--hero-bg-x",
            `${50 + (x-.5)*8}%`
          );


          hero.style.setProperty(
            "--hero-bg-y",
            `${50 + (y-.5)*8}%`
          );


        },
        {
          passive:true
        }
      );



      hero.addEventListener(
        "mouseleave",
        ()=>{

          hero.style.setProperty(
            "--hero-bg-x",
            "50%"
          );


          hero.style.setProperty(
            "--hero-bg-y",
            "50%"
          );

        }
      );


    });



    // Mobile gyroscope

    if(
      isTouchDevice() &&
      typeof DeviceOrientationEvent !== "undefined"
    ){


      const attachGyro = ()=>{


        window.addEventListener(
          "deviceorientation",
          e=>{


            const x =
              Math.min(
                Math.max(
                  (e.gamma || 0)/45,
                  -1
                ),
                1
              );


            const y =
              Math.min(
                Math.max(
                  (e.beta || 0)/90,
                  -1
                ),
                1
              );



            heroes.forEach(hero=>{


              hero.style.setProperty(
                "--hero-bg-x",
                `${50+x*4}%`
              );


              hero.style.setProperty(
                "--hero-bg-y",
                `${50+y*4}%`
              );


            });


          },
          {
            passive:true
          }
        );

      };



      const requestGyro = ()=>{


        if(
          typeof DeviceOrientationEvent.requestPermission ===
          "function"
        ){


          DeviceOrientationEvent
            .requestPermission()
            .then(permission=>{

              if(
                permission==="granted"
              ){

                attachGyro();

              }

            })
            .catch(()=>{});


        } else {

          attachGyro();

        }

      };



      document.addEventListener(
        "click",
        requestGyro,
        {
          once:true
        }
      );


    }

  }
  /* ==========================================================
     MOBILE NAVIGATION
  ========================================================== */


  const mobileToggle =
    document.querySelector(
      ".mobile-nav-toggle"
    );


  const navList =
    document.querySelector(
      ".site-subnav__list"
    );



  if(
    mobileToggle &&
    navList
  ){


    const openNav = ()=>{


      navList.classList.add(
        "active"
      );


      mobileToggle.setAttribute(
        "aria-expanded",
        "true"
      );


      mobileToggle.setAttribute(
        "aria-label",
        "Close navigation"
      );


      document.body.style.overflow =
        "hidden";

    };



    const closeNav = ()=>{


      navList.classList.remove(
        "active"
      );


      mobileToggle.setAttribute(
        "aria-expanded",
        "false"
      );


      mobileToggle.setAttribute(
        "aria-label",
        "Open navigation"
      );


      document.body.style.overflow =
        "";

    };



    const navIsOpen = ()=>{

      return navList.classList.contains(
        "active"
      );

    };



    mobileToggle.addEventListener(
      "click",
      e=>{

        e.stopPropagation();


        navIsOpen()
          ?
          closeNav()
          :
          openNav();

      }
    );



    document.addEventListener(
      "keydown",
      e=>{


        if(
          e.key==="Escape" &&
          navIsOpen()
        ){

          closeNav();

          mobileToggle.focus();

        }

      }
    );



    document.addEventListener(
      "click",
      e=>{


        if(
          navIsOpen() &&
          !navList.contains(e.target) &&
          !mobileToggle.contains(e.target)
        ){

          closeNav();

        }

      }
    );



  }




  /* ==========================================================
     MOBILE DROPDOWNS
  ========================================================== */


  const dropdowns =
    document.querySelectorAll(
      ".site-subnav__list .dropdown, .nav-links .dropdown"
    );



  dropdowns.forEach(dropdown=>{


    const toggle =
      dropdown.querySelector(
        ".dropdown-toggle"
      );


    const menu =
      dropdown.querySelector(
        ".dropdown-menu"
      );



    if(!toggle)
      return;



    toggle.setAttribute(
      "aria-expanded",
      "false"
    );



    const openDropdown = ()=>{


      dropdown.classList.add(
        "active"
      );


      toggle.setAttribute(
        "aria-expanded",
        "true"
      );



      if(menu){

        menu.style.maxHeight =
          menu.scrollHeight + "px";

      }

    };



    const closeDropdown = ()=>{


      dropdown.classList.remove(
        "active"
      );


      toggle.setAttribute(
        "aria-expanded",
        "false"
      );



      if(menu){

        menu.style.maxHeight =
          "0";

      }

    };



    toggle.addEventListener(
      "click",
      e=>{


        if(
          window.innerWidth < 992
        ){

          e.preventDefault();

          e.stopPropagation();



          dropdown.classList.contains(
            "active"
          )
            ?
            closeDropdown()
            :
            openDropdown();

        }


      }
    );



    document.addEventListener(
      "click",
      e=>{


        if(
          dropdown.classList.contains(
            "active"
          ) &&
          !dropdown.contains(e.target)
        ){

          closeDropdown();

        }

      }
    );



    dropdown.addEventListener(
      "keydown",
      e=>{


        if(
          e.key==="Escape" &&
          dropdown.classList.contains(
            "active"
          )
        ){

          closeDropdown();

          toggle.focus();

        }


      }
    );


  });






  /* ==========================================================
     SMOOTH SCROLL
  ========================================================== */


  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(anchor=>{


      anchor.addEventListener(
        "click",
        e=>{


          const id =
            anchor
            .getAttribute("href")
            .slice(1);



          if(!id)
            return;



          const target =
            document.getElementById(
              id
            );



          if(!target)
            return;



          e.preventDefault();



          target.scrollIntoView({

            behavior:
              reduceMotion
              ?
              "auto"
              :
              "smooth",

            block:"start"

          });



          history.replaceState(
            null,
            "",
            `#${id}`
          );


        }
      );


    });






  /* ==========================================================
     RESTORE HOME SCROLL POSITION
  ========================================================== */


  const isHomePage =
    window.location.pathname === "/" ||
    window.location.pathname.endsWith(
      "index.html"
    );



  if(isHomePage){


    const savedPosition =
      sessionStorage.getItem(
        "home_scroll"
      );



    if(savedPosition){


      requestAnimationFrame(()=>{


        window.scrollTo(
          0,
          Number(savedPosition)
        );


        sessionStorage.removeItem(
          "home_scroll"
        );


      });


    }




    document.addEventListener(
      "click",
      e=>{


        const link =
          e.target.closest(
            "a"
          );



        if(!link)
          return;



        const href =
          link.getAttribute(
            "href"
          )
          ||
          "";



        const internalLink =
          href &&
          !href.startsWith("#") &&
          !href.startsWith("http") &&
          !href.startsWith("//") &&
          !href.startsWith("mailto:");



        if(internalLink){


          sessionStorage.setItem(
            "home_scroll",
            String(
              window.scrollY
            )
          );


        }


      }
    );


  }





  /* ==========================================================
     ACTIVE NAV LINK
  ========================================================== */


  const currentPath =
    window.location.pathname
      .split("/")
      .pop()
      ||
      "index.html";



  document
    .querySelectorAll(
      ".nav-links a, .site-subnav__link"
    )
    .forEach(link=>{


      const href =
        link
        .getAttribute("href")
        ||
        "";



      const linkPath =
        href
        .split("/")
        .pop()
        .split("#")[0];



      if(
        linkPath &&
        linkPath===currentPath
      ){


        link.setAttribute(
          "aria-current",
          "page"
        );



        link.style.opacity =
          "1";



        link.style.borderBottom =
          "2px solid var(--accent, #5a3935)";


      }


    });






  /* ==========================================================
     RESIZE CLEANUP
  ========================================================== */


  let resizeTimer;


  window.addEventListener(
    "resize",
    ()=>{


      clearTimeout(
        resizeTimer
      );



      resizeTimer =
        setTimeout(()=>{


          if(
            window.innerWidth >= 992
          ){


            document
              .querySelectorAll(
                ".dropdown.active"
              )
              .forEach(item=>{


                item.classList.remove(
                  "active"
                );


                const menu =
                  item.querySelector(
                    ".dropdown-menu"
                  );


                if(menu){

                  menu.style.maxHeight =
                    "";

                }


              });


          }


        },200);


    }
  );



})();