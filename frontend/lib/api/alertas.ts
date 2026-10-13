import { apiRequest } from "./client";
import { PaginatedResponse } from "@/types/common";
import { Alerta, QueryAlertaParams } from "@/types/alertas";

export function listarAlertas(params: QueryAlertaParams = {}) {
  return apiRequest<PaginatedResponse<Alerta>>("/alertas", { query: params });
}

export function contarAlertasPendientes() {
  return apiRequest<{ pendientes: number }>("/alertas/pendientes/contador");
}

export function obtenerAlerta(id: number) {
  return apiRequest<Alerta>(`/alertas/${id}`);
}

export function marcarAlertaVista(id: number) {
  return apiRequest<Alerta>(`/alertas/${id}/ver`, { method: "PATCH" });
}

export function atenderAlerta(id: number) {
  return apiRequest<Alerta>(`/alertas/${id}/atender`, { method: "PATCH" });
}

export function descartarAlerta(id: number) {
  return apiRequest<Alerta>(`/alertas/${id}/descartar`, { method: "PATCH" });
}

export function ejecutarJobAlertas() {
  return apiRequest<{ ejecutado: boolean }>("/alertas/ejecutar-job", { method: "POST" });
}
