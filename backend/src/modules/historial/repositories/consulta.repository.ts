import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consulta } from '../entities/consulta.entity';

@Injectable()
export class ConsultaRepository {
  constructor(
    @InjectRepository(Consulta)
    private readonly repo: Repository<Consulta>,
  ) {}

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: {
        cita: true,
        paciente: true,
        medico: { usuario: true, especialidad: true },
      },
    });
  }

  findByPacienteId(pacienteId: number) {
    return this.repo.find({
      where: { paciente: { id: pacienteId } },
      relations: { medico: { usuario: true, especialidad: true } },
      order: { fecha: 'DESC' },
    });
  }

  save(consulta: Consulta) {
    return this.repo.save(consulta);
  }
}
