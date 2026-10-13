import { Injectable } from '@nestjs/common';
import { CategoriaPrioridad } from '../entities/categoria-prioridad.entity';
import { CategoriaPrioridadRepository } from '../repositories/categoria-prioridad.repository';

@Injectable()
export class CategoriasPrioridadService {
  constructor(
    private readonly categoriaPrioridadRepository: CategoriaPrioridadRepository,
  ) {}

  findActivas(): Promise<CategoriaPrioridad[]> {
    return this.categoriaPrioridadRepository.findActivas();
  }
}
