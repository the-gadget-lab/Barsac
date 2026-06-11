/* Barsac — interactions */
(() => {
  "use strict";

  const IMAGES = [
    "NK1911_DJI_0092-Panoramabd.jpg",
    "NK1911_DJI_0098bd.jpg",
    "NK1911_DJI_0105bd.jpg",
    "NK_0308N_7427bd.jpg",
    "NK_0409N_8723bd.jpg",
    "NK_0409N_8736bd.jpg",
    "NK_04N09_8459bd.jpg",
    "NK_0908N_0975bd.jpg",
    "NK_0908N_1051bd.jpg",
    "NK_1206N_7901bd.jpg",
    "NK_1206N_8388bd.jpg",
    "NK_1509N_4022bd.jpg",
    "NK_1707N_3450bd.jpg",
    "NK_1902N_7240bd.jpg",
    "NK_2506N_0483bd.jpg",
    "NK_2603N_2912bd.jpg",
    "NK_2604N_7589bd.jpg",
    "NK_2605N_7751bd.jpg",
    "NK_2605N_7792bd.jpg",
    "NK_2605N_7824bd.jpg",
  ];

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ── Header: scroll state + mobile menu ── */
  class Header {
    constructor() {
      this.el = $(".site-header");
      this.nav = $(".nav");
      this.toggle = $(".nav-toggle");
      this.onScroll();
      addEventListener("scroll", () => this.onScroll(), { passive: true });
      this.toggle.addEventListener("click", () => this.toggleMenu());
      $$(".nav a").forEach((a) => a.addEventListener("click", () => this.close()));
    }
    onScroll() {
      this.el.classList.toggle("scrolled", scrollY > window.innerHeight * 0.7);
    }
    toggleMenu() {
      const open = this.nav.classList.toggle("open");
      this.el.classList.toggle("menu-open", open);
      this.toggle.setAttribute("aria-expanded", String(open));
    }
    close() {
      this.nav.classList.remove("open");
      this.el.classList.remove("menu-open");
      this.toggle.setAttribute("aria-expanded", "false");
    }
  }

  /* ── Scroll reveal ── */
  class Reveal {
    constructor() {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
        }),
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      $$(".reveal").forEach((el) => io.observe(el));
    }
  }

  /* ── Animated stat counters ── */
  class Counters {
    constructor() {
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) { this.run(e.target); io.unobserve(e.target); }
        }),
        { threshold: 0.6 }
      );
      $$(".stat-num").forEach((el) => io.observe(el));
    }
    run(el) {
      const prefix = el.dataset.prefix;
      if (prefix) { el.textContent = prefix + "ᵉ"; return; }
      const to = parseInt(el.dataset.to, 10);
      const suffix = el.dataset.suffix || "";
      const dur = 1400, t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * eased).toLocaleString("fr-FR") + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  }

  /* ── Active nav link on scroll ── */
  class ScrollSpy {
    constructor() {
      this.links = new Map();
      $$(".nav a").forEach((a) => {
        const id = a.getAttribute("href").slice(1);
        if (id) this.links.set(id, a);
      });
      const io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) {
            this.links.forEach((l) => l.classList.remove("active"));
            this.links.get(e.target.id)?.classList.add("active");
          }
        }),
        { rootMargin: "-45% 0px -50% 0px" }
      );
      [...this.links.keys()].forEach((id) => {
        const sec = document.getElementById(id);
        if (sec) io.observe(sec);
      });
    }
  }

  /* ── Visionneuse : galerie + photos de la page ── */
  class Gallery {
    constructor() {
      this.grid = $("#gallery");
      if (!this.grid) return;
      this.box = $("#lightbox");
      this.img = $("#lb-img");
      this.count = $(".lb-count");
      this.alts = {};
      this.index = 0;
      this.build();
      this.bindPageImages();
      this.bind();
    }
    build() {
      const frag = document.createDocumentFragment();
      IMAGES.forEach((name, i) => {
        const fig = document.createElement("figure");
        const im = document.createElement("img");
        im.src = `assets/img/sm/${name}`;
        im.loading = "lazy";
        im.alt = `Barsac — photographie ${i + 1}`;
        im.addEventListener("click", () => this.open(i));
        fig.appendChild(im);
        frag.appendChild(fig);
      });
      this.grid.appendChild(frag);
    }
    bindPageImages() {
      $$(".village-figure img, .t-img img, .card-media img, .band img").forEach((im) => {
        const i = IMAGES.indexOf(im.src.split("/").pop());
        if (i === -1) return;
        if (im.alt) this.alts[i] = im.alt;
        im.classList.add("zoomable");
        im.addEventListener("click", () => this.open(i));
      });
    }
    bind() {
      $(".lb-close").addEventListener("click", () => this.closeBox());
      $(".lb-next").addEventListener("click", () => this.step(1));
      $(".lb-prev").addEventListener("click", () => this.step(-1));
      this.box.addEventListener("click", (e) => { if (e.target === this.box) this.closeBox(); });
      addEventListener("keydown", (e) => {
        if (!this.box.classList.contains("open")) return;
        if (e.key === "Escape") this.closeBox();
        if (e.key === "ArrowRight") this.step(1);
        if (e.key === "ArrowLeft") this.step(-1);
      });
      this.box.addEventListener("touchstart", (e) => { this.touchX = e.touches[0].clientX; }, { passive: true });
      this.box.addEventListener("touchend", (e) => {
        const dx = e.changedTouches[0].clientX - this.touchX;
        if (Math.abs(dx) > 40) this.step(dx < 0 ? 1 : -1);
      }, { passive: true });
    }
    open(i) {
      this.index = i;
      this.show();
      this.box.classList.add("open");
      this.box.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    show() {
      this.img.src = `assets/img/lg/${IMAGES[this.index]}`;
      this.img.alt = this.alts[this.index] || `Barsac — photographie ${this.index + 1}`;
      if (this.count) this.count.textContent = `${this.index + 1} / ${IMAGES.length}`;
      [1, -1].forEach((d) => {
        const n = (this.index + d + IMAGES.length) % IMAGES.length;
        new Image().src = `assets/img/lg/${IMAGES[n]}`;
      });
    }
    step(d) {
      this.index = (this.index + d + IMAGES.length) % IMAGES.length;
      this.show();
    }
    closeBox() {
      this.box.classList.remove("open");
      this.box.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }
  }

  /* ── boot ── */
  document.addEventListener("DOMContentLoaded", () => {
    new Header();
    new Reveal();
    new Counters();
    new ScrollSpy();
    new Gallery();
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
  });
})();
