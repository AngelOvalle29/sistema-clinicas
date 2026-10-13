import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CitasService } from '../../citas/services/citas.service';
import { MedicosService } from '../../medicos/services/medicos.service';
import { PacientesService } from '../../pacientes/services/pacientes.service';
import { CreateConsultaDto } from '../dto/create-consulta.dto';
import { UpdateConsultaDto } from '../dto/update-consulta.dto';
import { Cita } from '../../citas/entities/cita.entity';
import { Consulta } from '../entities/consulta.entity';
import { ConsultaRepository } from '../repositories/consulta.repository';

@Injectable()
export class ConsultasService {
  constructor(
    private readonly consultaRepository: ConsultaRepository,
    private readonly pacientesService: PacientesService,
    private readonly medicosService: MedicosService,
    private readonly citasService: CitasService,
  ) {}

  async create(
    dto: CreateConsultaDto,
    usuarioActualId: number,
  ): Promise<Consulta> {
    const paciente = await this.pacientesService.validarActivoParaAtencion(
      dto.pacienteId,
    );
    const medico = await this.medicosService.findByUsuarioId(usuarioActualId);

    let cita: Cita | null = null;
    if (dto.citaId) {
      cita = await this.citasService.findById(dto.citaId);
      if (cita.paciente.id !== dto.pacienteId) {
        throw new ForbiddenException('La cita no corresponde a ese paciente');
      }
    }

    const consulta = new Consulta();
    consulta.paciente = paciente;
    consulta.medico = medico;
    consulta.cita = cita;
    consulta.fecha = dto.fecha ? new Date(dto.fecha) : new Date();
    consulta.motivo = dto.motivo ?? null;
    consulta.diagnostico = dto.diagnostico ?? null;
    consulta.notas = dto.notas ?? null;

    return this.consultaRepository.save(consulta);
  }

  async findById(id: number): Promise<Consulta> {
    const consulta = await this.consultaRepository.findById(id);
    if (!consulta) {
      throw new NotFoundException('Consulta no encontrada');
    }
    return consulta;
  }

  findByPacienteId(pacienteId: number): Promise<Consulta[]> {
    return this.consultaRepository.findByPacienteId(pacienteId);
  }

  async update(
    id: number,
    dto: UpdateConsultaDto,
    usuarioActualId: number,
  ): Promise<Consulta> {
    const consulta = await this.findById(id);
    const medicoActual =
      await this.medicosService.findByUsuarioId(usuarioActualId);

    if (consulta.medico.id !== medicoActual.id) {
      throw new ForbiddenException(
        'Solo el médico autor puede editar su consulta',
      );
    }

    if (dto.motivo) {
      consulta.motivo = dto.motivo;
    }
    if (dto.diagnostico) {
      consulta.diagnostico = dto.diagnostico;
    }
    if (dto.notas) {
      consulta.notas = dto.notas;
    }

    return this.consultaRepository.save(consulta);
  }
}
