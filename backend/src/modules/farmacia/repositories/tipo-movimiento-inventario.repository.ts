import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoMovimientoInventario } from '../entities/tipo-movimiento-inventario.entity';

@Injectable()
export class TipoMovimientoInventarioRepository {
  constructor(
    @InjectRepository(TipoMovimientoInventario)
    private readonly repo: Repository<TipoMovimientoInventario>,
  ) {}

  findByCodigo(codigo: string) {
    return this.repo.findOne({ where: { codigo } });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }
}
