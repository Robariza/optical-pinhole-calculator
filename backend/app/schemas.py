"""
ESQUEMAS DE LA API — contrato de entrada y salida.

Definen la forma de los datos que la API acepta y devuelve. FastAPI los usa
para tres cosas a la vez, sin código adicional: validar la petición, responder
HTTP 422 con detalle si no cumple, y generar la documentación en /docs.

Separados de app/model.py a propósito: el modelo es lógica de negocio pura y no
debe conocer nada del transporte HTTP. Si mañana el cálculo se usara desde un
script o una cola de tareas, model.py sirve igual; estos esquemas no harían
falta. Esta separación es la misma que ADR-0002 exige en el frontend.

Unidades: la API habla en NANÓMETROS para la longitud de onda, siguiendo el
diccionario de campos de docs/requirements.md §3.1. El modelo calcula en
milímetros; la conversión ocurre aquí, en el borde, para que un cliente nunca
tenga que enviar valores como 0.00055.
"""

from pydantic import BaseModel, Field

# Espectro visible aproximado, en nanómetros. La interfaz ofrece solo tres
# valores (450/550/650), pero la API acepta cualquier punto del rango: esa
# restricción es una decisión de UI, no una ley física.
WAVELENGTH_NM_MIN = 380
WAVELENGTH_NM_MAX = 750

WAVELENGTH_NM_DEFAULT = 550


class CalculoRequest(BaseModel):
    """Parámetros de entrada del cálculo óptico."""

    focal_mm: float = Field(
        gt=0,
        le=10_000,
        description="Distancia del orificio al plano de imagen, en milímetros.",
        examples=[50.0],
    )
    diametro_mm: float = Field(
        gt=0,
        le=100,
        description="Diámetro del orificio, en milímetros.",
        examples=[0.315],
    )
    wavelength_nm: int = Field(
        default=WAVELENGTH_NM_DEFAULT,
        ge=WAVELENGTH_NM_MIN,
        le=WAVELENGTH_NM_MAX,
        description="Longitud de onda de referencia, en nanómetros (espectro visible).",
        examples=[550],
    )

    @property
    def wavelength_mm(self) -> float:
        """Conversión al sistema de unidades que usa el modelo (1 nm = 1e-6 mm)."""
        return self.wavelength_nm * 1e-6


class CalculoResponse(BaseModel):
    """Resultado del cálculo óptico."""

    d_optimo: float = Field(
        description="Diámetro óptimo según el criterio de Rayleigh, en milímetros.",
        examples=[0.315079],
    )
    sigma: float = Field(
        description=(
            "Intensidad del desenfoque simulado. Aproximación visual educativa, "
            "no un modelo físico de difracción (ver ADR-0001)."
        ),
        examples=[0.6],
    )
    clasificacion: str = Field(
        description="Clasificación del diámetro: optimo, subdimensionado o sobredimensionado.",
        examples=["optimo"],
    )
