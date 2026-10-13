import { Injectable } from '@nestjs/common';
import { PacientesService } from '../../pacientes/services/pacientes.service';
import { CreateAlergiaDto } from '../dto/create-alergia.dto';
import { Alergia } from '../entities/alergia.entity';
import { AlergiaRepository } from '../repositories/alergia.repository';

@Injectable()
export class AlergiasService {
  constructor(
    private readonly alergiaRepository: AlergiaRepository,
    private readonly pacientesService: PacientesService,
  ) {}

  async create(pacienteId: number, dto: CreateAlergiaDto): Promise<Alergia> {
    const paciente = await this.pacientesService.findById(pacienteId);

    const alergia = new Alergia();
    alergia.paciente = paciente;
    alergia.descripcion = dto.descripcion;
    alergia.severidad = dto.severidad ?? null;

    return this.alergiaRepository.save(alergia);
  }

  findByPacienteId(pacienteId: number): Promise<Alergia[]> {
    return this.alergiaRepository.findByPacienteId(pacienteId);
  }
}
