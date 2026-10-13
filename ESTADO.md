# ESTADO.md

Estado actual del proyecto. Claude Code lo lee al iniciar cada sesión y lo actualiza al terminar cada módulo o sesión de trabajo. Mantenerlo corto: esto es un resumen, no un log.

Última actualización: 12 de octubre de 2026

## Hecho

- Repo creado en GitHub (privado), rama `main`, conexión por SSH.
- `AGENTS.md`, `CLAUDE.md`, `ESTADO.md` reubicados a la raíz (vivían por error dentro de `frontend/`; el `.gitignore` y la sección 3 de `AGENTS.md` ya asumían raíz).
- `schema.dbml`: diseñado desde cero en la raíz (nunca había existido realmente, aunque el commit inicial y este archivo decían lo contrario — ver "Notas"). 30 tablas, 67 FKs, compila limpio con `dbml2sql --mysql`. Catálogos normalizados: `roles`, `estados_cita`, `estados_paciente`, `estados_receta`, `tipos_producto`, `tipos_movimiento_inventario`, `tipos_alerta`, `severidades_alerta`, `estados_alerta`, `categorias_prioridad`. Único enum real: `auditoria_logs.accion`. Auditoría: `created_by`/`updated_by` en las 17 tablas de negocio + tabla `auditoria_logs`.
- `backend/`: creado con NestJS + TypeORM + MySQL (`--no-spec`, `nest-cli.json` con `generateOptions.spec:false`).
- Config: `database.config.ts` (`SnakeNamingStrategy`, `synchronize:false`), `jwt.config.ts`, `data-source.ts`, `.env.example` (`JWT_EXPIRES_IN=30m`), `ValidationPipe`/`ClassSerializerInterceptor`/Swagger/CORS en `main.ts`.
- `common/`: `@Public()`, `@Roles()`, `@CurrentUser()`, `JwtAuthGuard`, `RolesGuard` (ambos globales), `RequestContext` (`AsyncLocalStorage`) + `RequestContextInterceptor`, `HttpExceptionFilter`.
- Auditoría centralizada: `AuditoriaLog` entity, `AuditService` (único punto de escritura), `AuditSubscriber` (`@EventSubscriber()` global — rellena `created_by`/`updated_by` y registra INSERT/UPDATE/DELETE automáticamente, sin tocar los services de negocio).
- Módulo `usuarios`: entidad `Usuario` + catálogo `Rol`, repositorios, service (bcrypt, sin exponer `passwordHash`), controller restringido a `ADMIN`.
- Módulo `auth`: `POST /auth/login` (público), JWT firmado con `JWT_EXPIRES_IN=30m`, `JwtStrategy`, registra `LOGIN` (éxito y fallo) en `auditoria_logs` a mano (único caso que no pasa por el subscriber).
- `npm run build` y `npm run lint` pasan sin errores en `backend/`.

## Pendiente (siguiente paso)

- **Autorización pendiente**: crear la base de datos (`clinica_db`) y generar/correr la migración inicial. MySQL/MariaDB ya corre en la máquina, pero la BD no existe — no se tocó sin permiso explícito (sección 6 de `AGENTS.md`).
- Seed del usuario ADMIN inicial y de los catálogos (`roles`, y luego el resto a medida que se agreguen sus módulos).
- Seguir con el orden de la sección 12 de `AGENTS.md`: `especialidades` → `medicos` → `pacientes` → `enfermedades-cronicas` → `citas` → `historial` → `farmacia` → `recetas` → `alertas`.
- Frontend: sin empezar.

## Módulos backend

| Módulo | Estado |
|--------|--------|
| config / data-source | Hecho |
| auditoría (subscriber + bitácora) | Hecho |
| auth / usuarios | Hecho (login JWT 30m, CRUD de usuarios) |
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

- MySQL: servidor corriendo localmente, base de datos `clinica_db` **aún no creada**.
- Migraciones: ninguna generada todavía (requiere conectar a `clinica_db`, pendiente de autorización).
- `schema.dbml` es la fuente de verdad y ya cubre el modelo completo; las entidades de TypeORM solo existen para los módulos ya implementados (catálogo `roles`, `usuarios`, `auditoria_logs`).

## Entorno de desarrollo

- Arch Linux.
- Conexión a internet lenta: evitar descargas innecesarias (no reinstalar dependencias sin motivo, no agregar paquetes pesados sin preguntar).
- Se puede trabajar con Claude Code en la web (sin acceso a MySQL local) o con Claude Code local. Si la sesión es en la web, no intentar crear la BD ni correr migraciones: dejarlo anotado aquí como pendiente para hacerlo local.
- `bcrypt` necesita rebuild nativo tras `npm install` (`npm rebuild bcrypt`) porque los install scripts vienen bloqueados por policy de npm en esta máquina.

## Decisiones tomadas

- Monorepo: `frontend/` y `backend/` en el mismo repo, ambos en la raíz.
- `schema.dbml` es la fuente de verdad del esquema; la BD se crea vía migraciones de TypeORM, no ejecutando el SQL de `dbml2sql`.
- Enums de negocio → catálogos con FK (ver sección 6.1 de `AGENTS.md`). Único enum real: `auditoria_logs.accion`.
- `created_by`/`updated_by` se modelan como relaciones `@ManyToOne` (no columnas planas) para que generen la FK real en la migración; el subscriber las detecta buscando la relación cuyo `@JoinColumn` apunta a `created_by`/`updated_by`, no por nombre de propiedad.
- Auditoría 100% centralizada en `AuditSubscriber` + `AuditService`; ningún service de negocio debe llamar a `AuditService` directamente (la única excepción documentada es `AuthService` para `LOGIN`).
- JWT vence a los 30 minutos, sin refresh token en el alcance mínimo.
- Sin tests por ahora.

## Notas / bloqueos

- `schema.dbml` nunca había existido realmente en el repo (ni en el working tree ni en el historial de git), aunque el commit inicial y este archivo decían lo contrario. Se diseñó desde cero en esta sesión; si en algún momento aparece una versión distinta guardada en otro lado (dbdiagram.io, otra máquina), compararla antes de seguir.
- Migración inicial y creación de `clinica_db`: bloqueadas hasta autorización explícita.
