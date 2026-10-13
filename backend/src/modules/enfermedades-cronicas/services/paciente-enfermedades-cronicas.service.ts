import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PacientesService } from '../../pacientes/services/pacientes.service';
import { AsignarEnfermedadCronicaDto } from '../dto/asignar-enfermedad-cronica.dto';
import { PacienteEnfermedadCronica } from '../entities/paciente-enfermedad-cronica.entity';
import { EnfermedadCronicaRepository } from '../repositories/enfermedad-cronica.repository';
import { PacienteEnfermedadCronicaRepository } from '../repositories/paciente-enfermedad-cronica.repository';

@Injectable()
export class PacienteEnfermedadesCronicasService {
  constructor(
    private readonly pacienteEnfermedadCronicaRepository: PacienteEnfermedadCronicaRepository,
    private readonly enfermedadCronicaRepository: EnfermedadCronicaRepository,
    private readonly pacientesService: PacientesService,
  ) {}

  async asignar(
    pacienteId: number,
    dto: AsignarEnfermedadCronicaDto,
  ): Promise<PacienteEnfermedadCronica> {
    const paciente =
      await this.pacientesService.validarActivoParaAtencion(pacienteId);

    const enfermedad = await this.enfermedadCronicaRepository.findById(
      dto.enfermedadCronicaId,
    );
    if (!enfermedad) {
      throw new NotFoundException('Enfermedad crónica no encontrada');
    }
    if (!enfermedad.activo) {
      throw new BadRequestException('La enfermedad crónica está inactiva');
    }

    const existente =
      await this.pacienteEnfermedadCronicaRepository.findActivaPorPacienteYEnfermedad(
        pacienteId,
        dto.enfermedadCronicaId,
      );
    if (existente) {
      throw new ConflictException(
        'El paciente ya tiene esa enfermedad crónica activa',
      );
    }

    const asignacion = new PacienteEnfermedadCronica();
    asignacion.paciente = paciente;
    asignacion.enfermedadCronica = enfermedad;
    asignacion.frecuenciaControlDiasOverride =
      dto.frecuenciaControlDiasOverride ?? null;
    asignacion.activo = true;

    return this.pacienteEnfermedadCronicaRepository.save(asignacion);
  }

  async retirar(asignacionId: number): Promise<PacienteEnfermedadCronica> {
    const asignacion =
      await this.pacienteEnfermedadCronicaRepository.findById(asignacionId);
    if (!asignacion) {
      throw new NotFoundException('Asignación no encontrada');
    }
    if (!asignacion.activo) {
      throw new BadRequestException('Esa asignación ya está retirada');
    }

    asignacion.activo = false;
    return this.pacienteEnfermedadCronicaRepository.save(asignacion);
  }

  findActivasByPaciente(
    pacienteId: number,
  ): Promise<PacienteEnfermedadCronica[]> {
    return this.pacienteEnfermedadCronicaRepository.findActivasByPaciente(
      pacienteId,
    );
  }

  /** Usado por `citas` para marcar `es_control_cronico` y por `alertas` para el job de control vencido. */
  async esPacienteCronico(pacienteId: number): Promise<boolean> {
    const activas =
      await this.pacienteEnfermedadCronicaRepository.findActivasByPaciente(
        pacienteId,
      );
    return activas.length > 0;
  }

  /** Usado por el job diario de `alertas`: todas las asignaciones activas con su frecuencia efectiva. */
  async findTodasActivasConFrecuencia(): Promise<
    Array<{
      asignacion: PacienteEnfermedadCronica;
      frecuenciaControlDias: number;
    }>
  > {
    const activas =
      await this.pacienteEnfermedadCronicaRepository.findTodasActivas();
    return activas.map((asignacion) => ({
      asignacion,
      frecuenciaControlDias:
        asignacion.frecuenciaControlDiasOverride ??
        asignacion.enfermedadCronica.frecuenciaControlDias,
    }));
  }
}
