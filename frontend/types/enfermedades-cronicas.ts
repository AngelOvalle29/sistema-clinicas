import { Paciente } from "./pacientes";

export interface EnfermedadCronica {
  id: number;
  codigoCie10: string | null;
  nombre: string;
  frecuenciaControlDias: number;
  activo: boolean;
}

export interface PacienteEnfermedadCronica {
  id: number;
  paciente: Paciente;
  enfermedadCronica: EnfermedadCronica;
  frecuenciaControlDiasOverride: number | null;
  activo: boolean;
}

export interface CreateEnfermedadCronicaRequest {
  codigoCie10?: string;
  nombre: string;
  frecuenciaControlDias: number;
}

export type UpdateEnfermedadCronicaRequest = Partial<CreateEnfermedadCronicaRequest>;

export interface QueryEnfermedadCronicaParams {
  page?: number;
  limit?: number;
  soloActivas?: boolean;
}

export interface AsignarEnfermedadCronicaRequest {
  enfermedadCronicaId: number;
  frecuenciaControlDiasOverride?: number;
}
