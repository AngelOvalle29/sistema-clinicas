"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { crearConsulta, registrarSignosVitales } from "@/lib/api/historial";
import { ApiError } from "@/lib/api/client";
import { Cita } from "@/types/citas";

interface FormValues {
  motivo: string;
  diagnostico: string;
  notas: string;
  presionSistolica: string;
  presionDiastolica: string;
  glucosa: string;
  saturacionO2: string;
  temperatura: string;
  peso: string;
  talla: string;
}

function numeroOUndefined(valor: string) {
  if (!valor.trim()) return undefined;
  const numero = Number(valor);
  return Number.isNaN(numero) ? undefined : numero;
}

export function ConsultaForm({ cita, onRegistrada }: { cita: Cita; onRegistrada: () => void }) {
  const { register, handleSubmit, reset } = useForm<FormValues>();
  const [guardando, setGuardando] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setGuardando(true);
    try {
      const consulta = await crearConsulta({
        pacienteId: cita.paciente.id,
        citaId: cita.id,
        motivo: data.motivo || undefined,
        diagnostico: data.diagnostico || undefined,
        notas: data.notas || undefined,
      });

      const signos = {
        presionSistolica: numeroOUndefined(data.presionSistolica),
        presionDiastolica: numeroOUndefined(data.presionDiastolica),
        glucosa: numeroOUndefined(data.glucosa),
        saturacionO2: numeroOUndefined(data.saturacionO2),
        temperatura: numeroOUndefined(data.temperatura),
        peso: numeroOUndefined(data.peso),
        talla: numeroOUndefined(data.talla),
      };
      const hayAlgunSigno = Object.values(signos).some((valor) => valor !== undefined);
      if (hayAlgunSigno) {
        await registrarSignosVitales(consulta.id, signos);
      }

      toast.success("Consulta registrada");
      reset();
      onRegistrada();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo registrar la consulta");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Registrar consulta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Motivo</Label>
            <Input {...register("motivo")} />
          </div>
          <div className="space-y-1.5">
            <Label>Diagnóstico</Label>
            <Input {...register("diagnostico")} />
          </div>
          <div className="space-y-1.5">
            <Label>Notas</Label>
            <Textarea {...register("notas")} />
          </div>

          <div className="text-sm font-medium text-default-700 pt-2">Signos vitales (opcional)</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Presión sistólica</Label>
              <Input type="number" {...register("presionSistolica")} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Presión diastólica</Label>
              <Input type="number" {...register("presionDiastolica")} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Glucosa (mg/dL)</Label>
              <Input type="number" step="0.01" {...register("glucosa")} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Saturación O2 (%)</Label>
              <Input type="number" step="0.01" {...register("saturacionO2")} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Temperatura (°C)</Label>
              <Input type="number" step="0.1" {...register("temperatura")} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Peso (kg)</Label>
              <Input type="number" step="0.01" {...register("peso")} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Talla (m)</Label>
              <Input type="number" step="0.01" {...register("talla")} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" color="primary" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar consulta"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
