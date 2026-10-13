import { Medico } from "./medicos";
import { Paciente } from "./pacientes";
import { Producto } from "./farmacia";

export type EstadoRecetaCodigo =
  | "EMITIDA"
  | "DISPENSADA_PARCIAL"
  | "DISPENSADA"
  | "ANULADA";

export interface EstadoReceta {
  id: number;
  codigo: EstadoRecetaCodigo;
  nombre: string;
  esFinal: boolean;
}

export interface RecetaDetalle {
  id: number;
  producto: Producto;
  cantidadPrescrita: number;
  cantidadDispensada: number;
  indicaciones: string | null;
}

export interface Receta {
  id: number;
  codigo: string;
  paciente: Paciente;
  medico: Medico;
  estado: EstadoReceta;
  fechaEmision: string;
  vigenteHasta: string;
  detalles: RecetaDetalle[];
  createdAt: string;
  updatedAt: string;
}

export interface DetalleRecetaRequest {
  productoId: number;
  cantidadPrescrita: number;
  indicaciones?: string;
}

export interface CreateRecetaRequest {
  pacienteId: number;
  vigenteHasta: string;
  detalles: DetalleRecetaRequest[];
}

export interface CreateRecetaResponse {
  receta: Receta;
  advertencias: string[];
}

export interface QueryRecetaParams {
  page?: number;
  limit?: number;
  pacienteId?: number;
  medicoId?: number;
  estadoCodigo?: string;
}
