"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EstadoBadge } from "@/components/clinica/estado-badge";
import { listarMovimientosDeLote } from "@/lib/api/farmacia";
import { MovimientoInventario } from "@/types/farmacia";

export function MovimientosLoteDialog({ loteId }: { loteId: number }) {
  const [open, setOpen] = useState(false);
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) {
          listarMovimientosDeLote(loteId).then(setMovimientos);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Movimientos
        </Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Movimientos de inventario del lote</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Referencia</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movimientos.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-default-500">
                  Sin movimientos registrados.
                </TableCell>
              </TableRow>
            )}
            {movimientos.map((movimiento) => (
              <TableRow key={movimiento.id}>
                <TableCell>{new Date(movimiento.fecha).toLocaleString("es-GT")}</TableCell>
                <TableCell>
                  <EstadoBadge
                    codigo={movimiento.tipoMovimiento.codigo}
                    nombre={movimiento.tipoMovimiento.nombre}
                  />
                </TableCell>
                <TableCell>{movimiento.cantidad}</TableCell>
                <TableCell className="normal-case">
                  {movimiento.referenciaTipo ? `${movimiento.referenciaTipo} #${movimiento.referenciaId}` : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
