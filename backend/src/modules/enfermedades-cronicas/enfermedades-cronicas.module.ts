import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacientesModule } from '../pacientes/pacientes.module';
import { EnfermedadesCronicasController } from './controllers/enfermedades-cronicas.controller';
import { PacienteEnfermedadesCronicasController } from './controllers/paciente-enfermedades-cronicas.controller';
import { EnfermedadCronica } from './entities/enfermedad-cronica.entity';
import { PacienteEnfermedadCronica } from './entities/paciente-enfermedad-cronica.entity';
import { EnfermedadCronicaRepository } from './repositories/enfermedad-cronica.repository';
import { PacienteEnfermedadCronicaRepository } from './repositories/paciente-enfermedad-cronica.repository';
import { EnfermedadesCronicasService } from './services/enfermedades-cronicas.service';
import { PacienteEnfermedadesCronicasService } from './services/paciente-enfermedades-cronicas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EnfermedadCronica, PacienteEnfermedadCronica]),
    PacientesModule,
  ],
  controllers: [
    EnfermedadesCronicasController,
    PacienteEnfermedadesCronicasController,
  ],
  providers: [
    EnfermedadCronicaRepository,
    PacienteEnfermedadCronicaRepository,
    EnfermedadesCronicasService,
    PacienteEnfermedadesCronicasService,
  ],
  exports: [EnfermedadesCronicasService, PacienteEnfermedadesCronicasService],
})
export class EnfermedadesCronicasModule {}
