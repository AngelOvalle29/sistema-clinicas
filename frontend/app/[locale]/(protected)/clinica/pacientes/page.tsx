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
import { CrearPacienteDialog } from "./components/crear-paciente-dialog";
import { listarPacientes } from "@/lib/api/pacientes";
import { Paciente } from "@/types/pacientes";

const LIMITE = 10;

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);

  const cargar = useCallback(() => {
    setCargando(true);
    listarPacientes({ page, limit: LIMITE, nombre: busqueda || undefined })
      .then((respuesta) => {
        setPacientes(respuesta.data);
        setTotal(respuesta.total);
      })
      .finally(() => setCargando(false));
  }, [page, busqueda]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-2xl font-medium text-default-800">Pacientes</div>
        <CrearPacienteDialog onCreado={cargar} />
      </div>

      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Buscar por nombre o apellido..."
            value={busqueda}
            onChange={(e) => {
              setPage(1);
              setBusqueda(e.target.value);
            }}
            className="max-w-sm mb-4"
          />

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>DPI</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioritario</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!cargando && pacientes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-default-500">
                    No se encontraron pacientes.
                  </TableCell>
                </TableRow>
              )}
              {pacientes.map((paciente) => (
                <TableRow key={paciente.id}>
                  <TableCell className="font-medium">{paciente.codigo}</TableCell>
                  <TableCell className="normal-case">
                    {paciente.nombres} {paciente.apellidos}
                  </TableCell>
                  <TableCell>{paciente.dpi ?? "—"}</TableCell>
                  <TableCell>
                    <EstadoBadge codigo={paciente.estado.codigo} nombre={paciente.estado.nombre} />
                  </TableCell>
                  <TableCell>
                    {paciente.esPrioritario ? (
                      <Badge color="warning">Sí</Badge>
                    ) : (
                      <span className="text-default-400">No</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/clinica/pacientes/${paciente.id}`}>
                      <Button variant="outline" size="sm">
                        Ver detalle
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
