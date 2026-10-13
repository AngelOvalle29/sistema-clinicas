"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ajustarLote } from "@/lib/api/farmacia";
import { ApiError } from "@/lib/api/client";

export function AjustarLoteDialog({ loteId, onAjustado }: { loteId: number; onAjustado: () => void }) {
  const [open, setOpen] = useState(false);
  const [cantidad, setCantidad] = useState("");
  const [guardando, setGuardando] = useState(false);

  const handleAjustar = async () => {
    const valor = Number(cantidad);
    if (!cantidad || Number.isNaN(valor)) {
      toast.error("Ingresa una cantidad válida");
      return;
    }
    setGuardando(true);
    try {
      await ajustarLote(loteId, { cantidad: valor });
      toast.success("Lote ajustado");
      setCantidad("");
      setOpen(false);
      onAjustado();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo ajustar el lote");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          Ajustar
        </Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Ajustar cantidad del lote</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Cantidad (positiva suma, negativa resta)</Label>
          <Input type="number" value={cantidad} onChange={(e) => setCantidad(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button color="primary" disabled={guardando} onClick={handleAjustar}>
            {guardando ? "Guardando..." : "Ajustar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
