import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEspecialidadDto } from '../dto/create-especialidad.dto';
import { UpdateEspecialidadDto } from '../dto/update-especialidad.dto';
import { Especialidad } from '../entities/especialidad.entity';
import { EspecialidadRepository } from '../repositories/especialidad.repository';

@Injectable()
export class EspecialidadesService {
  constructor(
    private readonly especialidadRepository: EspecialidadRepository,
  ) {}

  async create(dto: CreateEspecialidadDto): Promise<Especialidad> {
    const existente = await this.especialidadRepository.findByNombre(
      dto.nombre,
    );
    if (existente) {
      throw new ConflictException('Ya existe una especialidad con ese nombre');
    }

    const especialidad = new Especialidad();
    especialidad.nombre = dto.nombre;
    especialidad.activo = true;

    return this.especialidadRepository.save(especialidad);
  }

  async findAll(page: number, limit: number, soloActivas: boolean) {
    const [data, total] = await this.especialidadRepository.findAndCount(
      (page - 1) * limit,
      limit,
      soloActivas,
    );
    return { data, total, page, limit };
  }

  async findById(id: number): Promise<Especialidad> {
    const especialidad = await this.especialidadRepository.findById(id);
    if (!especialidad) {
      throw new NotFoundException('Especialidad no encontrada');
    }
    return especialidad;
  }

  async update(id: number, dto: UpdateEspecialidadDto): Promise<Especialidad> {
    const especialidad = await this.findById(id);

    if (dto.nombre && dto.nombre !== especialidad.nombre) {
      const existente = await this.especialidadRepository.findByNombre(
        dto.nombre,
      );
      if (existente) {
        throw new ConflictException(
          'Ya existe una especialidad con ese nombre',
        );
      }
      especialidad.nombre = dto.nombre;
    }

    return this.especialidadRepository.save(especialidad);
  }

  async desactivar(id: number): Promise<Especialidad> {
    const especialidad = await this.findById(id);
    especialidad.activo = false;
    return this.especialidadRepository.save(especialidad);
  }
}
