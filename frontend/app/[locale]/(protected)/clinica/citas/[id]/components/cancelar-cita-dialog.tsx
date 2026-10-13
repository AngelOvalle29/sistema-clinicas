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
import { cancelarCita } from "@/lib/api/citas";
import { ApiError } from "@/lib/api/client";

export function CancelarCitaDialog({ citaId, onCancelada }: { citaId: number; onCancelada: () => void }) {
  const [open, setOpen] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [guardando, setGuardando] = useState(false);

  const handleCancelar = async () => {
    if (!motivo.trim()) {
      toast.error("Ingresa el motivo de la cancelación");
      return;
    }
    setGuardando(true);
    try {
      await cancelarCita(citaId, { motivo });
      toast.success("Cita cancelada");
      setOpen(false);
      onCancelada();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo cancelar la cita");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" color="destructive" size="sm">
          Cancelar cita
        </Button>
      </DialogTrigger>
      <DialogContent size="sm">
        <DialogHeader>
          <DialogTitle>Cancelar cita</DialogTitle>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label>Motivo</Label>
          <Input value={motivo} onChange={(e) => setMotivo(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Volver
          </Button>
          <Button color="destructive" disabled={guardando} onClick={handleCancelar}>
            {guardando ? "Guardando..." : "Confirmar cancelación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
