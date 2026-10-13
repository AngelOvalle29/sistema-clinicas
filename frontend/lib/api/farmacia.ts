import { apiRequest } from "./client";
import { PaginatedResponse } from "@/types/common";
import {
  AjustarLoteRequest,
  CreateLoteRequest,
  CreateProductoRequest,
  Lote,
  MovimientoInventario,
  Producto,
  ProductoConStock,
  QueryProductoParams,
  TipoProducto,
  UpdateProductoRequest,
} from "@/types/farmacia";

export function listarTiposProducto() {
  return apiRequest<TipoProducto[]>("/farmacia/tipos-producto");
}

export function listarProductos(params: QueryProductoParams = {}) {
  return apiRequest<PaginatedResponse<Producto>>("/farmacia/productos", { query: params });
}

export function listarProductosConStockBajo() {
  return apiRequest<ProductoConStock[]>("/farmacia/productos/stock-bajo");
}

export function obtenerProducto(id: number) {
  return apiRequest<Producto>(`/farmacia/productos/${id}`);
}

export function obtenerStockProducto(id: number) {
  return apiRequest<{ stock: number }>(`/farmacia/productos/${id}/stock`);
}

export function crearProducto(data: CreateProductoRequest) {
  return apiRequest<Producto>("/farmacia/productos", { method: "POST", body: data });
}

export function actualizarProducto(id: number, data: UpdateProductoRequest) {
  return apiRequest<Producto>(`/farmacia/productos/${id}`, { method: "PATCH", body: data });
}

export function desactivarProducto(id: number) {
  return apiRequest<Producto>(`/farmacia/productos/${id}/desactivar`, { method: "PATCH" });
}

export function crearLote(data: CreateLoteRequest) {
  return apiRequest<Lote>("/farmacia/lotes", { method: "POST", body: data });
}

export function listarLotesProximosAVencer(dias = 30) {
  return apiRequest<Lote[]>("/farmacia/lotes/proximos-a-vencer", { query: { dias } });
}

export function listarLotesVencidos() {
  return apiRequest<Lote[]>("/farmacia/lotes/vencidos");
}

export function listarLotesDeProducto(productoId: number) {
  return apiRequest<Lote[]>(`/farmacia/lotes/producto/${productoId}`);
}

export function obtenerLote(id: number) {
  return apiRequest<Lote>(`/farmacia/lotes/${id}`);
}

export function listarMovimientosDeLote(id: number) {
  return apiRequest<MovimientoInventario[]>(`/farmacia/lotes/${id}/movimientos`);
}

export function ajustarLote(id: number, data: AjustarLoteRequest) {
  return apiRequest<Lote>(`/farmacia/lotes/${id}/ajuste`, { method: "PATCH", body: data });
}
