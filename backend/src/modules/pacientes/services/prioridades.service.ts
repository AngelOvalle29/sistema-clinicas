import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AsignarPrioridadDto } from '../dto/asignar-prioridad.dto';
import { EstadoPacienteCodigo } from '../enums/estado-paciente.enum';
import { PacientePrioridad } from '../entities/paciente-prioridad.entity';
import { CategoriaPrioridadRepository } from '../repositories/categoria-prioridad.repository';
import { PacientePrioridadRepository } from '../repositories/paciente-prioridad.repository';
import { PacienteRepository } from '../repositories/paciente.repository';

@Injectable()
export class PrioridadesService {
  constructor(
    private readonly pacienteRepository: PacienteRepository,
    private readonly pacientePrioridadRepository: PacientePrioridadRepository,
    private readonly categoriaPrioridadRepository: CategoriaPrioridadRepository,
  ) {}

  async asignar(
    pacienteId: number,
    dto: AsignarPrioridadDto,
  ): Promise<PacientePrioridad> {
    const paciente = await this.pacienteRepository.findById(pacienteId);
    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }
    if (
      (paciente.estado.codigo as EstadoPacienteCodigo) ===
      EstadoPacienteCodigo.FALLECIDO
    ) {
      throw new BadRequestException(
        'No se pueden asignar prioridades a un paciente fallecido',
      );
    }

    const categoria = await this.categoriaPrioridadRepository.findById(
      dto.categoriaPrioridadId,
    );
    if (!categoria) {
      throw new NotFoundException('Categoría de prioridad no encontrada');
    }
    if (!categoria.activo) {
      throw new BadRequestException('La categoría de prioridad está inactiva');
    }

    const existente =
      await this.pacientePrioridadRepository.findActivaPorPacienteYCategoria(
        pacienteId,
        dto.categoriaPrioridadId,
      );
    if (existente) {
      throw new ConflictException('El paciente ya tiene esa prioridad activa');
    }

    const prioridad = new PacientePrioridad();
    prioridad.paciente = paciente;
    prioridad.categoriaPrioridad = categoria;
    prioridad.activo = true;
    prioridad.fechaAsignacion = new Date();

    const guardada = await this.pacientePrioridadRepository.save(prioridad);
    await this.recalcularEsPrioritario(pacienteId);
    return guardada;
  }

  async retirar(prioridadId: number): Promise<PacientePrioridad> {
    const prioridad =
      await this.pacientePrioridadRepository.findById(prioridadId);
    if (!prioridad) {
      throw new NotFoundException('Prioridad no encontrada');
    }
    if (!prioridad.activo) {
      throw new BadRequestException('Esa prioridad ya está retirada');
    }

    prioridad.activo = false;
    prioridad.fechaRetiro = new Date();
    const guardada = await this.pacientePrioridadRepository.save(prioridad);
    await this.recalcularEsPrioritario(prioridad.paciente.id);
    return guardada;
  }

  findActivasByPaciente(pacienteId: number): Promise<PacientePrioridad[]> {
    return this.pacientePrioridadRepository.findActivasByPaciente(pacienteId);
  }

  /** Usado por `citas` para copiar el nivel de prioridad más alto (1 = más alta) al crear la cita. */
  async obtenerNivelMasAlto(pacienteId: number): Promise<number | null> {
    const activas =
      await this.pacientePrioridadRepository.findActivasByPaciente(pacienteId);
    if (activas.length === 0) {
      return null;
    }
    return Math.min(
      ...activas.map((prioridad) => prioridad.categoriaPrioridad.nivel),
    );
  }

  private async recalcularEsPrioritario(pacienteId: number): Promise<void> {
    const activas =
      await this.pacientePrioridadRepository.findActivasByPaciente(pacienteId);
    const paciente = await this.pacienteRepository.findById(pacienteId);
    if (!paciente) {
      return;
    }
    paciente.esPrioritario = activas.length > 0;
    await this.pacienteRepository.save(paciente);
  }
}
