import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspecialidadesController } from './controllers/especialidades.controller';
import { Especialidad } from './entities/especialidad.entity';
import { EspecialidadRepository } from './repositories/especialidad.repository';
import { EspecialidadesService } from './services/especialidades.service';

@Module({
  imports: [TypeOrmModule.forFeature([Especialidad])],
  controllers: [EspecialidadesController],
  providers: [EspecialidadRepository, EspecialidadesService],
  exports: [EspecialidadesService],
})
export class EspecialidadesModule {}
