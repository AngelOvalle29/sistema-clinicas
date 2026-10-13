import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolCodigo } from '../../../common/enums/rol-codigo.enum';
import { AsignarEnfermedadCronicaDto } from '../dto/asignar-enfermedad-cronica.dto';
import { PacienteEnfermedadesCronicasService } from '../services/paciente-enfermedades-cronicas.service';

@ApiTags('pacientes')
@ApiBearerAuth()
@Controller('pacientes')
export class PacienteEnfermedadesCronicasController {
  constructor(
    private readonly pacienteEnfermedadesCronicasService: PacienteEnfermedadesCronicasService,
  ) {}

  @Post(':id/enfermedades-cronicas')
  @Roles(RolCodigo.ADMIN, RolCodigo.MEDICO)
  @ApiOperation({ summary: 'Asignar una enfermedad crónica a un paciente' })
  asignar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AsignarEnfermedadCronicaDto,
  ) {
    return this.pacienteEnfermedadesCronicasService.asignar(id, dto);
  }

  @Get(':id/enfermedades-cronicas')
  @ApiOperation({
    summary: 'Listar enfermedades crónicas activas de un paciente',
  })
  findActivas(@Param('id', ParseIntPipe) id: number) {
    return this.pacienteEnfermedadesCronicasService.findActivasByPaciente(id);
  }

  @Patch('enfermedades-cronicas/:asignacionId/retirar')
  @Roles(RolCodigo.ADMIN, RolCodigo.MEDICO)
  @ApiOperation({ summary: 'Retirar una enfermedad crónica asignada' })
  retirar(@Param('asignacionId', ParseIntPipe) asignacionId: number) {
    return this.pacienteEnfermedadesCronicasService.retirar(asignacionId);
  }
}
