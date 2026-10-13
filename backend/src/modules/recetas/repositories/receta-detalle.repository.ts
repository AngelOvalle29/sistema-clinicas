import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecetaDetalle } from '../entities/receta-detalle.entity';

@Injectable()
export class RecetaDetalleRepository {
  constructor(
    @InjectRepository(RecetaDetalle)
    private readonly repo: Repository<RecetaDetalle>,
  ) {}

  findByRecetaId(recetaId: number) {
    return this.repo.find({
      where: { receta: { id: recetaId } },
      relations: { producto: true },
    });
  }

  save(detalle: RecetaDetalle) {
    return this.repo.save(detalle);
  }
}
