import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditSubscriber } from './audit.subscriber';
import { AuditService } from './audit.service';
import { AuditoriaLog } from './entities/auditoria-log.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([AuditoriaLog])],
  providers: [AuditService, AuditSubscriber],
  exports: [AuditService],
})
export class AuditModule {}
