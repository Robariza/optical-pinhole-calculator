# Brief de producto

**Proyecto:** Calculadora óptica paramétrica con simulación de imagen
**Fase del portafolio:** Fase 2 — Investigación de usuario (proyecto insignia 1 de 3)
**Especialización:** Full-stack con enfoque en producto
**Última actualización:** 2026-08-12

> Este documento es vivo: se actualiza a medida que el proyecto avanza de fase.
> Las decisiones técnicas puntuales se registran aparte como ADRs en [`docs/adr/`](adr).

## 1. Problema y usuario

**Usuario primario:** docentes de ciencias (física/óptica) en secundaria o
primeros semestres universitarios que enseñan formación de imagen sin
necesitar equipo costoso.

**Usuario secundario:** estudiantes que exploran el concepto por cuenta propia.

**Problema:** entender cómo el tamaño del pinhole y la distancia focal afectan
la nitidez de una imagen requiere construir una cámara física (lento, limitado
a pruebas) o interpretar fórmulas abstractas (Rayleigh) sin referente visual.
No existe una herramienta accesible que conecte la teoría con un resultado
visual inmediato.

**Hipótesis de valor:** si el usuario ve en tiempo real cómo cambia una imagen
simulada al mover los parámetros, internaliza el concepto de
difracción/resolución óptica más rápido que leyendo la fórmula de forma aislada.

## 2. Historias de usuario (MVP)

1. Como docente, quiero ingresar distancia focal y diámetro de orificio para
   ver si están dentro del rango óptimo (fórmula de Rayleigh), así valido
   diseños antes de construir la cámara.
2. Como estudiante, quiero ver una imagen de referencia simulada con
   nitidez/difracción según mis parámetros, para entender visualmente el
   efecto sin cámara física.
3. Como docente, quiero comparar dos configuraciones lado a lado, para
   mostrar en clase el antes/después de un diseño subóptimo frente a uno óptimo.
4. Como usuario, quiero cambiar el idioma (ES/EN) para usarlo en distintos
   contextos educativos.
5. Como docente, quiero ver la fórmula matemática detrás del cálculo con una
   breve interpretación de cada término, para poder usarla como material de
   apoyo verificable en clase, sin que reemplace ni complique el uso
   práctico de la herramienta.

## 3. Alcance funcional

### MVP (fase 4 — construcción inicial)

- Inputs: distancia focal, diámetro del orificio, longitud de onda de referencia.
- Output numérico: diámetro óptimo (Rayleigh) y clasificación (óptimo /
  subóptimo / sobredimensionado).
- Simulación visual: blur/difracción aplicado sobre una imagen base,
  proporcional al desvío del punto óptimo. **Es una aproximación visual
  educativa, no ray-tracing físico real** — se declara explícitamente en la
  interfaz para no ofrecer una precisión que no existe (ver
  [ADR-0001](adr/0001-simulacion-visual-vs-modelo-fisico.md)).
- Interfaz bilingüe (ES/EN) con selector.
- Respaldo académico: recuadros individuales con la fórmula usada, sus
  variables y una interpretación breve, presentados como panel secundario
  colapsable (no compite con el panel principal). Distingue explícitamente
  entre fórmula física (Rayleigh) y aproximación de ingeniería calibrada
  (mapeo a blur), reforzando [ADR-0001](adr/0001-simulacion-visual-vs-modelo-fisico.md).

### Extensión (post-MVP)

- Comparador lado a lado de dos configuraciones.
- Guardar/compartir configuración vía parámetros de URL.
- Permitir subir imagen propia del usuario para simular con sus parámetros.

## 4. Arquitectura técnica preliminar

| Capa     | Decisión                                             | Justificación                                         |
| -------- | ---------------------------------------------------- | ----------------------------------------------------- |
| Frontend | React + Vite, Tailwind, Canvas API                   | Interactividad en tiempo real, ecosistema conocido    |
| Backend  | FastAPI (Python)                                     | Separa cálculo científico del frontend; más testeable |
| Tests    | pytest sobre lógica de fórmulas                      | Casos límite: orificio = 0, focal negativa, etc.      |
| Deploy   | Netlify/Vercel (frontend) + Railway/Render (backend) | Free tier suficiente para demo                        |
| i18n     | react-i18next                                        | Soporta el requisito bilingüe                         |

## 5. Riesgos técnicos identificados

| Riesgo                                            | Estado              | Referencia                                                              |
| ------------------------------------------------- | ------------------- | ----------------------------------------------------------------------- |
| Viabilidad visual del blur ponderado por Rayleigh | ✅ Resuelto (spike) | [docs/spikes/001-simulacion-imagen.md](spikes/001-simulacion-imagen.md) |

## 6. Criterio de éxito del proyecto (para el portafolio)

- Demo desplegada y funcional, no solo repositorio de código.
- README con problema, decisiones técnicas y cómo correr el proyecto localmente.
- Cobertura de pruebas sobre la lógica de cálculo (backend).
- Caso de estudio escrito para el portafolio: investigación, diseño,
  arquitectura y resultado — construido a partir de estos mismos documentos.

---

_Fórmula de Rayleigh y parámetros base derivados del proyecto previo de cámara
pinhole para la actividad ecológica en Junín, Cundinamarca._

## Referencias

Strutt, J. W. (1891). On pin-hole photography. _Philosophical Magazine_, _31_, 87–99.

Young, B. (2024, April 5). _Pinhole design – what Lord Rayleigh really said_. AlternativePhotography.com. https://www.alternativephotography.com/pinhole-design-what-lord-rayleigh-really-said/
