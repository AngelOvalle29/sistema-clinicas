"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EstadoBadge } from "@/components/clinica/estado-badge";
import { anularReceta, dispensarReceta, obtenerReceta } from "@/lib/api/recetas";
import { ApiError } from "@/lib/api/client";
import { Receta } from "@/types/recetas";

export default function RecetaDetallePage() {
  const params = useParams<{ id: string }>();
  const recetaId = Number(params?.id);
  const { data: session } = useSession();
  const [receta, setReceta] = useState<Receta | null>(null);

  const cargar = useCallback(() => {
    obtenerReceta(recetaId).then(setReceta);
  }, [recetaId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleDispensar = async () => {
    try {
      await dispensarReceta(recetaId);
      toast.success("Receta dispensada");
      cargar();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo dispensar la receta");
    }
  };

  const handleAnular = async () => {
    try {
      await anularReceta(recetaId);
      toast.success("Receta anulada");
      cargar();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo anular la receta");
    }
  };

  if (!receta) {
    return <div className="text-sm text-default-500">Cargando receta...</div>;
  }

  const esFarmacia = session?.user?.rol === "FARMACIA";
  const puedeAnular = ["EMITIDA", "DISPENSADA_PARCIAL"].includes(receta.estado.codigo);
  const puedeDispensar = esFarmacia && puedeAnular;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-2">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-2xl font-medium text-default-800">{receta.codigo}</div>
              <div className="text-sm text-default-500">
                {receta.paciente.nombres} {receta.paciente.apellidos} · Dr(a).{" "}
                {receta.medico.usuario.nombres} {receta.medico.usuario.apellidos}
              </div>
              <div className="text-sm text-default-500">
                Emitida {new Date(receta.fechaEmision).toLocaleDateString("es-GT")} · Vigente
                hasta {new Date(receta.vigenteHasta).toLocaleDateString("es-GT")}
              </div>
              <div className="mt-2">
                <EstadoBadge codigo={receta.estado.codigo} nombre={receta.estado.nombre} />
              </div>
            </div>
            <div className="flex gap-2">
              {puedeDispensar && (
                <Button color="success" size="sm" onClick={handleDispensar}>
                  Dispensar
                </Button>
              )}
              {puedeAnular && (
                <Button variant="outline" color="destructive" size="sm" onClick={handleAnular}>
                  Anular
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead>Prescrito</TableHead>
                <TableHead>Dispensado</TableHead>
                <TableHead>Indicaciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {receta.detalles.map((detalle) => (
                <TableRow key={detalle.id}>
                  <TableCell className="normal-case">{detalle.producto.nombre}</TableCell>
                  <TableCell>{detalle.cantidadPrescrita}</TableCell>
                  <TableCell>{detalle.cantidadDispensada}</TableCell>
                  <TableCell className="normal-case">{detalle.indicaciones ?? "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
