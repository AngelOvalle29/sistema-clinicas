import { Injectable } from '@nestjs/common';
import { PacienteEnfermedadesCronicasService } from '../../enfermedades-cronicas/services/paciente-enfermedades-cronicas.service';
import { PacientesService } from '../../pacientes/services/pacientes.service';
import { AlergiasService } from './alergias.service';
import { AntecedentesService } from './antecedentes.service';
import { ConsultasService } from './consultas.service';

@Injectable()
export class HistorialService {
  constructor(
    private readonly pacientesService: PacientesService,
    private readonly consultasService: ConsultasService,
    private readonly alergiasService: AlergiasService,
    private readonly antecedentesService: AntecedentesService,
    private readonly pacienteEnfermedadesCronicasService: PacienteEnfermedadesCronicasService,
  ) {}

  async obtenerHistorialCompleto(pacienteId: number) {
    const paciente = await this.pacientesService.findById(pacienteId);

    const [consultas, alergias, antecedentes, enfermedadesCronicas] =
      await Promise.all([
        this.consultasService.findByPacienteId(pacienteId),
        this.alergiasService.findByPacienteId(pacienteId),
        this.antecedentesService.findByPacienteId(pacienteId),
        this.pacienteEnfermedadesCronicasService.findActivasByPaciente(
          pacienteId,
        ),
      ]);

    return {
      paciente,
      consultas,
      alergias,
      antecedentes,
      enfermedadesCronicas,
    };
  }
}
