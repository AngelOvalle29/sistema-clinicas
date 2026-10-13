import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnfermedadCronica } from '../entities/enfermedad-cronica.entity';

@Injectable()
export class EnfermedadCronicaRepository {
  constructor(
    @InjectRepository(EnfermedadCronica)
    private readonly repo: Repository<EnfermedadCronica>,
  ) {}

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  findByCodigoCie10(codigoCie10: string) {
    return this.repo.findOne({ where: { codigoCie10 } });
  }

  findAndCount(skip: number, take: number, soloActivas: boolean) {
    return this.repo.findAndCount({
      where: soloActivas ? { activo: true } : {},
      order: { nombre: 'ASC' },
      skip,
      take,
    });
  }

  save(enfermedad: EnfermedadCronica) {
    return this.repo.save(enfermedad);
  }
}
