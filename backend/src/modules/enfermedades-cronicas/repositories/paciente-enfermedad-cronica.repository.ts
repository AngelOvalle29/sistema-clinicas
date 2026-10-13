import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PacienteEnfermedadCronica } from '../entities/paciente-enfermedad-cronica.entity';

@Injectable()
export class PacienteEnfermedadCronicaRepository {
  constructor(
    @InjectRepository(PacienteEnfermedadCronica)
    private readonly repo: Repository<PacienteEnfermedadCronica>,
  ) {}

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: { paciente: true, enfermedadCronica: true },
    });
  }

  findActivasByPaciente(pacienteId: number) {
    return this.repo.find({
      where: { paciente: { id: pacienteId }, activo: true },
      relations: { enfermedadCronica: true },
    });
  }

  findActivaPorPacienteYEnfermedad(
    pacienteId: number,
    enfermedadCronicaId: number,
  ) {
    return this.repo.findOne({
      where: {
        paciente: { id: pacienteId },
        enfermedadCronica: { id: enfermedadCronicaId },
        activo: true,
      },
    });
  }

  findTodasActivas() {
    return this.repo.find({
      where: { activo: true },
      relations: { paciente: true, enfermedadCronica: true },
    });
  }

  save(asignacion: PacienteEnfermedadCronica) {
    return this.repo.save(asignacion);
  }
}
