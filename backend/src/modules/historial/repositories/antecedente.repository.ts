import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Antecedente } from '../entities/antecedente.entity';

@Injectable()
export class AntecedenteRepository {
  constructor(
    @InjectRepository(Antecedente)
    private readonly repo: Repository<Antecedente>,
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

  save(antecedente: Antecedente) {
    return this.repo.save(antecedente);
  }
}
