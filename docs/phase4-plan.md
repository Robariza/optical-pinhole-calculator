# Plan de fase 4 — Construcción técnica

**Orden acordado:** backend (FastAPI) primero, frontend (React) después.
**Ritmo:** paso a paso, cada uno cerrado con pruebas y commit antes de
avanzar al siguiente — no se avanza sobre una base sin verificar.

## 4A — Backend (FastAPI)

| #    | Paso                                                                                         | Qué produce                                    | Verifica                                                            |
| ---- | -------------------------------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------- |
| 4A.1 | Scaffolding del proyecto Python (estructura de carpetas, entorno virtual, dependencias base) | `backend/` con estructura clara                | El entorno arranca sin errores                                      |
| 4A.2 | Portar el Model puro (`model.js` → `model.py`), **con tests primero**                        | `backend/app/model.py` + `tests/test_model.py` | pytest cubre los casos límite ya listados en `requirements.md` §3.3 |
| 4A.3 | Esquemas de entrada/salida (Pydantic) según el diccionario de campos ya documentado          | `backend/app/schemas.py`                       | Los tipos coinciden exactamente con `requirements.md` §3            |
| 4A.4 | Endpoint FastAPI que use el Model portado                                                    | `backend/app/main.py`                          | Prueba manual vía docs automáticas de FastAPI (`/docs`)             |
| 4A.5 | Tests de integración del endpoint (no solo del Model aislado)                                | `tests/test_api.py`                            | Casos válidos e inválidos, incluyendo los mismos límites de 4A.2    |
| 4A.6 | Formato Python (Black) — pendiente desde fase 3                                              | `pyproject.toml` / config                      | `black --check` limpio                                              |
| 4A.7 | Documentar cómo correr el backend                                                            | Actualiza `README.md`                          | Otra persona podría levantarlo siguiendo el README                  |

## 4B — Frontend (React)

| #    | Paso                                                                                                   | Qué produce                      | Verifica                                                                         |
| ---- | ------------------------------------------------------------------------------------------------------ | -------------------------------- | -------------------------------------------------------------------------------- |
| 4B.1 | Scaffolding Vite + React                                                                               | `frontend/` con estructura clara | La app arranca en blanco sin errores                                             |
| 4B.2 | Servicio de API (fetch al backend) — el "Model" real ahora vive en el backend, esto es solo el cliente | `frontend/src/services/api.js`   | Prueba contra el backend de 4A corriendo local                                   |
| 4B.3 | Migrar `styles.css` → sistema de estilos de React (Tailwind, según `product-brief.md`)                 | Componentes con estilo           | Comparación visual contra el prototipo aprobado                                  |
| 4B.4 | Componentes (la View del prototipo, ahora en JSX)                                                      | `frontend/src/components/`       | Cada componente sin lógica de negocio, igual que ADR-0002 exigía en el prototipo |
| 4B.5 | Hooks (el Controller del prototipo) conectando servicio + componentes                                  | `frontend/src/hooks/`            | La interacción replica el comportamiento ya validado en el prototipo             |
| 4B.6 | i18n real con `react-i18next`, migrando el diccionario de `i18n.js`                                    | `frontend/src/i18n/`             | Cambio de idioma sin perder estado, igual que se verificó en el prototipo        |
| 4B.7 | Panel de respaldo académico (RF-12) migrado a componente                                               | `frontend/src/components/About*` | Mismo contenido, mismo comportamiento de pestañas                                |
| 4B.8 | Conexión end-to-end backend+frontend, pruebas manuales de todos los RF                                 | —                                | Checklist de `requirements.md` recorrido completo                                |
| 4B.9 | Deploy (Netlify/Vercel + Railway/Render, según `product-brief.md`)                                     | URLs públicas                    | Demo accesible sin correr nada localmente                                        |

## Principio para todo el proceso

El prototipo ya validó **qué construir** (UX, fórmulas, comportamiento). Fase
4 no vuelve a decidir eso — lo traduce a una arquitectura de producción. Si
en algún punto de fase 4 aparece la tentación de cambiar una decisión de UX,
eso se registra como pregunta aparte, no se decide sobre la marcha dentro de
un paso de construcción.
