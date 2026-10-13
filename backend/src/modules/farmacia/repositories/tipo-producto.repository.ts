import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoProducto } from '../entities/tipo-producto.entity';

@Injectable()
export class TipoProductoRepository {
  constructor(
    @InjectRepository(TipoProducto)
    private readonly repo: Repository<TipoProducto>,
  ) {}

  findByCodigo(codigo: string) {
    return this.repo.findOne({ where: { codigo } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  findAll() {
    return this.repo.find({ order: { nombre: 'ASC' } });
  }
}
