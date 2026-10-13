"use client";

import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  atenderAlerta,
  descartarAlerta,
  ejecutarJobAlertas,
  listarAlertas,
  marcarAlertaVista,
} from "@/lib/api/alertas";
import { ApiError } from "@/lib/api/client";
import { Alerta } from "@/types/alertas";

const LIMITE = 10;

export default function AlertasPage() {
  const { data: session } = useSession();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [severidad, setSeveridad] = useState<string>("");
  const [estado, setEstado] = useState<string>("");
  const [ejecutando, setEjecutando] = useState(false);

  const cargar = useCallback(() => {
    listarAlertas({
      page,
      limit: LIMITE,
      severidadCodigo: severidad || undefined,
      estadoCodigo: estado || undefined,
    }).then((respuesta) => {
      setAlertas(respuesta.data);
      setTotal(respuesta.total);
    });
  }, [page, severidad, estado]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const accion = async (fn: () => Promise<Alerta>) => {
    try {
      await fn();
      cargar();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo actualizar la alerta");
    }
  };

  const handleEjecutarJob = async () => {
    setEjecutando(true);
    try {
      await ejecutarJobAlertas();
      toast.success("Job de alertas ejecutado");
      cargar();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo ejecutar el job");
    } finally {
      setEjecutando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-2xl font-medium text-default-800">Alertas</div>
        {session?.user?.rol === "ADMIN" && (
          <Button variant="outline" disabled={ejecutando} onClick={handleEjecutarJob}>
            {ejecutando ? "Ejecutando..." : "Ejecutar job de alertas"}
          </Button>
        )}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 mb-4">
            <Select value={severidad} onValueChange={(v) => { setPage(1); setSeveridad(v); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BAJA">Baja</SelectItem>
                <SelectItem value="MEDIA">Media</SelectItem>
                <SelectItem value="ALTA">Alta</SelectItem>
                <SelectItem value="CRITICA">Crítica</SelectItem>
              </SelectContent>
            </Select>
            <Select value={estado} onValueChange={(v) => { setPage(1); setEstado(v); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                <SelectItem value="VISTA">Vista</SelectItem>
                <SelectItem value="ATENDIDA">Atendida</SelectItem>
                <SelectItem value="DESCARTADA">Descartada</SelectItem>
              </SelectContent>
            </Select>
            {(severidad || estado) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSeveridad("");
                  setEstado("");
                  setPage(1);
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Severidad</TableHead>
                <TableHead>Mensaje</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertas.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-default-500">
                    No hay alertas para este filtro.
                  </TableCell>
                </TableRow>
              )}
              {alertas.map((alerta) => (
                <TableRow key={alerta.id}>
                  <TableCell className="normal-case">
                    {alerta.paciente.nombres} {alerta.paciente.apellidos}
                  </TableCell>
                  <TableCell className="normal-case">{alerta.tipoAlerta.nombre}</TableCell>
                  <TableCell>
                    <EstadoBadge codigo={alerta.severidad.codigo} nombre={alerta.severidad.nombre} />
                  </TableCell>
                  <TableCell className="normal-case max-w-md">{alerta.mensaje}</TableCell>
                  <TableCell>
                    <EstadoBadge codigo={alerta.estado.codigo} nombre={alerta.estado.nombre} />
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {alerta.estado.codigo === "PENDIENTE" && (
                      <Button size="sm" variant="outline" onClick={() => accion(() => marcarAlertaVista(alerta.id))}>
                        Ver
                      </Button>
                    )}
                    {["PENDIENTE", "VISTA"].includes(alerta.estado.codigo) && (
                      <>
                        <Button size="sm" color="success" onClick={() => accion(() => atenderAlerta(alerta.id))}>
                          Atender
                        </Button>
                        <Button size="sm" variant="outline" color="destructive" onClick={() => accion(() => descartarAlerta(alerta.id))}>
                          Descartar
                        </Button>
                      </>
                    )}
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
