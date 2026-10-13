export type TipoProductoCodigo = "MEDICAMENTO" | "MUESTRA_MEDICA" | "INSUMO";
export type TipoMovimientoInventarioCodigo =
  | "ENTRADA"
  | "SALIDA"
  | "AJUSTE"
  | "VENCIMIENTO";

export interface TipoProducto {
  id: number;
  codigo: TipoProductoCodigo;
  nombre: string;
}

export interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  principioActivo: string | null;
  tipoProducto: TipoProducto;
  costoUnitario: number;
  stockMinimo: number;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Lote {
  id: number;
  producto: Producto;
  numeroLote: string;
  fechaVencimiento: string;
  cantidadActual: number;
  createdAt: string;
  updatedAt: string;
}

export interface TipoMovimientoInventario {
  id: number;
  codigo: TipoMovimientoInventarioCodigo;
  nombre: string;
}

export interface MovimientoInventario {
  id: number;
  tipoMovimiento: TipoMovimientoInventario;
  cantidad: number;
  referenciaTipo: string | null;
  referenciaId: number | null;
  fecha: string;
}

export interface ProductoConStock {
  producto: Producto;
  stock: number;
}

export interface CreateProductoRequest {
  codigo: string;
  nombre: string;
  principioActivo?: string;
  tipoProductoId: number;
  costoUnitario?: number;
  stockMinimo?: number;
}

export type UpdateProductoRequest = Partial<CreateProductoRequest>;

export interface QueryProductoParams {
  page?: number;
  limit?: number;
  busqueda?: string;
  tipoProductoId?: number;
  soloActivos?: boolean;
}

export interface CreateLoteRequest {
  productoId: number;
  numeroLote: string;
  fechaVencimiento: string;
  cantidadInicial: number;
}

export interface AjustarLoteRequest {
  cantidad: number;
}
