# Diseño de interfaz — Fase 3

**Prototipo navegable:** [`docs/design/prototype/index.html`](design/prototype/index.html)
(estructura, estilo y lógica en archivos separados — ver [ADR-0002](adr/0002-separacion-mvc-frontend.md))
**Basado en:** [product-brief.md](product-brief.md), historias de usuario 1 y 2
**Requerimientos y campos:** [requirements.md](requirements.md)

## Decisiones de UX

### 1. Layout de dos paneles (control → resultado)

Se separa físicamente "lo que el usuario ajusta" (izquierda) de "lo que el
sistema calcula/muestra" (derecha). Esto responde directo a la historia de
usuario 1 (validar diseño) y 2 (ver el efecto visual): el usuario nunca
pierde de vista el resultado mientras ajusta parámetros — condición
necesaria para que la hipótesis de valor del brief ("ver en tiempo real")
funcione.

### 2. El control de diámetro es un iris de diafragma funcional

En vez de un slider genérico, el control principal es una representación de
un iris fotográfico real que se abre y cierra. Decisión deliberada: el
usuario primario (docente de óptica) reconoce este objeto de inmediato, y
la metáfora enseña por sí sola — "cerrar el iris" es literalmente reducir
el diámetro del orificio. Reduce la carga cognitiva de traducir un número
abstracto a un concepto físico.

### 3. Clasificación como badge, no solo número

La historia de usuario 1 pide "validar si está en rango óptimo". Un número
crudo (ej. "0.235mm") no responde esa pregunta sin que el usuario haga la
comparación mental. El badge (Óptimo / Subdimensionado / Sobredimensionado)
responde la pregunta directamente; el número queda disponible para quien
quiera el detalle.

### 4. Disclaimer visible, no en letra pequeña oculta

Dado el [ADR-0001](adr/0001-simulacion-visual-vs-modelo-fisico.md), la
interfaz debe dejar claro que la simulación es una aproximación educativa.
Se colocó como texto visible bajo la vista previa, no como tooltip o nota
al pie — un docente que proyecta esto en clase debe poder señalarlo
directamente.

### 5. Selector de idioma en el header, siempre visible

Responde a la historia de usuario 4. Se ubicó en la esquina superior
derecha (convención reconocible) en vez de en un menú de configuración,
porque el cambio de idioma es una acción frecuente en un aula con
estudiantes que no dominan el mismo idioma que el docente, no una
preferencia que se configura una vez.

### 6. Respaldo académico como panel secundario y colapsable

Responde a la historia de usuario 5 (RF-12, RNF-09). Decisiones concretas:

- **Ubicación:** debajo de los paneles de control/resultado, nunca antes ni
  al lado — el usuario primero interactúa con la herramienta, el respaldo
  académico es material de consulta, no el punto de entrada.
- **Estado por defecto: colapsado.** Un docente que ya conoce el criterio
  de Rayleigh no debería tener que descartar un bloque de texto para llegar
  a los controles; quien lo necesita, lo expande.
- **Un recuadro por fórmula**, no un bloque de texto corrido. Cada recuadro
  contiene: la fórmula, el significado de cada variable, y una
  interpretación breve (2-3 líneas) de qué explica esa fórmula
  específicamente — no un ensayo de óptica.
- **Distinción explícita entre física real y aproximación calibrada.** El
  recuadro del criterio de Rayleigh se presenta como fórmula física
  establecida (con cita); el recuadro del mapeo a blur se presenta
  claramente como aproximación de ingeniería propia, calibrada en el spike
  001 — no se mezclan en el mismo nivel de autoridad. Esto extiende la
  misma honestidad que ya exige [ADR-0001](adr/0001-simulacion-visual-vs-modelo-fisico.md)
  al plano académico, no solo al disclaimer de la simulación visual.
- **Resuelto antes de construir:** la discrepancia de constante documentada
  en [requirements.md §3.5](requirements.md#35-discrepancia-de-constante--resuelta-2026-08-13)
  — se corrigió `diametroOptimo()` a la constante 1.9 citada.

### 7. Sub-pestañas dentro del panel, no una pestaña de nivel superior

Al implementar RF-12 se evaluó si el contenido académico debía vivir en una
pestaña de navegación separada del resto de la aplicación. Se descartó: una
pestaña de nivel superior fragmenta la experiencia y obliga a abandonar la
herramienta para consultar el fundamento. En su lugar, un único panel
colapsable contiene tres sub-pestañas, que van de lo general a lo específico:

| Pestaña          | Contenido                                                                                                         | Para quién                                           |
| ---------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Concepto**     | Qué es una cámara estenopeica, los dos efectos que compiten (geometría vs. difracción) y por qué existe un óptimo | Visitante sin contexto previo                        |
| **Fórmulas**     | Un recuadro por fórmula: ecuación, variables, interpretación                                                      | Docente o estudiante que necesita el detalle técnico |
| **Aplicaciones** | Usos reales, importancia académica del límite de difracción, uso en el aula                                       | Docente evaluando si sirve para su clase             |

Decisiones asociadas:

- **Codificación visual de la autoridad de cada fórmula.** Los recuadros de
  fórmulas físicas usan el azul de acento y llevan cita; el recuadro del
  mapeo a desenfoque usa el ámbar de advertencia y declara explícitamente
  que no es una ley física. La distinción exigida por
  [ADR-0001](adr/0001-simulacion-visual-vs-modelo-fisico.md) se vuelve así
  visible de un vistazo, no solo textual.
- **`<details>/<summary>` nativo** en vez de un colapsable propio con JS:
  accesible por teclado sin trabajo adicional (RNF-04).
- **El cambio de idioma no reinicia la pestaña activa** — verificado; el
  usuario no pierde su lugar al traducir.
- **Convención decimal por idioma:** la ecuación se muestra con coma decimal
  en español y punto en inglés, ya que forma parte del contenido traducible,
  no del código.

## Limitaciones conocidas del prototipo

- El blur en este prototipo usa un filtro CSS sobre un patrón dibujado en
  `<canvas>`, no la lógica exacta de `scipy.ndimage.gaussian_filter` del
  spike. Sirve para validar la interacción, no el resultado visual final
  (eso se resuelve en fase 4 con el backend real).
- La escala de valores del slider de diámetro es ilustrativa; en el MVP
  real los rangos de input deben calibrarse con casos de uso reales
  (distancias focales típicas de cámaras pinhole educativas).

## Siguiente paso

Fase 4 — construcción técnica: implementar el layout validado aquí con
React + Tailwind, y conectar el cálculo real vía FastAPI en vez de la
aproximación en JS del prototipo.
