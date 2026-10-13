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
import { crearProducto, listarTiposProducto } from "@/lib/api/farmacia";
import { ApiError } from "@/lib/api/client";
import { TipoProducto } from "@/types/farmacia";

interface FormValues {
  codigo: string;
  nombre: string;
  principioActivo?: string;
  tipoProductoId: string;
  costoUnitario?: string;
  stockMinimo?: string;
}

export function CrearProductoDialog({ onCreado }: { onCreado: () => void }) {
  const [open, setOpen] = useState(false);
  const [tipos, setTipos] = useState<TipoProducto[]>([]);
  const { register, handleSubmit, setValue, reset, formState: { isSubmitting } } = useForm<FormValues>();

  useEffect(() => {
    if (open) {
      listarTiposProducto().then(setTipos);
    }
  }, [open]);

  const onSubmit = async (data: FormValues) => {
    try {
      await crearProducto({
        codigo: data.codigo,
        nombre: data.nombre,
        principioActivo: data.principioActivo || undefined,
        tipoProductoId: Number(data.tipoProductoId),
        costoUnitario: data.costoUnitario ? Number(data.costoUnitario) : undefined,
        stockMinimo: data.stockMinimo ? Number(data.stockMinimo) : undefined,
      });
      toast.success("Producto creado");
      reset();
      setOpen(false);
      onCreado();
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : "No se pudo crear el producto");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button color="primary">Nuevo producto</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Código</Label>
            <Input {...register("codigo", { required: true })} />
          </div>
          <div className="space-y-1.5">
            <Label>Nombre</Label>
            <Input {...register("nombre", { required: true })} />
          </div>
          <div className="space-y-1.5 col-span-2">
            <Label>Principio activo</Label>
            <Input {...register("principioActivo")} />
          </div>
          <div className="space-y-1.5">
            <Label>Tipo</Label>
            <Select onValueChange={(value) => setValue("tipoProductoId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipo" />
              </SelectTrigger>
              <SelectContent>
                {tipos.map((tipo) => (
                  <SelectItem key={tipo.id} value={String(tipo.id)}>
                    {tipo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Costo unitario</Label>
            <Input type="number" step="0.01" {...register("costoUnitario")} placeholder="0 si es muestra médica" />
          </div>
          <div className="space-y-1.5">
            <Label>Stock mínimo</Label>
            <Input type="number" {...register("stockMinimo")} />
          </div>
          <div className="col-span-2 flex justify-end gap-2 pt-2">
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
