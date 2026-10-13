import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Producto } from '../entities/producto.entity';

export interface FiltrosProducto {
  busqueda?: string;
  tipoProductoId?: number;
  soloActivos?: boolean;
}

@Injectable()
export class ProductoRepository {
  constructor(
    @InjectRepository(Producto)
    private readonly repo: Repository<Producto>,
  ) {}

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: { tipoProducto: true },
    });
  }

  findByCodigo(codigo: string) {
    return this.repo.findOne({ where: { codigo } });
  }

  findActivos() {
    return this.repo.find({
      where: { activo: true },
      relations: { tipoProducto: true },
    });
  }

  findAndCount(skip: number, take: number, filtros: FiltrosProducto) {
    const base: Record<string, unknown> = {};
    if (filtros.tipoProductoId) {
      base.tipoProducto = { id: filtros.tipoProductoId };
    }
    if (filtros.soloActivos) {
      base.activo = true;
    }

    const where = filtros.busqueda
      ? [
          { ...base, nombre: Like(`%${filtros.busqueda}%`) },
          { ...base, principioActivo: Like(`%${filtros.busqueda}%`) },
          { ...base, codigo: Like(`%${filtros.busqueda}%`) },
        ]
      : base;

    return this.repo.findAndCount({
      where,
      relations: { tipoProducto: true },
      order: { nombre: 'ASC' },
      skip,
      take,
    });
  }

  save(producto: Producto) {
    return this.repo.save(producto);
  }
}
