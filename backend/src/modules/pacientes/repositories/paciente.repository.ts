import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { Paciente } from '../entities/paciente.entity';

export interface FiltrosPaciente {
  nombre?: string;
  dpi?: string;
  estadoCodigo?: string;
  soloPrioritarios?: boolean;
}

@Injectable()
export class PacienteRepository {
  constructor(
    @InjectRepository(Paciente)
    private readonly repo: Repository<Paciente>,
  ) {}

  findById(id: number, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Paciente) : this.repo;
    return repo.findOne({ where: { id }, relations: { estado: true } });
  }

  findByDpi(dpi: string) {
    return this.repo.findOne({ where: { dpi }, relations: { estado: true } });
  }

  count() {
    return this.repo.count();
  }

  findAndCount(skip: number, take: number, filtros: FiltrosPaciente) {
    const base: Record<string, unknown> = {};
    if (filtros.dpi) {
      base.dpi = filtros.dpi;
    }
    if (filtros.estadoCodigo) {
      base.estado = { codigo: filtros.estadoCodigo };
    }
    if (filtros.soloPrioritarios) {
      base.esPrioritario = true;
    }

    const where = filtros.nombre
      ? [
          { ...base, nombres: Like(`%${filtros.nombre}%`) },
          { ...base, apellidos: Like(`%${filtros.nombre}%`) },
        ]
      : base;

    return this.repo.findAndCount({
      where,
      relations: { estado: true },
      order: { apellidos: 'ASC' },
      skip,
      take,
    });
  }

  save(paciente: Paciente, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Paciente) : this.repo;
    return repo.save(paciente);
  }
}
