import { Injectable } from '@nestjs/common';
import { MovimientoInventario } from '../entities/movimiento-inventario.entity';
import { MovimientoInventarioRepository } from '../repositories/movimiento-inventario.repository';

@Injectable()
export class MovimientosInventarioService {
  constructor(
    private readonly movimientoInventarioRepository: MovimientoInventarioRepository,
  ) {}

  findByLoteId(loteId: number): Promise<MovimientoInventario[]> {
    return this.movimientoInventarioRepository.findByLoteId(loteId);
  }
}
