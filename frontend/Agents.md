# AGENTS.md

Guía para agentes de código (Claude Code, Codex, Cursor, Copilot, etc.) que trabajen en este repositorio. Este archivo es la fuente de verdad del proyecto: arquitectura, reglas de negocio, convenciones y prioridades. Si algo aquí contradice una suposición tuya, gana este archivo.

---

## 1. Contexto del proyecto

Sistema de gestión clínica con farmacia integrada. Proyecto universitario (UMES, Quetzaltenango).

**Fecha de entrega: 14 de octubre de 2026.** Prioriza que el alcance mínimo funcione de punta a punta antes de pulir o agregar extras.

### Alcance mínimo obligatorio

| # | Funcionalidad | Módulo backend |
|---|---------------|----------------|
| 1 | Historial médico | `historial` |
| 2 | Recetas | `recetas` |
| 3 | Registro de citas | `citas` |
| 4 | Alertas para pacientes crónicos | `enfermedades-cronicas` + `alertas` |
| 5 | Pacientes fallecidos | `pacientes` (submódulo defunciones) |
| 6 | Pacientes prioritarios | `pacientes` (submódulo prioridades) |
| 7 | Banco de datos de productos de farmacia y muestras médicas | `farmacia` |

Soporte necesario (no está en la lista pero todo depende de ello): `auth`, `usuarios`, `medicos`, `especialidades`.

---

## 2. Stack

| Capa | Tecnología |
|------|------------|
| Backend | NestJS (TypeScript) |
| ORM | TypeORM |
| Base de datos | MySQL 8 |
| Validación | `class-validator` + `class-transformer` |
| Docs API | `@nestjs/swagger` |
| Auth | JWT (`@nestjs/jwt`, `@nestjs/passport`, `passport-jwt`), `bcrypt` |
| Tareas programadas | `@nestjs/schedule` |
| Eventos internos | `@nestjs/event-emitter` |
| Config | `@nestjs/config` |
| Naming de columnas | `typeorm-naming-strategies` (`SnakeNamingStrategy`) |
| Frontend | Next.js (plantilla existente en `frontend/`) |

---

## 3. Estructura del repositorio

```
/
├── AGENTS.md
├── CLAUDE.md
├── database.dbml          # Diseño de BD (dbdiagram.io). Referencia del modelo.
├── backend/               # NestJS — aún no existe, se crea con las reglas de este archivo
└── frontend/              # Next.js — plantilla YA existente, no reemplazar
```

---

## 4. Backend: arquitectura en capas

### 4.1 Capas y responsabilidades

```
HTTP Request
    │
    ▼
┌──────────────────────────────┐
│ Presentación                 │  controllers/, dto/
│ - Rutas, guards, decorators  │  Valida entrada (DTO), llama al service,
│ - Sin lógica de negocio      │  devuelve respuesta. Nada más.
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Aplicación / Negocio         │  services/
│ - Reglas de negocio          │  Toda la lógica del modelo vive aquí.
│ - Orquesta transacciones     │  Lanza excepciones de Nest.
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Acceso a datos               │  repositories/
│ - Consultas a la BD          │  Una clase por entidad, con métodos
│ - Sin reglas de negocio      │  específicos de ese modelo.
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Dominio                      │  entities/, enums/
│ - Entidades TypeORM, enums   │
└──────────────────────────────┘
```

Reglas de dependencia (obligatorias):

- `controller` → solo depende de su `service`.
- `service` → depende de sus `repositories` y, si necesita otro módulo, del **service exportado** por ese módulo. Nunca del repositorio de otro módulo.
- `repository` → depende de `Repository<Entidad>` de TypeORM. No llama services.
- Las entidades no importan nada de services, controllers ni repositories.

### 4.2 Prohibido: CRUD genérico

**No crear** `CrudRepository`, `BaseRepository<T>`, `BaseService<T>`, `GenericCrudController` ni ninguna abstracción que concentre el CRUD de todos los modelos.

