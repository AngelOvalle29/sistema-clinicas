import { apiRequest } from "./client";
import { PaginatedResponse } from "@/types/common";
import {
  CreateMedicoRequest,
  Medico,
  QueryMedicoParams,
  UpdateMedicoRequest,
} from "@/types/medicos";

export function listarMedicos(params: QueryMedicoParams = {}) {
  return apiRequest<PaginatedResponse<Medico>>("/medicos", { query: params });
}

export function obtenerMedico(id: number) {
  return apiRequest<Medico>(`/medicos/${id}`);
}

export function crearMedico(data: CreateMedicoRequest) {
  return apiRequest<Medico>("/medicos", { method: "POST", body: data });
}

export function actualizarMedico(id: number, data: UpdateMedicoRequest) {
  return apiRequest<Medico>(`/medicos/${id}`, { method: "PATCH", body: data });
}
