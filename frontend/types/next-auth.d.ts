import { RolCodigo } from "./common";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accessToken: string;
      rol: RolCodigo;
      name?: string | null;
      email?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    rol?: RolCodigo;
  }
}