Cada modelo tiene su propio repositorio y su propio service con la lógica escrita explícitamente, aunque haya código parecido entre módulos. Esto es un requisito del proyecto, no una preferencia de estilo.

Patrón correcto:

```ts
// modules/pacientes/repositories/paciente.repository.ts
@Injectable()
export class PacienteRepository {
  constructor(
    @InjectRepository(Paciente)
    private readonly repo: Repository<Paciente>,
  ) {}

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  findByDpi(dpi: string) {
    return this.repo.findOne({ where: { dpi } });
  }

  findPrioritariosActivos() {
    return this.repo.find({
      where: { esPrioritario: true, estado: EstadoPaciente.ACTIVO },
      order: { apellidos: 'ASC' },
    });
  }

  save(paciente: Paciente) {
    return this.repo.save(paciente);
  }
}
```

```ts
// modules/pacientes/services/pacientes.service.ts
@Injectable()
export class PacientesService {
  constructor(private readonly pacienteRepository: PacienteRepository) {}

  async create(dto: CreatePacienteDto) {
    if (dto.dpi && (await this.pacienteRepository.findByDpi(dto.dpi))) {
      throw new ConflictException('Ya existe un paciente con ese DPI');
    }
    // ...lógica propia del modelo
  }
}
```

### 4.3 Estructura de carpetas del backend

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── database.config.ts        # TypeOrmModule.forRootAsync
│   │   └── jwt.config.ts
│   ├── database/
│   │   ├── data-source.ts            # DataSource para CLI de migraciones
│   │   ├── migrations/
│   │   └── seeds/                    # Datos iniciales (roles, admin, catálogos)
│   ├── common/
│   │   ├── decorators/               # @Roles(), @CurrentUser()
│   │   ├── guards/                   # JwtAuthGuard, RolesGuard
│   │   ├── filters/                  # HttpExceptionFilter
│   │   ├── interceptors/
│   │   ├── dto/                      # PaginationQueryDto (solo DTOs transversales)
│   │   └── enums/                    # Enums compartidos (RolUsuario, etc.)
│   └── modules/
│       ├── auth/
│       ├── usuarios/
│       ├── especialidades/
│       ├── medicos/
│       ├── pacientes/                # incluye prioridades y defunciones
│       ├── enfermedades-cronicas/
│       ├── historial/                # consultas, signos vitales, alergias, antecedentes
│       ├── citas/
│       ├── recetas/
│       ├── farmacia/                 # productos, categorías, lotes, movimientos
│       └── alertas/
├── .env.example
├── nest-cli.json
└── package.json
```

Estructura interna de cada módulo:

```
modules/pacientes/
├── pacientes.module.ts
├── controllers/
│   ├── pacientes.controller.ts
│   ├── prioridades.controller.ts
│   └── defunciones.controller.ts
├── services/
│   ├── pacientes.service.ts
│   ├── prioridades.service.ts
│   └── defunciones.service.ts
├── repositories/
│   ├── paciente.repository.ts
│   ├── paciente-prioridad.repository.ts
│   ├── categoria-prioridad.repository.ts
│   └── defuncion.repository.ts
├── entities/
│   ├── paciente.entity.ts
│   ├── paciente-prioridad.entity.ts
│   ├── categoria-prioridad.entity.ts
│   └── defuncion.entity.ts
├── dto/
│   ├── create-paciente.dto.ts
│   ├── update-paciente.dto.ts
│   ├── query-paciente.dto.ts
│   ├── asignar-prioridad.dto.ts
│   └── registrar-defuncion.dto.ts
└── enums/
    └── estado-paciente.enum.ts
