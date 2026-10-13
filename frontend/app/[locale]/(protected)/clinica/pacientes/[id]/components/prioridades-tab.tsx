"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  asignarPrioridad,
  listarCategoriasPrioridad,
  listarPrioridadesActivas,
  retirarPrioridad,
} from "@/lib/api/pacientes";
import { ApiError } from "@/lib/api/client";
import { CategoriaPrioridad, PacientePrioridad } from "@/types/pacientes";

export function PrioridadesTab({ pacienteId }: { pacienteId: number }) {
  const [prioridades, setPrioridades] = useState<PacientePrioridad[]>([]);
  const [categorias, setCategorias] = useState<CategoriaPrioridad[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const cargar = useCallback(() => {
    listarPrioridadesActivas(pacienteId).then(setPrioridades);
  }, [pacienteId]);

  useEffect(() => {
    cargar();
    listarCategoriasPrioridad().then(setCategorias);
  }, [cargar]);

  const handleAsignar = async () => {
    if (!categoriaSeleccionada) return;
    setGuardando(true);
    try {
      await asignarPrioridad(pacienteId, { categoriaPrioridadId: Number(categoriaSeleccionada) });
      toast.success("Prioridad asignada");
      setOpen(false);
      setCategoriaSeleccionada("");
      cargar();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo asignar la prioridad");
    } finally {
      setGuardando(false);
    }
  };

  const handleRetirar = async (prioridadId: number) => {
    try {
      await retirarPrioridad(prioridadId);
      toast.success("Prioridad retirada");
      cargar();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo retirar la prioridad");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" color="primary">
              Asignar prioridad
            </Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <DialogHeader>
              <DialogTitle>Asignar categoría de prioridad</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label>Categoría</Label>
                <Select value={categoriaSeleccionada} onValueChange={setCategoriaSeleccionada}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.id} value={String(categoria.id)}>
                        {categoria.nombre} (nivel {categoria.nivel})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button color="primary" disabled={guardando} onClick={handleAsignar}>
                  {guardando ? "Guardando..." : "Asignar"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {prioridades.length === 0 && (
        <div className="text-sm text-default-500">Sin prioridades activas.</div>
      )}
      <div className="space-y-2">
        {prioridades.map((prioridad) => (
          <div
            key={prioridad.id}
            className="flex items-center justify-between border border-default-100 rounded-md p-3"
          >
            <div>
              <Badge color="warning">{prioridad.categoriaPrioridad.nombre}</Badge>
              <span className="text-xs text-default-500 ml-2">
                Desde {new Date(prioridad.fechaAsignacion).toLocaleDateString("es-GT")}
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={() => handleRetirar(prioridad.id)}>
              Retirar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
