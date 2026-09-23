# CLAUDE.md

@AGENTS.md

Todo lo de `AGENTS.md` aplica. Este archivo solo agrega cómo debe trabajar Claude Code en este repo.

## Idioma y forma de responder

- Responde en español. Términos técnicos pueden ir en inglés.
- Cuando crees o modifiques un archivo, entrégalo completo; no dejes `// ...resto igual` ni fragmentos sueltos.
- Sé directo: qué hiciste, qué falta, qué comandos correr.

## Flujo de trabajo

1. **Antes de tocar código**, lee lo que ya existe: `backend/` (si ya fue creado), `frontend/package.json` y la estructura de `frontend/`, y `database.dbml`.
2. **Trabaja un módulo a la vez**, siguiendo el orden de la sección 12 de `AGENTS.md`. No generes todos los módulos de golpe.
3. Para cada módulo, antes de escribir, presenta un plan corto: entidades, métodos del repositorio, métodos del service, endpoints y reglas de negocio que vas a cubrir. Luego implementa.
4. Al terminar un módulo corre `npm run build` y `npm run lint` en `backend/` y corrige errores antes de seguir.
5. Recorre el checklist de la sección 13 de `AGENTS.md` y reporta qué quedó pendiente.

## Reglas que Claude tiende a romper (revisar siempre)

- **No** crear `BaseService`, `BaseRepository`, `CrudRepository` ni nada genérico "para ahorrar código". Cada modelo con su repositorio y su service.
- **No** crear archivos `*.spec.ts` ni carpetas `test/` con casos. Usar `--no-spec` en el CLI de Nest.
- **No** activar `synchronize: true` "para ir más rápido". Siempre migraciones.
- **No** inyectar el repositorio de otro módulo en un service; usar el service exportado o un evento.
- **No** reemplazar ni regenerar la plantilla de `frontend/`. Extenderla.
- **No** agregar dependencias fuera del stack de `AGENTS.md` sin preguntar primero.
- **No** hacer DELETE físico de datos clínicos.
- **No** tocar archivos `.env` reales; solo `.env.example`.

## Frontend

- Revisa la versión de Next.js en `frontend/package.json` antes de usar cualquier API (App Router, Server Actions, `params` async, etc.). Si hay docs en `frontend/node_modules/next/dist/docs/`, consúltalas en lugar de asumir.
- Usa los componentes y estilos que ya trae la plantilla antes de crear nuevos.
- Los tipos en `types/` deben coincidir con los DTOs y respuestas reales del backend; si cambias un DTO, actualiza el tipo.

## Base de datos

- Si cambias una entidad, genera la migración y actualiza `database.dbml` en el mismo cambio.
- Si detectas un problema en el diseño de `database.dbml`, propón el cambio y explica por qué antes de aplicarlo.

## Cuando algo no esté claro

Si una regla de negocio no está cubierta en `AGENTS.md`, pregunta en lugar de inventarla. Si decides una suposición razonable para no bloquearte, déjala escrita en tu respuesta.