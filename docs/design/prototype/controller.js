/**
 * CONTROLLER
 * Orquesta: escucha eventos de usuario, pide cálculo al Model, ordena a la
 * View que renderice. No calcula (eso es del Model) ni toca el DOM
 * directamente (eso es de la View).
 */

const Controller = (() => {
  const diamSlider = document.getElementById("diam");
  const focalSlider = document.getElementById("focal");

  function manejarCambio() {
    const focalMm = parseFloat(focalSlider.value);
    const diametroMm = parseFloat(diamSlider.value) / 1000;
    const rNorm = Math.min(diamSlider.value / diamSlider.max, 1);

    const resultado = Model.calcular({ focalMm, diametroMm });

    View.actualizar({ focalMm, diametroMm, rNorm, resultado });
  }

  function init() {
    View.dibujarPatron();
    diamSlider.addEventListener("input", manejarCambio);
    focalSlider.addEventListener("input", manejarCambio);
    manejarCambio(); // estado inicial
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", Controller.init);
