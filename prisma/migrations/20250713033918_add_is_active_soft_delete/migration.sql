-- AlterTable
ALTER TABLE "Cliente" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Pedido" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "PedidoDetalle" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
