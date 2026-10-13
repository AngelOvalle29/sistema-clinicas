import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolCodigo } from '../../../common/enums/rol-codigo.enum';
import { CreatePacienteDto } from '../dto/create-paciente.dto';
import { QueryPacienteDto } from '../dto/query-paciente.dto';
import { UpdatePacienteDto } from '../dto/update-paciente.dto';
import { PacientesService } from '../services/pacientes.service';

@ApiTags('pacientes')
@ApiBearerAuth()
@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @Post()
  @Roles(RolCodigo.ADMIN, RolCodigo.RECEPCION)
  @ApiOperation({ summary: 'Registrar paciente' })
  create(@Body() dto: CreatePacienteDto) {
    return this.pacientesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pacientes' })
  findAll(@Query() query: QueryPacienteDto) {
    return this.pacientesService.findAll(query.page ?? 1, query.limit ?? 20, {
      nombre: query.nombre,
      dpi: query.dpi,
      estadoCodigo: query.estadoCodigo,
      soloPrioritarios: query.soloPrioritarios,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener paciente por id (incluye estado y prioridad)',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pacientesService.findById(id);
  }

  @Patch(':id')
  @Roles(RolCodigo.ADMIN, RolCodigo.RECEPCION)
  @ApiOperation({ summary: 'Actualizar datos de un paciente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePacienteDto,
  ) {
    return this.pacientesService.update(id, dto);
  }
}
