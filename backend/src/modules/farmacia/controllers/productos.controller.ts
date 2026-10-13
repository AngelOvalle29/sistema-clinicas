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
import { CreateProductoDto } from '../dto/create-producto.dto';
import { QueryProductoDto } from '../dto/query-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';
import { ProductosService } from '../services/productos.service';

@ApiTags('farmacia')
@ApiBearerAuth()
@Controller('farmacia/productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @Roles(RolCodigo.ADMIN, RolCodigo.FARMACIA)
  @ApiOperation({ summary: 'Crear producto o muestra médica' })
  create(@Body() dto: CreateProductoDto) {
    return this.productosService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Buscar productos por nombre, principio activo o código',
  })
  findAll(@Query() query: QueryProductoDto) {
    return this.productosService.findAll(query.page ?? 1, query.limit ?? 20, {
      busqueda: query.busqueda,
      tipoProductoId: query.tipoProductoId,
      soloActivos: query.soloActivos,
    });
  }

  @Get('stock-bajo')
  @ApiOperation({ summary: 'Productos con stock por debajo del mínimo' })
  findConStockBajo() {
    return this.productosService.findConStockBajo();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.findById(id);
  }

  @Get(':id/stock')
  @ApiOperation({ summary: 'Stock actual (suma de lotes no vencidos)' })
  async obtenerStock(@Param('id', ParseIntPipe) id: number) {
    return { stock: await this.productosService.obtenerStock(id) };
  }

  @Patch(':id')
  @Roles(RolCodigo.ADMIN, RolCodigo.FARMACIA)
  @ApiOperation({ summary: 'Actualizar producto' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductoDto,
  ) {
    return this.productosService.update(id, dto);
  }

  @Patch(':id/desactivar')
  @Roles(RolCodigo.ADMIN)
  @ApiOperation({ summary: 'Desactivar producto (no se borra físicamente)' })
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.desactivar(id);
  }
}
