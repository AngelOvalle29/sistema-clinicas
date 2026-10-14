import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Between,
  EntityManager,
  FindOptionsWhere,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Defuncion } from '../entities/defuncion.entity';

@Injectable()
export class DefuncionRepository {
  constructor(
    @InjectRepository(Defuncion)
    private readonly repo: Repository<Defuncion>,
  ) {}

  findByPacienteId(pacienteId: number) {
    return this.repo.findOne({ where: { paciente: { id: pacienteId } } });
  }

  findAndCount(
    skip: number,
    take: number,
    fechaInicio?: Date,
    fechaFin?: Date,
  ) {
    const where: FindOptionsWhere<Defuncion> = {};
    if (fechaInicio && fechaFin) {
      where.fecha = Between(fechaInicio, fechaFin);
    } else if (fechaInicio) {
      where.fecha = MoreThanOrEqual(fechaInicio);
    } else if (fechaFin) {
      where.fecha = LessThanOrEqual(fechaFin);
    }

    return this.repo.findAndCount({
      where,
      relations: { paciente: true, medicoCertifica: { usuario: true } },
      order: { fecha: 'DESC' },
      skip,
      take,
    });
  }

  save(defuncion: Defuncion, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Defuncion) : this.repo;
    return repo.save(defuncion);
  }
}
