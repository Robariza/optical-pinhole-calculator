/**
 * I18N
 * Diccionario de textos de la interfaz. No es lógica de negocio (Model) ni
 * manipulación de DOM (View): es contenido. Se mantiene como cuarto archivo
 * separado en vez de forzarlo dentro de View, para que traducir o agregar
 * un idioma nunca implique tocar código de renderizado (RF-08,
 * docs/requirements.md).
 */

const I18N = (() => {
  const dict = {
    es: {
      eyebrow: "Fase 3 · Prototipo navegable",
      title: "Calculadora óptica paramétrica",
      panelParametros: "Parámetros",
      irisCaption: "Diámetro del orificio",
      diamLabel: "Diámetro del orificio",
      focalLabel: "Distancia focal",
      wavelengthLabel: "Longitud de onda de referencia",
      wavelength550: "550 nm (luz visible media)",
      wavelength450: "450 nm (azul)",
      wavelength650: "650 nm (rojo)",
      panelResultado: "Resultado",
      statOptimo: "Diámetro óptimo (Rayleigh)",
      statClasificacion: "Clasificación",
      previewNote: "Simulación visual — aproximación educativa",
      disclaimer:
        "Esta vista es una aproximación visual del efecto de difracción/desenfoque, calibrada a partir de un " +
        "spike técnico (ver <code>docs/spikes/001-simulacion-imagen.md</code>). No representa un modelo " +
        "físico exacto de propagación de ondas.",
      badge: {
        optimo: "Óptimo",
        subdimensionado: "Subdimensionado",
        sobredimensionado: "Sobredimensionado",
      },
    },
    en: {
      eyebrow: "Phase 3 · Navigable prototype",
      title: "Parametric optical calculator",
      panelParametros: "Parameters",
      irisCaption: "Pinhole diameter",
      diamLabel: "Pinhole diameter",
      focalLabel: "Focal length",
      wavelengthLabel: "Reference wavelength",
      wavelength550: "550 nm (mid visible light)",
      wavelength450: "450 nm (blue)",
      wavelength650: "650 nm (red)",
      panelResultado: "Result",
      statOptimo: "Optimal diameter (Rayleigh)",
      statClasificacion: "Classification",
      previewNote: "Visual simulation — educational approximation",
      disclaimer:
        "This view is a visual approximation of the diffraction/blur effect, calibrated from a technical " +
        "spike (see <code>docs/spikes/001-simulacion-imagen.md</code>). It does not represent an exact " +
        "physical wave-propagation model.",
      badge: {
        optimo: "Optimal",
        subdimensionado: "Undersized",
        sobredimensionado: "Oversized",
      },
    },
  };

  let currentLang = "es";

  function t(key) {
    return dict[currentLang][key];
  }

  function badgeText(clasificacion) {
    return dict[currentLang].badge[clasificacion];
  }

  function setLang(lang) {
    if (!dict[lang]) throw new Error(`Idioma no soportado: ${lang}`);
    currentLang = lang;
  }

  function getLang() {
    return currentLang;
  }

  return { t, badgeText, setLang, getLang };
})();
