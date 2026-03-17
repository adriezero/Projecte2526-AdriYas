/*
  Warnings:

  - A unique constraint covering the columns `[resetToken]` on the table `administrador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resetToken]` on the table `camionero` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resetToken]` on the table `cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resetToken]` on the table `dispatcher` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "administrador" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "camionero" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "cliente" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "dispatcher" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "administrador_resetToken_key" ON "administrador"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "camionero_resetToken_key" ON "camionero"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_resetToken_key" ON "cliente"("resetToken");

-- CreateIndex
CREATE UNIQUE INDEX "dispatcher_resetToken_key" ON "dispatcher"("resetToken");
