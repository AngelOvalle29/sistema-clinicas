import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaPrioridad } from '../entities/categoria-prioridad.entity';

@Injectable()
export class CategoriaPrioridadRepository {
  constructor(
    @InjectRepository(CategoriaPrioridad)
    private readonly repo: Repository<CategoriaPrioridad>,
  ) {}

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  findByCodigo(codigo: string) {
    return this.repo.findOne({ where: { codigo } });
  }

  findActivas() {
    return this.repo.find({ where: { activo: true }, order: { nivel: 'ASC' } });
  }
}
