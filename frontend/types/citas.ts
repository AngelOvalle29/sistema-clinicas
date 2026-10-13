import { Medico } from "./medicos";
import { Paciente } from "./pacientes";

export type EstadoCitaCodigo =
  | "PROGRAMADA"
  | "CONFIRMADA"
  | "EN_CURSO"
  | "COMPLETADA"
  | "CANCELADA"
  | "NO_ASISTIO";

export interface EstadoCita {
  id: number;
  codigo: EstadoCitaCodigo;
  nombre: string;
  esFinal: boolean;
}

export interface Cita {
  id: number;
  paciente: Paciente;
  medico: Medico;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: EstadoCita;
  nivelPrioridad: number | null;
  esControlCronico: boolean;
  motivoCancelacion: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCitaRequest {
  pacienteId: number;
  medicoId: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  esControlCronico?: boolean;
}

export interface QueryCitaParams {
  page?: number;
  limit?: number;
  pacienteId?: number;
  medicoId?: number;
  fecha?: string;
  estadoCodigo?: string;
}

export interface CancelarCitaRequest {
  motivo: string;
}