```

### 4.4 Convenciones de código

- Dominio en español (`Paciente`, `Cita`, `registrarDefuncion`), términos técnicos en inglés (`service`, `repository`, `dto`, `controller`).
- Archivos en `kebab-case`, clases en `PascalCase`, propiedades en `camelCase`. Columnas en BD quedan en `snake_case` por `SnakeNamingStrategy`.
- Tablas en plural `snake_case`: `@Entity('pacientes')`, `@Entity('receta_detalles')`.
- DTOs con `class-validator` en todos los endpoints. `UpdateXDto` extiende `PartialType(CreateXDto)` de `@nestjs/swagger`.
- `ValidationPipe` global con `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`.
- Errores con excepciones de Nest (`NotFoundException`, `ConflictException`, `BadRequestException`, `ForbiddenException`). Mensajes en español.
- Nunca devolver `passwordHash` ni datos sensibles: usar `@Exclude()` + `ClassSerializerInterceptor`, o seleccionar campos en el repositorio.
- Controllers documentados con `@ApiTags`, `@ApiOperation`, `@ApiBearerAuth`.
- Listados con paginación (`page`, `limit`) y filtros vía `QueryXDto`.
- Operaciones que tocan varias tablas van en transacción usando `DataSource.transaction(async (manager) => {...})` dentro del **service**. Los repositorios pueden exponer métodos que reciben un `EntityManager` opcional para participar en la transacción.
- Comunicación entre módulos que generaría dependencias circulares (p. ej. `historial` → `alertas`) se hace con eventos de `@nestjs/event-emitter`.
- Sin `any`. Tipar retornos de services.

### 4.5 Borrado de datos

Datos clínicos **nunca se borran físicamente**: pacientes, consultas, recetas, citas, defunciones, movimientos de inventario. Se usan estados (`estado`, `activo`). No exponer endpoints `DELETE` para esos recursos; usar acciones explícitas (`PATCH /citas/:id/cancelar`, `PATCH /recetas/:id/anular`).

Catálogos simples (especialidades, categorías) pueden desactivarse con `activo = false`.

---

## 5. Reglas de negocio por módulo

### 5.1 Auth / Usuarios

- Roles: `ADMIN`, `MEDICO`, `RECEPCION`, `FARMACIA`.
- Login con email + contraseña → JWT. Contraseñas con `bcrypt`.
- `JwtAuthGuard` global; endpoints públicos marcados con `@Public()`.
- `@Roles(...)` + `RolesGuard` para restringir por rol.
- Un seed crea el usuario ADMIN inicial desde variables de entorno.

### 5.2 Médicos y especialidades

- Un médico está ligado 1:1 a un usuario con rol `MEDICO`.
- Número de colegiado único.

### 5.3 Pacientes

- Código de paciente autogenerado (`PAC-000001`). DPI opcional pero único si existe.
- Estados: `ACTIVO`, `INACTIVO`, `FALLECIDO`.

### 5.4 Pacientes prioritarios

- Catálogo `categorias_prioridad` con `nivel` (1 = más alta): adulto mayor, embarazada, discapacidad, pediátrico, paciente crónico descompensado, etc.
- Un paciente puede tener varias prioridades activas (`paciente_prioridades`).
- `pacientes.es_prioritario` se recalcula en el service cada vez que se asigna o retira una prioridad. No se edita directo por la API.
- Al crear una cita se guarda una copia del nivel de prioridad más alto del paciente (`citas.nivel_prioridad`).
- Listados de citas del día se ordenan por `nivel_prioridad ASC` y luego por hora.
- Frontend: los pacientes prioritarios se marcan visualmente en listados y en la agenda.

### 5.5 Pacientes fallecidos

`POST /pacientes/:id/defuncion` ejecuta en **una sola transacción**:

1. Valida que el paciente no esté ya `FALLECIDO`.
2. Crea el registro en `defunciones` (fecha, causa, número de certificado, médico que certifica).
3. Cambia `pacientes.estado` a `FALLECIDO`.
4. Cancela todas las citas futuras (`estado = CANCELADA`, motivo "Paciente fallecido").
5. Descarta alertas pendientes del paciente.
6. Anula recetas `EMITIDA` no dispensadas.

Después de eso:

- No se pueden crear citas, consultas ni recetas para ese paciente (validar en cada service → `BadRequestException`).
- El historial queda en solo lectura.
- El job de alertas ignora pacientes fallecidos.
- Existe un listado `GET /pacientes/fallecidos` con filtros por rango de fechas.

### 5.6 Citas

- Estados: `PROGRAMADA`, `CONFIRMADA`, `EN_CURSO`, `COMPLETADA`, `CANCELADA`, `NO_ASISTIO`.
- No permitir solapamiento de citas para el mismo médico (validar rango `fecha_hora_inicio`–`fecha_hora_fin`).
- No crear citas en el pasado ni para pacientes fallecidos/inactivos.
- Transiciones válidas:
  - `PROGRAMADA` → `CONFIRMADA` | `CANCELADA` | `NO_ASISTIO`
  - `CONFIRMADA` → `EN_CURSO` | `CANCELADA` | `NO_ASISTIO`
  - `EN_CURSO` → `COMPLETADA`
  - `COMPLETADA`, `CANCELADA`, `NO_ASISTIO` son finales.
- `es_control_cronico = true` cuando la cita es seguimiento de una enfermedad crónica.
- Al completar una cita, el médico registra la consulta en el historial (la consulta puede referenciar `cita_id`).

### 5.7 Historial médico

- Compuesto por: `consultas`, `signos_vitales` (1:1 con consulta), `alergias`, `antecedentes`, enfermedades crónicas del paciente.
- Solo `MEDICO` crea consultas. Solo el médico autor puede editar su consulta.
- `GET /pacientes/:id/historial` devuelve el historial completo agregado y ordenado por fecha descendente.
- Al registrar signos vitales, si un valor sale de rango (ver 5.8) se emite el evento `signos-vitales.fuera-de-rango`.

### 5.8 Enfermedades crónicas y alertas

- Catálogo `enfermedades_cronicas` (código CIE-10, nombre, `frecuencia_control_dias` por defecto).
- `paciente_enfermedades_cronicas` asigna la enfermedad a un paciente; puede sobreescribir la frecuencia.
- Un paciente con al menos una enfermedad crónica activa se considera paciente crónico.

Generación de alertas:

| Tipo | Disparador | Severidad sugerida |
|------|-----------|--------------------|
| `CONTROL_VENCIDO` | Job diario (`@Cron` 06:00): última consulta + frecuencia < hoy y sin cita futura | `ALTA` |
| `SIN_CITA_PROGRAMADA` | Job diario: faltan ≤ 7 días para el próximo control y no hay cita | `MEDIA` |
| `VALOR_FUERA_RANGO` | Evento al guardar signos vitales | `ALTA` o `CRITICA` |
| `MEDICACION_POR_TERMINAR` | Job diario: receta de crónico cuya duración termina en ≤ 5 días | `MEDIA` |

Rangos de referencia iniciales (constantes en `alertas/constants/`, fáciles de ajustar): glucosa > 180 mg/dL o < 70; presión sistólica ≥ 140 o diastólica ≥ 90; saturación O₂ < 92 %.

- **No duplicar**: si ya existe una alerta `PENDIENTE` del mismo tipo para el mismo paciente y condición, no crear otra.
- Estados de alerta: `PENDIENTE` → `VISTA` → `ATENDIDA` | `DESCARTADA`.
- Endpoint para disparar el job manualmente (solo `ADMIN`) para pruebas y demostración.
- Frontend: panel de alertas con contador de pendientes, filtrable por severidad.

### 5.9 Farmacia (productos y muestras médicas)

- `productos.tipo`: `MEDICAMENTO`, `MUESTRA_MEDICA`, `INSUMO`.
- El stock vive en `lotes` (número de lote, vencimiento, cantidad actual). El stock de un producto = suma de `cantidad_actual` de sus lotes no vencidos.
- Todo cambio de stock genera un registro en `movimientos_inventario` (`ENTRADA`, `SALIDA`, `AJUSTE`, `VENCIMIENTO`). Nunca modificar `cantidad_actual` sin movimiento.
- Salidas usan FEFO (primero el lote que vence primero).
- Las muestras médicas no tienen costo (`costo_unitario = 0`) y se registran igual que un producto.
- Endpoints de consulta: productos con stock bajo (`stock < stock_minimo`), lotes próximos a vencer (≤ 30 días), lotes vencidos.
- Búsqueda de productos por nombre, principio activo o código.

### 5.10 Recetas

- Solo `MEDICO` emite. Código autogenerado (`REC-000001`).
- Una receta tiene 1..n `receta_detalles`, cada uno apuntando a un `producto`.
- No emitir recetas a pacientes fallecidos. Advertir (no bloquear) si un producto coincide con una alergia registrada del paciente: la respuesta incluye un arreglo `advertencias`.
- Estados: `EMITIDA`, `DISPENSADA_PARCIAL`, `DISPENSADA`, `ANULADA`.
- `POST /recetas/:id/dispensar` (rol `FARMACIA`) en **una transacción**: descuenta stock por FEFO, crea movimientos `SALIDA` ligados al detalle, actualiza `cantidad_dispensada` y el estado de la receta. Si no hay stock suficiente, dispensa lo disponible y deja la receta en `DISPENSADA_PARCIAL`.
- Receta vencida (`vigente_hasta < hoy`) no se puede dispensar.

---

## 6. Base de datos

- Diseño de referencia: `database.dbml` en la raíz (formato dbdiagram.io). Si cambias el modelo, actualiza ese archivo también.
- `synchronize: false` siempre. Cambios de esquema solo con migraciones de TypeORM.
- `SnakeNamingStrategy` para que `fechaNacimiento` → `fecha_nacimiento`.
- Timestamps con `@CreateDateColumn` / `@UpdateDateColumn`.
- Montos con `decimal(10,2)`; en la entidad usar un `transformer` para convertir a `number`.
- Enums de TypeORM (`type: 'enum'`) usando los enums de TypeScript del módulo.
- Relaciones: definir `@ManyToOne` con `@JoinColumn` y, cuando se necesite, la inversa `@OneToMany`. No usar `eager: true`; cargar relaciones explícitamente en el repositorio.

Scripts esperados en `backend/package.json`:

```json
{
  "typeorm": "typeorm-ts-node-commonjs -d src/database/data-source.ts",
  "migration:generate": "npm run typeorm -- migration:generate src/database/migrations/$npm_config_name",
  "migration:run": "npm run typeorm -- migration:run",
  "migration:revert": "npm run typeorm -- migration:revert",
  "seed": "ts-node src/database/seeds/run-seeds.ts"
}
```

Uso: `npm run migration:generate --name=InitSchema`.

---

## 7. Frontend (Next.js)

La carpeta `frontend/` ya contiene una plantilla de Next.js. **No la reemplaces ni la regeneres.**

Antes de escribir código en el frontend:

1. Lee `frontend/package.json` para saber la versión de Next.js, React y las librerías de UI instaladas.
2. Revisa la estructura existente (`app/` o `src/app/`, componentes, estilos, layout) y extiéndela respetando sus convenciones.
3. Si `frontend/` trae su propio `AGENTS.md` o `CLAUDE.md`, sus instrucciones aplican dentro de esa carpeta además de este archivo.
4. Si la versión de Next.js es más nueva de lo que conoces, consulta la documentación incluida en `node_modules/next/dist/docs/` (si existe) antes de usar APIs.

Organización en capas del frontend (adaptar nombres a la plantilla):

```
app/ (o src/app/)          # Rutas y páginas. Poca lógica.
components/                # UI reutilizable y componentes por dominio
  pacientes/, citas/, recetas/, farmacia/, alertas/, historial/
