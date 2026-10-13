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
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolCodigo } from '../../../common/enums/rol-codigo.enum';
import type { AuthenticatedUser } from '../../../common/interfaces/authenticated-user.interface';
import { CreateConsultaDto } from '../dto/create-consulta.dto';
import { UpdateConsultaDto } from '../dto/update-consulta.dto';
import { ConsultasService } from '../services/consultas.service';

@ApiTags('historial')
@ApiBearerAuth()
@Controller('historial/consultas')
export class ConsultasController {
  constructor(private readonly consultasService: ConsultasService) {}

  @Post()
  @Roles(RolCodigo.MEDICO)
  @ApiOperation({ summary: 'Registrar una consulta (solo MEDICO)' })
  create(
    @Body() dto: CreateConsultaDto,
    @CurrentUser() usuario: AuthenticatedUser,
  ) {
    return this.consultasService.create(dto, usuario.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener consulta por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.consultasService.findById(id);
  }

  @Patch(':id')
  @Roles(RolCodigo.MEDICO)
  @ApiOperation({ summary: 'Editar una consulta (solo el médico autor)' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateConsultaDto,
    @CurrentUser() usuario: AuthenticatedUser,
  ) {
    return this.consultasService.update(id, dto, usuario.id);
  }
}
