"use client";

import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listarProductos } from "@/lib/api/farmacia";
import { listarPacientes } from "@/lib/api/pacientes";
import { emitirReceta } from "@/lib/api/recetas";
import { ApiError } from "@/lib/api/client";
import { Producto } from "@/types/farmacia";
import { Paciente } from "@/types/pacientes";

interface FormValues {
  pacienteId: string;
  vigenteHasta: string;
  detalles: { productoId: string; cantidadPrescrita: string; indicaciones?: string }[];
}

export function EmitirRecetaDialog({ onEmitida }: { onEmitida: () => void }) {
  const [open, setOpen] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [guardando, setGuardando] = useState(false);

  const { register, control, handleSubmit, setValue, reset } = useForm<FormValues>({
    defaultValues: { detalles: [{ productoId: "", cantidadPrescrita: "1", indicaciones: "" }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "detalles" });

  useEffect(() => {
    if (open) {
      listarPacientes({ limit: 100, estadoCodigo: "ACTIVO" }).then((r) => setPacientes(r.data));
      listarProductos({ limit: 100, soloActivos: true }).then((r) => setProductos(r.data));
    }
  }, [open]);

  const onSubmit = async (data: FormValues) => {
    setGuardando(true);
    try {
      const { advertencias } = await emitirReceta({
        pacienteId: Number(data.pacienteId),
        vigenteHasta: data.vigenteHasta,
        detalles: data.detalles.map((detalle) => ({
          productoId: Number(detalle.productoId),
          cantidadPrescrita: Number(detalle.cantidadPrescrita),
          indicaciones: detalle.indicaciones || undefined,
        })),
      });
      toast.success("Receta emitida");
      advertencias.forEach((advertencia) => toast.warning(advertencia));
      reset();
      setOpen(false);
      onEmitida();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo emitir la receta");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button color="primary">Emitir receta</Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Emitir receta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Paciente</Label>
              <Select onValueChange={(value) => setValue("pacienteId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un paciente" />
                </SelectTrigger>
                <SelectContent>
                  {pacientes.map((paciente) => (
                    <SelectItem key={paciente.id} value={String(paciente.id)}>
                      {paciente.nombres} {paciente.apellidos}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Vigente hasta</Label>
              <Input type="date" {...register("vigenteHasta")} />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Medicamentos</Label>
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-[2fr_1fr_2fr_auto] gap-2 items-start">
                <Select
                  onValueChange={(value) => setValue(`detalles.${index}.productoId`, value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {productos.map((producto) => (
                      <SelectItem key={producto.id} value={String(producto.id)}>
                        {producto.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={1}
                  placeholder="Cant."
                  {...register(`detalles.${index}.cantidadPrescrita`)}
                />
                <Input
                  placeholder="Indicaciones"
                  {...register(`detalles.${index}.indicaciones`)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={fields.length <= 1}
                  onClick={() => remove(index)}
                >
                  ✕
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ productoId: "", cantidadPrescrita: "1", indicaciones: "" })}
            >
              + Agregar medicamento
            </Button>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" color="primary" disabled={guardando}>
              {guardando ? "Guardando..." : "Emitir receta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
