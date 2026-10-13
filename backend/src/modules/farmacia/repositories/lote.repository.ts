import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EntityManager,
  LessThan,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Lote } from '../entities/lote.entity';

@Injectable()
export class LoteRepository {
  constructor(
    @InjectRepository(Lote)
    private readonly repo: Repository<Lote>,
  ) {}

  findById(id: number, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Lote) : this.repo;
    return repo.findOne({ where: { id }, relations: { producto: true } });
  }

  findByProductoId(productoId: number) {
    return this.repo.find({
      where: { producto: { id: productoId } },
      order: { fechaVencimiento: 'ASC' },
    });
  }

  findVigentesOrdenadosPorVencimiento(productoId: number) {
    return this.repo
      .createQueryBuilder('lote')
      .where('lote.producto_id = :productoId', { productoId })
      .andWhere('lote.cantidad_actual > 0')
      .andWhere('lote.fecha_vencimiento >= :hoy', { hoy: new Date() })
      .orderBy('lote.fecha_vencimiento', 'ASC')
      .getMany();
  }

  async sumarStockVigente(productoId: number): Promise<number> {
    const resultado = await this.repo
      .createQueryBuilder('lote')
      .select('SUM(lote.cantidad_actual)', 'total')
      .where('lote.producto_id = :productoId', { productoId })
      .andWhere('lote.fecha_vencimiento >= :hoy', { hoy: new Date() })
      .getRawOne<{ total: string | null }>();
    return Number(resultado?.total ?? 0);
  }

  findProximosAVencer(dias: number) {
    const limite = new Date();
    limite.setDate(limite.getDate() + dias);
    return this.repo.find({
      where: {
        fechaVencimiento: LessThanOrEqual(limite),
        cantidadActual: MoreThanOrEqual(1),
      },
      relations: { producto: true },
      order: { fechaVencimiento: 'ASC' },
    });
  }

  findVencidos() {
    return this.repo.find({
      where: { fechaVencimiento: LessThan(new Date()) },
      relations: { producto: true },
      order: { fechaVencimiento: 'DESC' },
    });
  }

  save(lote: Lote, manager?: EntityManager) {
    const repo = manager ? manager.getRepository(Lote) : this.repo;
    return repo.save(lote);
  }
}
