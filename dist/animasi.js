/* ANIMASI WEBSITE: kesan tambahan; kandungan masih tersedia tanpa animasi. */
(() => {
  // 1. Semak pilihan pengguna untuk mengurangkan pergerakan.
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let observer;
  let generation = 0;
  let active = [];
  let introPending = false;
  const easing = "cubic-bezier(.22,1,.36,1)";
  // 2. Fungsi umum untuk menjalankan animasi dengan tempoh yang seragam.
  const animate = (element, frames, options = {}) => {
    if (reduced.matches || !element.animate) return;
    const animation = element.animate(frames, {
      duration: 700,
      easing,
      ...options,
    });
    active.push(animation);
    animation.finished
      .then(() => {
        active = active.filter((a) => a !== animation);
      })
      .catch(() => {});
  };
  // 3. Paparkan blok apabila blok tersebut memasuki kawasan skrin.
  function paparBlok(element) {
    element.classList.remove("motion-pending");
    if (element.hidden) return;
    animate(
      element,
      [
        { opacity: 0, transform: "translateY(22px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { delay: Number(element.dataset.motionDelay || 0) },
    );
  }
  // 4. Gerakkan tajuk dan gambar utama selepas skrin memuatkan selesai.
  function animasiPengenalan() {
    if (!introPending || !document.querySelector("#loader")?.classList.contains("done"))
      return;
    introPending = false;
    document
      .querySelectorAll(".hero-content > *, .page-intro .wrap > *")
      .forEach((element, index) => {
        animate(
          element,
          [
            { opacity: 0, transform: "translateY(26px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 900, delay: index * 100 },
        );
      });
    const image = document.querySelector(".hero-image");
    if (image)
      animate(image, [{ transform: "scale(1.055)" }, { transform: "scale(1)" }], {
        duration: 6500,
        easing: "ease-out",
      });
  }
  // 5. Sediakan pemerhati tatal semula setiap kali halaman ditukar.
  function sediakanAnimasi() {
    generation++;
    observer?.disconnect();
    active.forEach((a) => a.cancel());
    active = [];
    document
      .querySelectorAll(".motion-pending")
      .forEach((el) => el.classList.remove("motion-pending"));
    introPending = !reduced.matches;
    if (reduced.matches || !("IntersectionObserver" in window)) return;
    const current = generation;
    observer = new IntersectionObserver(
      (entries) => {
        if (current !== generation) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            paparBlok(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -24px 0px" },
    );
    const selector =
      ".stats > div, .section > .eyebrow, .section > h2, .section-heading, .split > div, .feature > img, .services > article, .team > article, .secretary, .expertise-list > div, .project, .note, .document-toolbar, .filters, .cert, .source-note, .project-source, .cta > *, .download > *";
    const candidates = [
      ...document.querySelectorAll("main " + selector.split(", ").join(", main ")),
      ...document.querySelectorAll(".footer-top > div, .footer-bottom"),
    ];
    // Pilih bekas utama atau anaknya untuk mengelakkan animasi bertindih.
    const selected = candidates.filter(
      (el) => !candidates.some((parent) => parent !== el && parent.contains(el)),
    );
    selected.forEach((element, index) => {
      element.dataset.motionDelay = String((index % 3) * 65);
      // Kandungan awal kekal kelihatan semasa skrin memuatkan ditutup.
      if (element.getBoundingClientRect().top < innerHeight) return;
      element.classList.add("motion-pending");
      observer.observe(element);
    });
    animasiPengenalan();
  }
  // 6. Sambungkan animasi kepada pertukaran halaman dan fokus papan kekunci.
  document.addEventListener("hss:render", sediakanAnimasi);
  document.addEventListener("focusin", (event) => {
    const item = event.target.closest(".motion-pending");
    if (item) {
      observer?.unobserve(item);
      item.classList.remove("motion-pending");
    }
  });
  // 7. Animasi ringkas untuk hasil penapisan projek atau sijil.
  document.addEventListener("hss:filter", () => {
    document
      .querySelectorAll(".project:not([hidden]), .cert:not([hidden])")
      .forEach((el, i) => {
        observer?.unobserve(el);
        el.classList.remove("motion-pending");
        animate(
          el,
          [
            { opacity: 0, transform: "translateY(12px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          { duration: 420, delay: Math.min(i, 4) * 40 },
        );
      });
  });
  // 8. Paparkan kotak dialog dengan pergerakan yang lembut.
  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-view], #install");
    if (!trigger) return;
    queueMicrotask(() => {
      const dialog = document.querySelector("dialog[open]");
      if (dialog)
        animate(
          dialog,
          [
            { opacity: 0, transform: "translateY(14px) scale(.985)" },
            { opacity: 1, transform: "translateY(0) scale(1)" },
          ],
          { duration: 320 },
        );
    });
  });
  // 9. Hentikan animasi apabila pengguna mengaktifkan pengurangan gerakan.
  reduced.addEventListener("change", sediakanAnimasi);
  const loader = document.querySelector("#loader");
  if (loader)
    new MutationObserver(animasiPengenalan).observe(loader, {
      attributes: true,
      attributeFilter: ["class"],
    });
  // 10. Garisan di bahagian atas menunjukkan kedudukan tatal halaman.
  const progress = document.createElement("div");
  progress.className = "reading-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);
  let scheduled = false;
  // Kemas kini lebar garisan sekali pada setiap bingkai paparan.
  function kemasKiniTatal() {
    const distance = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${distance > 0 ? Math.min(1, Math.max(0, scrollY / distance)) : 0})`;
    scheduled = false;
  }
  addEventListener(
    "scroll",
    () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(kemasKiniTatal);
      }
    },
    { passive: true },
  );
  addEventListener("resize", kemasKiniTatal, { passive: true });
  document.addEventListener("hss:render", () => requestAnimationFrame(kemasKiniTatal));
})();

