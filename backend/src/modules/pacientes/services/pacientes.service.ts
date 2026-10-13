import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePacienteDto } from '../dto/create-paciente.dto';
import { UpdatePacienteDto } from '../dto/update-paciente.dto';
import { EstadoPacienteCodigo } from '../enums/estado-paciente.enum';
import { Paciente } from '../entities/paciente.entity';
import {
  FiltrosPaciente,
  PacienteRepository,
} from '../repositories/paciente.repository';
import { EstadoPacienteRepository } from '../repositories/estado-paciente.repository';

@Injectable()
export class PacientesService {
  constructor(
    private readonly pacienteRepository: PacienteRepository,
    private readonly estadoPacienteRepository: EstadoPacienteRepository,
  ) {}

  async create(dto: CreatePacienteDto): Promise<Paciente> {
    if (dto.dpi) {
      const existente = await this.pacienteRepository.findByDpi(dto.dpi);
      if (existente) {
        throw new ConflictException('Ya existe un paciente con ese DPI');
      }
    }

    const estadoActivo = await this.estadoPacienteRepository.findByCodigo(
      EstadoPacienteCodigo.ACTIVO,
    );
    if (!estadoActivo) {
      throw new NotFoundException(
        'El catálogo estados_paciente no tiene seedeado el código ACTIVO',
      );
    }

    const total = await this.pacienteRepository.count();

    const paciente = new Paciente();
    paciente.codigo = `PAC-${String(total + 1).padStart(6, '0')}`;
    paciente.nombres = dto.nombres;
    paciente.apellidos = dto.apellidos;
    paciente.dpi = dto.dpi ?? null;
    paciente.fechaNacimiento = dto.fechaNacimiento
      ? new Date(dto.fechaNacimiento)
      : null;
    paciente.genero = dto.genero ?? null;
    paciente.telefono = dto.telefono ?? null;
    paciente.direccion = dto.direccion ?? null;
    paciente.estado = estadoActivo;
    paciente.esPrioritario = false;

    return this.pacienteRepository.save(paciente);
  }

  async findAll(page: number, limit: number, filtros: FiltrosPaciente) {
    const [data, total] = await this.pacienteRepository.findAndCount(
      (page - 1) * limit,
      limit,
      filtros,
    );
    return { data, total, page, limit };
  }

  async findById(id: number): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findById(id);
    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }
    return paciente;
  }

  async update(id: number, dto: UpdatePacienteDto): Promise<Paciente> {
    const paciente = await this.findById(id);

    if (dto.dpi && dto.dpi !== paciente.dpi) {
      const existente = await this.pacienteRepository.findByDpi(dto.dpi);
      if (existente) {
        throw new ConflictException('Ya existe un paciente con ese DPI');
      }
      paciente.dpi = dto.dpi;
    }
    if (dto.nombres) {
      paciente.nombres = dto.nombres;
    }
    if (dto.apellidos) {
      paciente.apellidos = dto.apellidos;
    }
    if (dto.fechaNacimiento) {
      paciente.fechaNacimiento = new Date(dto.fechaNacimiento);
    }
    if (dto.genero) {
      paciente.genero = dto.genero;
    }
    if (dto.telefono) {
      paciente.telefono = dto.telefono;
    }
    if (dto.direccion) {
      paciente.direccion = dto.direccion;
    }

    return this.pacienteRepository.save(paciente);
  }

  /**
   * Usado por otros módulos (citas, historial, recetas) antes de crear
   * registros nuevos para un paciente: bloquea fallecidos e inactivos.
   */
  async validarActivoParaAtencion(id: number): Promise<Paciente> {
    const paciente = await this.findById(id);
    if (
      (paciente.estado.codigo as EstadoPacienteCodigo) ===
      EstadoPacienteCodigo.FALLECIDO
    ) {
      throw new BadRequestException(
        'El paciente está fallecido: no se pueden registrar citas, consultas ni recetas',
      );
    }
    if (
      (paciente.estado.codigo as EstadoPacienteCodigo) ===
      EstadoPacienteCodigo.INACTIVO
    ) {
      throw new BadRequestException(
        'El paciente está inactivo: no se pueden registrar citas, consultas ni recetas',
      );
    }
    return paciente;
  }
}
