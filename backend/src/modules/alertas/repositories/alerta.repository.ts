import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alerta } from '../entities/alerta.entity';
import { EstadoAlertaCodigo } from '../enums/estado-alerta.enum';

export interface FiltrosAlerta {
  pacienteId?: number;
  severidadCodigo?: string;
  estadoCodigo?: string;
}

@Injectable()
export class AlertaRepository {
  constructor(
    @InjectRepository(Alerta)
    private readonly repo: Repository<Alerta>,
  ) {}

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: {
        paciente: true,
        tipoAlerta: true,
        severidad: true,
        estado: true,
      },
    });
  }

  findPendienteDuplicada(pacienteId: number, tipoAlertaCodigo: string) {
    return this.repo.findOne({
      where: {
        paciente: { id: pacienteId },
        tipoAlerta: { codigo: tipoAlertaCodigo },
        estado: { codigo: EstadoAlertaCodigo.PENDIENTE },
      },
    });
  }

  findAndCount(skip: number, take: number, filtros: FiltrosAlerta) {
    const where: Record<string, unknown> = {};
    if (filtros.pacienteId) {
      where.paciente = { id: filtros.pacienteId };
    }
    if (filtros.severidadCodigo) {
      where.severidad = { codigo: filtros.severidadCodigo };
    }
    if (filtros.estadoCodigo) {
      where.estado = { codigo: filtros.estadoCodigo };
    }

    return this.repo.findAndCount({
      where,
      relations: {
        paciente: true,
        tipoAlerta: true,
        severidad: true,
        estado: true,
      },
      order: { fechaGenerada: 'DESC' },
      skip,
      take,
    });
  }

  countPendientes() {
    return this.repo.count({
      where: { estado: { codigo: EstadoAlertaCodigo.PENDIENTE } },
    });
  }

  save(alerta: Alerta) {
    return this.repo.save(alerta);
  }
}
