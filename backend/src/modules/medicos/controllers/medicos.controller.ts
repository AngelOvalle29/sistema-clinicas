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
import { CreateMedicoDto } from '../dto/create-medico.dto';
import { QueryMedicoDto } from '../dto/query-medico.dto';
import { UpdateMedicoDto } from '../dto/update-medico.dto';
import { MedicosService } from '../services/medicos.service';

@ApiTags('medicos')
@ApiBearerAuth()
@Controller('medicos')
export class MedicosController {
  constructor(private readonly medicosService: MedicosService) {}

  @Post()
  @Roles(RolCodigo.ADMIN)
  @ApiOperation({ summary: 'Vincular un usuario con rol MEDICO como médico' })
  create(@Body() dto: CreateMedicoDto) {
    return this.medicosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar médicos' })
  findAll(@Query() query: QueryMedicoDto) {
    return this.medicosService.findAll(
      query.page ?? 1,
      query.limit ?? 20,
      query.especialidadId,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener médico por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.medicosService.findById(id);
  }

  @Patch(':id')
  @Roles(RolCodigo.ADMIN)
  @ApiOperation({ summary: 'Actualizar especialidad o número de colegiado' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateMedicoDto) {
    return this.medicosService.update(id, dto);
  }
}
