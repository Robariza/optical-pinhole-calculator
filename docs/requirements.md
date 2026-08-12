# Requerimientos

**Proyecto:** Calculadora óptica paramétrica con simulación de imagen
**Última actualización:** 2026-08-12
**Basado en:** [product-brief.md](product-brief.md) (historias de usuario 1–4)

> Documento vivo. Se actualiza cuando cambian campos, alcance o restricciones.
> Ver también [wireframes.md](wireframes.md) para las decisiones de UX que
> derivan de estos requerimientos.

## 1. Requerimientos funcionales (RF)

Un requerimiento funcional describe **qué debe hacer el sistema** —una
acción o cálculo observable por el usuario.

| ID | Requerimiento | Historia de usuario relacionada | Estado |
|---|---|---|---|
| RF-01 | El sistema debe permitir ingresar el diámetro del orificio mediante un control interactivo (iris) | HU-1 | ✅ Implementado (prototipo) |
| RF-02 | El sistema debe permitir ingresar la distancia focal | HU-1 | ✅ Implementado (prototipo) |
| RF-03 | El sistema debe permitir seleccionar la longitud de onda de referencia | HU-1 | ⚠️ UI presente, sin efecto en el cálculo aún |
| RF-04 | El sistema debe calcular el diámetro óptimo mediante el criterio de Rayleigh | HU-1 | ✅ Implementado (`model.js`) |
| RF-05 | El sistema debe clasificar el resultado como óptimo, subdimensionado o sobredimensionado | HU-1 | ✅ Implementado |
| RF-06 | El sistema debe mostrar una simulación visual del efecto de desenfoque sobre una imagen de referencia | HU-2 | ✅ Implementado (aproximación vía CSS blur en prototipo; pendiente motor real en fase 4) |
| RF-07 | El sistema debe declarar visiblemente que la simulación es una aproximación educativa, no un modelo físico exacto | ADR-0001 | ✅ Implementado |
| RF-08 | El sistema debe permitir alternar el idioma de la interfaz entre español e inglés | HU-4 | ✅ Implementado (`i18n.js`, verificado con prueba funcional en jsdom) |
| RF-09 | El sistema debe permitir comparar dos configuraciones lado a lado | HU-3 | ⏳ Post-MVP, no iniciado |
| RF-10 | El sistema debe permitir compartir una configuración vía parámetros de URL | Extensión (brief §3) | ⏳ Post-MVP, no iniciado |
| RF-11 | El sistema debe permitir subir una imagen propia para simular con los parámetros ingresados | Extensión (brief §3) | ⏳ Post-MVP, no iniciado |

## 2. Requerimientos no funcionales (RNF)

Un requerimiento no funcional describe **cómo debe comportarse el sistema**
—cualidades como rendimiento, mantenibilidad o accesibilidad, no acciones
puntuales.

| ID | Requerimiento | Categoría | Origen / justificación |
|---|---|---|---|
| RNF-01 | La vista previa debe actualizarse en tiempo real (percibido como instantáneo, sin delay de red notable) al mover los controles | Rendimiento | Hipótesis de valor del brief: "ver en tiempo real" |
| RNF-02 | El cálculo y la representación (View) deben mantenerse en archivos separados de la lógica (Model), sin mezclar responsabilidades | Mantenibilidad | ADR-0002 |
| RNF-03 | La interfaz debe ser responsive, usable desde móvil hasta escritorio | Usabilidad | Buena práctica esperada en un proyecto de portafolio |
| RNF-04 | Los controles deben tener foco visible por teclado y contraste de color adecuado (mínimo AA) | Accesibilidad | Buena práctica de ingeniería de software / criterio de calidad del portafolio |
| RNF-05 | La lógica de cálculo del backend debe tener cobertura de pruebas automatizadas, incluyendo casos límite (orificio = 0, focal negativa, etc.) | Confiabilidad | product-brief.md §6 |
| RNF-06 | El despliegue debe operar dentro de niveles gratuitos de los proveedores elegidos (Netlify/Vercel + Railway/Render) | Restricción de costo | product-brief.md §4 |
| RNF-07 | Toda decisión de arquitectura no trivial debe registrarse como ADR en `docs/adr/` | Documentación / mantenibilidad | Proceso adoptado para el portafolio (ver README del repo) |
| RNF-08 | La duplicación de lógica de cálculo entre frontend (preview) y backend (fuente de verdad) debe quedar explícitamente documentada donde ocurra | Transparencia técnica | ADR-0002, riesgo aceptado |

