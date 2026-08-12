# -*- coding: utf-8 -*-
"""
SPIKE TÉCNICO — Proyecto 1: Calculadora óptica paramétrica
Objetivo: validar si un blur gaussiano ponderado por el criterio de Rayleigh
produce un resultado visualmente creíble para 3 escenarios:
  1. Orificio subdimensionado (menor al óptimo) -> domina la difracción
  2. Orificio óptimo (criterio de Rayleigh)      -> nitidez máxima posible
  3. Orificio sobredimensionado (mayor al óptimo) -> domina el borroneo geométrico

Nota: esto NO es un modelo físico de difracción real (eso requeriría óptica de
Fourier / propagación de ondas). Es una aproximación visual con fines educativos,
tal como se documentó en el brief (sección 3, "Alcance funcional").
"""
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.ndimage import gaussian_filter

# --- 1. Generar imagen de prueba (patrón de resolución tipo "mira" óptica) ---
def generar_imagen_prueba(size=300):
    img = Image.new("L", (size, size), color=255)
    draw = ImageDraw.Draw(img)
    # Líneas radiales para evaluar pérdida de resolución en todas direcciones
    center = size // 2
    for angle_deg in range(0, 360, 6):
        angle = math.radians(angle_deg)
        x2 = center + center * math.cos(angle)
        y2 = center + center * math.sin(angle)
        draw.line([(center, center), (x2, y2)], fill=0, width=2)
    # Círculos concéntricos para ver pérdida de contraste radial
    for r in range(20, center, 20):
        draw.ellipse([center - r, center - r, center + r, center + r], outline=0, width=1)
    return np.array(img).astype(float)

# --- 2. Fórmula de Rayleigh para diámetro óptimo de pinhole ---
def diametro_optimo(focal_mm, wavelength_nm=550):
    """Aproximación estándar: d = sqrt(2 * lambda * f) (unidades consistentes en mm)."""
    wavelength_mm = wavelength_nm * 1e-6
    return math.sqrt(2 * wavelength_mm * focal_mm)

# --- 3. Mapear el desvío del diámetro óptimo a un sigma de blur ---
def sigma_desde_diametro(d_mm, d_optimo_mm, k=3.2, sigma_base=0.6, sigma_max=8.0):
    """
    A mayor desviación relativa (en cualquier dirección) del diámetro óptimo,
    mayor sigma de blur. sigma_base evita nitidez perfecta irreal (pinhole
    nunca es tan nítido como una lente). sigma_max evita que el efecto
    destruya por completo la imagen y deje de ser educativo (hallazgo del
    primer intento del spike, con k=18: la imagen se volvía ilegible).
    """
    desviacion_relativa = abs(d_mm - d_optimo_mm) / d_optimo_mm
    sigma = sigma_base + k * desviacion_relativa
    return min(sigma, sigma_max)

# --- 4. Ejecutar los 3 escenarios ---
focal_mm = 50.0  # distancia focal de ejemplo
d_opt = diametro_optimo(focal_mm)

escenarios = {
    "1_subdimensionado (difraccion)": d_opt * 0.4,
    "2_optimo (rayleigh)": d_opt,
    "3_sobredimensionado (geometrico)": d_opt * 2.2,
}

base = generar_imagen_prueba()
resultados = {}
for nombre, d in escenarios.items():
    sigma = sigma_desde_diametro(d, d_opt)
    blurred = gaussian_filter(base, sigma=sigma)
    resultados[nombre] = (d, sigma, blurred)

# --- 5. Componer imagen comparativa lado a lado con etiquetas ---
w, h = base.shape
canvas = Image.new("RGB", (w * 3 + 40, h + 70), color="white")
draw = ImageDraw.Draw(canvas)
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 13)
    font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 11)
except Exception:
    font = ImageFont.load_default()
    font_small = font

x_offset = 10
for nombre, (d, sigma, blurred_arr) in resultados.items():
    img_tile = Image.fromarray(np.clip(blurred_arr, 0, 255).astype(np.uint8)).convert("RGB")
    canvas.paste(img_tile, (x_offset, 50))
    label = nombre.split("_", 1)[1].replace("_", " ")
    draw.text((x_offset, 10), label, fill="black", font=font)
    draw.text((x_offset, 28), f"d={d:.3f}mm  sigma={sigma:.2f}", fill="gray", font=font_small)
    x_offset += w + 15

draw.text((10, h + 55), f"Distancia focal: {focal_mm}mm | Diametro optimo (Rayleigh): {d_opt:.3f}mm",
          fill="black", font=font_small)

import os
output_path = os.path.join(os.path.dirname(__file__), "output", "comparacion_escenarios.png")
canvas.save(output_path)
print(f"Spike generado: {output_path}")
print(f"d_optimo = {d_opt:.4f} mm para focal = {focal_mm} mm")
for nombre, (d, sigma, _) in resultados.items():
    print(f"  {nombre}: d={d:.4f}mm sigma={sigma:.3f}")
