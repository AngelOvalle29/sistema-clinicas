import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEnfermedadCronicaDto } from '../dto/create-enfermedad-cronica.dto';
import { UpdateEnfermedadCronicaDto } from '../dto/update-enfermedad-cronica.dto';
import { EnfermedadCronica } from '../entities/enfermedad-cronica.entity';
import { EnfermedadCronicaRepository } from '../repositories/enfermedad-cronica.repository';

@Injectable()
export class EnfermedadesCronicasService {
  constructor(
    private readonly enfermedadCronicaRepository: EnfermedadCronicaRepository,
  ) {}

  async create(dto: CreateEnfermedadCronicaDto): Promise<EnfermedadCronica> {
    if (dto.codigoCie10) {
      const existente =
        await this.enfermedadCronicaRepository.findByCodigoCie10(
          dto.codigoCie10,
        );
      if (existente) {
        throw new ConflictException(
          'Ya existe una enfermedad crónica con ese código CIE-10',
        );
      }
    }

    const enfermedad = new EnfermedadCronica();
    enfermedad.codigoCie10 = dto.codigoCie10 ?? null;
    enfermedad.nombre = dto.nombre;
    enfermedad.frecuenciaControlDias = dto.frecuenciaControlDias;
    enfermedad.activo = true;

    return this.enfermedadCronicaRepository.save(enfermedad);
  }

  async findAll(page: number, limit: number, soloActivas: boolean) {
    const [data, total] = await this.enfermedadCronicaRepository.findAndCount(
      (page - 1) * limit,
      limit,
      soloActivas,
    );
    return { data, total, page, limit };
  }

  async findById(id: number): Promise<EnfermedadCronica> {
    const enfermedad = await this.enfermedadCronicaRepository.findById(id);
    if (!enfermedad) {
      throw new NotFoundException('Enfermedad crónica no encontrada');
    }
    return enfermedad;
  }

  async update(
    id: number,
    dto: UpdateEnfermedadCronicaDto,
  ): Promise<EnfermedadCronica> {
    const enfermedad = await this.findById(id);

    if (dto.codigoCie10 && dto.codigoCie10 !== enfermedad.codigoCie10) {
      const existente =
        await this.enfermedadCronicaRepository.findByCodigoCie10(
          dto.codigoCie10,
        );
      if (existente) {
        throw new ConflictException(
          'Ya existe una enfermedad crónica con ese código CIE-10',
        );
      }
      enfermedad.codigoCie10 = dto.codigoCie10;
    }
    if (dto.nombre) {
      enfermedad.nombre = dto.nombre;
    }
    if (dto.frecuenciaControlDias) {
      enfermedad.frecuenciaControlDias = dto.frecuenciaControlDias;
    }

    return this.enfermedadCronicaRepository.save(enfermedad);
  }

  async desactivar(id: number): Promise<EnfermedadCronica> {
    const enfermedad = await this.findById(id);
    enfermedad.activo = false;
    return this.enfermedadCronicaRepository.save(enfermedad);
  }
}