## 3. Diccionario de campos

### 3.1 Campos de entrada (controlados por el usuario)

| Campo | Tipo | Unidad | Rango / valores | Requerido | Control UI | Notas |
|---|---|---|---|---|---|---|
| `diametroMm` | `float` | milímetros | 0.005 – 0.200 (prototipo; pendiente calibrar con casos reales) | Sí | Slider + iris visual | Ver limitación en wireframes.md: rango ilustrativo, no validado con hardware real |
| `focalMm` | `float` | milímetros | 20 – 150 | Sí | Slider | Rango típico de cámaras pinhole educativas, sin validar aún con casos reales |
| `wavelengthNm` | `enum` (`int`) | nanómetros | `{450, 550, 650}` | Sí | Select | 550nm = valor por defecto (luz visible media). Aún no conectado al cálculo (RF-03) |
| `idioma` | `enum` (`string`) | — | `{"es", "en"}` | Sí | Toggle en header | Por defecto `"es"`. Implementado vía `i18n.js` (diccionario de textos + `I18N.setLang()`) |

### 3.2 Campos calculados (salida del sistema, no editables)

| Campo | Tipo | Unidad | Origen | Descripción |
|---|---|---|---|---|
| `dOptimo` | `float` | milímetros | `Model.diametroOptimo(focalMm, wavelengthMm)` | Diámetro óptimo según criterio de Rayleigh |
| `sigma` | `float` | px (blur) | `Model.sigmaDesdeDiametro(diametroMm, dOptimo)` | Intensidad del desenfoque simulado, acotada por `SIGMA_MAX` (ADR-0001) |
| `clasificacion` | `enum` (`string`) | — | `Model.clasificar(diametroMm, dOptimo)` | `"optimo"` \| `"subdimensionado"` \| `"sobredimensionado"` |

### 3.3 Constantes de calibración (no editables por el usuario, documentadas por trazabilidad)

| Constante | Valor actual | Definida en | Justificación |
|---|---|---|---|
| `SIGMA_K` | `3.2` | `model.js` | Resultado del spike 001 tras descartar `k=18` (ilegible) |
| `SIGMA_BASE` | `0.6` | `model.js` | Evita nitidez perfecta irreal en el óptimo |
| `SIGMA_MAX` | `8.0` | `model.js` | Límite superior para que el efecto degrade sin destruir la imagen |
| `UMBRAL_OPTIMO` | `0.15` (15%) | `model.js` | Desviación relativa máxima para clasificar como "óptimo"; sin validar aún con usuarios reales — candidato a ajuste en fase de pruebas de usuario |

## 4. Trazabilidad rápida

```
Historia de usuario (product-brief.md)
        │
        ▼
Requerimiento funcional (RF-xx, este documento)
        │
        ▼
Decisión de UX (wireframes.md) ──┐
        │                        │
        ▼                        ▼
Campo/control (diccionario)   Componente del prototipo (model/view/controller.js)
```

## 5. Próximos pasos derivados de este documento

- Calibrar los rangos de `diametroMm` y `focalMm` con casos reales de cámaras
  pinhole educativas (actualmente son ilustrativos).
- Conectar `wavelengthNm` al cálculo real (actualmente el selector no afecta
  el resultado — RF-03 incompleto).
