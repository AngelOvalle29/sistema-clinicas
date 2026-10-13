import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { RequestContext } from '../context/request-context';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

type RequestConUsuario = Request & { user?: AuthenticatedUser };

@Injectable()
export class RequestContextInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<RequestConUsuario>();
    const usuarioId = request.user?.id ?? null;
    const ip: string | null =
      request.ip ?? request.socket?.remoteAddress ?? null;

    return RequestContext.run({ usuarioId, ip }, () => next.handle());
  }
}
