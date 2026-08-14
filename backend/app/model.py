"""
MODELO ÓPTICO — fuente de verdad del cálculo.

Lógica de negocio pura: sin dependencias de FastAPI, HTTP ni de ninguna
capa de presentación. Esto la hace testeable de forma aislada y reutilizable
si el proyecto cambiara de framework.

Equivalente en el prototipo de fase 3: docs/design/prototype/model.js. Esa
copia en JS existe únicamente para el preview instantáneo del navegador; este
módulo es la referencia autoritativa (ver ADR-0002, "duplicación aceptada").

A diferencia del prototipo, aquí SÍ se validan las entradas: el backend recibe
peticiones HTTP arbitrarias, no valores acotados por un slider (RNF-05).
"""

import math

# --- Constantes físicas ---

# Constante empírica de Lord Rayleigh, determinada experimentalmente.
# Ver docs/product-brief.md (Strutt, 1891; Young, 2024).
RAYLEIGH_CONST = 1.9

# Longitud de onda por defecto: luz visible media (550 nm expresados en mm).
# Documentado en docs/requirements.md §3.1.
WAVELENGTH_DEFAULT_MM = 550e-6

# --- Constantes de calibración de la simulación visual ---
# NO son física: son parámetros de una aproximación de ingeniería, calibrados
# en el spike 001. Ver docs/adr/0001-simulacion-visual-vs-modelo-fisico.md.

SIGMA_K = 3.2  # escala de crecimiento del desenfoque según la desviación
SIGMA_BASE = 0.6  # desenfoque mínimo: una estenopeica nunca es perfectamente nítida
SIGMA_MAX = 8.0  # tope: sin él la imagen se vuelve ilegible (hallazgo del spike 001)

UMBRAL_OPTIMO = 0.15  # desviación relativa máxima para clasificar como "óptimo"


def diametro_optimo(focal_mm: float, wavelength_mm: float = WAVELENGTH_DEFAULT_MM) -> float:
    """Diámetro óptimo del orificio según el criterio de Rayleigh.

        d = 1.9 * sqrt(f * lambda)

    Equilibra los dos efectos que compiten: el desenfoque geométrico (que crece
    con orificios grandes) y la difracción (que domina en orificios pequeños).

    Args:
        focal_mm: distancia del orificio al plano de imagen, en mm.
        wavelength_mm: longitud de onda de la luz, en mm.

    Returns:
        Diámetro óptimo en mm.

    Raises:
        ValueError: si algún parámetro no es estrictamente positivo.
    """
    if focal_mm <= 0:
        raise ValueError(f"La distancia focal debe ser positiva, se recibió {focal_mm}")
    if wavelength_mm <= 0:
        raise ValueError(f"La longitud de onda debe ser positiva, se recibió {wavelength_mm}")

    return RAYLEIGH_CONST * math.sqrt(focal_mm * wavelength_mm)


def sigma_desde_diametro(diametro_mm: float, d_optimo_mm: float) -> float:
    """Intensidad del desenfoque simulado a partir de la desviación del óptimo.

        sigma = min(sigma_base + k * |d - d_opt| / d_opt, sigma_max)

    ADVERTENCIA: esto no es un modelo físico de difracción. Es una aproximación
    visual con fines educativos (ADR-0001). No usar para diseñar instrumentos.

    Raises:
        ValueError: si d_optimo_mm no es positivo (evita división por cero).
    """
    if d_optimo_mm <= 0:
        raise ValueError(f"El diámetro óptimo debe ser positivo, se recibió {d_optimo_mm}")

    desviacion_relativa = abs(diametro_mm - d_optimo_mm) / d_optimo_mm
    return min(SIGMA_BASE + SIGMA_K * desviacion_relativa, SIGMA_MAX)


def clasificar(diametro_mm: float, d_optimo_mm: float) -> str:
    """Clasifica el diámetro respecto al óptimo.

    Returns:
        "optimo", "subdimensionado" o "sobredimensionado".

    Raises:
        ValueError: si d_optimo_mm no es positivo.
    """
    if d_optimo_mm <= 0:
        raise ValueError(f"El diámetro óptimo debe ser positivo, se recibió {d_optimo_mm}")

    desviacion_relativa = abs(diametro_mm - d_optimo_mm) / d_optimo_mm
    if desviacion_relativa < UMBRAL_OPTIMO:
        return "optimo"
    return "subdimensionado" if diametro_mm < d_optimo_mm else "sobredimensionado"


def calcular(
    focal_mm: float,
    diametro_mm: float,
    wavelength_mm: float = WAVELENGTH_DEFAULT_MM,
) -> dict:
    """Punto de entrada único: compone las funciones anteriores.

    No reimplementa lógica; solo orquesta, para que exista una sola definición
    de cada fórmula.

    Raises:
        ValueError: si alguna entrada no es físicamente válida.
    """
    if diametro_mm <= 0:
        raise ValueError(f"El diámetro del orificio debe ser positivo, se recibió {diametro_mm}")

    d_opt = diametro_optimo(focal_mm, wavelength_mm)

    return {
        "d_optimo": d_opt,
        "sigma": sigma_desde_diametro(diametro_mm, d_opt),
        "clasificacion": clasificar(diametro_mm, d_opt),
    }
