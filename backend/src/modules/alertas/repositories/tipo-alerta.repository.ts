import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoAlerta } from '../entities/tipo-alerta.entity';

@Injectable()
export class TipoAlertaRepository {
  constructor(
    @InjectRepository(TipoAlerta)
    private readonly repo: Repository<TipoAlerta>,
  ) {}

  findByCodigo(codigo: string) {
    return this.repo.findOne({ where: { codigo } });
  }
}
