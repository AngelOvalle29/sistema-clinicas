import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import { AuditModule } from './common/audit/audit.module';
import { CommonModule } from './common/common.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { EspecialidadesModule } from './modules/especialidades/especialidades.module';
import { MedicosModule } from './modules/medicos/medicos.module';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { EnfermedadesCronicasModule } from './modules/enfermedades-cronicas/enfermedades-cronicas.module';
import { CitasModule } from './modules/citas/citas.module';
import { HistorialModule } from './modules/historial/historial.module';
import { FarmaciaModule } from './modules/farmacia/farmacia.module';
import { RecetasModule } from './modules/recetas/recetas.module';
import { AlertasModule } from './modules/alertas/alertas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    CommonModule,
    AuditModule,
    UsuariosModule,
    AuthModule,
    EspecialidadesModule,
    MedicosModule,
    PacientesModule,
    EnfermedadesCronicasModule,
    CitasModule,
    HistorialModule,
    FarmaciaModule,
    RecetasModule,
    AlertasModule,
  ],
})
export class AppModule {}
