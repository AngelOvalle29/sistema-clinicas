import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { UpdateProductoDto } from '../dto/update-producto.dto';
import { Producto } from '../entities/producto.entity';
import { TipoProductoCodigo } from '../enums/tipo-producto.enum';
import {
  FiltrosProducto,
  ProductoRepository,
} from '../repositories/producto.repository';
import { TipoProductoRepository } from '../repositories/tipo-producto.repository';
import { LoteRepository } from '../repositories/lote.repository';

@Injectable()
export class ProductosService {
  constructor(
    private readonly productoRepository: ProductoRepository,
    private readonly tipoProductoRepository: TipoProductoRepository,
    private readonly loteRepository: LoteRepository,
  ) {}

  async create(dto: CreateProductoDto): Promise<Producto> {
    const existente = await this.productoRepository.findByCodigo(dto.codigo);
    if (existente) {
      throw new ConflictException('Ya existe un producto con ese código');
    }

    const tipoProducto = await this.tipoProductoRepository.findById(
      dto.tipoProductoId,
    );
    if (!tipoProducto) {
      throw new NotFoundException('Tipo de producto no encontrado');
    }

    const esMuestra =
      (tipoProducto.codigo as TipoProductoCodigo) ===
      TipoProductoCodigo.MUESTRA_MEDICA;

    const producto = new Producto();
    producto.codigo = dto.codigo;
    producto.nombre = dto.nombre;
    producto.principioActivo = dto.principioActivo ?? null;
    producto.tipoProducto = tipoProducto;
    producto.costoUnitario = esMuestra ? 0 : (dto.costoUnitario ?? 0);
    producto.stockMinimo = dto.stockMinimo ?? 0;
    producto.activo = true;

    return this.productoRepository.save(producto);
  }

  async findAll(page: number, limit: number, filtros: FiltrosProducto) {
    const [data, total] = await this.productoRepository.findAndCount(
      (page - 1) * limit,
      limit,
      filtros,
    );
    return { data, total, page, limit };
  }

  async findById(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findById(id);
    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }
    return producto;
  }

  async update(id: number, dto: UpdateProductoDto): Promise<Producto> {
    const producto = await this.findById(id);

    if (dto.codigo && dto.codigo !== producto.codigo) {
      const existente = await this.productoRepository.findByCodigo(dto.codigo);
      if (existente) {
        throw new ConflictException('Ya existe un producto con ese código');
      }
      producto.codigo = dto.codigo;
    }
    if (dto.nombre) {
      producto.nombre = dto.nombre;
    }
    if (dto.principioActivo) {
      producto.principioActivo = dto.principioActivo;
    }
    if (dto.tipoProductoId) {
      const tipoProducto = await this.tipoProductoRepository.findById(
        dto.tipoProductoId,
      );
      if (!tipoProducto) {
        throw new NotFoundException('Tipo de producto no encontrado');
      }
      producto.tipoProducto = tipoProducto;
    }
    const esMuestra =
      (producto.tipoProducto.codigo as TipoProductoCodigo) ===
      TipoProductoCodigo.MUESTRA_MEDICA;
    if (dto.costoUnitario !== undefined) {
      producto.costoUnitario = esMuestra ? 0 : dto.costoUnitario;
    }
    if (dto.stockMinimo !== undefined) {
      producto.stockMinimo = dto.stockMinimo;
    }

    return this.productoRepository.save(producto);
  }

  async desactivar(id: number): Promise<Producto> {
    const producto = await this.findById(id);
    producto.activo = false;
    return this.productoRepository.save(producto);
  }

  obtenerStock(productoId: number): Promise<number> {
    return this.loteRepository.sumarStockVigente(productoId);
  }

  async findConStockBajo(): Promise<
    Array<{ producto: Producto; stock: number }>
  > {
    const activos = await this.productoRepository.findActivos();
    const conStock = await Promise.all(
      activos.map(async (producto) => ({
        producto,
        stock: await this.loteRepository.sumarStockVigente(producto.id),
      })),
    );
    return conStock.filter((item) => item.stock < item.producto.stockMinimo);
  }
}
