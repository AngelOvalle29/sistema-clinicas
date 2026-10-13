import { apiRequest } from "./client";
import { PaginatedResponse } from "@/types/common";
import {
  CreateRecetaRequest,
  CreateRecetaResponse,
  QueryRecetaParams,
  Receta,
} from "@/types/recetas";

export function listarRecetas(params: QueryRecetaParams = {}) {
  return apiRequest<PaginatedResponse<Receta>>("/recetas", { query: params });
}

export function obtenerReceta(id: number) {
  return apiRequest<Receta>(`/recetas/${id}`);
}

export function emitirReceta(data: CreateRecetaRequest) {
  return apiRequest<CreateRecetaResponse>("/recetas", { method: "POST", body: data });
}

export function dispensarReceta(id: number) {
  return apiRequest<Receta>(`/recetas/${id}/dispensar`, { method: "POST" });
}

export function anularReceta(id: number) {
  return apiRequest<Receta>(`/recetas/${id}/anular`, { method: "PATCH" });
}
