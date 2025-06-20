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

  if (window.matchMedia("(max-width: 769px)").matches) {
    cursor.destroy();
    console.log("JS Hitted");
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

const megneticButton = () => {
  const lerp = (a, b, n) => (1 - n) * a + n * b;
  const getMousePos = (e) => ({ x: e.clientX, y: e.clientY });
  const distance = (x1, y1, x2, y2) => Math.hypot(x1 - x2, y1 - y2);

  class ButtonCtrl {
    constructor(el) {
      this.DOM = { el };
      this.DOM.text = el.querySelector(".button__text");
      this.DOM.textinner = el.querySelector(".button__text-inner");
      this.DOM.filler = el.querySelector(".button__filler");

      this.renderedStyles = {
        tx: { previous: 0, current: 0, amt: 0.1 },
        ty: { previous: 0, current: 0, amt: 0.1 },
      };

      this.state = { hover: false };
      this.calculateSizePosition();
      this.initEvents();
      requestAnimationFrame(() => this.render());
    }

    calculateSizePosition() {
      this.rect = this.DOM.el.getBoundingClientRect();
      this.distanceToTrigger = this.rect.width * 0.7;
    }

    initEvents() {
      window.addEventListener("resize", () => this.calculateSizePosition());
      window.addEventListener("mousemove", (ev) => {
        this.mousepos = getMousePos(ev);
      });
    }

    render() {
      if (!this.mousepos) return requestAnimationFrame(() => this.render());

      const dist = distance(
        this.mousepos.x,
        this.mousepos.y,
        this.rect.left + this.rect.width / 2,
        this.rect.top + this.rect.height / 2
      );

      let x = 0,
        y = 0;

      if (dist < this.distanceToTrigger) {
        if (!this.state.hover) this.enter();
        x = (this.mousepos.x - (this.rect.left + this.rect.width / 2)) * 0.2;
        y = (this.mousepos.y - (this.rect.top + this.rect.height / 2)) * 0.2;
      } else if (this.state.hover) {
        this.leave();
      }

      this.renderedStyles.tx.current = x;
      this.renderedStyles.ty.current = y;

      for (const key in this.renderedStyles) {
        this.renderedStyles[key].previous = lerp(
          this.renderedStyles[key].previous,
          this.renderedStyles[key].current,
          this.renderedStyles[key].amt
        );
      }

      this.DOM.el.style.transform = `translate3d(${this.renderedStyles.tx.previous}px, ${this.renderedStyles.ty.previous}px, 0)`;
      this.DOM.text.style.transform = `translate3d(${
        -this.renderedStyles.tx.previous * 0.6
      }px, ${-this.renderedStyles.ty.previous * 0.6}px, 0)`;

      requestAnimationFrame(() => this.render());
    }

    enter() {
      this.state.hover = true;
      this.DOM.el.classList.add("button--hover");

      gsap.killTweensOf(this.DOM.filler);
      gsap.killTweensOf(this.DOM.textinner);

      gsap
        .timeline()
        .to(this.DOM.filler, {
          duration: 0.5,
          ease: "Power3.easeOut",
          startAt: { y: "75%" },
          y: "0%",
        })
        .to(
          this.DOM.textinner,
          {
            duration: 0.1,
            ease: "Power3.easeOut",
            opacity: 0,
            y: "-10%",
          },
          0
        )
        .to(
          this.DOM.textinner,
          {
            duration: 0.25,
            ease: "Power3.easeOut",
            startAt: { y: "30%", opacity: 1 },
            opacity: 1,
            y: "0%",
          },
          0.1
        );
    }

    leave() {
      this.state.hover = false;
      this.DOM.el.classList.remove("button--hover");

      gsap.killTweensOf(this.DOM.filler);
      gsap.killTweensOf(this.DOM.textinner);

      gsap
        .timeline()
        .to(this.DOM.filler, {
          duration: 0.4,
          ease: "Power3.easeOut",
          y: "-75%",
        })
        .to(
          this.DOM.textinner,
          {
            duration: 0.1,
            ease: "Power3.easeOut",
            opacity: 0,
            y: "10%",
          },
          0
        )
        .to(
          this.DOM.textinner,
          {
            duration: 0.25,
            ease: "Power3.easeOut",
            startAt: { y: "-30%", opacity: 1 },
            opacity: 1,
            y: "0%",
          },
          0.1
        );
    }
  }

  const el = document.querySelector(".button");
  if (el) new ButtonCtrl(el);
};

window.addEventListener("load", () => {
  setTimeout(megneticButton, 50);
});

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
