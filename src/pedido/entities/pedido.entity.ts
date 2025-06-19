export class Pedido {
  id: number;
  clienteId: number;
  productos: { productoId: number; cantidad: number }[];
  total: number;
  fecha: string;
  estado: 'pendiente' | 'preparando' | 'entregado';
}
