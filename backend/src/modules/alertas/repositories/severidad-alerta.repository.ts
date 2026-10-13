import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SeveridadAlerta } from '../entities/severidad-alerta.entity';

@Injectable()
export class SeveridadAlertaRepository {
  constructor(
    @InjectRepository(SeveridadAlerta)
    private readonly repo: Repository<SeveridadAlerta>,
  ) {}

  findByCodigo(codigo: string) {
    return this.repo.findOne({ where: { codigo } });
  }
}
