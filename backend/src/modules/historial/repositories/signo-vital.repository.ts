import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignoVital } from '../entities/signo-vital.entity';

@Injectable()
export class SignoVitalRepository {
  constructor(
    @InjectRepository(SignoVital)
    private readonly repo: Repository<SignoVital>,
  ) {}

  findByConsultaId(consultaId: number) {
    return this.repo.findOne({ where: { consulta: { id: consultaId } } });
  }

  save(signoVital: SignoVital) {
    return this.repo.save(signoVital);
  }
}
