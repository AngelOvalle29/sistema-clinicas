"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { crearLote, listarProductos } from "@/lib/api/farmacia";
import { ApiError } from "@/lib/api/client";
import { Producto } from "@/types/farmacia";

interface FormValues {
  productoId: string;
  numeroLote: string;
  fechaVencimiento: string;
  cantidadInicial: string;
}

export function CrearLoteDialog({ onCreado }: { onCreado: () => void }) {
  const [open, setOpen] = useState(false);
  const [productos, setProductos] = useState<Producto[]>([]);
  const { register, handleSubmit, setValue, reset, formState: { isSubmitting } } = useForm<FormValues>();

  useEffect(() => {
    if (open) {
      listarProductos({ limit: 100, soloActivos: true }).then((r) => setProductos(r.data));
    }
  }, [open]);

  const onSubmit = async (data: FormValues) => {
    try {
      await crearLote({
        productoId: Number(data.productoId),
        numeroLote: data.numeroLote,
        fechaVencimiento: data.fechaVencimiento,
        cantidadInicial: Number(data.cantidadInicial),
      });
      toast.success("Lote registrado");
      reset();
      setOpen(false);
      onCreado();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo registrar el lote");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button color="primary">Nuevo lote</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar lote</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Producto</Label>
            <Select onValueChange={(value) => setValue("productoId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un producto" />
              </SelectTrigger>
              <SelectContent>
                {productos.map((producto) => (
                  <SelectItem key={producto.id} value={String(producto.id)}>
                    {producto.nombre} ({producto.codigo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Número de lote</Label>
            <Input {...register("numeroLote", { required: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Fecha de vencimiento</Label>
            <Input type="date" {...register("fechaVencimiento", { required: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Cantidad inicial</Label>
            <Input type="number" min={0} {...register("cantidadInicial", { required: true })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
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
