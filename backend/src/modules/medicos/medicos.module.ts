import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EspecialidadesModule } from '../especialidades/especialidades.module';
import { UsuariosModule } from '../usuarios/usuarios.module';
import { MedicosController } from './controllers/medicos.controller';
import { Medico } from './entities/medico.entity';
import { MedicoRepository } from './repositories/medico.repository';
import { MedicosService } from './services/medicos.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Medico]),
    UsuariosModule,
    EspecialidadesModule,
  ],
  controllers: [MedicosController],
  providers: [MedicoRepository, MedicosService],
  exports: [MedicosService],
})
export class MedicosModule {}
