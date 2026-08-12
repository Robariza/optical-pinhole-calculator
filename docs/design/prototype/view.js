/**
 * VIEW
 * Renderizado y manipulación del DOM únicamente.
 * No calcula nada (Model) y no conoce los textos por idioma (I18N) más allá
 * de pedírselos — solo los pinta.
 */

const View = (() => {
  const el = {
    focalVal: document.getElementById("focalVal"),
    diamVal: document.getElementById("diamVal"),
    diamLabel: document.getElementById("diamLabel"),
    optimoVal: document.getElementById("optimoVal"),
    badge: document.getElementById("badge"),
    badgeText: document.getElementById("badgeText"),
    canvas: document.getElementById("canvas"),
    iris: document.getElementById("iris"),
    langEs: document.getElementById("langEs"),
    langEn: document.getElementById("langEn"),
  };
  const ctx = el.canvas.getContext("2d");

  /** Dibuja el patrón de prueba radial (una sola vez, es estático). */
  function dibujarPatron() {
    const w = el.canvas.width, h = el.canvas.height, cx = w / 2, cy = h / 2;
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#111"; ctx.lineWidth = 2;
    for (let a = 0; a < 360; a += 6) {
      const rad = (a * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + cx * Math.cos(rad), cy + cy * Math.sin(rad));
      ctx.stroke();
    }
    ctx.lineWidth = 1;
    for (let r = 30; r < cx; r += 30) {
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    }
  }

  /** Dibuja el iris (elemento firma) según la apertura normalizada 0..1. */
  function dibujarIris(rNorm) {
    const n = 8, R = 62, cx = 70, cy = 70;
    const rOpen = 8 + rNorm * 46;
    const twist = (1 - rNorm) * 22;
    const inner = [];
    for (let i = 0; i < n; i++) {
      const ang = (360 / n) * i + twist;
      const rad = (ang * Math.PI) / 180;
      inner.push(`${cx + rOpen * Math.cos(rad)},${cy + rOpen * Math.sin(rad)}`);
    }
    el.iris.innerHTML = `
      <path d="M ${cx - R},${cy} A ${R},${R} 0 1 0 ${cx + R},${cy} A ${R},${R} 0 1 0 ${cx - R},${cy} Z
                M ${inner.join(" L ")} Z"
            fill="var(--blade)" fill-rule="evenodd"/>
      <circle cx="${cx}" cy="${cy}" r="${R}" fill="none" stroke="var(--line)" stroke-width="1.5"/>
    `;
  }

  /** Actualiza los textos, el badge y el blur del preview con un resultado del Model. */
  function actualizar({ focalMm, diametroMm, rNorm, resultado }) {
    el.focalVal.textContent = focalMm.toFixed(0) + " mm";
    el.diamVal.textContent = diametroMm.toFixed(3) + " mm";
    el.diamLabel.textContent = diametroMm.toFixed(3) + " mm";
    el.optimoVal.textContent = resultado.dOptimo.toFixed(3) + " mm";

    el.badge.className = "badge " + (resultado.clasificacion === "optimo" ? "optimo" : "desvio");
    el.badgeText.textContent = I18N.badgeText(resultado.clasificacion);

    el.canvas.style.setProperty("--blur", resultado.sigma * 1.6 + "px");
    dibujarIris(rNorm);
  }

  /** Aplica el idioma actual (I18N.getLang()) a todo texto estático marcado con data-i18n. */
  function aplicarIdioma() {
    document.documentElement.lang = I18N.getLang();

    document.querySelectorAll("[data-i18n]").forEach((elem) => {
      elem.textContent = I18N.t(elem.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-html]").forEach((elem) => {
      elem.innerHTML = I18N.t(elem.dataset.i18nHtml);
    });
    document.querySelectorAll("#wavelength option").forEach((opt) => {
      if (opt.dataset.i18n) opt.textContent = I18N.t(opt.dataset.i18n);
    });

    el.langEs.classList.toggle("active", I18N.getLang() === "es");
    el.langEn.classList.toggle("active", I18N.getLang() === "en");
  }

  return { dibujarPatron, actualizar, aplicarIdioma };
})();
