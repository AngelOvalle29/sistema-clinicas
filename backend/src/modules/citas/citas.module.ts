import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnfermedadesCronicasModule } from '../enfermedades-cronicas/enfermedades-cronicas.module';
import { MedicosModule } from '../medicos/medicos.module';
import { PacientesModule } from '../pacientes/pacientes.module';
import { CitasController } from './controllers/citas.controller';
import { Cita } from './entities/cita.entity';
import { EstadoCita } from './entities/estado-cita.entity';
import { CitaRepository } from './repositories/cita.repository';
import { EstadoCitaRepository } from './repositories/estado-cita.repository';
import { CitasService } from './services/citas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cita, EstadoCita]),
    PacientesModule,
    MedicosModule,
    EnfermedadesCronicasModule,
  ],
  controllers: [CitasController],
  providers: [CitaRepository, EstadoCitaRepository, CitasService],
  exports: [CitasService],
})
export class CitasModule {}
