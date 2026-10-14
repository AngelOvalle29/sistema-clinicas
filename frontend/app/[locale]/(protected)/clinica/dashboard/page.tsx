"use client";

import { useEffect, useState } from "react";
import { Link } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { EstadoBadge } from "@/components/clinica/estado-badge";
import { listarCitas } from "@/lib/api/citas";
import { listarAlertas, contarAlertasPendientes } from "@/lib/api/alertas";
import { listarProductosConStockBajo } from "@/lib/api/farmacia";
import { Cita } from "@/types/citas";
import { hoyLocal } from "@/lib/clinica/fechas";
import { Alerta } from "@/types/alertas";
import { ProductoConStock } from "@/types/farmacia";


export default function DashboardPage() {
  const [citasHoy, setCitasHoy] = useState<Cita[]>([]);
  const [alertasPendientes, setAlertasPendientes] = useState<Alerta[]>([]);
  const [totalPendientes, setTotalPendientes] = useState(0);
  const [stockBajo, setStockBajo] = useState<ProductoConStock[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      listarCitas({ fecha: hoyLocal(), limit: 50 }),
      listarAlertas({ estadoCodigo: "PENDIENTE", limit: 5 }),
      contarAlertasPendientes(),
      listarProductosConStockBajo(),
    ])
      .then(([citas, alertas, contador, productos]) => {
        setCitasHoy(citas.data);
        setAlertasPendientes(alertas.data);
        setTotalPendientes(contador.pendientes);
        setStockBajo(productos);
      })
      .finally(() => setCargando(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-2xl font-medium text-default-800">Dashboard</div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Citas de hoy</CardTitle>
            <Icon icon="heroicons-outline:calendar" className="w-6 h-6 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{citasHoy.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Alertas pendientes</CardTitle>
            <Icon icon="heroicons-outline:bell-alert" className="w-6 h-6 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{totalPendientes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Productos con stock bajo</CardTitle>
            <Icon icon="heroicons-outline:beaker" className="w-6 h-6 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold">{stockBajo.length}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Agenda de hoy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!cargando && citasHoy.length === 0 && (
              <div className="text-sm text-default-500">No hay citas programadas para hoy.</div>
            )}
            {citasHoy.map((cita) => (
              <Link
                key={cita.id}
                href={`/clinica/citas/${cita.id}`}
                className="flex items-center justify-between border-b border-default-100 pb-2 last:border-0 hover:opacity-80"
              >
                <div>
                  <div className="font-medium text-default-800 flex items-center gap-2">
                    {cita.paciente.esPrioritario && (
                      <Badge color="warning" rounded="full">
                        Prioritario
                      </Badge>
                    )}
                    {cita.paciente.nombres} {cita.paciente.apellidos}
                  </div>
                  <div className="text-xs text-default-500">
                    {new Date(cita.fechaHoraInicio).toLocaleTimeString("es-GT", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    · Dr(a). {cita.medico.usuario.nombres} {cita.medico.usuario.apellidos}
                  </div>
                </div>
                <EstadoBadge codigo={cita.estado.codigo} nombre={cita.estado.nombre} />
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Alertas pendientes recientes</CardTitle>
            <Link href="/clinica/alertas" className="text-sm text-primary hover:underline">
              Ver todas
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {!cargando && alertasPendientes.length === 0 && (
              <div className="text-sm text-default-500">No hay alertas pendientes.</div>
            )}
            {alertasPendientes.map((alerta) => (
              <div
                key={alerta.id}
                className="flex items-center justify-between border-b border-default-100 pb-2 last:border-0"
              >
                <div>
                  <div className="font-medium text-default-800">
                    {alerta.paciente.nombres} {alerta.paciente.apellidos}
                  </div>
                  <div className="text-xs text-default-500">{alerta.mensaje}</div>
                </div>
                <EstadoBadge codigo={alerta.severidad.codigo} nombre={alerta.severidad.nombre} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Productos con stock bajo</CardTitle>
          <Link href="/clinica/farmacia" className="text-sm text-primary hover:underline">
            Ir a farmacia
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {!cargando && stockBajo.length === 0 && (
            <div className="text-sm text-default-500">Todos los productos están sobre su stock mínimo.</div>
          )}
          {stockBajo.map(({ producto, stock }) => (
            <div
              key={producto.id}
              className="flex items-center justify-between border-b border-default-100 pb-2 last:border-0"
            >
              <div>
                <div className="font-medium text-default-800">{producto.nombre}</div>
                <div className="text-xs text-default-500">Código {producto.codigo}</div>
              </div>
              <Badge color="destructive">
                {stock} / {producto.stockMinimo}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
