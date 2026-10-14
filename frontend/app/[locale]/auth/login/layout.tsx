import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión | XelaHealing",
  description: "Sistema de gestión clínica con farmacia integrada.",
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
