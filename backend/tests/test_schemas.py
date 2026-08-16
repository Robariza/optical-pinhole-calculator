"""
Pruebas de los esquemas de la API.

Verifican el contrato de entrada/salida: qué acepta, qué rechaza y cómo
convierte unidades. La validación de Pydantic es la primera línea de defensa
antes de que los datos lleguen al modelo (RNF-05).
"""

import pytest
from pydantic import ValidationError

from app.model import WAVELENGTH_DEFAULT_MM
from app.schemas import CalculoRequest, CalculoResponse

# --- Entradas válidas ---


def test_request_acepta_valores_validos():
    req = CalculoRequest(focal_mm=50.0, diametro_mm=0.315, wavelength_nm=550)
    assert req.focal_mm == 50.0
    assert req.diametro_mm == 0.315
    assert req.wavelength_nm == 550


def test_request_usa_550nm_por_defecto():
    """Valor por defecto documentado en docs/requirements.md §3.1."""
    req = CalculoRequest(focal_mm=50.0, diametro_mm=0.315)
    assert req.wavelength_nm == 550


def test_request_convierte_nanometros_a_milimetros():
    """La API habla en nm; el modelo calcula en mm. La conversión ocurre aquí."""
    req = CalculoRequest(focal_mm=50.0, diametro_mm=0.315, wavelength_nm=550)
    assert req.wavelength_mm == pytest.approx(WAVELENGTH_DEFAULT_MM)


@pytest.mark.parametrize("nm, mm_esperado", [(450, 0.00045), (550, 0.00055), (650, 0.00065)])
def test_conversion_para_los_tres_valores_de_la_interfaz(nm, mm_esperado):
    req = CalculoRequest(focal_mm=50.0, diametro_mm=0.315, wavelength_nm=nm)
    assert req.wavelength_mm == pytest.approx(mm_esperado)


def test_request_acepta_enteros_donde_espera_float():
    """Pydantic convierte int -> float sin quejarse: 50 y 50.0 son equivalentes."""
    req = CalculoRequest(focal_mm=50, diametro_mm=1)
    assert isinstance(req.focal_mm, float)


# --- Entradas inválidas ---


@pytest.mark.parametrize("focal_invalida", [0, -1, -50.0])
def test_request_rechaza_focal_no_positiva(focal_invalida):
    with pytest.raises(ValidationError):
        CalculoRequest(focal_mm=focal_invalida, diametro_mm=0.315)


@pytest.mark.parametrize("diametro_invalido", [0, -0.1])
def test_request_rechaza_diametro_no_positivo(diametro_invalido):
    with pytest.raises(ValidationError):
        CalculoRequest(focal_mm=50.0, diametro_mm=diametro_invalido)


@pytest.mark.parametrize("nm_fuera_de_rango", [379, 751, 0, -550])
def test_request_rechaza_longitud_de_onda_fuera_del_espectro_visible(nm_fuera_de_rango):
    with pytest.raises(ValidationError):
        CalculoRequest(focal_mm=50.0, diametro_mm=0.315, wavelength_nm=nm_fuera_de_rango)


def test_request_rechaza_campos_faltantes():
    with pytest.raises(ValidationError):
        CalculoRequest(focal_mm=50.0)  # falta diametro_mm


def test_request_rechaza_tipos_no_numericos():
    with pytest.raises(ValidationError):
        CalculoRequest(focal_mm="cincuenta", diametro_mm=0.315)


def test_error_de_validacion_identifica_el_campo():
    """El detalle del error debe permitir al cliente saber qué corregir."""
    with pytest.raises(ValidationError) as exc:
        CalculoRequest(focal_mm=-1, diametro_mm=0.315)

    campos_con_error = [e["loc"][0] for e in exc.value.errors()]
    assert "focal_mm" in campos_con_error


# --- Respuesta ---


def test_response_acepta_un_resultado_del_modelo():
    """El dict que devuelve model.calcular() debe encajar en el esquema."""
    from app.model import calcular

    resultado = calcular(focal_mm=50.0, diametro_mm=0.315)
    response = CalculoResponse(**resultado)

    assert response.d_optimo == pytest.approx(resultado["d_optimo"])
    assert response.clasificacion == "optimo"
