import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { EstadoPaciente } from '../entities/estado-paciente.entity';

@Injectable()
export class EstadoPacienteRepository {
  constructor(
    @InjectRepository(EstadoPaciente)
    private readonly repo: Repository<EstadoPaciente>,
  ) {}

  findByCodigo(codigo: string, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(EstadoPaciente) : this.repo;
    return repo.findOne({ where: { codigo } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
