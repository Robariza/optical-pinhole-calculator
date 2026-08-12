/**
 * CONTROLLER
 * Orquesta: escucha eventos de usuario, pide cálculo al Model, ordena a la
 * View que renderice, y pide a I18N el idioma activo. No calcula, no toca
 * el DOM directamente y no conoce los textos por idioma.
 */

const Controller = (() => {
  const diamSlider = document.getElementById("diam");
  const focalSlider = document.getElementById("focal");
  const langEs = document.getElementById("langEs");
  const langEn = document.getElementById("langEn");

  function manejarCambio() {
    const focalMm = parseFloat(focalSlider.value);
    const diametroMm = parseFloat(diamSlider.value) / 1000;
    const rNorm = Math.min(diamSlider.value / diamSlider.max, 1);

    // RF-03 (longitud de onda) queda pendiente: el select aún no se lee ni
    // se pasa a Model.calcular(). Ver docs/requirements.md.
    const resultado = Model.calcular({ focalMm, diametroMm });

    View.actualizar({ focalMm, diametroMm, rNorm, resultado });
  }

  function cambiarIdioma(lang) {
    I18N.setLang(lang);
    View.aplicarIdioma();
    manejarCambio(); // el badge depende del idioma, hay que reevaluar su texto
  }

  function init() {
    View.dibujarPatron();
    View.aplicarIdioma();

    diamSlider.addEventListener("input", manejarCambio);
    focalSlider.addEventListener("input", manejarCambio);
    langEs.addEventListener("click", () => cambiarIdioma("es"));
    langEn.addEventListener("click", () => cambiarIdioma("en"));

    manejarCambio(); // estado inicial
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", Controller.init);
