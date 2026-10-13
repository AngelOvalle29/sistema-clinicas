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
- **BD creada y migración inicial aplicada** (autorizado 13 oct): `clinica_db` creada en MariaDB local (`utf8mb4`/`utf8mb4_unicode_ci`) con `npm run db:create`. Migración `1791863318427-InitSchema` generada y corrida con `migration:run`: crea `roles`, `usuarios`, `auditoria_logs` + 4 FKs (`usuarios.rol_id`, `usuarios.created_by/updated_by` self-ref, `auditoria_logs.usuario_id`).
- Fixes de bug encontrados al generar la migración (no cambian el esquema de negocio):
  - `data-source.ts` tenía doble export de `DataSource` (named + default); la CLI de TypeORM exige uno solo. Se dejó solo `export default`.
  - `AuditoriaLog.registroId` e `.ip` estaban tipadas `string | null` sin `type: 'varchar'` explícito — TypeScript reflexiona uniones como `Object` y TypeORM no podía mapear la columna. Se añadió `type: 'varchar'` explícito en ambas.
- `backend/.env` creado localmente (ignorado por git) con las credenciales reales para que los scripts de TypeORM puedan conectar. **Pendiente**: `backend/.env.example` sigue con valores reales (`DB_PASSWORD=putrix`, un `JWT_SECRET` real) en vez de placeholders — el usuario decidió dejarlo así por ahora (13 oct), pero como `.env.example` SÍ está trackeado en git, hay que revertirlo a placeholders antes de cualquier commit/push para no filtrar credenciales.
- Módulo `especialidades`: entidad `Especialidad` (catálogo simple, sin auditoría, igual forma que `Rol`), repo, service (nombre único, desactivar sin DELETE), controller (mutaciones `ADMIN`, lectura sin restricción de rol porque otros módulos necesitan leer el catálogo).
- Módulo `medicos`: entidad `Medico` (1:1 con `Usuario`, FK a `Especialidad`, `numero_colegiado` único, con `created_by`/`updated_by`), repo, service (depende de `UsuariosService` y `EspecialidadesService` exportados, no de sus repos — regla 4.1 de AGENTS.md). Valida que el usuario tenga rol `MEDICO`, que no esté ya vinculado a otro médico, especialidad activa y colegiado único. Sin endpoint propio de baja: se desactiva vía `PATCH /usuarios/:id/desactivar` porque `medicos` no tiene columna `activo` en el esquema.
- Migración `1791863788588-Especialidades` generada y aplicada: crea `especialidades` y `medicos` + 4 FKs.
- **Backend completo para los 7 puntos de alcance mínimo (AGENTS.md sección 1)**, módulo por módulo, siguiendo el orden de la sección 12:
  - `pacientes` (+ `prioridades`, `defunciones`): código + migración `Pacientes` + seeds (`estados_paciente`, `categorias_prioridad`). `DefuncionesService.registrar()` transaccional (crea defunción + cambia estado a `FALLECIDO`) y emite el evento `paciente.fallecido` para que otros módulos reaccionen (ver más abajo) en vez de que `pacientes` conozca `citas`/`recetas`/`alertas`.
  - `enfermedades-cronicas` (+ `paciente_enfermedades_cronicas`): catálogo + asignación/retiro por paciente, expone `esPacienteCronico()` y `findTodasActivasConFrecuencia()` para `citas`/`alertas`.
  - `citas`: transiciones validadas por matriz (`PROGRAMADA→CONFIRMADA/CANCELADA/NO_ASISTIO`, etc.), valida solapamiento por médico y no permite crear en el pasado ni a pacientes fallecidos/inactivos. Escucha `paciente.fallecido` para cancelar citas futuras (regla 5.5).
  - `historial` (`consultas`, `signos_vitales` 1:1, `alergias`, `antecedentes`): solo `MEDICO` crea/edita su propia consulta (resuelto vía `MedicosService.findByUsuarioId` desde el JWT). Al registrar signos vitales fuera de rango (constantes en `alertas/constants/rangos-referencia.ts`) emite `signos-vitales.fuera-de-rango`.
  - `farmacia` (`productos`, `lotes`, `movimientos_inventario`): stock = suma de lotes no vencidos (query), salidas por FEFO (`LotesService.salidaFEFO`, usado por `recetas`), toda entrada/salida/ajuste genera un movimiento, muestras médicas fuerzan `costo_unitario=0`.
  - `recetas` (+ `receta_detalles`): solo `MEDICO` emite, código autogenerado, advierte (no bloquea) si un producto coincide con una alergia del paciente, `dispensar()` usa FEFO y deja `DISPENSADA_PARCIAL` si no hay stock suficiente. Escucha `paciente.fallecido` para anular recetas `EMITIDA`.
  - `alertas` (`tipos_alerta`, `severidades_alerta`, `estados_alerta`): `AlertasService.crear()` deduplica por paciente+tipo+`PENDIENTE`; `AlertasJobService` corre `@Cron('0 6 * * *')` evaluando `CONTROL_VENCIDO`/`SIN_CITA_PROGRAMADA`/`MEDICACION_POR_TERMINAR` para pacientes crónicos, más endpoint `POST /alertas/ejecutar-job` (solo `ADMIN`) para disparo manual. Escucha `signos-vitales.fuera-de-rango` (crea `VALOR_FUERA_RANGO`) y `paciente.fallecido` (descarta pendientes).
  - Comunicación entre estos módulos para la regla 5.5 es 100% vía `@nestjs/event-emitter` (`EventEmitterModule.forRoot()` global) — ningún módulo importa el repositorio de otro, solo sus services exportados cuando hace falta síncronamente (p. ej. `citas` depende de `PacientesService`/`MedicosService`/`PacienteEnfermedadesCronicasService`).
  - Todas las migraciones (`Pacientes`, `EnfermedadesCronicas`, `Citas`, `Historial`, `Farmacia`, `Recetas`, `Alertas`) se generaron, se limpiaron a mano del ruido de introspección MariaDB (ver "Base de datos") y se aplicaron. Todos los seeds de catálogos nuevos se agregaron a `run-seeds.ts` y corrieron.
  - `npm run build` y `npm run lint` pasan limpios después de cada módulo. Se verificó además que `node dist/main.js` bootea sin errores de DI/dependencias circulares con los 10 módulos de negocio cargados y Swagger montado.
  - Supuestos razonables que tomé sin preguntar (documentados por si no son los que quieres): roles permitidos en `POST/PATCH /pacientes` = `ADMIN, RECEPCION`; `esControlCronico` en citas es un flag explícito del creador de la cita (no se infiere solo porque el paciente tenga alguna enfermedad crónica); el matching de alergia↔producto en recetas es un `includes()` case-insensitive entre `alergia.descripcion` y `producto.nombre`/`principioActivo` (heurístico, no hay texto estructurado para esto en el esquema).

