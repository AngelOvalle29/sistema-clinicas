import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstadoAlerta } from '../entities/estado-alerta.entity';

@Injectable()
export class EstadoAlertaRepository {
  constructor(
    @InjectRepository(EstadoAlerta)
    private readonly repo: Repository<EstadoAlerta>,
  ) {}

  findByCodigo(codigo: string) {
    return this.repo.findOne({ where: { codigo } });
  }
}
