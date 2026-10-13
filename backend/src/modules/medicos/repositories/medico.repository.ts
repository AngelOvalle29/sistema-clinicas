import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medico } from '../entities/medico.entity';

@Injectable()
export class MedicoRepository {
  constructor(
    @InjectRepository(Medico)
    private readonly repo: Repository<Medico>,
  ) {}

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: { usuario: true, especialidad: true },
    });
  }

  findByUsuarioId(usuarioId: number) {
    return this.repo.findOne({
      where: { usuario: { id: usuarioId } },
      relations: { usuario: true, especialidad: true },
    });
  }

  findByNumeroColegiado(numeroColegiado: string) {
    return this.repo.findOne({ where: { numeroColegiado } });
  }

  findAndCount(skip: number, take: number, especialidadId?: number) {
    return this.repo.findAndCount({
      where: especialidadId ? { especialidad: { id: especialidadId } } : {},
      relations: { usuario: true, especialidad: true },
      order: { id: 'ASC' },
      skip,
      take,
    });
  }

  save(medico: Medico) {
    return this.repo.save(medico);
  }
}
