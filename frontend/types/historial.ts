import { Cita } from "./citas";
import { PacienteEnfermedadCronica } from "./enfermedades-cronicas";
import { Medico } from "./medicos";
import { Paciente } from "./pacientes";

export interface Consulta {
  id: number;
  cita: Cita | null;
  paciente: Paciente;
  medico: Medico;
  fecha: string;
  motivo: string | null;
  diagnostico: string | null;
  notas: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SignoVital {
  id: number;
  presionSistolica: number | null;
  presionDiastolica: number | null;
  glucosa: number | null;
  saturacionO2: number | null;
  temperatura: number | null;
  peso: number | null;
  talla: number | null;
}

export interface Alergia {
  id: number;
  paciente: Paciente;
  descripcion: string;
  severidad: string | null;
}

export interface Antecedente {
  id: number;
  paciente: Paciente;
  tipo: string;
  descripcion: string;
}

export interface HistorialCompleto {
  paciente: Paciente;
  consultas: Consulta[];
  alergias: Alergia[];
  antecedentes: Antecedente[];
  enfermedadesCronicas: PacienteEnfermedadCronica[];
}

export interface CreateConsultaRequest {
  pacienteId: number;
  citaId?: number;
  fecha?: string;
  motivo?: string;
  diagnostico?: string;
  notas?: string;
}

export interface UpdateConsultaRequest {
  motivo?: string;
  diagnostico?: string;
  notas?: string;
}

export interface RegistrarSignosVitalesRequest {
  presionSistolica?: number;
  presionDiastolica?: number;
  glucosa?: number;
  saturacionO2?: number;
  temperatura?: number;
  peso?: number;
  talla?: number;
}

export interface CreateAlergiaRequest {
  descripcion: string;
  severidad?: string;
}

export interface CreateAntecedenteRequest {
  tipo: string;
  descripcion: string;
}
