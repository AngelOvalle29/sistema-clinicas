"use client";

import { useCallback, useEffect, useState } from "react";
import { Link } from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { CrearCitaDialog } from "./components/crear-cita-dialog";
import { listarCitas } from "@/lib/api/citas";
import { Cita } from "@/types/citas";
import { hoyLocal } from "@/lib/clinica/fechas";

const LIMITE = 10;


export default function CitasPage() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [fecha, setFecha] = useState(hoyLocal());
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(() => {
    setCargando(true);
    listarCitas({ page, limit: LIMITE, fecha: fecha || undefined })
      .then((respuesta) => {
        setCitas(respuesta.data);
        setTotal(respuesta.total);
      })
      .finally(() => setCargando(false));
  }, [page, fecha]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-2xl font-medium text-default-800">Citas</div>
        <CrearCitaDialog onCreada={cargar} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <Input
              type="date"
              value={fecha}
              onChange={(e) => {
                setPage(1);
                setFecha(e.target.value);
              }}
              className="max-w-[200px]"
            />
            {fecha && (
              <Button variant="outline" size="sm" onClick={() => setFecha("")}>
                Ver todas
              </Button>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!cargando && citas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-default-500">
                    No hay citas para este filtro.
                  </TableCell>
                </TableRow>
              )}
              {citas.map((cita) => (
                <TableRow key={cita.id}>
                  <TableCell>
                    {new Date(cita.fechaHoraInicio).toLocaleString("es-GT", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </TableCell>
                  <TableCell className="normal-case">
                    <div className="flex items-center gap-2">
                      {cita.paciente.esPrioritario && <Badge color="warning">P</Badge>}
                      {cita.paciente.nombres} {cita.paciente.apellidos}
                    </div>
                  </TableCell>
                  <TableCell className="normal-case">
                    Dr(a). {cita.medico.usuario.nombres} {cita.medico.usuario.apellidos}
                  </TableCell>
                  <TableCell>
                    <EstadoBadge codigo={cita.estado.codigo} nombre={cita.estado.nombre} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/clinica/citas/${cita.id}`}>
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
