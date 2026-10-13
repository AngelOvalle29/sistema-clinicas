export interface Especialidad {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface CreateEspecialidadRequest {
  nombre: string;
}

export type UpdateEspecialidadRequest = Partial<CreateEspecialidadRequest>;

export interface QueryEspecialidadParams {
  page?: number;
  limit?: number;
  soloActivas?: boolean;
}
