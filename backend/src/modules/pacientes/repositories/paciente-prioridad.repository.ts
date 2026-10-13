import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacientePrioridad } from '../entities/paciente-prioridad.entity';

@Injectable()
export class PacientePrioridadRepository {
  constructor(
    @InjectRepository(PacientePrioridad)
    private readonly repo: Repository<PacientePrioridad>,
  ) {}

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: { paciente: true, categoriaPrioridad: true },
    });
  }

  findActivasByPaciente(pacienteId: number) {
    return this.repo.find({
      where: { paciente: { id: pacienteId }, activo: true },
      relations: { categoriaPrioridad: true },
    });
  }

  findActivaPorPacienteYCategoria(
    pacienteId: number,
    categoriaPrioridadId: number,
  ) {
    return this.repo.findOne({
      where: {
        paciente: { id: pacienteId },
        categoriaPrioridad: { id: categoriaPrioridadId },
        activo: true,
      },
    });
  }

  save(prioridad: PacientePrioridad) {
    return this.repo.save(prioridad);
  }
}
