import { color } from "@/lib/type";

const MAPA_COLOR: Record<string, color> = {
  // pacientes
  ACTIVO: "success",
  INACTIVO: "warning",
  FALLECIDO: "destructive",
  // citas / recetas
  PROGRAMADA: "info",
  CONFIRMADA: "primary",
  EN_CURSO: "warning",
  COMPLETADA: "success",
  CANCELADA: "destructive",
  NO_ASISTIO: "secondary",
  EMITIDA: "info",
  DISPENSADA_PARCIAL: "warning",
  DISPENSADA: "success",
  ANULADA: "destructive",
  // alertas
  BAJA: "secondary",
  MEDIA: "info",
  ALTA: "warning",
  CRITICA: "destructive",
  PENDIENTE: "warning",
  VISTA: "info",
  ATENDIDA: "success",
  DESCARTADA: "secondary",
  // movimientos de inventario
  ENTRADA: "success",
  SALIDA: "info",
  AJUSTE: "warning",
  VENCIMIENTO: "destructive",
};

export function colorPorCodigo(codigo: string): color {
  return MAPA_COLOR[codigo] ?? "default";
}
