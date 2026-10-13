"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { crearAlergia, crearAntecedente, obtenerHistorialCompleto } from "@/lib/api/historial";
import { ApiError } from "@/lib/api/client";
import { HistorialCompleto } from "@/types/historial";

export function HistorialTab({ pacienteId }: { pacienteId: number }) {
  const [historial, setHistorial] = useState<HistorialCompleto | null>(null);
  const [nuevaAlergia, setNuevaAlergia] = useState("");
  const [nuevoAntecedenteTipo, setNuevoAntecedenteTipo] = useState("");
  const [nuevoAntecedenteDescripcion, setNuevoAntecedenteDescripcion] = useState("");

  const cargar = useCallback(() => {
    obtenerHistorialCompleto(pacienteId).then(setHistorial);
  }, [pacienteId]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const agregarAlergia = async () => {
    if (!nuevaAlergia.trim()) return;
    try {
      await crearAlergia(pacienteId, { descripcion: nuevaAlergia });
      setNuevaAlergia("");
      cargar();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo registrar la alergia");
    }
  };

  const agregarAntecedente = async () => {
    if (!nuevoAntecedenteTipo.trim() || !nuevoAntecedenteDescripcion.trim()) return;
    try {
      await crearAntecedente(pacienteId, {
        tipo: nuevoAntecedenteTipo,
        descripcion: nuevoAntecedenteDescripcion,
      });
      setNuevoAntecedenteTipo("");
      setNuevoAntecedenteDescripcion("");
      cargar();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo registrar el antecedente");
    }
  };

  if (!historial) {
    return <div className="text-sm text-default-500">Cargando historial...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Consultas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {historial.consultas.length === 0 && (
            <div className="text-sm text-default-500">Sin consultas registradas.</div>
          )}
          {historial.consultas.map((consulta) => (
            <div key={consulta.id} className="border-b border-default-100 pb-2 last:border-0">
              <div className="text-sm font-medium text-default-800">
                {new Date(consulta.fecha).toLocaleString("es-GT")} — Dr(a).{" "}
                {consulta.medico.usuario.nombres} {consulta.medico.usuario.apellidos}
              </div>
              <div className="text-xs text-default-500">
                Motivo: {consulta.motivo ?? "—"} · Diagnóstico: {consulta.diagnostico ?? "—"}
              </div>
              {consulta.notas && <div className="text-xs text-default-400">{consulta.notas}</div>}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Alergias</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {historial.alergias.map((alergia) => (
              <Badge key={alergia.id} color="destructive">
                {alergia.descripcion}
              </Badge>
            ))}
            {historial.alergias.length === 0 && (
              <span className="text-sm text-default-500">Sin alergias registradas.</span>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Descripción de la alergia"
              value={nuevaAlergia}
              onChange={(e) => setNuevaAlergia(e.target.value)}
            />
            <Button size="sm" onClick={agregarAlergia}>
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Antecedentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {historial.antecedentes.map((antecedente) => (
              <div key={antecedente.id} className="text-sm">
                <span className="font-medium text-default-800">{antecedente.tipo}:</span>{" "}
                {antecedente.descripcion}
              </div>
            ))}
            {historial.antecedentes.length === 0 && (
              <div className="text-sm text-default-500">Sin antecedentes registrados.</div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Tipo (ej. familiar, quirúrgico)"
              value={nuevoAntecedenteTipo}
              onChange={(e) => setNuevoAntecedenteTipo(e.target.value)}
            />
            <Input
              placeholder="Descripción"
              value={nuevoAntecedenteDescripcion}
              onChange={(e) => setNuevoAntecedenteDescripcion(e.target.value)}
            />
            <Button size="sm" onClick={agregarAntecedente} className="self-end">
              Agregar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Enfermedades crónicas activas</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {historial.enfermedadesCronicas.length === 0 && (
            <span className="text-sm text-default-500">Sin enfermedades crónicas activas.</span>
          )}
          {historial.enfermedadesCronicas.map((item) => (
            <Badge key={item.id} color="info">
              {item.enfermedadCronica.nombre}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