services/ (o lib/api/)     # Cliente HTTP y una función por endpoint, agrupadas por módulo
types/                     # Tipos que reflejan los DTOs/respuestas del backend
hooks/                     # Hooks de datos y estado
```

Reglas:

- Las páginas no llaman `fetch` directo: usan funciones de `services/`.
- URL del backend en `NEXT_PUBLIC_API_URL`.
- El token JWT se adjunta en un único cliente HTTP.
- Formularios validados en cliente, pero la validación de verdad es la del backend.
- Mostrar claramente: badge de paciente prioritario, estado `FALLECIDO` (y deshabilitar acciones), contador de alertas pendientes, productos con stock bajo o por vencer.

Pantallas mínimas: login, dashboard (citas del día + alertas + stock bajo), pacientes (lista, detalle con historial, prioridades, registrar defunción), citas (agenda y creación), consulta médica, recetas (emitir y dispensar), farmacia (productos, lotes, movimientos), alertas.

---

## 8. Testing

**No escribir tests por ahora.** Ni unitarios ni e2e.

- Generar código de Nest con `--no-spec`.
- En `nest-cli.json` agregar `"generateOptions": { "spec": false }`.
- Si el CLI o la plantilla crean archivos `*.spec.ts`, bórralos.
- Verificación durante el desarrollo: `npm run build`, `npm run lint` y pruebas manuales desde Swagger (`/api/docs`).

Los tests se agregarán en una fase posterior cuando se indique explícitamente.

---

## 9. Comandos

```bash
# Crear el backend (una sola vez, desde la raíz)
npx @nestjs/cli new backend --package-manager npm --skip-git

