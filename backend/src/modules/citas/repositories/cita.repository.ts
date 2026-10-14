import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, MoreThan, Not, Repository } from 'typeorm';
import { EstadoCitaCodigo } from '../enums/estado-cita.enum';
import { Cita } from '../entities/cita.entity';

export interface FiltrosCita {
  pacienteId?: number;
  medicoId?: number;
  fecha?: Date;
  estadoCodigo?: string;
}

const ESTADOS_QUE_NO_BLOQUEAN_AGENDA = [
  EstadoCitaCodigo.CANCELADA,
  EstadoCitaCodigo.NO_ASISTIO,
];

@Injectable()
export class CitaRepository {
  constructor(
    @InjectRepository(Cita)
    private readonly repo: Repository<Cita>,
  ) {}

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: {
        paciente: true,
        medico: { usuario: true, especialidad: true },
        estado: true,
      },
    });
  }

  async findSolapadas(
    medicoId: number,
    inicio: Date,
    fin: Date,
    excluirCitaId?: number,
  ) {
    const citas = await this.repo.find({
      where: {
        medico: { id: medicoId },
        fechaHoraInicio: LessThan(fin),
        fechaHoraFin: MoreThan(inicio),
      },
      relations: { estado: true },
    });
    return citas.filter(
      (cita) =>
        cita.id !== excluirCitaId &&
        !ESTADOS_QUE_NO_BLOQUEAN_AGENDA.includes(
          cita.estado.codigo as EstadoCitaCodigo,
        ),
    );
  }

  findFuturasActivasByPaciente(pacienteId: number) {
    return this.repo.find({
      where: {
        paciente: { id: pacienteId },
        fechaHoraInicio: MoreThan(new Date()),
        estado: { codigo: Not(EstadoCitaCodigo.CANCELADA) },
      },
      relations: { estado: true },
    });
  }

  findAndCount(skip: number, take: number, filtros: FiltrosCita) {
    const where: Record<string, unknown> = {};
    if (filtros.pacienteId) {
      where.paciente = { id: filtros.pacienteId };
    }
    if (filtros.medicoId) {
      where.medico = { id: filtros.medicoId };
    }
    if (filtros.estadoCodigo) {
      where.estado = { codigo: filtros.estadoCodigo };
    }
    if (filtros.fecha) {
      const inicioDia = new Date(filtros.fecha);
      inicioDia.setHours(0, 0, 0, 0);
      const finDia = new Date(filtros.fecha);
      finDia.setHours(23, 59, 59, 999);
      where.fechaHoraInicio = LessThan(finDia);
      where.fechaHoraFin = MoreThan(inicioDia);
    }

    return this.repo.findAndCount({
      where,
      relations: {
        paciente: true,
        medico: { usuario: true, especialidad: true },
        estado: true,
      },
      order: { nivelPrioridad: 'ASC', fechaHoraInicio: 'ASC' },
      skip,
      take,
    });
  }

  save(cita: Cita) {
    return this.repo.save(cita);
  }
}
