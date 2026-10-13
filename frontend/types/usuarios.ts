import { RolCodigo } from "./common";

export interface Rol {
  id: number;
  codigo: RolCodigo;
  nombre: string;
  activo: boolean;
}

export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: Rol;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUsuarioRequest {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  rolCodigo: RolCodigo;
}

export type UpdateUsuarioRequest = Partial<CreateUsuarioRequest>;
