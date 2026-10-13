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
import { CreateAntecedenteDto } from '../dto/create-antecedente.dto';
import { AntecedentesService } from '../services/antecedentes.service';

@ApiTags('pacientes')
@ApiBearerAuth()
@Controller('pacientes')
export class AntecedentesController {
  constructor(private readonly antecedentesService: AntecedentesService) {}

  @Post(':id/antecedentes')
  @Roles(RolCodigo.ADMIN, RolCodigo.MEDICO)
  @ApiOperation({ summary: 'Registrar un antecedente del paciente' })
  create(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateAntecedenteDto,
  ) {
    return this.antecedentesService.create(id, dto);
  }

  @Get(':id/antecedentes')
  @ApiOperation({ summary: 'Listar antecedentes del paciente' })
  findAll(@Param('id', ParseIntPipe) id: number) {
    return this.antecedentesService.findByPacienteId(id);
  }
}
