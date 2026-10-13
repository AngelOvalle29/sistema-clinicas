\# ESTADO.md

Estado actual del proyecto. Claude Code lo lee al iniciar cada sesión y lo actualiza al terminar cada módulo o sesión de trabajo. Mantenerlo corto: esto es un resumen, no un log.

Última actualización: 23 de septiembre de 2026

## Hecho

- Repo creado en GitHub (privado), rama `main`, conexión por SSH.
- En la raíz: `AGENTS.md`, `CLAUDE.md`, `ESTADO.md`, `schema.dbml`, `.gitignore`, `.claude/settings.json`.
- `frontend/`: plantilla de Next.js sin modificar.
- `schema.dbml`: primera propuesta del modelo (20 tablas), sujeta a cambios.

## Pendiente (siguiente paso)

- Crear `backend/` con NestJS según la sección 9 de `AGENTS.md`.
- Configurar TypeORM + MySQL, `data-source.ts`, scripts de migración y `db:create`.
- Pasar `schema.dbml` a entidades y generar la migración inicial.
- Crear la base de datos y aplicar migraciones: **solo con autorización** (sección 6 de `AGENTS.md`).

## Módulos backend

| Módulo | Estado |
|--------|--------|
| auth / usuarios | Pendiente |
| especialidades | Pendiente |
| medicos | Pendiente |
| pacientes (+ prioridades, defunciones) | Pendiente |
| enfermedades-cronicas | Pendiente |
| citas | Pendiente |
| historial | Pendiente |
| farmacia | Pendiente |
| recetas | Pendiente |
| alertas | Pendiente |

## Frontend

| Pantalla | Estado |
|----------|--------|
| Todas | Pendiente |

## Base de datos

- MySQL: base de datos aún no creada.
- Migraciones aplicadas: ninguna.

## Entorno de desarrollo

- Arch Linux.
- Conexión a internet lenta: evitar descargas innecesarias (no reinstalar dependencias sin motivo, no agregar paquetes pesados sin preguntar).
- Se puede trabajar con Claude Code en la web (sin acceso a MySQL local) o con Claude Code local. Si la sesión es en la web, no intentar crear la BD ni correr migraciones: dejarlo anotado aquí como pendiente para hacerlo local.

## Decisiones tomadas

- Monorepo: `frontend/` y `backend/` en el mismo repo.
- `schema.dbml` es la fuente de verdad del esquema; la BD se crea vía migraciones de TypeORM, no ejecutando el SQL de `dbml2sql`.
- Sin tests por ahora.

## Notas / bloqueos

- (ninguno)