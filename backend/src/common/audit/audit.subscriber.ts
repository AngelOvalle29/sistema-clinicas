import { Injectable } from '@nestjs/common';
import {
  DataSource,
  EntityMetadata,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  ObjectLiteral,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { RequestContext } from '../context/request-context';
import { AccionAuditoria } from '../enums/accion-auditoria.enum';
import { AuditService } from './audit.service';
import { AuditoriaLog } from './entities/auditoria-log.entity';

const ENTIDADES_SIN_AUDITORIA = new Set<string>([AuditoriaLog.name]);

/**
 * Subscriber global de TypeORM: se registra una sola vez contra el DataSource y
 * audita automáticamente INSERT/UPDATE/DELETE de cualquier entidad de negocio,
 * además de rellenar created_by/updated_by. Esto es lo que evita que cada
 * module/service tenga que llamar a AuditService a mano.
 */
@Injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  constructor(
    private readonly dataSource: DataSource,
    private readonly auditService: AuditService,
  ) {
    dataSource.subscribers.push(this);
  }

  beforeInsert(event: InsertEvent<ObjectLiteral>): void {
    if (this.debeIgnorar(event.metadata.name) || !event.entity) {
      return;
    }
    this.estamparCreador(event.entity, event.metadata);
  }

  beforeUpdate(event: UpdateEvent<ObjectLiteral>): void {
    if (this.debeIgnorar(event.metadata.name) || !event.entity) {
      return;
    }
    this.estamparActualizador(event.entity, event.metadata);
  }

  afterInsert(event: InsertEvent<ObjectLiteral>): void {
    if (this.debeIgnorar(event.metadata.name)) {
      return;
    }
    void this.auditService.registrar({
      usuarioId: RequestContext.usuarioId(),
      accion: AccionAuditoria.INSERT,
      tablaAfectada: event.metadata.tableName,
      registroId: this.obtenerId(event.entity, event.metadata),
      datosNuevos: this.serializar(event.entity, event.metadata),
      ip: RequestContext.ip(),
    });
  }

  afterUpdate(event: UpdateEvent<ObjectLiteral>): void {
    if (this.debeIgnorar(event.metadata.name)) {
      return;
    }
    void this.auditService.registrar({
      usuarioId: RequestContext.usuarioId(),
      accion: AccionAuditoria.UPDATE,
      tablaAfectada: event.metadata.tableName,
      registroId: this.obtenerId(
        event.entity ?? event.databaseEntity,
        event.metadata,
      ),
      datosAnteriores: this.serializar(event.databaseEntity, event.metadata),
      datosNuevos: this.serializar(event.entity, event.metadata),
      ip: RequestContext.ip(),
    });
  }

  afterRemove(event: RemoveEvent<ObjectLiteral>): void {
    if (this.debeIgnorar(event.metadata.name)) {
      return;
    }
    void this.auditService.registrar({
      usuarioId: RequestContext.usuarioId(),
      accion: AccionAuditoria.DELETE,
      tablaAfectada: event.metadata.tableName,
      registroId: this.obtenerId(
        event.databaseEntity ?? event.entity,
        event.metadata,
      ),
      datosAnteriores: this.serializar(event.databaseEntity, event.metadata),
      ip: RequestContext.ip(),
    });
  }

  private debeIgnorar(nombreEntidad: string): boolean {
    return ENTIDADES_SIN_AUDITORIA.has(nombreEntidad);
  }

  private buscarRelacionPorColumna(
    metadata: EntityMetadata,
    columnaDb: string,
  ) {
    return metadata.relations.find((relation) =>
      relation.joinColumns.some(
        (joinColumn) => joinColumn.databaseName === columnaDb,
      ),
    );
  }

  private estamparCreador(
    entity: ObjectLiteral,
    metadata: EntityMetadata,
  ): void {
    const usuarioId = RequestContext.usuarioId();
    if (usuarioId == null) {
      return;
    }
    const registro = entity as Record<string, unknown>;
    const relacionCreador = this.buscarRelacionPorColumna(
      metadata,
      'created_by',
    );
    if (relacionCreador && registro[relacionCreador.propertyName] == null) {
      registro[relacionCreador.propertyName] = { id: usuarioId };
    }
    const relacionActualizador = this.buscarRelacionPorColumna(
      metadata,
      'updated_by',
    );
    if (
      relacionActualizador &&
      registro[relacionActualizador.propertyName] == null
    ) {
      registro[relacionActualizador.propertyName] = { id: usuarioId };
    }
  }

  private estamparActualizador(
    entity: ObjectLiteral,
    metadata: EntityMetadata,
  ): void {
    const usuarioId = RequestContext.usuarioId();
    if (usuarioId == null) {
      return;
    }
    const registro = entity as Record<string, unknown>;
    const relacionActualizador = this.buscarRelacionPorColumna(
      metadata,
      'updated_by',
    );
    if (relacionActualizador) {
      registro[relacionActualizador.propertyName] = { id: usuarioId };
    }
  }

  private obtenerId(
    entity: ObjectLiteral | undefined,
    metadata: EntityMetadata,
  ): string | null {
    if (!entity) {
      return null;
    }
    const registro = entity as Record<string, unknown>;
    const primaryColumn = metadata.primaryColumns[0];
    const valor = (
      primaryColumn ? registro[primaryColumn.propertyName] : registro.id
    ) as string | number | undefined;
    return valor != null ? String(valor) : null;
  }

  /**
   * Aplana el snapshot a columna -> valor escalar (las relaciones se reducen a su id)
   * para que quede un JSON simple en auditoria_logs, sin riesgo de referencias circulares.
   */
  private serializar(
    entity: ObjectLiteral | undefined,
    metadata: EntityMetadata,
  ): Record<string, unknown> | null {
    if (!entity) {
      return null;
    }
    const registro = entity as Record<string, unknown>;
    const snapshot: Record<string, unknown> = {};
    for (const column of metadata.columns) {
      if (column.propertyName === 'passwordHash') {
        continue;
      }
      const valor = registro[column.propertyName];
      if (valor === undefined) {
        continue;
      }
      snapshot[column.propertyName] =
        valor !== null && typeof valor === 'object' && 'id' in valor
          ? valor.id
          : valor;
    }
    return snapshot;
  }
}