## Pendiente (siguiente paso)

- **Backend de los 7 puntos de alcance mínimo: completo.** Falta solo soporte (ya está: `auth/usuarios/especialidades/medicos`) — no queda ningún módulo backend pendiente del listado de la sección 12.
- Revertir `backend/.env.example` a placeholders (`DB_PASSWORD=`, `JWT_SECRET=cambia-esto`) antes de comitear — el usuario pidió dejarlo así por ahora (12 oct), pero sigue siendo un riesgo si se hace push.
- **Frontend: sin empezar (0%).** Es el bloque de trabajo más grande que queda antes del 14 oct.
- No hay datos de demostración (seed solo cubre catálogos + admin, no pacientes/citas/recetas de ejemplo) — considerar un seed de demo si se quiere mostrar algo poblado.
- README del proyecto: no escrito.

## Módulos backend

| Módulo | Estado |
|--------|--------|
| config / data-source | Hecho |
| auditoría (subscriber + bitácora) | Hecho |
| auth / usuarios | Hecho (login JWT 30m, CRUD de usuarios) |
| especialidades | Hecho |
| medicos | Hecho |
| pacientes (+ prioridades, defunciones) | Hecho |
| enfermedades-cronicas | Hecho |
| citas | Hecho |
| historial | Hecho |
| farmacia | Hecho |
| recetas | Hecho |
| alertas | Hecho (incluye cron 06:00 + disparo manual) |

## Frontend

| Pantalla | Estado |
|----------|--------|
| Todas | Pendiente |

## Base de datos

- **MariaDB** (servidor real del usuario, no MySQL — 13.0.2-MariaDB): `clinica_db` creada, `type: 'mysql'` + driver `mysql2` (sin el paquete `mariadb`) funciona sin cambios.
- Migraciones aplicadas en orden: `InitSchema` (`roles`, `usuarios`, `auditoria_logs`) → `Especialidades` (`especialidades`, `medicos`) → `Pacientes` (`estados_paciente`, `pacientes`, `categorias_prioridad`, `paciente_prioridades`, `defunciones`) → `EnfermedadesCronicas` (`enfermedades_cronicas`, `paciente_enfermedades_cronicas`) → `Citas` (`estados_cita`, `citas`) → `Historial` (`consultas`, `signos_vitales`, `antecedentes`, `alergias`) → `Farmacia` (`tipos_producto`, `tipos_movimiento_inventario`, `productos`, `lotes`, `movimientos_inventario`) → `Recetas` (`estados_receta`, `recetas`, `receta_detalles`) → `Alertas` (`tipos_alerta`, `severidades_alerta`, `estados_alerta`, `alertas`). Las 30 tablas de `schema.dbml` están creadas en `clinica_db`.
- **Patrón confirmado y repetido en cada migración nueva**: TypeORM, contra MariaDB, detecta "cambios" falsos en `auditoria_logs.datos_anteriores/datos_nuevos` (por el alias `json`→`longtext` de MariaDB) y vuelve a soltar/recrear FKs de tablas ya existentes sin necesidad. En cada módulo se revisó el archivo generado y se dejó solo el `CREATE TABLE`/`ADD CONSTRAINT` real de las tablas nuevas antes de aplicarlo.
- Seeds (`backend/src/database/seeds/run-seeds.ts`, correr con `npm run seed`, idempotente): `roles`, admin inicial, `estados_paciente`, `categorias_prioridad`, `estados_cita`, `tipos_producto`, `tipos_movimiento_inventario`, `estados_receta`, `tipos_alerta`, `severidades_alerta`, `estados_alerta`.

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
- Regla 5.5 (defunción → cancelar citas, descartar alertas, anular recetas) implementada con eventos (`@nestjs/event-emitter`) en vez de que `pacientes` dependa de `citas`/`recetas`/`alertas`: `DefuncionesService` solo emite `paciente.fallecido`, cada módulo interesado se suscribe con `@OnEvent`. Mismo patrón para `signos-vitales.fuera-de-rango` (`historial` emite, `alertas` escucha). Es el patrón que pide AGENTS.md 4.4 para evitar dependencias circulares entre módulos.

## Notas / bloqueos

- `schema.dbml` nunca había existido realmente en el repo (ni en el working tree ni en el historial de git), aunque el commit inicial y este archivo decían lo contrario. Se diseñó desde cero en esta sesión; si en algún momento aparece una versión distinta guardada en otro lado (dbdiagram.io, otra máquina), compararla antes de seguir.
- `backend/.env.example` (trackeado en git) tiene credenciales reales en vez de placeholders — ver nota en "Hecho". Revertir antes de comitear.
