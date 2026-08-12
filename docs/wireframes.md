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
