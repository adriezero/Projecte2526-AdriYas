-- CreateEnum
CREATE TYPE "reportes_Rol" AS ENUM ('Administrador', 'Camionero', 'Cliente', 'Dispatcher');

-- CreateEnum
CREATE TYPE "reportes_Tipo" AS ENUM ('Problema Técnico', 'Incidencia', 'Sugerencia');

-- CreateEnum
CREATE TYPE "reportes_Estado" AS ENUM ('Pendiente', 'En revisión', 'Resuelto', 'Cerrado');

-- CreateTable
CREATE TABLE "reportes" (
    "ID" SERIAL NOT NULL,
    "Tipo" "reportes_Tipo" NOT NULL,
    "FechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Estado" "reportes_Estado" NOT NULL DEFAULT 'Pendiente',
    "idReportante" INTEGER NOT NULL,
    "rolReportante" "reportes_Rol" NOT NULL,

    CONSTRAINT "reportes_pkey" PRIMARY KEY ("ID")
);
