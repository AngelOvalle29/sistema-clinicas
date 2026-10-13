import { Medico } from "./medicos";

export type EstadoPacienteCodigo = "ACTIVO" | "INACTIVO" | "FALLECIDO";

export interface EstadoPaciente {
  id: number;
  codigo: EstadoPacienteCodigo;
  nombre: string;
}

export interface CategoriaPrioridad {
  id: number;
  codigo: string;
  nombre: string;
  nivel: number;
  activo: boolean;
}

export interface Paciente {
  id: number;
  codigo: string;
  nombres: string;
  apellidos: string;
  dpi: string | null;
  fechaNacimiento: string | null;
  genero: string | null;
  telefono: string | null;
  direccion: string | null;
  estado: EstadoPaciente;
  esPrioritario: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PacientePrioridad {
  id: number;
  paciente: Paciente;
  categoriaPrioridad: CategoriaPrioridad;
  activo: boolean;
  fechaAsignacion: string;
  fechaRetiro: string | null;
}

export interface Defuncion {
  id: number;
  paciente: Paciente;
  fecha: string;
  causa: string;
  numeroCertificado: string | null;
  medicoCertifica: Medico;
  createdAt: string;
}

export interface CreatePacienteRequest {
  nombres: string;
  apellidos: string;
  dpi?: string;
  fechaNacimiento?: string;
  genero?: string;
  telefono?: string;
  direccion?: string;
}

export type UpdatePacienteRequest = Partial<CreatePacienteRequest>;

export interface QueryPacienteParams {
  page?: number;
  limit?: number;
  nombre?: string;
  dpi?: string;
  estadoCodigo?: string;
  soloPrioritarios?: boolean;
}

export interface AsignarPrioridadRequest {
  categoriaPrioridadId: number;
}

export interface RegistrarDefuncionRequest {
  fecha: string;
  causa: string;
  numeroCertificado?: string;
  medicoCertificaId: number;
}

export interface QueryDefuncionParams {
  page?: number;
  limit?: number;
  fechaInicio?: string;
  fechaFin?: string;
}
