import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RolCodigo } from '../enums/rol-codigo.enum';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

type RequestConUsuario = Request & { user?: AuthenticatedUser };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesRequeridos = this.reflector.getAllAndOverride<RolCodigo[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!rolesRequeridos || rolesRequeridos.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<RequestConUsuario>();
    if (!user || !rolesRequeridos.includes(user.rolCodigo as RolCodigo)) {
      throw new ForbiddenException('No tiene permisos para esta acción');
    }
    return true;
  }
}
