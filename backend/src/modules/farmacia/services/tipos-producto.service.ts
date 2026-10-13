import { Injectable } from '@nestjs/common';
import { TipoProducto } from '../entities/tipo-producto.entity';
import { TipoProductoRepository } from '../repositories/tipo-producto.repository';

@Injectable()
export class TiposProductoService {
  constructor(
    private readonly tipoProductoRepository: TipoProductoRepository,
  ) {}

  findAll(): Promise<TipoProducto[]> {
    return this.tipoProductoRepository.findAll();
  }
}
