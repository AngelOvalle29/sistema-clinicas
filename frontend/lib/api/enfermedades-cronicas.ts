import { apiRequest } from "./client";
import { PaginatedResponse } from "@/types/common";
import {
  AsignarEnfermedadCronicaRequest,
  CreateEnfermedadCronicaRequest,
  EnfermedadCronica,
  PacienteEnfermedadCronica,
  QueryEnfermedadCronicaParams,
  UpdateEnfermedadCronicaRequest,
} from "@/types/enfermedades-cronicas";

export function listarEnfermedadesCronicas(params: QueryEnfermedadCronicaParams = {}) {
  return apiRequest<PaginatedResponse<EnfermedadCronica>>("/enfermedades-cronicas", {
    query: params,
  });
}

export function obtenerEnfermedadCronica(id: number) {
  return apiRequest<EnfermedadCronica>(`/enfermedades-cronicas/${id}`);
}

export function crearEnfermedadCronica(data: CreateEnfermedadCronicaRequest) {
  return apiRequest<EnfermedadCronica>("/enfermedades-cronicas", { method: "POST", body: data });
}

export function actualizarEnfermedadCronica(id: number, data: UpdateEnfermedadCronicaRequest) {
  return apiRequest<EnfermedadCronica>(`/enfermedades-cronicas/${id}`, {
    method: "PATCH",
    body: data,
  });
}

export function desactivarEnfermedadCronica(id: number) {
  return apiRequest<EnfermedadCronica>(`/enfermedades-cronicas/${id}/desactivar`, {
    method: "PATCH",
  });
}

export function listarEnfermedadesCronicasDePaciente(pacienteId: number) {
  return apiRequest<PacienteEnfermedadCronica[]>(`/pacientes/${pacienteId}/enfermedades-cronicas`);
}

export function asignarEnfermedadCronica(
  pacienteId: number,
  data: AsignarEnfermedadCronicaRequest,
) {
  return apiRequest<PacienteEnfermedadCronica>(
    `/pacientes/${pacienteId}/enfermedades-cronicas`,
    { method: "POST", body: data },
  );
}

export function retirarEnfermedadCronica(asignacionId: number) {
  return apiRequest<PacienteEnfermedadCronica>(
    `/pacientes/enfermedades-cronicas/${asignacionId}/retirar`,
    { method: "PATCH" },
  );
}
