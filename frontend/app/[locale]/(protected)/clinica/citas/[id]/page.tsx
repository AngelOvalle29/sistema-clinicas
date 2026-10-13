"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EstadoBadge } from "@/components/clinica/estado-badge";
import { CancelarCitaDialog } from "./components/cancelar-cita-dialog";
import { ConsultaForm } from "./components/consulta-form";
import {
  completarCita,
  confirmarCita,
  iniciarCita,
  marcarNoAsistioCita,
  obtenerCita,
} from "@/lib/api/citas";
import { ApiError } from "@/lib/api/client";
import { Cita } from "@/types/citas";

export default function CitaDetallePage() {
  const params = useParams<{ id: string }>();
  const citaId = Number(params.id);
  const { data: session } = useSession();
  const [cita, setCita] = useState<Cita | null>(null);

  const cargar = useCallback(() => {
    obtenerCita(citaId).then(setCita);
  }, [citaId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const ejecutar = async (accion: () => Promise<Cita>) => {
    try {
      await accion();
      toast.success("Cita actualizada");
      cargar();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo actualizar la cita");
    }
  };

  if (!cita) {
    return <div className="text-sm text-default-500">Cargando cita...</div>;
  }

  const esMedico = session?.user?.rol === "MEDICO";
  const estado = cita.estado.codigo;

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-medium text-default-800">
                  {cita.paciente.nombres} {cita.paciente.apellidos}
                </div>
                {cita.paciente.esPrioritario && <Badge color="warning">Prioritario</Badge>}
                {cita.esControlCronico && <Badge color="info">Control crónico</Badge>}
              </div>
              <div className="text-sm text-default-500">
                Dr(a). {cita.medico.usuario.nombres} {cita.medico.usuario.apellidos} —{" "}
                {cita.medico.especialidad.nombre}
              </div>
              <div className="text-sm text-default-500">
                {new Date(cita.fechaHoraInicio).toLocaleString("es-GT")} —{" "}
                {new Date(cita.fechaHoraFin).toLocaleTimeString("es-GT")}
              </div>
              <div className="mt-2">
                <EstadoBadge codigo={cita.estado.codigo} nombre={cita.estado.nombre} />
              </div>
              {cita.motivoCancelacion && (
                <div className="text-sm text-destructive mt-1">
                  Motivo de cancelación: {cita.motivoCancelacion}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {estado === "PROGRAMADA" && (
                <Button size="sm" color="primary" onClick={() => ejecutar(() => confirmarCita(cita.id))}>
                  Confirmar
                </Button>
              )}
              {estado === "CONFIRMADA" && esMedico && (
                <Button size="sm" color="primary" onClick={() => ejecutar(() => iniciarCita(cita.id))}>
                  Iniciar consulta
                </Button>
              )}
              {estado === "EN_CURSO" && esMedico && (
                <Button size="sm" color="success" onClick={() => ejecutar(() => completarCita(cita.id))}>
                  Completar cita
                </Button>
              )}
              {(estado === "PROGRAMADA" || estado === "CONFIRMADA") && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => ejecutar(() => marcarNoAsistioCita(cita.id))}
                  >
                    No asistió
                  </Button>
                  <CancelarCitaDialog citaId={cita.id} onCancelada={cargar} />
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {estado === "EN_CURSO" && esMedico && <ConsultaForm cita={cita} onRegistrada={cargar} />}
    </div>
  );
}
