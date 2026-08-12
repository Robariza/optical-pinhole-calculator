# ADR-0001: Simulación visual aproximada en lugar de modelo físico de difracción

**Estado:** Aceptada
**Fecha:** 2026-08-12
**Relacionado con:** [docs/spikes/001-simulacion-imagen.md](../spikes/001-simulacion-imagen.md)

## Contexto

El MVP necesita mostrar visualmente el efecto de un pinhole mal o bien
dimensionado sobre una imagen. Un modelo físico real de difracción requiere
óptica de Fourier / propagación de ondas — fuera de alcance para el tiempo
disponible y para el objetivo educativo del proyecto (no es una herramienta
de investigación óptica).

Se evaluó una alternativa más simple: aplicar un blur gaussiano cuyo `sigma`
se calcula a partir de la desviación del diámetro del orificio respecto al
óptimo definido por el criterio de Rayleigh.

## Decisión

Usar blur gaussiano ponderado por desviación de Rayleigh como aproximación
visual, **declarando explícitamente en la interfaz** que no es un modelo
físico de difracción real, para no comunicar una precisión que la
herramienta no tiene.

La validez de este enfoque se confirmó mediante un spike técnico (ver
documento relacionado), que también reveló la necesidad de acotar el
parámetro `sigma` con un máximo (`sigma_max`), ya que sin ese límite la
imagen se volvía ilegible en los extremos y dejaba de cumplir su propósito
educativo.

## Consecuencias

**Positivas**
- Implementación simple (scipy/PIL en backend, o equivalente en frontend con Canvas).
- Rápido de calcular en tiempo real para una interfaz interactiva.
- Suficiente para el objetivo pedagógico: mostrar la tendencia, no medir con precisión física.

**Negativas / limitaciones aceptadas**
- No es científicamente preciso; no debe usarse para diseño real de instrumentos ópticos.
- Requiere comunicación clara en la UI para evitar que se interprete como simulación física exacta.

**Seguimiento**
- Los valores de calibración (`k`, `sigma_base`, `sigma_max`) deben quedar
  como constantes documentadas en el código backend, no como "números mágicos".
