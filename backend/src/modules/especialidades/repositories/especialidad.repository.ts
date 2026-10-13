import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Especialidad } from '../entities/especialidad.entity';

@Injectable()
export class EspecialidadRepository {
  constructor(
    @InjectRepository(Especialidad)
    private readonly repo: Repository<Especialidad>,
  ) {}

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  findByNombre(nombre: string) {
    return this.repo.findOne({ where: { nombre } });
  }

  findActivas() {
    return this.repo.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });
  }

  findAndCount(skip: number, take: number, soloActivas: boolean) {
    return this.repo.findAndCount({
      where: soloActivas ? { activo: true } : {},
      order: { nombre: 'ASC' },
      skip,
      take,
    });
  }

  save(especialidad: Especialidad) {
    return this.repo.save(especialidad);
  }
}
