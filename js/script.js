gsap.registerPlugin(MorphSVGPlugin);
gsap.registerPlugin(ScrollTrigger);

let buttonStaggerAnimation = () => {
  const buttons = document.querySelectorAll("[anm-stagger-btn=wrap]");

  buttons.forEach((button) => {
    const text = button.querySelector("[anm-stagger-btn=text]");
    const direction = button.getAttribute("anm-direction");
    const isReverse = button.getAttribute("anm-reverse");
    const stagger = button.getAttribute("anm-stagger") || 0.0055;
    const delay = button.getAttribute("anm-delay") || 0;
    const duration = button.getAttribute("anm-duration") || 1;
    const ease = button.getAttribute("anm-ease") || "elastic.out(1,0.33)";
    const custom = button.getAttribute("anm-custom") || "";

    const parseCustomAttribute = (attr) => {
      const props = {};
      if (attr) {
        attr.split(",").forEach((pair) => {
          const [key, value] = pair.split(":").map((item) => item.trim());
          if (key && value) {
            props[key] = value;
          }
        });
      }
      return props;
    };

    const transformValuesForToState = (element, props) => {
      const transformedValues = {};
      const computedStyles = window.getComputedStyle(element);
      for (const key in props) {
        let value = props[key];
        if (key === "opacity") {
          transformedValues[key] = "1";
        } else {
          transformedValues[key] = value.replace(/(\d+(\.\d+)?)/g, (match) => {
            const unitMatch = match.match(
              /(\d+(\.\d+)?)(px|rem|em|%|vh|vw|dvh|dvw|deg|rad|grad|turn|cvw|cvh)?/
            );
            return unitMatch ? `0${unitMatch[3] || ""}` : "0";
          });

          if (!/\d/.test(value)) {
            transformedValues[key] = computedStyles[key] || value;
          }
        }
      }
      return transformedValues;
    };

    const animationProps = parseCustomAttribute(custom);
    const toStateProps = transformValuesForToState(text, animationProps);

    const textClone = text.cloneNode(true);
    textClone.style.position = "absolute";
    textClone.style.fontWeight = "500";
    text.after(textClone);

    const textSplit = new SplitType(text, { types: "chars" });
    const clonedSplit = new SplitType(textClone, { types: "chars" });

    const timeline = gsap.timeline({
      defaults: {
        ease: ease,
        delay: delay,
        duration: duration,
        stagger: stagger,
      },
      paused: true,
    });

    if (direction === "up") {
      textClone.style.top = "100%";
      timeline
        .fromTo(
          textSplit.chars,
          { yPercent: 0, ...animationProps },
          { yPercent: -100, ...toStateProps }
        )
        .fromTo(
          clonedSplit.chars,
          { yPercent: 0, ...animationProps },
          { yPercent: -100, ...toStateProps },
          "<"
        );
    } else if (direction === "down") {
      textClone.style.top = "-100%";
      timeline
        .fromTo(
          textSplit.chars,
          { yPercent: 0, ...animationProps },
          { yPercent: 100, ...toStateProps }
        )
        .fromTo(
          clonedSplit.chars,
          { yPercent: 0, ...animationProps },
          { yPercent: 100, ...toStateProps },
          "<"
        );
    }

    button.addEventListener("mouseenter", () => {
      timeline.restart();
    });

    button.addEventListener("mouseleave", () => {
      if (isReverse === "true") {
        timeline.reverse();
      } else {
        return;
      }
    });
  });
};
buttonStaggerAnimation();

