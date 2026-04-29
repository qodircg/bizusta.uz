gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isDesktop = window.matchMedia("(min-width: 961px)");
const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

document.querySelectorAll(".stagger-up").forEach((el) => el.classList.add("pre-animate"));

if (!prefersReducedMotion && typeof Lenis !== "undefined") {
  const lenis = new Lenis({
    duration: 1.15,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 0.95,
    touchMultiplier: 1.1,
    infinite: false
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

/* ----------------------------------
   TEXT REVEAL
---------------------------------- */

const animateTextBlocks = () => {
  const blocks = gsap.utils.toArray("[data-reveal='text']");

  blocks.forEach((block, blockIndex) => {
    const lines = block.querySelectorAll(".reveal-line > span");
    if (!lines.length) return;

    const isHero = block.closest(".hero");

    gsap.set(lines, { yPercent: isHero ? 112 : 105 });

    gsap.to(lines, {
      yPercent: 0,
      duration: 1.15,
      ease: "power4.out",
      stagger: 0.08,
      delay: isHero ? 0.15 + blockIndex * 0.06 : 0,
      scrollTrigger: isHero
        ? undefined
        : {
            trigger: block,
            start: "top 86%",
            once: true
          }
    });
  });
};

/* ----------------------------------
   IMAGE WIPE REVEAL
---------------------------------- */

const animateImages = () => {
  gsap.utils.toArray(".reveal-image").forEach((image) => {
    gsap.fromTo(
      image,
      { clipPath: "inset(100% 0% 0% 0%)" },
      {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.2,
        ease: "power4.out",
        scrollTrigger: {
          trigger: image,
          start: "top 86%",
          once: true
        }
      }
    );
  });
};

/* ----------------------------------
   STAGGER GROUPS
---------------------------------- */

const animateStaggerGroups = () => {
  const groups = [
    ".service-item",
    ".project-card",
    ".timeline-item",
    ".testimonial-card"
  ];

  groups.forEach((selector) => {
    const items = gsap.utils.toArray(selector);
    if (!items.length) return;

    gsap.fromTo(
      items,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.95,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: items[0].parentElement,
          start: "top 82%",
          once: true
        }
      }
    );
  });
};

/* ----------------------------------
   HERO PARALLAX
---------------------------------- */

const animateParallax = () => {
  gsap.utils.toArray(".parallax-element").forEach((element, index) => {
    gsap.to(element, {
      yPercent: index === 0 ? -18 : -10,
      xPercent: index === 0 ? -4 : 4,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1
      }
    });
  });
};

/* ----------------------------------
   PINNED STACKING CARDS
---------------------------------- */

const initStackCards = () => {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 961px)", () => {
    const cards = gsap.utils.toArray(".service-stack .stack-card");
    if (!cards.length) return;

    gsap.set(cards, {
      zIndex: (i, _, arr) => arr.length - i
    });

    gsap.set(cards[0], { opacity: 1, y: 0, scale: 1 });
    gsap.set(cards.slice(1), { opacity: 0, y: 90, scale: 1.04 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".services-layout",
        start: "top top+=90",
        end: "+=1600",
        scrub: 1,
        pin: ".service-stack",
        anticipatePin: 1
      }
    });

    cards.forEach((card, index) => {
      if (index === 0) return;

      tl.to(
        cards[index - 1],
        {
          y: -26,
          scale: 0.94,
          opacity: 0.28,
          duration: 0.55,
          ease: "power2.out"
        },
        index - 1
      ).to(
        card,
        {
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.55,
          ease: "power3.out"
        },
        index - 1
      );
    });
  });
};

/* ----------------------------------
   CURSOR
---------------------------------- */

const initCursor = () => {
  if (prefersReducedMotion || !hasFinePointer || !isDesktop.matches) return;

  const cursor = document.querySelector(".cursor");
  if (!cursor) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  gsap.set(cursor, { x: mouseX, y: mouseY, opacity: 1 });

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    gsap.to(cursor, {
      x: mouseX,
      y: mouseY,
      duration: 0.18,
      ease: "power3.out"
    });
  });

  const targets = document.querySelectorAll(
    "a, button, .project-card, .service-item, .testimonial-card, .badge"
  );

  targets.forEach((target) => {
    target.addEventListener("mouseenter", () => cursor.classList.add("active"));
    target.addEventListener("mouseleave", () => cursor.classList.remove("active"));
  });
};

/* ----------------------------------
   MAGNETIC HOVER
---------------------------------- */

const initMagneticTargets = () => {
  if (prefersReducedMotion || !hasFinePointer) return;

  document.querySelectorAll(".magnetic-target").forEach((item) => {
    item.addEventListener("mousemove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;

      gsap.to(item, {
        x: x * 0.08,
        y: y * 0.08,
        duration: 0.35,
        ease: "power2.out"
      });
    });

    item.addEventListener("mouseleave", () => {
      gsap.to(item, {
        x: 0,
        y: 0,
        duration: 0.45,
        ease: "power3.out"
      });
    });
  });
};

/* ----------------------------------
   INIT
---------------------------------- */

const init = () => {
  animateTextBlocks();

  if (!prefersReducedMotion) {
    animateImages();
    animateStaggerGroups();
    animateParallax();
    initStackCards();
    initCursor();
    initMagneticTargets();
  }

  ScrollTrigger.refresh();
};

window.addEventListener("load", init);
window.addEventListener("resize", () => ScrollTrigger.refresh());
