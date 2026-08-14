# Calculadora óptica paramétrica con simulación de imagen

Herramienta web bilingüe (ES/EN) para docentes y estudiantes de ciencias que permite
explorar cómo el diámetro del orificio y la distancia focal de una cámara pinhole
afectan la nitidez de la imagen resultante, aplicando el criterio de Rayleigh y una
simulación visual del efecto.

Proyecto insignia 1 de 3 del portafolio de Robinson Ariza — especialización
full-stack con enfoque en producto.

## Estado del proyecto

Fase 3 completada (prototipo con MVP funcional: RF-01 a RF-08 y RF-12).
Fase 4 en curso — ver [docs/phase4-plan.md](docs/phase4-plan.md).

| Fase                        | Estado                                                                                            |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| 1. Fundamentos              | ✅ Completada                                                                                     |
| 2. Investigación de usuario | ✅ Completada — ver [docs/product-brief.md](docs/product-brief.md)                                |
| 3. Diseño de interfaz       | ✅ Completada — ver [docs/wireframes.md](docs/wireframes.md) y [prototipo](docs/design/prototype) |
| 4. Construcción técnica     | 🔜 En curso — ver [docs/phase4-plan.md](docs/phase4-plan.md)                                      |
| 5. Despliegue y pulido      | ⏳ Pendiente                                                                                      |
| 6. Presentación             | ⏳ Pendiente                                                                                      |

## Documentación

- **[docs/product-brief.md](docs/product-brief.md)** — problema, usuario, historias de usuario, alcance y arquitectura preliminar.
- **[docs/requirements.md](docs/requirements.md)** — requerimientos funcionales/no funcionales y diccionario de campos.
- **[docs/wireframes.md](docs/wireframes.md)** — decisiones de UX del prototipo.
- **[docs/adr/](docs/adr)** — decisiones de arquitectura registradas (Architecture Decision Records).
- **[docs/spikes/](docs/spikes)** — investigaciones técnicas exploratorias previas a comprometer diseño/arquitectura.
- **[docs/design/prototype/](docs/design/prototype)** — prototipo navegable, separado en estructura (`index.html`), estilo (`styles.css`), contenido por idioma (`i18n.js`) y lógica (`model.js`/`view.js`/`controller.js`) — ver [ADR-0002](docs/adr/0002-separacion-mvc-frontend.md).

## Stack (preliminar, ver ADR-0001)

- **Frontend:** React + Vite, Tailwind, Canvas API
- **Backend:** FastAPI (Python)
- **Tests:** pytest
- **i18n:** react-i18next
- **Deploy:** Netlify/Vercel (frontend) + Railway/Render (backend)

## Cómo correr el proyecto

### Backend (fase 4A, en curso)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -e ".[dev]"
```

Pruebas y formato:

```bash
pytest                 # ejecuta la suite completa
black app tests        # formatea (config en pyproject.toml)
```

### Frontend (fase 4B)

_Pendiente — se documentará al iniciar el paso 4B.1._

## Licencia

Pendiente de definir.
