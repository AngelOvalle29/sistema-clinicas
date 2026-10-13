import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class UsuarioRepository {
  constructor(
    @InjectRepository(Usuario)
    private readonly repo: Repository<Usuario>,
  ) {}

  findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: { rol: true } });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email }, relations: { rol: true } });
  }

  findAndCount(skip: number, take: number) {
    return this.repo.findAndCount({
      relations: { rol: true },
      order: { apellidos: 'ASC' },
      skip,
      take,
    });
  }

  save(usuario: Usuario) {
    return this.repo.save(usuario);
  }
}
