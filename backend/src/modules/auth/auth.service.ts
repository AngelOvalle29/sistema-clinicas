import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import jwtConfig from '../../config/jwt.config';
import { AuditService } from '../../common/audit/audit.service';
import { AccionAuditoria } from '../../common/enums/accion-auditoria.enum';
import { UsuariosService } from '../usuarios/services/usuarios.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuariosService: UsuariosService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
  ) {}

  async login(dto: LoginDto, ip: string | null) {
    const usuario = await this.usuariosService.findByEmail(dto.email);
    const credencialesValidas =
      !!usuario &&
      usuario.activo &&
      (await bcrypt.compare(dto.password, usuario.passwordHash));

    if (!credencialesValidas) {
      await this.auditService.registrar({
        usuarioId: usuario?.id ?? null,
        accion: AccionAuditoria.LOGIN,
        tablaAfectada: 'usuarios',
        registroId: usuario?.id ?? null,
        datosNuevos: { email: dto.email, exito: false },
        ip,
      });
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rolCodigo: usuario.rol.codigo,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.secret,
      expiresIn: this.config.expiresIn as JwtSignOptions['expiresIn'],
    });

    await this.auditService.registrar({
      usuarioId: usuario.id,
      accion: AccionAuditoria.LOGIN,
      tablaAfectada: 'usuarios',
      registroId: usuario.id,
      datosNuevos: { email: usuario.email, exito: true },
      ip,
    });

    return {
      accessToken,
      expiresIn: this.config.expiresIn,
      usuario: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol.codigo,
      },
    };
  }
}
