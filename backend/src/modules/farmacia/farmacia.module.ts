import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LotesController } from './controllers/lotes.controller';
import { ProductosController } from './controllers/productos.controller';
import { TiposProductoController } from './controllers/tipos-producto.controller';
import { Lote } from './entities/lote.entity';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { Producto } from './entities/producto.entity';
import { TipoMovimientoInventario } from './entities/tipo-movimiento-inventario.entity';
import { TipoProducto } from './entities/tipo-producto.entity';
import { LoteRepository } from './repositories/lote.repository';
import { MovimientoInventarioRepository } from './repositories/movimiento-inventario.repository';
import { ProductoRepository } from './repositories/producto.repository';
import { TipoMovimientoInventarioRepository } from './repositories/tipo-movimiento-inventario.repository';
import { TipoProductoRepository } from './repositories/tipo-producto.repository';
import { LotesService } from './services/lotes.service';
import { MovimientosInventarioService } from './services/movimientos-inventario.service';
import { ProductosService } from './services/productos.service';
import { TiposProductoService } from './services/tipos-producto.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TipoProducto,
      TipoMovimientoInventario,
      Producto,
      Lote,
      MovimientoInventario,
    ]),
  ],
  controllers: [ProductosController, LotesController, TiposProductoController],
  providers: [
    TipoProductoRepository,
    TipoMovimientoInventarioRepository,
    ProductoRepository,
    LoteRepository,
    MovimientoInventarioRepository,
    ProductosService,
    LotesService,
    MovimientosInventarioService,
    TiposProductoService,
  ],
  exports: [ProductosService, LotesService, MovimientosInventarioService],
})
export class FarmaciaModule {}
