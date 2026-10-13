import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoCita } from '../entities/estado-cita.entity';

@Injectable()
export class EstadoCitaRepository {
  constructor(
    @InjectRepository(EstadoCita)
    private readonly repo: Repository<EstadoCita>,
  ) {}

  findByCodigo(codigo: string) {
    return this.repo.findOne({ where: { codigo } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
