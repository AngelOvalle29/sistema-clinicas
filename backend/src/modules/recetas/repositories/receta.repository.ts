import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Receta } from '../entities/receta.entity';

export interface FiltrosReceta {
  pacienteId?: number;
  medicoId?: number;
  estadoCodigo?: string;
}

@Injectable()
export class RecetaRepository {
  constructor(
    @InjectRepository(Receta)
    private readonly repo: Repository<Receta>,
  ) {}

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: {
        paciente: true,
        medico: true,
        estado: true,
        detalles: { producto: true },
      },
    });
  }

  count() {
    return this.repo.count();
  }

  findByPacienteIdYEstadoCodigo(pacienteId: number, estadoCodigo: string) {
    return this.repo.find({
      where: { paciente: { id: pacienteId }, estado: { codigo: estadoCodigo } },
    });
  }

  findAndCount(skip: number, take: number, filtros: FiltrosReceta) {
    const where: Record<string, unknown> = {};
    if (filtros.pacienteId) {
      where.paciente = { id: filtros.pacienteId };
    }
    if (filtros.medicoId) {
      where.medico = { id: filtros.medicoId };
    }
    if (filtros.estadoCodigo) {
      where.estado = { codigo: filtros.estadoCodigo };
    }

    return this.repo.findAndCount({
      where,
      relations: { paciente: true, medico: true, estado: true },
      order: { fechaEmision: 'DESC' },
      skip,
      take,
    });
  }

  save(receta: Receta) {
    return this.repo.save(receta);
  }
}
