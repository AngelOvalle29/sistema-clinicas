import { apiRequest } from "./client";
import {
  Alergia,
  Antecedente,
  Consulta,
  CreateAlergiaRequest,
  CreateAntecedenteRequest,
  CreateConsultaRequest,
  HistorialCompleto,
  RegistrarSignosVitalesRequest,
  SignoVital,
  UpdateConsultaRequest,
} from "@/types/historial";

export function obtenerHistorialCompleto(pacienteId: number) {
  return apiRequest<HistorialCompleto>(`/pacientes/${pacienteId}/historial`);
}

export function crearConsulta(data: CreateConsultaRequest) {
  return apiRequest<Consulta>("/historial/consultas", { method: "POST", body: data });
}

export function obtenerConsulta(id: number) {
  return apiRequest<Consulta>(`/historial/consultas/${id}`);
}

export function actualizarConsulta(id: number, data: UpdateConsultaRequest) {
  return apiRequest<Consulta>(`/historial/consultas/${id}`, { method: "PATCH", body: data });
}

export function registrarSignosVitales(
  consultaId: number,
  data: RegistrarSignosVitalesRequest,
) {
  return apiRequest<SignoVital>(`/historial/consultas/${consultaId}/signos-vitales`, {
    method: "POST",
    body: data,
  });
}

export function obtenerSignosVitales(consultaId: number) {
  return apiRequest<SignoVital | null>(`/historial/consultas/${consultaId}/signos-vitales`);
}

export function listarAlergias(pacienteId: number) {
  return apiRequest<Alergia[]>(`/pacientes/${pacienteId}/alergias`);
}

export function crearAlergia(pacienteId: number, data: CreateAlergiaRequest) {
  return apiRequest<Alergia>(`/pacientes/${pacienteId}/alergias`, {
    method: "POST",
    body: data,
  });
}

export function listarAntecedentes(pacienteId: number) {
  return apiRequest<Antecedente[]>(`/pacientes/${pacienteId}/antecedentes`);
}

export function crearAntecedente(pacienteId: number, data: CreateAntecedenteRequest) {
  return apiRequest<Antecedente>(`/pacientes/${pacienteId}/antecedentes`, {
    method: "POST",
    body: data,
  });
}
