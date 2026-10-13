import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { Usuario } from '../entities/usuario.entity';
import { RolRepository } from '../repositories/rol.repository';
import { UsuarioRepository } from '../repositories/usuario.repository';

const SALT_ROUNDS = 10;

@Injectable()
export class UsuariosService {
  constructor(
    private readonly usuarioRepository: UsuarioRepository,
    private readonly rolRepository: RolRepository,
  ) {}

  async create(dto: CreateUsuarioDto): Promise<Usuario> {
    const existente = await this.usuarioRepository.findByEmail(dto.email);
    if (existente) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }
    const rol = await this.rolRepository.findByCodigo(dto.rolCodigo);
    if (!rol) {
      throw new NotFoundException(`El rol ${dto.rolCodigo} no existe`);
    }

    const usuario = new Usuario();
    usuario.nombres = dto.nombres;
    usuario.apellidos = dto.apellidos;
    usuario.email = dto.email;
    usuario.passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    usuario.rol = rol;
    usuario.activo = true;

    return this.usuarioRepository.save(usuario);
  }

  async findAll(page: number, limit: number) {
    const [data, total] = await this.usuarioRepository.findAndCount(
      (page - 1) * limit,
      limit,
    );
    return { data, total, page, limit };
  }

  async findById(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findById(id);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepository.findByEmail(email);
  }

  async update(id: number, dto: UpdateUsuarioDto): Promise<Usuario> {
    const usuario = await this.findById(id);

    if (dto.nombres) {
      usuario.nombres = dto.nombres;
    }
    if (dto.apellidos) {
      usuario.apellidos = dto.apellidos;
    }
    if (dto.email && dto.email !== usuario.email) {
      const existente = await this.usuarioRepository.findByEmail(dto.email);
      if (existente) {
        throw new ConflictException('Ya existe un usuario con ese email');
      }
      usuario.email = dto.email;
    }
    if (dto.password) {
      usuario.passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
    }
    if (dto.rolCodigo) {
      const rol = await this.rolRepository.findByCodigo(dto.rolCodigo);
      if (!rol) {
        throw new NotFoundException(`El rol ${dto.rolCodigo} no existe`);
      }
      usuario.rol = rol;
    }

    return this.usuarioRepository.save(usuario);
  }

  async desactivar(id: number): Promise<Usuario> {
    const usuario = await this.findById(id);
    usuario.activo = false;
    return this.usuarioRepository.save(usuario);
  }
}
