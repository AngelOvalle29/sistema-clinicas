import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alergia } from '../entities/alergia.entity';

@Injectable()
export class AlergiaRepository {
  constructor(
    @InjectRepository(Alergia)
    private readonly repo: Repository<Alergia>,
  ) {}

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  findByPacienteId(pacienteId: number) {
    return this.repo.find({
      where: { paciente: { id: pacienteId } },
      order: { id: 'DESC' },
    });
  }

  save(alergia: Alergia) {
    return this.repo.save(alergia);
  }
}
