import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { MovimientoInventario } from '../entities/movimiento-inventario.entity';

@Injectable()
export class MovimientoInventarioRepository {
  constructor(
    @InjectRepository(MovimientoInventario)
    private readonly repo: Repository<MovimientoInventario>,
  ) {}

  findByLoteId(loteId: number) {
    return this.repo.find({
      where: { lote: { id: loteId } },
      relations: { tipoMovimiento: true },
      order: { fecha: 'DESC' },
    });
  }

  save(movimiento: MovimientoInventario, manager?: EntityManager) {
    const repo = manager
      ? manager.getRepository(MovimientoInventario)
      : this.repo;
    return repo.save(movimiento);
  }
}
