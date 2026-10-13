import { Especialidad } from "./especialidades";
import { Usuario } from "./usuarios";

export interface Medico {
  id: number;
  usuario: Usuario;
  especialidad: Especialidad;
  numeroColegiado: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicoRequest {
  usuarioId: number;
  especialidadId: number;
  numeroColegiado: string;
}

export interface UpdateMedicoRequest {
  especialidadId?: number;
  numeroColegiado?: string;
}

export interface QueryMedicoParams {
  page?: number;
  limit?: number;
  especialidadId?: number;
}
