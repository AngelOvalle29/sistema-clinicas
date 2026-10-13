import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rol } from '../entities/rol.entity';

@Injectable()
export class RolRepository {
  constructor(
    @InjectRepository(Rol)
    private readonly repo: Repository<Rol>,
  ) {}

  findByCodigo(codigo: string) {
    return this.repo.findOne({ where: { codigo } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  findActivos() {
    return this.repo.find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });
  }
}
