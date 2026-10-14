"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { crearCita } from "@/lib/api/citas";
import { listarMedicos } from "@/lib/api/medicos";
import { listarPacientes } from "@/lib/api/pacientes";
import { ApiError } from "@/lib/api/client";
import { Medico } from "@/types/medicos";
import { Paciente } from "@/types/pacientes";

const schema = z.object({
  pacienteId: z.string().min(1, "Selecciona un paciente"),
  medicoId: z.string().min(1, "Selecciona un médico"),
  fechaHoraInicio: z.string().min(1, "La hora de inicio es obligatoria"),
  fechaHoraFin: z.string().min(1, "La hora de fin es obligatoria"),
  esControlCronico: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CrearCitaDialog({ onCreada }: { onCreada: () => void }) {
  const [open, setOpen] = useState(false);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) {
      listarPacientes({ limit: 100, estadoCodigo: "ACTIVO" })
        .then((r) => setPacientes(r.data))
        .catch(() => toast.error("No se pudieron cargar los pacientes"));
      listarMedicos({ limit: 100 })
        .then((r) => setMedicos(r.data))
        .catch(() => toast.error("No se pudieron cargar los médicos"));
    }
  }, [open]);

  const ahoraLocal = () => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const sumarMinutos = (valor: string, minutos: number) => {
    const d = new Date(valor);
    d.setMinutes(d.getMinutes() + minutos - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const inicioRegistro = register("fechaHoraInicio");

  const onSubmit = async (data: FormValues) => {
    try {
      await crearCita({
        pacienteId: Number(data.pacienteId),
        medicoId: Number(data.medicoId),
        fechaHoraInicio: new Date(data.fechaHoraInicio).toISOString(),
        fechaHoraFin: new Date(data.fechaHoraFin).toISOString(),
        esControlCronico: data.esControlCronico,
      });
      toast.success("Cita programada");
      reset();
      setOpen(false);
      onCreada();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo programar la cita");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button color="primary">Nueva cita</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Programar cita</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Paciente</Label>
            <Select
              value={watch("pacienteId") ?? ""}
              onValueChange={(value) => setValue("pacienteId", value, { shouldValidate: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un paciente" />
              </SelectTrigger>
              <SelectContent>
                {pacientes.map((paciente) => (
                  <SelectItem key={paciente.id} value={String(paciente.id)}>
                    {paciente.nombres} {paciente.apellidos} ({paciente.codigo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.pacienteId && (
              <p className="text-xs text-destructive">{errors.pacienteId.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Médico</Label>
            <Select
              value={watch("medicoId") ?? ""}
              onValueChange={(value) => setValue("medicoId", value, { shouldValidate: true })}
              disabled={medicos.length === 0}
            >
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
            {medicos.length === 0 && (
              <p className="text-xs text-warning">
                No hay médicos registrados. Un ADMIN debe crearlos primero.
              </p>
            )}
            {errors.medicoId && (
              <p className="text-xs text-destructive">{errors.medicoId.message}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Inicio</Label>
              <Input
                type="datetime-local"
                min={ahoraLocal()}
                {...inicioRegistro}
                onChange={(e) => {
                  inicioRegistro.onChange(e);
                  if (e.target.value) {
                    setValue("fechaHoraFin", sumarMinutos(e.target.value, 30), { shouldValidate: true });
                  }
                }}
              />
              {errors.fechaHoraInicio && (
                <p className="text-xs text-destructive">{errors.fechaHoraInicio.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Fin</Label>
              <Input type="datetime-local" min={ahoraLocal()} {...register("fechaHoraFin")} />
              {errors.fechaHoraFin && (
                <p className="text-xs text-destructive">{errors.fechaHoraFin.message}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="esControlCronico"
              checked={watch("esControlCronico")}
              onCheckedChange={(checked) => setValue("esControlCronico", checked === true)}
            />
            <Label htmlFor="esControlCronico">Es control de enfermedad crónica</Label>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Programar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
