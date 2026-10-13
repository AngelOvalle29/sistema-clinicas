import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EspecialidadesService } from '../../especialidades/services/especialidades.service';
import { UsuariosService } from '../../usuarios/services/usuarios.service';
import { RolCodigo } from '../../../common/enums/rol-codigo.enum';
import { CreateMedicoDto } from '../dto/create-medico.dto';
import { UpdateMedicoDto } from '../dto/update-medico.dto';
import { Medico } from '../entities/medico.entity';
import { MedicoRepository } from '../repositories/medico.repository';

@Injectable()
export class MedicosService {
  constructor(
    private readonly medicoRepository: MedicoRepository,
    private readonly usuariosService: UsuariosService,
    private readonly especialidadesService: EspecialidadesService,
  ) {}

  async create(dto: CreateMedicoDto): Promise<Medico> {
    const usuario = await this.usuariosService.findById(dto.usuarioId);
    if ((usuario.rol.codigo as RolCodigo) !== RolCodigo.MEDICO) {
      throw new BadRequestException(
        'El usuario debe tener rol MEDICO para vincularse a un médico',
      );
    }

    const yaVinculado = await this.medicoRepository.findByUsuarioId(
      dto.usuarioId,
    );
    if (yaVinculado) {
      throw new ConflictException('Ese usuario ya está vinculado a un médico');
    }

    const numeroColegiadoExistente =
      await this.medicoRepository.findByNumeroColegiado(dto.numeroColegiado);
    if (numeroColegiadoExistente) {
      throw new ConflictException(
        'Ya existe un médico con ese número de colegiado',
      );
    }

    const especialidad = await this.especialidadesService.findById(
      dto.especialidadId,
    );
    if (!especialidad.activo) {
      throw new BadRequestException(
        'La especialidad seleccionada está inactiva',
      );
    }

    const medico = new Medico();
    medico.usuario = usuario;
    medico.especialidad = especialidad;
    medico.numeroColegiado = dto.numeroColegiado;

    return this.medicoRepository.save(medico);
  }

  async findAll(page: number, limit: number, especialidadId?: number) {
    const [data, total] = await this.medicoRepository.findAndCount(
      (page - 1) * limit,
      limit,
      especialidadId,
    );
    return { data, total, page, limit };
  }

  async findById(id: number): Promise<Medico> {
    const medico = await this.medicoRepository.findById(id);
    if (!medico) {
      throw new NotFoundException('Médico no encontrado');
    }
    return medico;
  }

  /** Usado por `historial`/`recetas` para resolver el médico autor a partir del usuario del JWT. */
  async findByUsuarioId(usuarioId: number): Promise<Medico> {
    const medico = await this.medicoRepository.findByUsuarioId(usuarioId);
    if (!medico) {
      throw new NotFoundException(
        'El usuario actual no está vinculado a un médico',
      );
    }
    return medico;
  }

  async update(id: number, dto: UpdateMedicoDto): Promise<Medico> {
    const medico = await this.findById(id);

    if (dto.numeroColegiado && dto.numeroColegiado !== medico.numeroColegiado) {
      const existente = await this.medicoRepository.findByNumeroColegiado(
        dto.numeroColegiado,
      );
      if (existente) {
        throw new ConflictException(
          'Ya existe un médico con ese número de colegiado',
        );
      }
      medico.numeroColegiado = dto.numeroColegiado;
    }

    if (dto.especialidadId && dto.especialidadId !== medico.especialidad.id) {
      const especialidad = await this.especialidadesService.findById(
        dto.especialidadId,
      );
      if (!especialidad.activo) {
        throw new BadRequestException(
          'La especialidad seleccionada está inactiva',
        );
      }
      medico.especialidad = especialidad;
    }

    return this.medicoRepository.save(medico);
  }
}
