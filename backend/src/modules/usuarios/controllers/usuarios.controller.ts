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
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolCodigo } from '../../../common/enums/rol-codigo.enum';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { UsuariosService } from '../services/usuarios.service';

@ApiTags('usuarios')
@ApiBearerAuth()
@Roles(RolCodigo.ADMIN)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear usuario' })
  create(@Body() dto: CreateUsuarioDto) {
    return this.usuariosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuarios' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.usuariosService.findAll(query.page ?? 1, query.limit ?? 20);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUsuarioDto) {
    return this.usuariosService.update(id, dto);
  }

  @Patch(':id/desactivar')
  @ApiOperation({ summary: 'Desactivar usuario (no se borra físicamente)' })
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.desactivar(id);
  }
}
