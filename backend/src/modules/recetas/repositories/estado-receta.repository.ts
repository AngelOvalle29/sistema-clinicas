import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoReceta } from '../entities/estado-receta.entity';

@Injectable()
export class EstadoRecetaRepository {
  constructor(
    @InjectRepository(EstadoReceta)
    private readonly repo: Repository<EstadoReceta>,
  ) {}

  findByCodigo(codigo: string) {
    return this.repo.findOne({ where: { codigo } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
