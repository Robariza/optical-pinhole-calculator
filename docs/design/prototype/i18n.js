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

      // --- Panel de respaldo académico (RF-12) ---
      aboutSummary: "Fundamento académico",
      tabConcepto: "Concepto",
      tabFormulas: "Fórmulas",
      tabAplicaciones: "Aplicaciones",

      conceptoTitulo: "¿Qué representa esta calculadora?",
      conceptoTexto:
        "<p>Una <b>cámara estenopeica</b> (o <i>pinhole</i>) forma imágenes sin lente: la luz " +
        "atraviesa un orificio muy pequeño y proyecta una imagen invertida sobre el plano de la " +
        "película o sensor. Su comportamiento depende de dos efectos que compiten entre sí.</p>" +
        "<p>Si el orificio es <b>demasiado grande</b>, cada punto del objeto se proyecta como un " +
        "círculo ancho: la imagen se ve borrosa por razones puramente <b>geométricas</b>. Si el " +
        "orificio es <b>demasiado pequeño</b>, la naturaleza ondulatoria de la luz se vuelve " +
        "dominante y el haz se dispersa al atravesarlo: la imagen se degrada por " +
        "<b>difracción</b>.</p>" +
        "<p>Existe entonces un <b>diámetro óptimo</b> que equilibra ambos efectos y produce la " +
        "mejor resolución posible. Esta herramienta calcula ese punto de equilibrio y permite " +
        "observar visualmente qué ocurre al alejarse de él en cualquiera de las dos direcciones.</p>",

      formulasTitulo: "Fórmulas empleadas",
      formulaRayleighNombre: "1. Diámetro óptimo — criterio de Rayleigh",
      formulaRayleighEcuacion: "d = 1,9 · √(f · λ)",
      formulaRayleighVars:
        "<li><b>d</b> — diámetro óptimo del orificio (mm)</li>" +
        "<li><b>f</b> — distancia focal: del orificio al plano de imagen (mm)</li>" +
        "<li><b>λ</b> — longitud de onda de la luz (mm)</li>" +
        "<li><b>1,9</b> — constante empírica determinada por Lord Rayleigh</li>",
      formulaRayleighInterpretacion:
        "El diámetro óptimo crece con la raíz cuadrada de la distancia focal: una cámara más " +
        "profunda necesita un orificio proporcionalmente mayor. También depende del color de la " +
        "luz — la luz roja (λ mayor) exige un orificio ligeramente más grande que la azul.",
      formulaRayleighFuente:
        "Formulación de Strutt (1891); constante 1,9 confirmada experimentalmente (Young, 2024).",

      formulaFNumberNombre: "2. Número f — relación de apertura",
      formulaFNumberEcuacion: "N = f / d",
      formulaFNumberVars:
        "<li><b>N</b> — número f (adimensional)</li>" +
        "<li><b>f</b> — distancia focal (mm)</li>" +
        "<li><b>d</b> — diámetro del orificio (mm)</li>",
      formulaFNumberInterpretacion:
        "Expresa cuánta luz deja pasar el sistema. En cámaras estenopeicas N suele ser muy alto " +
        "(f/150 o más), lo que implica tiempos de exposición largos — de segundos a minutos.",

      formulaBlurNombre: "3. Mapeo a desenfoque — aproximación propia",
      formulaBlurEcuacion: "σ = mín( σ₀ + k · |d − d_opt| / d_opt , σ_máx )",
      formulaBlurVars:
        "<li><b>σ</b> — intensidad del desenfoque simulado</li>" +
        "<li><b>d_opt</b> — diámetro óptimo calculado con la fórmula 1</li>" +
        "<li><b>k = 3,2</b> — constante de escala calibrada</li>" +
        "<li><b>σ₀ = 0,6</b> — desenfoque base (una estenopeica nunca es perfectamente nítida)</li>" +
        "<li><b>σ_máx = 8,0</b> — límite superior</li>",
      formulaBlurInterpretacion:
        "Traduce la desviación respecto al óptimo en un desenfoque visible. A diferencia de las " +
        "dos anteriores, <b>esta no es una ley física</b>: es una aproximación de ingeniería " +
        "calibrada experimentalmente para que la simulación resulte comprensible. No debe usarse " +
        "para diseñar instrumentos ópticos reales.",

      aplicacionesTitulo: "Aplicaciones e importancia",
      aplicacionesTexto:
        "<p><b>Aplicaciones reales.</b> El principio estenopeico se usa donde no es posible o " +
        "conveniente emplear lentes: en imagenología de rayos X y rayos gamma, donde ningún " +
        "material refracta esa radiación de forma útil; en la observación segura de eclipses " +
        "solares mediante proyección; en el control de apertura de instrumentos ópticos y " +
        "microscopios; y en fotografía artística, por su profundidad de campo prácticamente " +
        "ilimitada.</p>" +
        "<p><b>Importancia académica.</b> La estenopeica es uno de los ejemplos más claros del " +
        "<b>límite de difracción</b>: el punto donde la naturaleza ondulatoria de la luz impone " +
        "un techo a la resolución, sin importar la calidad de fabricación. Ese mismo límite " +
        "gobierna telescopios, microscopios y sistemas de litografía. Estudiarlo aquí, con un " +
        "dispositivo construible con materiales cotidianos, permite observar experimentalmente " +
        "un principio que de otro modo se queda en lo abstracto.</p>" +
        "<p><b>Uso en el aula.</b> Permite predecir el diámetro adecuado antes de construir la " +
        "cámara, comparar configuraciones sin gastar material fotosensible, y discutir por qué " +
        "'más pequeño' deja de significar 'más nítido' a partir de cierto punto.</p>",
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

      // --- Academic backing panel (RF-12) ---
      aboutSummary: "Academic background",
      tabConcepto: "Concept",
      tabFormulas: "Formulas",
      tabAplicaciones: "Applications",

      conceptoTitulo: "What does this calculator represent?",
      conceptoTexto:
        "<p>A <b>pinhole camera</b> forms images without a lens: light passes through a very " +
        "small aperture and projects an inverted image onto the film or sensor plane. Its " +
        "behaviour depends on two competing effects.</p>" +
        "<p>If the aperture is <b>too large</b>, each point of the subject projects as a wide " +
        "circle: the image blurs for purely <b>geometric</b> reasons. If the aperture is " +
        "<b>too small</b>, the wave nature of light becomes dominant and the beam spreads as it " +
        "passes through: the image degrades through <b>diffraction</b>.</p>" +
        "<p>There is therefore an <b>optimal diameter</b> that balances both effects and yields " +
        "the best achievable resolution. This tool computes that balance point and lets you " +
        "visually observe what happens as you move away from it in either direction.</p>",

      formulasTitulo: "Formulas used",
      formulaRayleighNombre: "1. Optimal diameter — Rayleigh criterion",
      formulaRayleighEcuacion: "d = 1.9 · √(f · λ)",
      formulaRayleighVars:
        "<li><b>d</b> — optimal aperture diameter (mm)</li>" +
        "<li><b>f</b> — focal length: aperture to image plane (mm)</li>" +
        "<li><b>λ</b> — wavelength of light (mm)</li>" +
        "<li><b>1.9</b> — empirical constant determined by Lord Rayleigh</li>",
      formulaRayleighInterpretacion:
        "The optimal diameter grows with the square root of focal length: a deeper camera needs " +
        "a proportionally larger aperture. It also depends on the colour of light — red light " +
        "(longer λ) requires a slightly larger aperture than blue.",
      formulaRayleighFuente:
        "Formulation from Strutt (1891); constant 1.9 experimentally confirmed (Young, 2024).",

      formulaFNumberNombre: "2. f-number — aperture ratio",
      formulaFNumberEcuacion: "N = f / d",
      formulaFNumberVars:
        "<li><b>N</b> — f-number (dimensionless)</li>" +
        "<li><b>f</b> — focal length (mm)</li>" +
        "<li><b>d</b> — aperture diameter (mm)</li>",
      formulaFNumberInterpretacion:
        "Expresses how much light the system lets through. In pinhole cameras N is typically very " +
        "high (f/150 or more), which implies long exposure times — from seconds to minutes.",

      formulaBlurNombre: "3. Blur mapping — our own approximation",
      formulaBlurEcuacion: "σ = min( σ₀ + k · |d − d_opt| / d_opt , σ_max )",
      formulaBlurVars:
        "<li><b>σ</b> — simulated blur intensity</li>" +
        "<li><b>d_opt</b> — optimal diameter from formula 1</li>" +
        "<li><b>k = 3.2</b> — calibrated scale constant</li>" +
        "<li><b>σ₀ = 0.6</b> — base blur (a pinhole is never perfectly sharp)</li>" +
        "<li><b>σ_max = 8.0</b> — upper bound</li>",
      formulaBlurInterpretacion:
        "Translates deviation from the optimum into visible blur. Unlike the previous two, " +
        "<b>this is not a physical law</b>: it is an engineering approximation, experimentally " +
        "calibrated so the simulation reads clearly. It should not be used to design real " +
        "optical instruments.",

      aplicacionesTitulo: "Applications and significance",
      aplicacionesTexto:
        "<p><b>Real-world applications.</b> The pinhole principle is used wherever lenses are " +
        "impractical or impossible: in X-ray and gamma-ray imaging, where no material usefully " +
        "refracts that radiation; in safe solar eclipse observation through projection; in " +
        "aperture control for optical instruments and microscopes; and in artistic photography, " +
        "for its practically unlimited depth of field.</p>" +
        "<p><b>Academic significance.</b> The pinhole is one of the clearest examples of the " +
        "<b>diffraction limit</b>: the point where the wave nature of light imposes a ceiling on " +
        "resolution, regardless of manufacturing quality. That same limit governs telescopes, " +
        "microscopes and lithography systems. Studying it here, with a device buildable from " +
        "everyday materials, makes a principle observable that would otherwise stay abstract.</p>" +
        "<p><b>Classroom use.</b> It allows predicting the right diameter before building the " +
        "camera, comparing configurations without spending photosensitive material, and " +
        "discussing why 'smaller' stops meaning 'sharper' beyond a certain point.</p>",
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
