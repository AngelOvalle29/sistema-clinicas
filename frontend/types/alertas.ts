import { Paciente } from "./pacientes";

export type TipoAlertaCodigo =
  | "CONTROL_VENCIDO"
  | "SIN_CITA_PROGRAMADA"
  | "VALOR_FUERA_RANGO"
  | "MEDICACION_POR_TERMINAR";

export type SeveridadAlertaCodigo = "BAJA" | "MEDIA" | "ALTA" | "CRITICA";
export type EstadoAlertaCodigo = "PENDIENTE" | "VISTA" | "ATENDIDA" | "DESCARTADA";

export interface TipoAlerta {
  id: number;
  codigo: TipoAlertaCodigo;
  nombre: string;
}

export interface SeveridadAlerta {
  id: number;
  codigo: SeveridadAlertaCodigo;
  nombre: string;
  nivel: number;
}

export interface EstadoAlerta {
  id: number;
  codigo: EstadoAlertaCodigo;
  nombre: string;
}

export interface Alerta {
  id: number;
  paciente: Paciente;
  tipoAlerta: TipoAlerta;
  severidad: SeveridadAlerta;
  estado: EstadoAlerta;
  mensaje: string;
  fechaGenerada: string;
  fechaAtendida: string | null;
}

export interface QueryAlertaParams {
  page?: number;
  limit?: number;
  pacienteId?: number;
  severidadCodigo?: string;
  estadoCodigo?: string;
}
