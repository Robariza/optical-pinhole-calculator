/**
 * MODEL
 * Lógica de negocio pura — sin referencias al DOM.
 * Misma fórmula que docs/spikes/001-simulacion-imagen.md y el backend FastAPI
 * de fase 4 (fuente de verdad real: backend; esta copia es solo para preview
 * instantáneo en el prototipo — ver docs/wireframes.md, "Limitaciones conocidas").
 */

const Model = (() => {
  // Constantes de calibración documentadas en docs/adr/0001-simulacion-visual-vs-modelo-fisico.md
  const SIGMA_K = 3.2;
  const SIGMA_BASE = 0.6;
  const SIGMA_MAX = 8.0;
  const UMBRAL_OPTIMO = 0.15; // desviación relativa máxima para considerarse "óptimo"

  /** Diámetro óptimo de pinhole según el criterio de Rayleigh (Strutt, 1891). */
  function diametroOptimo(focalMm, lambdaMm = 550e-6) {
    const RAYLEIGH_CONST = 1.9; // constante empírica de Lord Rayleigh (Young, 2024)
    return RAYLEIGH_CONST * Math.sqrt(focalMm * lambdaMm);
  }

  /** Sigma de blur a partir de la desviación relativa respecto al óptimo. */
  function sigmaDesdeDiametro(dMm, dOptimoMm) {
    const desviacion = Math.abs(dMm - dOptimoMm) / dOptimoMm;
    return Math.min(SIGMA_BASE + SIGMA_K * desviacion, SIGMA_MAX);
  }

  /** Clasificación textual del resultado. */
  function clasificar(dMm, dOptimoMm) {
    const desviacion = Math.abs(dMm - dOptimoMm) / dOptimoMm;
    if (desviacion < UMBRAL_OPTIMO) return "optimo";
    return dMm < dOptimoMm ? "subdimensionado" : "sobredimensionado";
  }

  /** Punto de entrada único: recalcula todo a partir de los inputs. */
  function calcular({ focalMm, diametroMm, wavelengthMm = 550e-6 }) {
    const dOptimo = diametroOptimo(focalMm, wavelengthMm);
    return {
      dOptimo,
      sigma: sigmaDesdeDiametro(diametroMm, dOptimo),
      clasificacion: clasificar(diametroMm, dOptimo),
    };
  }

  return { calcular, diametroOptimo, sigmaDesdeDiametro, clasificar };
})();
