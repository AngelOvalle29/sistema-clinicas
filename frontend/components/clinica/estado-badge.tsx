import { Badge } from "@/components/ui/badge";
import { colorPorCodigo } from "@/lib/clinica/badges";

export function EstadoBadge({ codigo, nombre }: { codigo: string; nombre: string }) {
  return <Badge color={colorPorCodigo(codigo)}>{nombre}</Badge>;
}
