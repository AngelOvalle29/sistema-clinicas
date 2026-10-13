"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { crearPaciente } from "@/lib/api/pacientes";
import { ApiError } from "@/lib/api/client";

const schema = z.object({
  nombres: z.string().min(1, "Los nombres son obligatorios"),
  apellidos: z.string().min(1, "Los apellidos son obligatorios"),
  dpi: z.string().optional(),
  fechaNacimiento: z.string().optional(),
  genero: z.string().optional(),
  telefono: z.string().optional(),
  direccion: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CrearPacienteDialog({ onCreado }: { onCreado: () => void }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      await crearPaciente({
        ...data,
        dpi: data.dpi || undefined,
        fechaNacimiento: data.fechaNacimiento || undefined,
        genero: data.genero || undefined,
        telefono: data.telefono || undefined,
        direccion: data.direccion || undefined,
      });
      toast.success("Paciente registrado");
      reset();
      setOpen(false);
      onCreado();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo registrar el paciente");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button color="primary">Nuevo paciente</Button>
      </DialogTrigger>
      <DialogContent size="md">
        <DialogHeader>
          <DialogTitle>Registrar paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Nombres</Label>
            <Input {...register("nombres")} />
            {errors.nombres && <p className="text-xs text-destructive">{errors.nombres.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Apellidos</Label>
            <Input {...register("apellidos")} />
            {errors.apellidos && <p className="text-xs text-destructive">{errors.apellidos.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>DPI (opcional)</Label>
            <Input {...register("dpi")} />
          </div>
          <div className="space-y-1.5">
            <Label>Fecha de nacimiento</Label>
            <Input type="date" {...register("fechaNacimiento")} />
          </div>
          <div className="space-y-1.5">
            <Label>Género</Label>
            <Input {...register("genero")} placeholder="Masculino / Femenino / Otro" />
          </div>
          <div className="space-y-1.5">
            <Label>Teléfono</Label>
            <Input {...register("telefono")} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Dirección</Label>
            <Input {...register("direccion")} />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
