import { apiRequest } from "./client";
import { PaginatedResponse } from "@/types/common";
import {
  CreateEspecialidadRequest,
  Especialidad,
  QueryEspecialidadParams,
  UpdateEspecialidadRequest,
} from "@/types/especialidades";

export function listarEspecialidades(params: QueryEspecialidadParams = {}) {
  return apiRequest<PaginatedResponse<Especialidad>>("/especialidades", { query: params });
}

export function listarEspecialidadesActivas() {
  return listarEspecialidades({ soloActivas: true, limit: 100 });
}

export function obtenerEspecialidad(id: number) {
  return apiRequest<Especialidad>(`/especialidades/${id}`);
}

export function crearEspecialidad(data: CreateEspecialidadRequest) {
  return apiRequest<Especialidad>("/especialidades", { method: "POST", body: data });
}

export function actualizarEspecialidad(id: number, data: UpdateEspecialidadRequest) {
  return apiRequest<Especialidad>(`/especialidades/${id}`, { method: "PATCH", body: data });
}

export function desactivarEspecialidad(id: number) {
  return apiRequest<Especialidad>(`/especialidades/${id}/desactivar`, { method: "PATCH" });
}
