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
        x = (this.mousepos.x - (this.rect.left + this.rect.width / 2)) * 0.3;
        y = (this.mousepos.y - (this.rect.top + this.rect.height / 2)) * 0.3;
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
