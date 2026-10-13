"use client";

import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listarMedicos } from "@/lib/api/medicos";
import { registrarDefuncion } from "@/lib/api/pacientes";
import { ApiError } from "@/lib/api/client";
import { Medico } from "@/types/medicos";

const schema = z.object({
  fecha: z.string().min(1, "La fecha es obligatoria"),
  causa: z.string().min(1, "La causa es obligatoria"),
  numeroCertificado: z.string().optional(),
  medicoCertificaId: z.string().min(1, "Selecciona el médico que certifica"),
});

type FormValues = z.infer<typeof schema>;

export function DefuncionDialog({
  pacienteId,
  onRegistrada,
}: {
  pacienteId: number;
  onRegistrada: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) {
      listarMedicos({ limit: 100 }).then((r) => setMedicos(r.data));
    }
  }, [open]);

  const onSubmit = async (data: FormValues) => {
    try {
      await registrarDefuncion(pacienteId, {
        fecha: data.fecha,
        causa: data.causa,
        numeroCertificado: data.numeroCertificado || undefined,
        medicoCertificaId: Number(data.medicoCertificaId),
      });
      toast.success("Defunción registrada");
      setOpen(false);
      onRegistrada();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo registrar la defunción");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button color="destructive" variant="outline">
          Registrar defunción
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar defunción</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Fecha</Label>
            <Input type="date" {...register("fecha")} />
            {errors.fecha && <p className="text-xs text-destructive">{errors.fecha.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Causa</Label>
            <Input {...register("causa")} />
            {errors.causa && <p className="text-xs text-destructive">{errors.causa.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Número de certificado (opcional)</Label>
            <Input {...register("numeroCertificado")} />
          </div>
          <div className="space-y-1.5">
            <Label>Médico que certifica</Label>
            <Select onValueChange={(value) => setValue("medicoCertificaId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un médico" />
              </SelectTrigger>
              <SelectContent>
                {medicos.map((medico) => (
                  <SelectItem key={medico.id} value={String(medico.id)}>
                    Dr(a). {medico.usuario.nombres} {medico.usuario.apellidos} —{" "}
                    {medico.especialidad.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.medicoCertificaId && (
              <p className="text-xs text-destructive">{errors.medicoCertificaId.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" color="destructive" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Confirmar defunción"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
