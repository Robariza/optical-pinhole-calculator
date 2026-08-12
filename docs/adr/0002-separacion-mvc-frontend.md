# ADR-0002: Separación de responsabilidades (estilo MVC) en frontend

**Estado:** Aceptada
**Fecha:** 2026-08-12
**Relacionado con:** [docs/wireframes.md](../wireframes.md), fase 4 (construcción técnica)

## Contexto

El prototipo de fase 3 empezó como un único archivo HTML con estructura,
estilos y lógica mezclados. Es válido para explorar una idea rápido, pero no
escala como base para fase 4 ni demuestra buenas prácticas de separación de
responsabilidades — algo que sí se evalúa en un portafolio técnico.

Se evaluó adoptar un patrón MVC. El proyecto real usará React (SPA) + FastAPI
(API), donde MVC clásico (servidor con templates) no aplica de forma literal.

## Decisión

Adoptar una separación de responsabilidades equivalente a MVC, adaptada a
cada capa del proyecto:

| Rol MVC | En el prototipo (HTML/CSS/JS plano) | En fase 4 (React + FastAPI) |
|---|---|---|
| **Model** | `model.js` — funciones puras de cálculo, sin DOM | Backend FastAPI (fuente de verdad) + un módulo de lógica pura compartible en frontend para preview instantáneo |
| **View** | `index.html` + `styles.css` — estructura y presentación, sin lógica | Componentes React (JSX) + estilos, sin cálculo embebido |
| **Controller** | `controller.js` — escucha eventos, llama a Model, ordena a View | Hooks (`useState`/`useEffect`) que orquestan Model y View |

Regla dura para ambas capas: **la View nunca calcula, el Model nunca toca el
DOM.** El Controller es el único que conoce a ambos.

### Adenda: un cuarto rol para contenido (i18n)

Al implementar RF-08 (idioma), el diccionario de textos no encajaba
limpiamente en ninguno de los tres roles: no es lógica de negocio (Model) ni
manipulación de DOM (View). Se creó `i18n.js` como cuarto archivo,
responsable únicamente de *contenido por idioma*. La View lo consulta
(`I18N.t(key)`) pero nunca decide textos por su cuenta; el Controller es
quien dispara el cambio de idioma y ordena a la View reaplicarlo. Este
patrón se traslada a fase 4 como una capa de i18n independiente de
componentes y de lógica de negocio (p. ej. `react-i18next`, ya contemplado
en `product-brief.md`).

## Consecuencias

**Positivas**
- Los archivos `model.js` son testeables de forma aislada (sin mocks de DOM) — útil ya para pytest cuando se porten a Python en fase 4.
- Cambiar el diseño visual (`styles.css`) no arriesga romper el cálculo.
- El patrón se transfiere directo a React: reduce la curva de decisión en fase 4.

**Negativas / trade-offs aceptados**
- Hay duplicación de la fórmula de Rayleigh entre `model.js` (frontend, preview) y el futuro backend FastAPI (fuente de verdad). Se acepta porque el preview debe ser instantáneo sin llamada de red; se documenta explícitamente para no perder de vista la duplicación (ver también limitación ya registrada en `docs/wireframes.md`).
- Requiere disciplina: es fácil "colar" un cálculo dentro de `view.js` por comodidad. Se revisa en cada PR/commit relevante.
