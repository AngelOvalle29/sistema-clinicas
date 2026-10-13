import { RolCodigo } from "./common";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UsuarioSesion {
  id: number;
  nombres: string;
  apellidos: string;
  email: string;
  rol: RolCodigo;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: string;
  usuario: UsuarioSesion;
}
