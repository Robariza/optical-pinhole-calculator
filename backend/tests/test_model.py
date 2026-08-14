"""
Pruebas del modelo óptico.

Escritas ANTES de la implementación (TDD): definen el comportamiento
esperado, incluyendo los casos límite exigidos por RNF-05 en
docs/requirements.md.

Referencia de las fórmulas: docs/design/prototype/model.js (prototipo de
fase 3) y el panel de fundamento académico (RF-12).
"""

import math

import pytest

from app.model import (
    SIGMA_BASE,
    SIGMA_MAX,
    calcular,
    clasificar,
    diametro_optimo,
    sigma_desde_diametro,
)

# --- diametro_optimo: criterio de Rayleigh d = 1.9 * sqrt(f * lambda) ---


def test_diametro_optimo_valor_conocido():
    """Caso de referencia usado en el spike 001 y en la documentación."""
    # 1.9 * sqrt(50 * 0.00055) = 0.31513...
    assert diametro_optimo(50.0, 0.00055) == pytest.approx(0.3151, abs=1e-4)


def test_diametro_optimo_crece_con_focal():
    """Una cámara más profunda requiere un orificio mayor."""
    assert diametro_optimo(100.0, 0.00055) > diametro_optimo(50.0, 0.00055)


def test_diametro_optimo_crece_con_longitud_de_onda():
    """La luz roja (lambda mayor) exige un orificio más grande que la azul."""
    azul = diametro_optimo(50.0, 0.00045)
    rojo = diametro_optimo(50.0, 0.00065)
    assert rojo > azul


def test_diametro_optimo_escala_con_raiz_cuadrada():
    """Cuadruplicar la focal debe duplicar el diámetro óptimo (relación sqrt)."""
    d1 = diametro_optimo(25.0, 0.00055)
    d4 = diametro_optimo(100.0, 0.00055)
    assert d4 == pytest.approx(2 * d1, rel=1e-9)


@pytest.mark.parametrize("focal_invalida", [0.0, -1.0, -50.0])
def test_diametro_optimo_rechaza_focal_no_positiva(focal_invalida):
    """RNF-05: una focal cero o negativa no tiene sentido físico."""
    with pytest.raises(ValueError):
        diametro_optimo(focal_invalida, 0.00055)


@pytest.mark.parametrize("lambda_invalida", [0.0, -0.00055])
def test_diametro_optimo_rechaza_longitud_de_onda_no_positiva(lambda_invalida):
    with pytest.raises(ValueError):
        diametro_optimo(50.0, lambda_invalida)


# --- sigma_desde_diametro: mapeo a desenfoque (aproximación propia, ADR-0001) ---


def test_sigma_en_el_optimo_es_el_valor_base():
    """Sin desviación, el desenfoque es el mínimo (nunca cero: ADR-0001)."""
    assert sigma_desde_diametro(0.315, 0.315) == pytest.approx(SIGMA_BASE)


def test_sigma_crece_con_la_desviacion():
    d_opt = 0.315
    poco = sigma_desde_diametro(d_opt * 1.2, d_opt)
    mucho = sigma_desde_diametro(d_opt * 1.8, d_opt)
    assert mucho > poco > SIGMA_BASE


def test_sigma_es_simetrico_respecto_al_optimo():
    """Desviarse un 40% por debajo o por encima produce el mismo desenfoque."""
    d_opt = 0.315
    assert sigma_desde_diametro(d_opt * 0.6, d_opt) == pytest.approx(
        sigma_desde_diametro(d_opt * 1.4, d_opt)
    )


def test_sigma_respeta_el_limite_superior():
    """Hallazgo del spike 001: sin tope, la imagen se vuelve ilegible."""
    assert sigma_desde_diametro(100.0, 0.315) == pytest.approx(SIGMA_MAX)


def test_sigma_rechaza_optimo_no_positivo():
    """Evita la división por cero al calcular la desviación relativa."""
    with pytest.raises(ValueError):
        sigma_desde_diametro(0.3, 0.0)


# --- clasificar ---


def test_clasifica_como_optimo_dentro_del_umbral():
    d_opt = 0.315
    assert clasificar(d_opt, d_opt) == "optimo"
    assert clasificar(d_opt * 1.10, d_opt) == "optimo"  # 10% < umbral 15%


def test_clasifica_subdimensionado():
    d_opt = 0.315
    assert clasificar(d_opt * 0.5, d_opt) == "subdimensionado"


def test_clasifica_sobredimensionado():
    d_opt = 0.315
    assert clasificar(d_opt * 2.0, d_opt) == "sobredimensionado"


def test_clasificar_rechaza_optimo_no_positivo():
    with pytest.raises(ValueError):
        clasificar(0.3, 0.0)


# --- calcular: punto de entrada único ---


def test_calcular_devuelve_las_tres_claves():
    resultado = calcular(focal_mm=50.0, diametro_mm=0.315, wavelength_mm=0.00055)
    assert set(resultado) == {"d_optimo", "sigma", "clasificacion"}


def test_calcular_es_coherente_con_las_funciones_individuales():
    """El punto de entrada no debe reimplementar la lógica, solo componerla."""
    resultado = calcular(focal_mm=50.0, diametro_mm=0.20, wavelength_mm=0.00055)
    d_opt = diametro_optimo(50.0, 0.00055)

    assert resultado["d_optimo"] == pytest.approx(d_opt)
    assert resultado["sigma"] == pytest.approx(sigma_desde_diametro(0.20, d_opt))
    assert resultado["clasificacion"] == clasificar(0.20, d_opt)


def test_calcular_usa_550nm_por_defecto():
    """Valor por defecto documentado en requirements.md §3.1."""
    con_defecto = calcular(focal_mm=50.0, diametro_mm=0.315)
    explicito = calcular(focal_mm=50.0, diametro_mm=0.315, wavelength_mm=0.00055)
    assert con_defecto == explicito


@pytest.mark.parametrize(
    "kwargs",
    [
        {"focal_mm": 0.0, "diametro_mm": 0.3},
        {"focal_mm": -50.0, "diametro_mm": 0.3},
        {"focal_mm": 50.0, "diametro_mm": 0.0},
        {"focal_mm": 50.0, "diametro_mm": -0.3},
    ],
)
def test_calcular_rechaza_entradas_invalidas(kwargs):
    """RNF-05: el backend es la fuente de verdad y valida antes de calcular."""
    with pytest.raises(ValueError):
        calcular(**kwargs)


def test_calcular_nunca_devuelve_nan():
    """Regresión: el prototipo en JS producía NaN con entradas límite."""
    resultado = calcular(focal_mm=20.0, diametro_mm=0.001, wavelength_mm=0.00045)
    assert not math.isnan(resultado["d_optimo"])
    assert not math.isnan(resultado["sigma"])
