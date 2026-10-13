import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PacienteEnfermedadesCronicasService } from '../../enfermedades-cronicas/services/paciente-enfermedades-cronicas.service';
import { MedicosService } from '../../medicos/services/medicos.service';
import { PacientesService } from '../../pacientes/services/pacientes.service';
import { PrioridadesService } from '../../pacientes/services/prioridades.service';
import { CancelarCitaDto } from '../dto/cancelar-cita.dto';
import { CreateCitaDto } from '../dto/create-cita.dto';
import { Cita } from '../entities/cita.entity';
import { EstadoCitaCodigo } from '../enums/estado-cita.enum';
import { CitaRepository, FiltrosCita } from '../repositories/cita.repository';
import { EstadoCitaRepository } from '../repositories/estado-cita.repository';

const TRANSICIONES_VALIDAS: Record<EstadoCitaCodigo, EstadoCitaCodigo[]> = {
  [EstadoCitaCodigo.PROGRAMADA]: [
    EstadoCitaCodigo.CONFIRMADA,
    EstadoCitaCodigo.CANCELADA,
    EstadoCitaCodigo.NO_ASISTIO,
  ],
  [EstadoCitaCodigo.CONFIRMADA]: [
    EstadoCitaCodigo.EN_CURSO,
    EstadoCitaCodigo.CANCELADA,
    EstadoCitaCodigo.NO_ASISTIO,
  ],
  [EstadoCitaCodigo.EN_CURSO]: [EstadoCitaCodigo.COMPLETADA],
  [EstadoCitaCodigo.COMPLETADA]: [],
  [EstadoCitaCodigo.CANCELADA]: [],
  [EstadoCitaCodigo.NO_ASISTIO]: [],
};

@Injectable()
export class CitasService {
  constructor(
    private readonly citaRepository: CitaRepository,
    private readonly estadoCitaRepository: EstadoCitaRepository,
    private readonly pacientesService: PacientesService,
    private readonly medicosService: MedicosService,
    private readonly prioridadesService: PrioridadesService,
    private readonly pacienteEnfermedadesCronicasService: PacienteEnfermedadesCronicasService,
  ) {}

  async create(dto: CreateCitaDto): Promise<Cita> {
    const inicio = new Date(dto.fechaHoraInicio);
    const fin = new Date(dto.fechaHoraFin);

    if (inicio <= new Date()) {
      throw new BadRequestException('No se pueden crear citas en el pasado');
    }
    if (fin <= inicio) {
      throw new BadRequestException(
        'La hora de fin debe ser posterior a la hora de inicio',
      );
    }

    const paciente = await this.pacientesService.validarActivoParaAtencion(
      dto.pacienteId,
    );
    const medico = await this.medicosService.findById(dto.medicoId);

    if (dto.esControlCronico) {
      const esCronico =
        await this.pacienteEnfermedadesCronicasService.esPacienteCronico(
          dto.pacienteId,
        );
      if (!esCronico) {
        throw new BadRequestException(
          'El paciente no tiene enfermedades crónicas activas; no puede marcarse como control crónico',
        );
      }
    }

    const solapadas = await this.citaRepository.findSolapadas(
      dto.medicoId,
      inicio,
      fin,
    );
    if (solapadas.length > 0) {
      throw new BadRequestException(
        'El médico ya tiene una cita en ese horario',
      );
    }

    const estadoProgramada = await this.estadoCitaRepository.findByCodigo(
      EstadoCitaCodigo.PROGRAMADA,
    );
    if (!estadoProgramada) {
      throw new NotFoundException(
        'El catálogo estados_cita no tiene seedeado PROGRAMADA',
      );
    }

    const nivelPrioridad = await this.prioridadesService.obtenerNivelMasAlto(
      dto.pacienteId,
    );

    const cita = new Cita();
    cita.paciente = paciente;
    cita.medico = medico;
    cita.fechaHoraInicio = inicio;
    cita.fechaHoraFin = fin;
    cita.estado = estadoProgramada;
    cita.nivelPrioridad = nivelPrioridad;
    cita.esControlCronico = dto.esControlCronico ?? false;

    return this.citaRepository.save(cita);
  }

  /** Usado por el job diario de `alertas` (CONTROL_VENCIDO / SIN_CITA_PROGRAMADA). */
  async tieneFuturaProgramada(pacienteId: number): Promise<boolean> {
    const futuras =
      await this.citaRepository.findFuturasActivasByPaciente(pacienteId);
    return futuras.length > 0;
  }

  async findAll(page: number, limit: number, filtros: FiltrosCita) {
    const [data, total] = await this.citaRepository.findAndCount(
      (page - 1) * limit,
      limit,
      filtros,
    );
    return { data, total, page, limit };
  }

  async findById(id: number): Promise<Cita> {
    const cita = await this.citaRepository.findById(id);
    if (!cita) {
      throw new NotFoundException('Cita no encontrada');
    }
    return cita;
  }

  confirmar(id: number): Promise<Cita> {
    return this.cambiarEstado(id, EstadoCitaCodigo.CONFIRMADA);
  }

  iniciar(id: number): Promise<Cita> {
    return this.cambiarEstado(id, EstadoCitaCodigo.EN_CURSO);
  }

  completar(id: number): Promise<Cita> {
    return this.cambiarEstado(id, EstadoCitaCodigo.COMPLETADA);
  }

  cancelar(id: number, dto: CancelarCitaDto): Promise<Cita> {
    return this.cambiarEstado(id, EstadoCitaCodigo.CANCELADA, dto.motivo);
  }

  marcarNoAsistio(id: number): Promise<Cita> {
    return this.cambiarEstado(id, EstadoCitaCodigo.NO_ASISTIO);
  }

  private async cambiarEstado(
    id: number,
    nuevoCodigo: EstadoCitaCodigo,
    motivo?: string,
  ): Promise<Cita> {
    const cita = await this.findById(id);
    const actual = cita.estado.codigo as EstadoCitaCodigo;
    const permitidas = TRANSICIONES_VALIDAS[actual] ?? [];

    if (!permitidas.includes(nuevoCodigo)) {
      throw new BadRequestException(
        `No se puede pasar de ${actual} a ${nuevoCodigo}`,
      );
    }

    const nuevoEstado =
      await this.estadoCitaRepository.findByCodigo(nuevoCodigo);
    if (!nuevoEstado) {
      throw new NotFoundException(
        `El catálogo estados_cita no tiene seedeado ${nuevoCodigo}`,
      );
    }

    cita.estado = nuevoEstado;
    if (nuevoCodigo === EstadoCitaCodigo.CANCELADA && motivo) {
      cita.motivoCancelacion = motivo;
    }

    return this.citaRepository.save(cita);
  }

  /** Regla 5.5: al registrar una defunción se cancelan las citas futuras del paciente. */
  @OnEvent('paciente.fallecido')
  async onPacienteFallecido(payload: { pacienteId: number }): Promise<void> {
    const estadoCancelada = await this.estadoCitaRepository.findByCodigo(
      EstadoCitaCodigo.CANCELADA,
    );
    if (!estadoCancelada) {
      return;
    }
    const futuras = await this.citaRepository.findFuturasActivasByPaciente(
      payload.pacienteId,
    );
    for (const cita of futuras) {
      cita.estado = estadoCancelada;
      cita.motivoCancelacion = 'Paciente fallecido';
      await this.citaRepository.save(cita);
    }
  }
}
