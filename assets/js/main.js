/* Barsac — interactions du site statique */
window.intramurosCityIdEvent = "10970";
window.intramurosAggloIdEvent = "914";
window.zoomEvent = 1;
window.containerSizeEvent = "medium";
window.itemPerPageEvent = 10;
window.imageMaxHeightEvent = 0;
window.backgroundColorEvent = "#ffffff";
window.titleColorEvent = "#000000";
window.dateColorEvent = "#E40046";
window.displayModeEvent = "list";
window.truncateEvent = 0;
window.showFiltersEvent = 1;
window.showPinnedFirstEvent = 1;

window.intramurosCityIdNews = "10970";
window.intramurosAggloIdNews = "914";
window.zoomNews = 1;
window.containerSizeNews = "medium";
window.itemPerPageNews = 10;
window.imageMaxHeightNews = 0;
window.backgroundColorNews = "#ffffff";
window.titleColorNews = "#000000";
window.excludeActorsNews = false;
window.displayModeNews = "list";
window.truncateNews = 0;
window.showFiltersNews = 1;
window.showPinnedFirstNews = 1;

(() => {
  "use strict";

  const IMAGES = [
    ["NK1911_DJI_0092-Panoramabd", 1800, 474, "Panorama de Barsac dans la vallée du Diois"],
    ["NK1911_DJI_0098bd", 1800, 1199, "Vue aérienne de Barsac dans la vallée"],
    ["NK1911_DJI_0105bd", 1800, 1056, "Le village et ses vignes en automne"],
    ["NK_0308N_7427bd", 1800, 600, "Paysage autour de Barsac"],
    ["NK_0409N_8723bd", 1800, 1200, "Vendanges dans les vignes"],
    ["NK_0409N_8736bd", 1800, 1200, "Vie viticole à Barsac"],
    ["NK_04N09_8459bd", 1800, 1200, "Vignes du Diois"],
    ["NK_0908N_0975bd", 1800, 1200, "Été à Barsac"],
    ["NK_0908N_1051bd", 1800, 1200, "Montagnes autour de Barsac"],
    ["NK_1206N_7901bd", 1800, 1200, "Fête au village"],
    ["NK_1206N_8388bd", 1800, 1200, "Vie du village"],
    ["NK_1509N_4022bd", 1800, 1200, "Vendanges de la Clairette"],
    ["NK_1707N_3450bd", 1800, 1200, "Producteurs locaux"],
    ["NK_1902N_7240bd", 1800, 1350, "Taille de la vigne en hiver"],
    ["NK_2506N_0483bd", 1800, 1350, "Course de caisses à savon"],
    ["NK_2603N_2912bd", 1800, 1350, "Chevreaux à la ferme"],
    ["NK_2604N_7589bd", 1800, 1201, "Printemps dans le Diois"],
    ["NK_2605N_7751bd", 1800, 1201, "Spectacle sous les platanes"],
    ["NK_2605N_7792bd", 1800, 1201, "Animation à Barsac"],
    ["NK_2605N_7824bd", 1800, 1061, "Concert dans une cave"],
  ];
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
  const BLANK_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

  class Header {
    constructor() {
      this.el = $(".site-header"); this.nav = $(".nav"); this.toggle = $(".nav-toggle");
      if (!this.el || !this.nav || !this.toggle) return;
      this.onScroll();
      addEventListener("scroll", () => this.onScroll(), { passive: true });
      this.toggle.addEventListener("click", () => this.setOpen(!this.nav.classList.contains("open")));
      $$("a", this.nav).forEach((link) => link.addEventListener("click", () => this.setOpen(false)));
      addEventListener("keydown", (event) => {
        if (event.key === "Escape" && this.nav.classList.contains("open")) { this.setOpen(false); this.toggle.focus(); }
        if (event.key === "Tab" && this.nav.classList.contains("open") && matchMedia("(max-width:1100px)").matches) this.trapFocus(event);
      });
      addEventListener("resize", () => { if (!matchMedia("(max-width:1100px)").matches) this.setOpen(false); });
    }
    onScroll() { this.el.classList.toggle("scrolled", scrollY > innerHeight * 0.7); }
    setOpen(open) {
      this.nav.classList.toggle("open", open); this.el.classList.toggle("menu-open", open); document.body.classList.toggle("menu-locked", open);
      this.toggle.setAttribute("aria-expanded", String(open)); this.toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
      if (open) $("a", this.nav)?.focus();
    }
    trapFocus(event) {
      const nodes = [...$$("a", this.nav), this.toggle]; const first = nodes[0]; const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  }

  class Reveal {
    constructor() {
      if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((el) => el.classList.add("in")); return; }
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("in"); observer.unobserve(entry.target); } }), { threshold: .1, rootMargin: "0px 0px -5% 0px" });
      $$(".reveal").forEach((el) => observer.observe(el));
    }
  }

  class Counters {
    constructor() {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { this.run(entry.target); observer.unobserve(entry.target); } }), { threshold: .6 });
      $$(".stat-num").forEach((el) => observer.observe(el));
    }
    run(el) {
      const target = Number.parseInt(el.dataset.to, 10); const suffix = el.dataset.suffix || ""; const start = performance.now();
      const tick = (now) => { const progress = Math.min((now - start) / 1000, 1); el.textContent = `${Math.round(target * (1 - (1 - progress) ** 3)).toLocaleString("fr-FR")}${suffix}`; if (progress < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }
  }

  class ScrollSpy {
    constructor() {
      const links = new Map($$(".nav a[href^='#']").map((link) => [link.hash.slice(1), link]));
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { links.forEach((link) => link.classList.remove("active")); links.get(entry.target.id)?.classList.add("active"); } }), { rootMargin: "-45% 0px -50% 0px" });
      links.forEach((_link, id) => { const section = document.getElementById(id); if (section) observer.observe(section); });
    }
  }

  class Gallery {
    constructor() {
      this.grid = $("#gallery"); this.box = $("#lightbox"); this.img = $("#lb-img"); this.count = $(".lb-count"); this.index = 0; this.returnFocus = null;
      if (!this.grid || !this.box || !this.img) return;
      this.build(); this.bindPageImages(); this.bind();
    }
    build() {
      const fragment = document.createDocumentFragment();
      IMAGES.forEach(([name, width, height, alt], index) => {
        const figure = document.createElement("figure"); const button = document.createElement("button"); const image = document.createElement("img");
        button.type = "button"; button.setAttribute("aria-label", `Agrandir : ${alt}`); button.addEventListener("click", () => this.open(index, button));
        image.src = `assets/img/sm/${name}.webp`; image.loading = "lazy"; image.alt = alt; image.width = 820; image.height = Math.round(height * 820 / width);
        button.append(image); figure.append(button); fragment.append(figure);
      });
      this.grid.append(fragment);
    }
    bindPageImages() {
      $$(".village-figure img, .t-img img, .card-media img, .band img").forEach((image) => {
        const name = image.currentSrc.split("/").pop().replace(/\.(webp|jpg)$/i, ""); const index = IMAGES.findIndex(([candidate]) => candidate === name); if (index < 0) return;
        const target = image.closest("picture") || image; if (target.parentElement?.tagName === "BUTTON") return;
        const button = document.createElement("button"); button.type = "button"; button.className = "zoom-button"; button.setAttribute("aria-label", `Agrandir : ${image.alt}`);
        target.before(button); button.append(target); button.addEventListener("click", () => this.open(index, button));
      });
    }
    bind() {
      $(".lb-close", this.box).addEventListener("click", () => this.close()); $(".lb-next", this.box).addEventListener("click", () => this.step(1)); $(".lb-prev", this.box).addEventListener("click", () => this.step(-1));
      this.box.addEventListener("click", (event) => { if (event.target === this.box) this.close(); });
      addEventListener("keydown", (event) => { if (!this.box.classList.contains("open")) return; if (event.key === "Escape") this.close(); if (event.key === "ArrowRight") this.step(1); if (event.key === "ArrowLeft") this.step(-1); if (event.key === "Tab") this.trapFocus(event); });
      this.box.addEventListener("touchstart", (event) => { this.touchX = event.touches[0].clientX; }, { passive: true });
      this.box.addEventListener("touchend", (event) => { const distance = event.changedTouches[0].clientX - this.touchX; if (Math.abs(distance) > 40) this.step(distance < 0 ? 1 : -1); }, { passive: true });
    }
    open(index, source) { this.index = index; this.returnFocus = source || document.activeElement; this.show(); this.box.classList.add("open"); this.box.setAttribute("aria-hidden", "false"); document.body.classList.add("menu-locked"); requestAnimationFrame(() => $(".lb-close", this.box).focus()); }
    show() { const [name, , , alt] = IMAGES[this.index]; this.img.src = `assets/img/lg/${name}.webp`; this.img.alt = alt; this.count.textContent = `${this.index + 1} / ${IMAGES.length}`; }
    step(direction) { this.index = (this.index + direction + IMAGES.length) % IMAGES.length; this.show(); }
    trapFocus(event) { const nodes = $$("button", this.box); const first = nodes[0]; const last = nodes[nodes.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } }
    close() { this.box.classList.remove("open"); this.box.setAttribute("aria-hidden", "true"); document.body.classList.remove("menu-locked"); this.img.src = BLANK_IMAGE; this.img.alt = ""; this.returnFocus?.focus(); }
  }

  class ContactForm {
    constructor() {
      this.form = $("#contact-form"); this.topic = $("#contact-topic"); this.customWrap = $(".custom-subject"); this.custom = $("#contact-custom"); this.status = $("#contact-status");
      if (!this.form) return;
      $$('[data-contact-topic]').forEach((link) => link.addEventListener("click", () => this.select(link.dataset.contactTopic)));
      this.topic.addEventListener("change", () => this.toggleCustom()); this.form.addEventListener("submit", (event) => this.submit(event)); this.toggleCustom();
      const requested = new URLSearchParams(location.search).get("demande"); if (requested) this.select(requested, false);
    }
    select(value, focus = true) { if ([...this.topic.options].some((option) => option.value === value)) this.topic.value = value; this.toggleCustom(); if (focus) setTimeout(() => this.topic.focus(), 500); }
    toggleCustom() { const visible = this.topic.value === "autre"; this.customWrap.hidden = !visible; this.custom.required = visible; }
    submit(event) {
      event.preventDefault(); if (!this.form.reportValidity()) return;
      const label = this.topic.value === "autre" ? this.custom.value.trim() : this.topic.selectedOptions[0].textContent.trim();
      const name = $("#contact-name").value.trim(); const email = $("#contact-email").value.trim(); const message = $("#contact-message").value.trim();
      const subject = `[Site de Barsac] ${label}`; const body = `Bonjour,\n\n${message}\n\nNom : ${name}\nCourriel pour la réponse : ${email}\n\nCordialement`;
      const mailto = `mailto:mairie.barsac@orange.fr?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      this.form.dataset.mailto = mailto; this.status.textContent = "Le courriel est prêt. Ouverture de votre messagerie…"; window.location.href = mailto;
    }
  }

  class WidgetStatus {
    constructor() {
      [$("#intramuros_events"), $("#intramuros_news")].filter(Boolean).forEach((container) => {
        const clearLoading = () => {
          const loading = $(".widget-loading", container);
          if (loading && container.textContent.replace(loading.textContent, "").trim()) loading.remove();
        };
        new MutationObserver(clearLoading).observe(container, { childList: true, subtree: true, characterData: true });
        clearLoading();
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    new Header(); new Reveal(); new Counters(); new ScrollSpy(); new Gallery(); new ContactForm(); new WidgetStatus();
    const year = $("#year"); if (year) year.textContent = new Date().getFullYear();
  });
})();
