import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AjustarLoteDto } from '../dto/ajustar-lote.dto';
import { CreateLoteDto } from '../dto/create-lote.dto';
import { Lote } from '../entities/lote.entity';
import { MovimientoInventario } from '../entities/movimiento-inventario.entity';
import { TipoMovimientoInventarioCodigo } from '../enums/tipo-movimiento-inventario.enum';
import { LoteRepository } from '../repositories/lote.repository';
import { MovimientoInventarioRepository } from '../repositories/movimiento-inventario.repository';
import { TipoMovimientoInventarioRepository } from '../repositories/tipo-movimiento-inventario.repository';
import { ProductosService } from './productos.service';

@Injectable()
export class LotesService {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly loteRepository: LoteRepository,
    private readonly movimientoInventarioRepository: MovimientoInventarioRepository,
    private readonly tipoMovimientoInventarioRepository: TipoMovimientoInventarioRepository,
    private readonly productosService: ProductosService,
  ) {}

  async crear(dto: CreateLoteDto): Promise<Lote> {
    const producto = await this.productosService.findById(dto.productoId);
    const tipoEntrada = await this.obtenerTipoMovimiento(
      TipoMovimientoInventarioCodigo.ENTRADA,
    );

    return this.dataSource.transaction(async (manager) => {
      const lote = new Lote();
      lote.producto = producto;
      lote.numeroLote = dto.numeroLote;
      lote.fechaVencimiento = new Date(dto.fechaVencimiento);
      lote.cantidadActual = 0;
      const guardado = await this.loteRepository.save(lote, manager);

      const movimiento = new MovimientoInventario();
      movimiento.lote = guardado;
      movimiento.tipoMovimiento = tipoEntrada;
      movimiento.cantidad = dto.cantidadInicial;
      movimiento.fecha = new Date();
      await this.movimientoInventarioRepository.save(movimiento, manager);

      guardado.cantidadActual = dto.cantidadInicial;
      return this.loteRepository.save(guardado, manager);
    });
  }

  async ajustar(loteId: number, dto: AjustarLoteDto): Promise<Lote> {
    const lote = await this.findById(loteId);
    const nuevaCantidad = lote.cantidadActual + dto.cantidad;
    if (nuevaCantidad < 0) {
      throw new BadRequestException(
        'El ajuste dejaría la cantidad del lote en negativo',
      );
    }
    const tipoAjuste = await this.obtenerTipoMovimiento(
      TipoMovimientoInventarioCodigo.AJUSTE,
    );

    return this.dataSource.transaction(async (manager) => {
      const movimiento = new MovimientoInventario();
      movimiento.lote = lote;
      movimiento.tipoMovimiento = tipoAjuste;
      movimiento.cantidad = dto.cantidad;
      movimiento.fecha = new Date();
      await this.movimientoInventarioRepository.save(movimiento, manager);

      lote.cantidadActual = nuevaCantidad;
      return this.loteRepository.save(lote, manager);
    });
  }

  /**
   * FEFO: descuenta `cantidadRequerida` empezando por el lote que vence primero.
   * Usado por `recetas` al dispensar. Devuelve lo realmente descontado
   * (puede ser menor a lo solicitado si no hay stock suficiente).
   */
  async salidaFEFO(
    productoId: number,
    cantidadRequerida: number,
    referenciaTipo?: string,
    referenciaId?: number,
  ): Promise<number> {
    const tipoSalida = await this.obtenerTipoMovimiento(
      TipoMovimientoInventarioCodigo.SALIDA,
    );

    return this.dataSource.transaction(async (manager) => {
      const lotesVigentes =
        await this.loteRepository.findVigentesOrdenadosPorVencimiento(
          productoId,
        );

      let restante = cantidadRequerida;
      let dispensado = 0;

      for (const lote of lotesVigentes) {
        if (restante <= 0) {
          break;
        }
        const tomar = Math.min(lote.cantidadActual, restante);
        if (tomar <= 0) {
          continue;
        }

        lote.cantidadActual -= tomar;
        await this.loteRepository.save(lote, manager);

        const movimiento = new MovimientoInventario();
        movimiento.lote = lote;
        movimiento.tipoMovimiento = tipoSalida;
        movimiento.cantidad = tomar;
        movimiento.referenciaTipo = referenciaTipo ?? null;
        movimiento.referenciaId = referenciaId ?? null;
        movimiento.fecha = new Date();
        await this.movimientoInventarioRepository.save(movimiento, manager);

        restante -= tomar;
        dispensado += tomar;
      }

      return dispensado;
    });
  }

  async findById(id: number): Promise<Lote> {
    const lote = await this.loteRepository.findById(id);
    if (!lote) {
      throw new NotFoundException('Lote no encontrado');
    }
    return lote;
  }

  findByProductoId(productoId: number): Promise<Lote[]> {
    return this.loteRepository.findByProductoId(productoId);
  }

  findProximosAVencer(dias: number): Promise<Lote[]> {
    return this.loteRepository.findProximosAVencer(dias);
  }

  findVencidos(): Promise<Lote[]> {
    return this.loteRepository.findVencidos();
  }

  private async obtenerTipoMovimiento(codigo: TipoMovimientoInventarioCodigo) {
    const tipo =
      await this.tipoMovimientoInventarioRepository.findByCodigo(codigo);
    if (!tipo) {
      throw new NotFoundException(
        `El catálogo tipos_movimiento_inventario no tiene seedeado ${codigo}`,
      );
    }
    return tipo;
  }
}
