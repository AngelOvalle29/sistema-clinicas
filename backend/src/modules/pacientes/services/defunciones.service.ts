import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DataSource } from 'typeorm';
import { MedicosService } from '../../medicos/services/medicos.service';
import { RegistrarDefuncionDto } from '../dto/registrar-defuncion.dto';
import { EstadoPacienteCodigo } from '../enums/estado-paciente.enum';
import { Defuncion } from '../entities/defuncion.entity';
import { DefuncionRepository } from '../repositories/defuncion.repository';
import { EstadoPacienteRepository } from '../repositories/estado-paciente.repository';
import { PacienteRepository } from '../repositories/paciente.repository';

@Injectable()
export class DefuncionesService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly defuncionRepository: DefuncionRepository,
    private readonly pacienteRepository: PacienteRepository,
    private readonly estadoPacienteRepository: EstadoPacienteRepository,
    private readonly medicosService: MedicosService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async registrar(
    pacienteId: number,
    dto: RegistrarDefuncionDto,
  ): Promise<Defuncion> {
    const paciente = await this.pacienteRepository.findById(pacienteId);
    if (!paciente) {
      throw new NotFoundException('Paciente no encontrado');
    }
    if (
      (paciente.estado.codigo as EstadoPacienteCodigo) ===
      EstadoPacienteCodigo.FALLECIDO
    ) {
      throw new BadRequestException(
        'El paciente ya está registrado como fallecido',
      );
    }

    const medico = await this.medicosService.findById(dto.medicoCertificaId);

    const estadoFallecido = await this.estadoPacienteRepository.findByCodigo(
      EstadoPacienteCodigo.FALLECIDO,
    );
    if (!estadoFallecido) {
      throw new NotFoundException(
        'El catálogo estados_paciente no tiene seedeado el código FALLECIDO',
      );
    }

    const defuncion = await this.dataSource.transaction(async (manager) => {
      const nuevaDefuncion = new Defuncion();
      nuevaDefuncion.paciente = paciente;
      nuevaDefuncion.fecha = new Date(dto.fecha);
      nuevaDefuncion.causa = dto.causa;
      nuevaDefuncion.numeroCertificado = dto.numeroCertificado ?? null;
      nuevaDefuncion.medicoCertifica = medico;
      const guardada = await this.defuncionRepository.save(
        nuevaDefuncion,
        manager,
      );

      paciente.estado = estadoFallecido;
      await this.pacienteRepository.save(paciente, manager);

      return guardada;
    });

    // citas/alertas/recetas todavía no existen en este punto del proyecto;
    // cuando se implementen, deben escuchar este evento para cancelar citas
    // futuras, descartar alertas pendientes y anular recetas EMITIDA (regla 5.5).
    this.eventEmitter.emit('paciente.fallecido', { pacienteId });

    return defuncion;
  }

  async findAll(
    page: number,
    limit: number,
    fechaInicio?: string,
    fechaFin?: string,
  ) {
    const [data, total] = await this.defuncionRepository.findAndCount(
      (page - 1) * limit,
      limit,
      fechaInicio ? new Date(fechaInicio) : undefined,
      fechaFin ? new Date(fechaFin) : undefined,
    );
    return { data, total, page, limit };
  }
}
