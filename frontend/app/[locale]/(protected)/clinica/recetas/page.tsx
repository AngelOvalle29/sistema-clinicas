"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
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
import { PaginationControls } from "@/components/clinica/pagination-controls";
import { EmitirRecetaDialog } from "./components/emitir-receta-dialog";
import { listarRecetas } from "@/lib/api/recetas";
import { Receta } from "@/types/recetas";

const LIMITE = 10;

export default function RecetasPage() {
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(() => {
    setCargando(true);
    listarRecetas({ page, limit: LIMITE })
      .then((respuesta) => {
        setRecetas(respuesta.data);
        setTotal(respuesta.total);
      })
      .finally(() => setCargando(false));
  }, [page]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-2xl font-medium text-default-800">Recetas</div>
        <EmitirRecetaDialog onEmitida={cargar} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead>Vigente hasta</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!cargando && recetas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-default-500">
                    No hay recetas registradas.
                  </TableCell>
                </TableRow>
              )}
              {recetas.map((receta) => (
                <TableRow key={receta.id}>
                  <TableCell className="font-medium">{receta.codigo}</TableCell>
                  <TableCell className="normal-case">
                    {receta.paciente.nombres} {receta.paciente.apellidos}
                  </TableCell>
                  <TableCell className="normal-case">
                    Dr(a). {receta.medico.usuario.nombres} {receta.medico.usuario.apellidos}
                  </TableCell>
                  <TableCell>{new Date(receta.vigenteHasta).toLocaleDateString("es-GT")}</TableCell>
                  <TableCell>
                    <EstadoBadge codigo={receta.estado.codigo} nombre={receta.estado.nombre} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/clinica/recetas/${receta.id}`}>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <PaginationControls page={page} limit={LIMITE} total={total} onPageChange={setPage} />
        </CardContent>
      </Card>
    </div>
  );
}
