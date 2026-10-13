"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginationControls } from "@/components/clinica/pagination-controls";
import { AjustarLoteDialog } from "./components/ajustar-lote-dialog";
import { CrearLoteDialog } from "./components/crear-lote-dialog";
import { CrearProductoDialog } from "./components/crear-producto-dialog";
import { MovimientosLoteDialog } from "./components/movimientos-lote-dialog";
import { listarLotesProximosAVencer, listarLotesVencidos, listarProductos } from "@/lib/api/farmacia";
import { Lote, Producto } from "@/types/farmacia";

const LIMITE = 10;

function ProductosTab() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [busqueda, setBusqueda] = useState("");

  const cargar = useCallback(() => {
    listarProductos({ page, limit: LIMITE, busqueda: busqueda || undefined }).then((r) => {
      setProductos(r.data);
      setTotal(r.total);
    });
  }, [page, busqueda]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <Input
            placeholder="Buscar por nombre, principio activo o código..."
            value={busqueda}
            onChange={(e) => {
              setPage(1);
              setBusqueda(e.target.value);
            }}
            className="max-w-sm"
          />
          <CrearProductoDialog onCreado={cargar} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Costo</TableHead>
              <TableHead>Stock mínimo</TableHead>
              <TableHead>Activo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productos.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-default-500">
                  No se encontraron productos.
                </TableCell>
              </TableRow>
            )}
            {productos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell className="font-medium">{producto.codigo}</TableCell>
                <TableCell className="normal-case">{producto.nombre}</TableCell>
                <TableCell>{producto.tipoProducto.nombre}</TableCell>
                <TableCell>Q{producto.costoUnitario.toFixed(2)}</TableCell>
                <TableCell>{producto.stockMinimo}</TableCell>
                <TableCell>
                  <Badge color={producto.activo ? "success" : "secondary"}>
                    {producto.activo ? "Sí" : "No"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <PaginationControls page={page} limit={LIMITE} total={total} onPageChange={setPage} />
      </CardContent>
    </Card>
  );
}

function LotesTab() {
  const [proximos, setProximos] = useState<Lote[]>([]);
  const [vencidos, setVencidos] = useState<Lote[]>([]);

  const cargar = useCallback(() => {
    listarLotesProximosAVencer(30).then(setProximos);
    listarLotesVencidos().then(setVencidos);
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const renderTabla = (lotes: Lote[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead>Lote</TableHead>
          <TableHead>Vencimiento</TableHead>
          <TableHead>Cantidad actual</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lotes.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-default-500">
              Sin registros.
            </TableCell>
          </TableRow>
        )}
        {lotes.map((lote) => (
          <TableRow key={lote.id}>
            <TableCell className="normal-case">{lote.producto.nombre}</TableCell>
            <TableCell>{lote.numeroLote}</TableCell>
            <TableCell>{new Date(lote.fechaVencimiento).toLocaleDateString("es-GT")}</TableCell>
            <TableCell>{lote.cantidadActual}</TableCell>
            <TableCell className="text-right space-x-2">
              <MovimientosLoteDialog loteId={lote.id} />
              <AjustarLoteDialog loteId={lote.id} onAjustado={cargar} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <CrearLoteDialog onCreado={cargar} />
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="font-medium text-default-800 mb-3">Próximos a vencer (30 días)</div>
          {renderTabla(proximos)}
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="font-medium text-default-800 mb-3">Vencidos</div>
          {renderTabla(vencidos)}
        </CardContent>
      </Card>
    </div>
  );
}

export default function FarmaciaPage() {
  return (
    <div className="space-y-6">
      <div className="text-2xl font-medium text-default-800">Farmacia</div>
      <Tabs defaultValue="productos">
        <TabsList>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="lotes">Lotes</TabsTrigger>
        </TabsList>
        <TabsContent value="productos">
          <ProductosTab />
        </TabsContent>
        <TabsContent value="lotes">
          <LotesTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