let morphSvgBtn = () => {
  const morphBtns = document.querySelectorAll(".morph-btn");

  morphBtns.forEach((btn) => {
    const shape = btn.querySelector("#morphBtnShape");
    const target = btn.querySelector("#morphBtnTarget");
    const originalPath = shape.getAttribute("data-original");

    if (!shape || !target) return;

    btn.addEventListener("mouseenter", () => {
      gsap.to(shape, {
        duration: 1.5,
        morphSVG: { shape: target, map: "complexity" },
        ease: "elastic.out(1,0.3)",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(shape, {
        duration: 1,
        morphSVG: { shape: originalPath, map: "complexity" },
        ease: "elastic.out(.1,0.3)",
        // ease: "slow(10.7,10.7,true)",
      });
    });
  });
};
morphSvgBtn();

let menuBtnConfig = () => {
  const menuBtn = document.querySelector(".menu-btn");
  const btnDef = document.querySelector("#menu-btn-default");
  const btnClose = document.querySelector("#menu-btn-close");
  const mediaNav = document.querySelector(".sm-media-nav");

  let isOpen = false;

  const navTimeline = gsap.timeline({ paused: true });

  navTimeline.fromTo(
    mediaNav,
    {
      height: "3.5rem",
      opacity: 1,
    },
    {
      height: "auto",
      opacity: 1,
      duration: 0.8,
      ease: "power2.inOut",
    }
  );

  navTimeline.from(
    ".media-nav-link",
    {
      y: 50,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.07,
    },
    "<"
  );

  menuBtn.addEventListener("click", () => {
    gsap.to(btnDef, {
      duration: 0.8,
      ease: "circ.inOut",
      morphSVG: {
        shape: isOpen ? btnDef.dataset.original : btnClose,
        shapeIndex: -9,
        type: "linear",
        map: "position",
      },
    });

    if (isOpen) {
      navTimeline.reverse();
    } else {
      navTimeline.play();
    }

    isOpen = !isOpen;
  });
};
menuBtnConfig();

let reeller = () => {
  document.addEventListener("DOMContentLoaded", () => {
    const rows = document.querySelectorAll(".cb-tagreel-row");

    rows.forEach((e, i) => {
      let row_width = e.getBoundingClientRect().width;
      let row_item_width = e.children[0].getBoundingClientRect().width;
      let initial_offset = ((2 * row_item_width) / row_width) * 100 * -1;

      gsap.set(e, {
        xPercent: initial_offset,
      });

      gsap.timeline().to(e, {
        ease: "none",
        duration: 8,
        xPercent: 0,
        repeat: -1,
      });
    });
  });
};
reeller();

let mfCursor = () => {
  const cursor = new MouseFollower();
  const vidWrapper = document.querySelector(".video-intro-wrapper");

  vidWrapper.addEventListener("mouseenter", () => {
    cursor.setSkewing(0.2);
  });

  vidWrapper.addEventListener("mouseleave", () => {
    cursor.removeSkewing();
  });

  if (window.innerWidth < 768) {
    cursor.destroy();
    console.log("media screen 768px");
  }
};
mfCursor();

let bentoCard = () => {
  let cards = document.querySelectorAll(".bento-card");

  cards.forEach((card) => {
    let cardVid = card.querySelector(".card-video");
    card.addEventListener("mouseenter", () => {
      cardVid.style.opacity = 1;
      cardVid.currentTime = 0;
      cardVid.play();
    });

    card.addEventListener("mouseleave", () => {
      cardVid.style.opacity = 0;
    });
  });
};
bentoCard();
const parallax__playground = () => {
  const lenis = new Lenis({
    lerp: 0.07,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  let parallaxCon = document.querySelectorAll(".parallax-container");
  parallaxCon.forEach((parallax) => {
    let parallaxItem = parallax.querySelector(".parallax-item");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: parallax,
        scrub: true,
        pin: false,
      },
    });

    tl.fromTo(
      parallaxItem,
      {
        yPercent: -20,
        ease: "none",
      },
      {
        yPercent: 20,
        ease: "none",
      }
    );
  });
};
parallax__playground();

let tabsNCards = () => {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const projectCards = document.querySelectorAll(".project-card");
  function showTab(tabName) {
    projectCards.forEach((card) => {
      const cardTab = card.getAttribute("data-tab-content");

      if (cardTab === tabName) {
        card.style.display = "flex";

        const video = card.querySelector("video");

        card.addEventListener("mouseenter", () => {
          if (video) {
            video.currentTime = 0;
            video.play();
          }
        });

        card.addEventListener("mouseleave", () => {
          if (video) {
            video.pause();
            video.currentTime = 0;
          }
        });
      } else {
        card.style.display = "none";
      }
    });

    tabButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === tabName);
    });
  }

  showTab("ai");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTab = button.dataset.tab;
      showTab(selectedTab);
    });
  });
  // Pin Tab Nav
  const pinnedSection = document.getElementById("pinSection");
  const nextSection = document.getElementById("endTabNavTrigger");

  if (window.innerWidth > 768) {
    ScrollTrigger.create({
      trigger: pinnedSection,
      start: "top 2%",
      endTrigger: nextSection,
      end: "top 30%",
      pin: ".tab-nav",
      pinSpacing: false,
      // markers: true,
    });
  }
};
tabsNCards();

let contactSvgMorph = () => {
  const startPath = document.querySelector('path[data-morph="start"]');
  const endPath = document.querySelector('path[data-morph="end"]');
  let contactCon = document.querySelector(".component-contact");

  const endD = endPath.getAttribute("d");

  endPath.style.display = "none";

  contactCon.addEventListener("mouseenter", () => {
    gsap.to(startPath, {
      duration: 0.4,
      morphSVG: endD,

      ease: "sine.inOut",
    });
  });

  contactCon.addEventListener("mouseleave", () => {
    gsap.to(startPath, {
      duration: 0.4,
      morphSVG: startPath.getAttribute("data-original"),
      ease: "sine.inOut",
    });
  });
};
contactSvgMorph();

function faqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const questionWrap = item.querySelector(".faq-question-wrap");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon ion-icon");

    questionWrap.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all
      faqItems.forEach((i) => {
        i.classList.remove("open");
        gsap.to(i.querySelector(".faq-answer"), {
          height: 0,
          opacity: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });
        i.querySelector(".faq-icon ion-icon").style.transform = "rotate(0deg)";
      });

      // If not already open, open it
      if (!isOpen) {
        item.classList.add("open");
        answer.style.height = "auto";
        const height = answer.scrollHeight;
        answer.style.height = "0px"; // reset before animating

        gsap.to(answer, {
          height: height,
          opacity: 1,
          duration: 0.4,
          ease: "power2.inOut",
        });

        icon.style.transform = "rotate(180deg)";
      }
    });
  });
}
faqAccordion();
