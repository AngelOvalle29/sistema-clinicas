"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EstadoBadge } from "@/components/clinica/estado-badge";
import { DefuncionDialog } from "./components/defuncion-dialog";
import { HistorialTab } from "./components/historial-tab";
import { PrioridadesTab } from "./components/prioridades-tab";
import { obtenerPaciente } from "@/lib/api/pacientes";
import { Paciente } from "@/types/pacientes";

export default function PacienteDetallePage() {
  const params = useParams<{ id: string }>();
  const pacienteId = Number(params?.id);
  const [paciente, setPaciente] = useState<Paciente | null>(null);

  const cargar = useCallback(() => {
    obtenerPaciente(pacienteId).then(setPaciente);
  }, [pacienteId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  if (!paciente) {
    return <div className="text-sm text-default-500">Cargando paciente...</div>;
  }

  const esFallecido = paciente.estado.codigo === "FALLECIDO";

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="text-2xl font-medium text-default-800">
                {paciente.nombres} {paciente.apellidos}
              </div>
              {paciente.esPrioritario && <Badge color="warning">Prioritario</Badge>}
            </div>
            <div className="text-sm text-default-500">
              Código {paciente.codigo} · DPI {paciente.dpi ?? "—"} · Tel. {paciente.telefono ?? "—"}
            </div>
            <div className="mt-2">
              <EstadoBadge codigo={paciente.estado.codigo} nombre={paciente.estado.nombre} />
            </div>
          </div>
          {!esFallecido && <DefuncionDialog pacienteId={paciente.id} onRegistrada={cargar} />}
        </CardContent>
      </Card>

      {esFallecido && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 text-destructive text-sm p-4">
          Este paciente está fallecido. El historial queda en solo lectura y no se pueden crear
          citas, consultas ni recetas nuevas.
        </div>
      )}

      <Tabs defaultValue="historial">
        <TabsList>
          <TabsTrigger value="historial">Historial</TabsTrigger>
          <TabsTrigger value="prioridades">Prioridades</TabsTrigger>
        </TabsList>
        <TabsContent value="historial">
          <HistorialTab pacienteId={paciente.id} />
        </TabsContent>
        <TabsContent value="prioridades">
          <PrioridadesTab pacienteId={paciente.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
