import { apiRequest } from "./client";
import { PaginatedResponse } from "@/types/common";
import {
  CancelarCitaRequest,
  Cita,
  CreateCitaRequest,
  QueryCitaParams,
} from "@/types/citas";

export function listarCitas(params: QueryCitaParams = {}) {
  return apiRequest<PaginatedResponse<Cita>>("/citas", { query: params });
}

export function obtenerCita(id: number) {
  return apiRequest<Cita>(`/citas/${id}`);
}

export function crearCita(data: CreateCitaRequest) {
  return apiRequest<Cita>("/citas", { method: "POST", body: data });
}

export function confirmarCita(id: number) {
  return apiRequest<Cita>(`/citas/${id}/confirmar`, { method: "PATCH" });
}

export function iniciarCita(id: number) {
  return apiRequest<Cita>(`/citas/${id}/iniciar`, { method: "PATCH" });
}

export function completarCita(id: number) {
  return apiRequest<Cita>(`/citas/${id}/completar`, { method: "PATCH" });
}

export function cancelarCita(id: number, data: CancelarCitaRequest) {
  return apiRequest<Cita>(`/citas/${id}/cancelar`, { method: "PATCH", body: data });
}

export function marcarNoAsistioCita(id: number) {
  return apiRequest<Cita>(`/citas/${id}/no-asistio`, { method: "PATCH" });
}
