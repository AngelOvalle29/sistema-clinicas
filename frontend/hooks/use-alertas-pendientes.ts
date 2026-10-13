'use client'

import { useEffect, useState } from "react";
import { contarAlertasPendientes } from "@/lib/api/alertas";

const INTERVALO_MS = 60_000;

export function useAlertasPendientes(): number {
  const [pendientes, setPendientes] = useState(0);

  useEffect(() => {
    let activo = true;

    const cargar = () => {
      contarAlertasPendientes()
        .then((res) => {
          if (activo) setPendientes(res.pendientes);
        })
        .catch(() => {
          // Sin sesión o backend caído: el contador simplemente queda en 0.
        });
    };

    cargar();
    const intervalo = setInterval(cargar, INTERVALO_MS);
    return () => {
      activo = false;
      clearInterval(intervalo);
    };
  }, []);

  return pendientes;
}
