import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolCodigo } from '../../../common/enums/rol-codigo.enum';
import { CreateAlergiaDto } from '../dto/create-alergia.dto';
import { AlergiasService } from '../services/alergias.service';

@ApiTags('pacientes')
@ApiBearerAuth()
@Controller('pacientes')
export class AlergiasController {
  constructor(private readonly alergiasService: AlergiasService) {}

  @Post(':id/alergias')
  @Roles(RolCodigo.ADMIN, RolCodigo.MEDICO)
  @ApiOperation({ summary: 'Registrar una alergia del paciente' })
  create(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateAlergiaDto) {
    return this.alergiasService.create(id, dto);
  }

  @Get(':id/alergias')
  @ApiOperation({ summary: 'Listar alergias del paciente' })
  findAll(@Param('id', ParseIntPipe) id: number) {
    return this.alergiasService.findByPacienteId(id);
  }
}
