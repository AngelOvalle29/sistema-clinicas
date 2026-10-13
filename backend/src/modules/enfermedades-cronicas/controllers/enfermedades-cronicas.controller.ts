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
import { CreateEnfermedadCronicaDto } from '../dto/create-enfermedad-cronica.dto';
import { QueryEnfermedadCronicaDto } from '../dto/query-enfermedad-cronica.dto';
import { UpdateEnfermedadCronicaDto } from '../dto/update-enfermedad-cronica.dto';
import { EnfermedadesCronicasService } from '../services/enfermedades-cronicas.service';

@ApiTags('enfermedades-cronicas')
@ApiBearerAuth()
@Controller('enfermedades-cronicas')
export class EnfermedadesCronicasController {
  constructor(
    private readonly enfermedadesCronicasService: EnfermedadesCronicasService,
  ) {}

  @Post()
  @Roles(RolCodigo.ADMIN)
  @ApiOperation({ summary: 'Crear enfermedad crónica (catálogo)' })
  create(@Body() dto: CreateEnfermedadCronicaDto) {
    return this.enfermedadesCronicasService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar enfermedades crónicas' })
  findAll(@Query() query: QueryEnfermedadCronicaDto) {
    return this.enfermedadesCronicasService.findAll(
      query.page ?? 1,
      query.limit ?? 20,
      query.soloActivas ?? false,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener enfermedad crónica por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enfermedadesCronicasService.findById(id);
  }

  @Patch(':id')
  @Roles(RolCodigo.ADMIN)
  @ApiOperation({ summary: 'Actualizar enfermedad crónica' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEnfermedadCronicaDto,
  ) {
    return this.enfermedadesCronicasService.update(id, dto);
  }

  @Patch(':id/desactivar')
  @Roles(RolCodigo.ADMIN)
  @ApiOperation({
    summary: 'Desactivar enfermedad crónica (no se borra físicamente)',
  })
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.enfermedadesCronicasService.desactivar(id);
  }
}
