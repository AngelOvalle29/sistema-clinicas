import { DefaultSession } from "next-auth";
import { RolCodigo } from "./common";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accessToken: string;
      rol: RolCodigo;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    rol?: RolCodigo;
  }
}
