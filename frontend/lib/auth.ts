import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { LoginResponse } from "@/types/auth";
import type { RolCodigo } from "@/types/common";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    // Igual al vencimiento del JWT del backend (AGENTS.md 5.1): sin refresh token.
    maxAge: 30 * 60,
  },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const response = await fetch(`${API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: credentials.email,
            password: credentials.password,
          }),
        });

        if (!response.ok) {
          const body = await response.json().catch(() => null);
          throw new Error(body?.message ?? "Credenciales inválidas");
        }

        const data = (await response.json()) as LoginResponse;

        return {
          id: String(data.usuario.id),
          email: data.usuario.email,
          name: `${data.usuario.nombres} ${data.usuario.apellidos}`,
          rol: data.usuario.rol,
          accessToken: data.accessToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as { accessToken: string }).accessToken;
        token.rol = (user as { rol: string }).rol;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.accessToken = token.accessToken as string;
        session.user.rol = token.rol as RolCodigo;
      }
      return session;
    },
  },
});
