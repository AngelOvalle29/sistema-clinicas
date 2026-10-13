import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistema de clínicas",
  description: "Gestión clínica con farmacia integrada",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
