# Calculadora óptica paramétrica con simulación de imagen

Herramienta web bilingüe (ES/EN) para docentes y estudiantes de ciencias que permite
explorar cómo el diámetro del orificio y la distancia focal de una cámara pinhole
afectan la nitidez de la imagen resultante, aplicando el criterio de Rayleigh y una
simulación visual del efecto.

Proyecto insignia 1 de 3 del portafolio de Robinson Ariza — especialización
full-stack con enfoque en producto.

## Estado del proyecto

Diseño de interfaz completado. Próximo paso: construcción técnica (fase 4).

| Fase                        | Estado                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1. Fundamentos              | ✅ Completada                                                                                          |
| 2. Investigación de usuario | ✅ Completada — ver [docs/product-brief.md](docs/product-brief.md)                                     |
| 3. Diseño de interfaz       | ✅ Completada — ver [docs/wireframes.md](docs/wireframes.md) y [prototipo](docs/design/prototype.html) |
| 4. Construcción técnica     | 🔜 Próxima                                                                                             |
| 5. Despliegue y pulido      | ⏳ Pendiente                                                                                           |
| 6. Presentación             | ⏳ Pendiente                                                                                           |

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

_Pendiente — se documentará al iniciar la fase 4 (construcción técnica)._

## Licencia

Pendiente de definir.
