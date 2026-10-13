import { Injectable } from '@nestjs/common';
import { PacientesService } from '../../pacientes/services/pacientes.service';
import { CreateAntecedenteDto } from '../dto/create-antecedente.dto';
import { Antecedente } from '../entities/antecedente.entity';
import { AntecedenteRepository } from '../repositories/antecedente.repository';

@Injectable()
export class AntecedentesService {
  constructor(
    private readonly antecedenteRepository: AntecedenteRepository,
    private readonly pacientesService: PacientesService,
  ) {}

  async create(
    pacienteId: number,
    dto: CreateAntecedenteDto,
  ): Promise<Antecedente> {
    const paciente = await this.pacientesService.findById(pacienteId);

    const antecedente = new Antecedente();
    antecedente.paciente = paciente;
    antecedente.tipo = dto.tipo;
    antecedente.descripcion = dto.descripcion;

    return this.antecedenteRepository.save(antecedente);
  }

  findByPacienteId(pacienteId: number): Promise<Antecedente[]> {
    return this.antecedenteRepository.findByPacienteId(pacienteId);
  }
}
