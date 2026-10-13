import { apiRequest } from "./client";
import { PaginatedResponse } from "@/types/common";
import {
  AsignarPrioridadRequest,
  CategoriaPrioridad,
  CreatePacienteRequest,
  Defuncion,
  Paciente,
  PacientePrioridad,
  QueryDefuncionParams,
  QueryPacienteParams,
  RegistrarDefuncionRequest,
  UpdatePacienteRequest,
} from "@/types/pacientes";

export function listarCategoriasPrioridad() {
  return apiRequest<CategoriaPrioridad[]>("/categorias-prioridad");
}

export function listarPacientes(params: QueryPacienteParams = {}) {
  return apiRequest<PaginatedResponse<Paciente>>("/pacientes", { query: params });
}

export function obtenerPaciente(id: number) {
  return apiRequest<Paciente>(`/pacientes/${id}`);
}

export function crearPaciente(data: CreatePacienteRequest) {
  return apiRequest<Paciente>("/pacientes", { method: "POST", body: data });
}

export function actualizarPaciente(id: number, data: UpdatePacienteRequest) {
  return apiRequest<Paciente>(`/pacientes/${id}`, { method: "PATCH", body: data });
}

export function listarPrioridadesActivas(pacienteId: number) {
  return apiRequest<PacientePrioridad[]>(`/pacientes/${pacienteId}/prioridades`);
}

export function asignarPrioridad(pacienteId: number, data: AsignarPrioridadRequest) {
  return apiRequest<PacientePrioridad>(`/pacientes/${pacienteId}/prioridades`, {
    method: "POST",
    body: data,
  });
}

export function retirarPrioridad(prioridadId: number) {
  return apiRequest<PacientePrioridad>(`/pacientes/prioridades/${prioridadId}/retirar`, {
    method: "PATCH",
  });
}

export function registrarDefuncion(pacienteId: number, data: RegistrarDefuncionRequest) {
  return apiRequest<Defuncion>(`/pacientes/${pacienteId}/defuncion`, {
    method: "POST",
    body: data,
  });
}

export function listarFallecidos(params: QueryDefuncionParams = {}) {
  return apiRequest<PaginatedResponse<Defuncion>>("/pacientes/fallecidos", { query: params });
}