# Generar recursos sin tests
npx nest g module modules/pacientes --no-spec
npx nest g controller modules/pacientes/controllers/pacientes --flat --no-spec
npx nest g service modules/pacientes/services/pacientes --flat --no-spec

# Backend
cd backend
npm run start:dev          # http://localhost:3001, Swagger en /api/docs
npm run build
npm run lint
npm run migration:run
npm run seed

# Frontend
cd frontend
npm run dev                # http://localhost:3000
npm run build
npm run lint
```

---

## 10. Variables de entorno

`backend/.env.example`:

```
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=clinica_db
JWT_SECRET=cambia-esto
JWT_EXPIRES_IN=8h
CORS_ORIGIN=http://localhost:3000
ADMIN_EMAIL=admin@clinica.local
ADMIN_PASSWORD=Admin123!
```

`frontend/.env.example`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Nunca commitear `.env`. Nunca leer ni modificar `.env` reales sin que se pida.

---

## 11. Git

- Commits pequeños por módulo, en español, estilo Conventional Commits: `feat(citas): validar solapamiento por médico`, `fix(recetas): dispensación parcial con FEFO`.
- Una rama por módulo o funcionalidad cuando se trabaje en equipo: `feat/recetas`, `feat/alertas-cronicos`.

---

## 12. Plan de trabajo hacia el 14 de octubre de 2026

| Fechas | Objetivo |
|--------|----------|
| 23–27 sep | Crear backend, config, TypeORM + MySQL, migración inicial desde `database.dbml`, seeds, auth/usuarios, médicos, especialidades |
| 28 sep–2 oct | Pacientes (+ prioridades, defunciones), citas, historial médico |
| 3–7 oct | Farmacia (productos, lotes, movimientos), recetas con dispensación, enfermedades crónicas + alertas (job y eventos) |
| 1–10 oct (en paralelo) | Frontend: cliente API, login, dashboard, pantallas por módulo |
| 11–13 oct | Integración completa, datos de demostración, revisión de reglas de negocio, README |
| 14 oct | Entrega |

Orden de implementación de módulos backend (respeta dependencias): `auth/usuarios` → `especialidades` → `medicos` → `pacientes` → `enfermedades-cronicas` → `citas` → `historial` → `farmacia` → `recetas` → `alertas`.

---

## 13. Checklist antes de dar por terminado un módulo

- [ ] Entidades, repositorio(s) propios, service con la lógica, controller, DTOs validados.
- [ ] Sin CRUD genérico ni clases base compartidas.
- [ ] Reglas de negocio de la sección 5 implementadas.
- [ ] Transacciones donde se tocan varias tablas.
- [ ] Endpoints protegidos por rol y documentados en Swagger.
- [ ] Migración generada si cambió el esquema; `database.dbml` actualizado.
- [ ] `npm run build` y `npm run lint` pasan.
- [ ] Ningún archivo `*.spec.ts` creado.