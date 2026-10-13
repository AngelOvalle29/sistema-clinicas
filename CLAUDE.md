# CLAUDE.md

@AGENTS.md

Todo lo de `AGENTS.md` aplica. Este archivo solo agrega cómo debe trabajar Claude Code en este repo.

## Idioma y forma de responder

- Responde en español. Términos técnicos pueden ir en inglés.
- Cuando crees o modifiques un archivo, entrégalo completo; no dejes `// ...resto igual` ni fragmentos sueltos.
- Sé directo: qué hiciste, qué falta, qué comandos correr.

## Flujo de trabajo

1. **Antes de tocar código**, lee `ESTADO.md` para saber qué está hecho y qué sigue. Luego revisa lo que ya existe: `schema.dbml`, `backend/` (si ya fue creado), `frontend/package.json` y la estructura de `frontend/`.
2. **Trabaja un módulo a la vez**, siguiendo el orden de la sección 12 de `AGENTS.md`. No generes todos los módulos de golpe.
3. Para cada módulo, antes de escribir, presenta un plan corto: tablas de `schema.dbml` que usa, entidades, métodos del repositorio, métodos del service, endpoints y reglas de negocio que vas a cubrir. Luego implementa.
4. Al terminar un módulo corre `npm run build` y `npm run lint` en `backend/` y corrige errores antes de seguir.
5. Recorre el checklist de la sección 13 de `AGENTS.md` y reporta qué quedó pendiente.
6. **Actualiza `ESTADO.md`** al terminar cada módulo o antes de cerrar la sesión: tablas de módulos, estado de la BD, decisiones nuevas y bloqueos. Mantenlo corto; no lo conviertas en un log.

## Base de datos: `schema.dbml` y MySQL

Sigue la sección 6 de `AGENTS.md`. Resumen operativo:

- **Puedes modificar `schema.dbml` sin pedir permiso.** Después de cada cambio, corre `npm run dbml:validate` (o `npx @dbml/cli dbml2sql schema.dbml --mysql`) y reporta qué tablas, columnas y relaciones cambiaron.
- Si un cambio en una entidad implica cambio de esquema, edita primero `schema.dbml` y luego la entidad. Nunca al revés.
- Puedes generar migraciones (`migration:generate`) sin permiso. Lee el SQL generado antes de proponer aplicarlo.
- **No ejecutes nada que escriba en MySQL sin autorización explícita en esta sesión**: `db:create`, `migration:run`, `migration:revert`, `seed`, el cliente `mysql` o SQL suelto.
- Antes de pedir autorización, muestra: base destino (sin contraseñas), si se crea la BD, tablas/columnas/índices/FKs afectados, operaciones destructivas resaltadas y los comandos exactos.
- Operaciones destructivas (`DROP`, cambios de tipo que pierden datos) necesitan su propia autorización, nombrando el cambio.
- Si un comando falla a la mitad, detente y reporta. No intentes "arreglar" la BD con más SQL sin permiso.
- No ejecutes `schema.reference.sql` contra MySQL; es solo para comparar.

## Reglas que Claude tiende a romper (revisar siempre)

- **No** crear `BaseService`, `BaseRepository`, `CrudRepository` ni nada genérico "para ahorrar código". Cada modelo con su repositorio y su service.
- **No** crear archivos `*.spec.ts` ni carpetas `test/` con casos. Usar `--no-spec` en el CLI de Nest.
- **No** activar `synchronize: true` "para ir más rápido". Siempre migraciones.
- **No** asumir que una autorización anterior sigue vigente para una migración nueva.
- **No** inyectar el repositorio de otro módulo en un service; usar el service exportado o un evento.
- **No** reemplazar ni regenerar la plantilla de `frontend/`. Extenderla.
- **No** agregar dependencias fuera del stack de `AGENTS.md` sin preguntar primero.
- **No** hacer DELETE físico de datos clínicos.
- **No** tocar archivos `.env` reales; solo `.env.example`.

## Frontend

- Revisa la versión de Next.js en `frontend/package.json` antes de usar cualquier API (App Router, Server Actions, `params` async, etc.). Si hay docs en `frontend/node_modules/next/dist/docs/`, consúltalas en lugar de asumir.
- Usa los componentes y estilos que ya trae la plantilla antes de crear nuevos.
- Los tipos en `types/` deben coincidir con los DTOs y respuestas reales del backend; si cambias un DTO, actualiza el tipo.

## Cuando algo no esté claro

Si una regla de negocio no está cubierta en `AGENTS.md`, pregunta en lugar de inventarla. Si decides una suposición razonable para no bloquearte, déjala escrita en tu respuesta.