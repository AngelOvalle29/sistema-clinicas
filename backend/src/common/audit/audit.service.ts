import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccionAuditoria } from '../enums/accion-auditoria.enum';
import { AuditoriaLog } from './entities/auditoria-log.entity';

export interface RegistrarAuditoriaParams {
  usuarioId: number | null;
  accion: AccionAuditoria;
  tablaAfectada: string;
  registroId?: string | number | null;
  datosAnteriores?: Record<string, unknown> | null;
  datosNuevos?: Record<string, unknown> | null;
  ip?: string | null;
}

/**
 * Único punto que escribe en `auditoria_logs`. Lo invoca AuditSubscriber (automático,
 * para INSERT/UPDATE/DELETE de entidades de negocio) y AuthService (manual, solo para LOGIN,
 * porque un login no es una mutación de entidad que el subscriber pueda captar).
 * Ningún otro service debe llamar a este método directamente.
 */
@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditoriaLog)
    private readonly auditoriaLogRepository: Repository<AuditoriaLog>,
  ) {}

  async registrar(params: RegistrarAuditoriaParams): Promise<void> {
    const log = this.auditoriaLogRepository.create({
      usuario: params.usuarioId != null ? { id: params.usuarioId } : null,
      accion: params.accion,
      tablaAfectada: params.tablaAfectada,
      registroId: params.registroId != null ? String(params.registroId) : null,
      datosAnteriores: params.datosAnteriores ?? null,
      datosNuevos: params.datosNuevos ?? null,
      ip: params.ip ?? null,
    });
    await this.auditoriaLogRepository.save(log);
  }
}
