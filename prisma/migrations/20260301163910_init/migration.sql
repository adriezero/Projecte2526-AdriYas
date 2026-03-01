-- CreateEnum
CREATE TYPE "rutas_Estado" AS ENUM ('Programado', 'Cargando', 'En_ruta', 'En_pausa', 'Finalizado', 'Incidente');

-- CreateEnum
CREATE TYPE "informes_Formato" AS ENUM ('CSV', 'PDF');

-- CreateEnum
CREATE TYPE "camionero_Licencia" AS ENUM ('A', 'B', 'C', 'C1', 'CE', 'D', 'E');

-- CreateEnum
CREATE TYPE "administrador_Estado" AS ENUM ('Disponible', 'Ocupado', 'No molestar', 'Ausente', 'Día libre');

-- CreateEnum
CREATE TYPE "cliente_EstadoCuenta" AS ENUM ('Disponible', 'Ocupado', 'No molestar', 'Ausente', 'Día libre');

-- CreateTable
CREATE TABLE "administrador" (
    "ID" SERIAL NOT NULL,
    "Nombre" VARCHAR(50) NOT NULL,
    "Email" VARCHAR(50),
    "Permisos" VARCHAR(255),
    "Contraseña" VARCHAR(60) NOT NULL,
    "Estado" "administrador_Estado" NOT NULL DEFAULT 'Disponible',

    CONSTRAINT "administrador_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "camionero" (
    "ID" SERIAL NOT NULL,
    "Nombre" VARCHAR(50) NOT NULL,
    "Email" VARCHAR(50),
    "Licencia" "camionero_Licencia" NOT NULL,
    "Telf" VARCHAR(10) NOT NULL,
    "Disponible" BOOLEAN NOT NULL DEFAULT true,
    "idTurno" INTEGER NOT NULL,
    "FechaInicio" DATE NOT NULL,
    "FechaFinal" DATE NOT NULL,

    CONSTRAINT "camionero_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "cliente" (
    "ID" SERIAL NOT NULL,
    "Nombre" VARCHAR(50) NOT NULL,
    "NombreEmpresa" VARCHAR(150) NOT NULL,
    "RazonSocial" VARCHAR(255),
    "Email" VARCHAR(50),
    "Contraseña" VARCHAR(60) NOT NULL,
    "Telf" VARCHAR(10) NOT NULL,
    "EstadoCuenta" "cliente_EstadoCuenta" NOT NULL DEFAULT 'Disponible',

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "comentarios" (
    "ID" SERIAL NOT NULL,
    "Contenido" VARCHAR(200),
    "EsPositivo" BOOLEAN NOT NULL DEFAULT true,
    "Fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Moderado" BOOLEAN DEFAULT false,
    "Administrador" INTEGER,
    "Ruta" INTEGER NOT NULL,
    "Cliente" INTEGER NOT NULL,

    CONSTRAINT "comentarios_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "dispatcher" (
    "ID" SERIAL NOT NULL,
    "Nombre" VARCHAR(50) NOT NULL,
    "Email" VARCHAR(50) NOT NULL,
    "Contraseña" VARCHAR(60) NOT NULL,
    "CentroOperacion" VARCHAR(255),

    CONSTRAINT "dispatcher_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "documentos" (
    "ID" SERIAL NOT NULL,
    "Nombre" VARCHAR(50) NOT NULL,
    "Descripción" VARCHAR(150) NOT NULL,
    "FechaSubida" DATE NOT NULL,
    "Dispatcher" INTEGER NOT NULL,

    CONSTRAINT "documentos_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "informes" (
    "ID" SERIAL NOT NULL,
    "Tipo" VARCHAR(50) NOT NULL,
    "Formato" "informes_Formato",
    "FechaSubida" DATE NOT NULL,
    "idDispatcher" INTEGER NOT NULL,
    "idCliente" INTEGER NOT NULL,

    CONSTRAINT "informes_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "reservas" (
    "ID" SERIAL NOT NULL,
    "Fecha" DATE NOT NULL,
    "Motivo" VARCHAR(150) NOT NULL,
    "Descripción" VARCHAR(255),

    CONSTRAINT "reservas_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "rol" (
    "ID" SERIAL NOT NULL,
    "Nombre" VARCHAR(50) NOT NULL,
    "Descripción" VARCHAR(150),
    "idAdmin" INTEGER NOT NULL,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "rutas" (
    "ID" SERIAL NOT NULL,
    "Estado" "rutas_Estado",
    "Reservas" TEXT NOT NULL,
    "Cargas" TEXT NOT NULL,
    "EnTiempoReal" BOOLEAN NOT NULL DEFAULT false,
    "Camionero" INTEGER NOT NULL,
    "Origen" VARCHAR(255) NOT NULL,
    "Destino" VARCHAR(255) NOT NULL,

    CONSTRAINT "rutas_pkey" PRIMARY KEY ("ID")
);

-- CreateTable
CREATE TABLE "solicitud_reserva" (
    "idReserva" INTEGER NOT NULL,
    "idCliente" INTEGER NOT NULL,
    "idCamionero" INTEGER NOT NULL,

    CONSTRAINT "solicitud_reserva_pkey" PRIMARY KEY ("idReserva","idCliente")
);

-- CreateTable
CREATE TABLE "turnos" (
    "ID" SERIAL NOT NULL,
    "Descripción" VARCHAR(255) NOT NULL,

    CONSTRAINT "turnos_pkey" PRIMARY KEY ("ID")
);

-- CreateIndex
CREATE INDEX "camionero_idTurno_idx" ON "camionero"("idTurno");

-- CreateIndex
CREATE INDEX "comentarios_Administrador_idx" ON "comentarios"("Administrador");

-- CreateIndex
CREATE INDEX "comentarios_Ruta_idx" ON "comentarios"("Ruta");

-- CreateIndex
CREATE INDEX "comentarios_Cliente_idx" ON "comentarios"("Cliente");

-- CreateIndex
CREATE INDEX "documentos_Dispatcher_idx" ON "documentos"("Dispatcher");

-- CreateIndex
CREATE INDEX "informes_idDispatcher_idx" ON "informes"("idDispatcher");

-- CreateIndex
CREATE INDEX "informes_idCliente_idx" ON "informes"("idCliente");

-- CreateIndex
CREATE INDEX "rol_idAdmin_idx" ON "rol"("idAdmin");

-- CreateIndex
CREATE INDEX "rutas_Camionero_idx" ON "rutas"("Camionero");

-- CreateIndex
CREATE INDEX "solicitud_reserva_idCamionero_idx" ON "solicitud_reserva"("idCamionero");

-- CreateIndex
CREATE INDEX "solicitud_reserva_idCliente_idx" ON "solicitud_reserva"("idCliente");

-- CreateIndex
CREATE INDEX "solicitud_reserva_idReserva_idx" ON "solicitud_reserva"("idReserva");

-- AddForeignKey
ALTER TABLE "camionero" ADD CONSTRAINT "camionero_idTurno_fkey" FOREIGN KEY ("idTurno") REFERENCES "turnos"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_Administrador_fkey" FOREIGN KEY ("Administrador") REFERENCES "administrador"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_Cliente_fkey" FOREIGN KEY ("Cliente") REFERENCES "cliente"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comentarios" ADD CONSTRAINT "comentarios_Ruta_fkey" FOREIGN KEY ("Ruta") REFERENCES "rutas"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documentos" ADD CONSTRAINT "documentos_Dispatcher_fkey" FOREIGN KEY ("Dispatcher") REFERENCES "dispatcher"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "informes" ADD CONSTRAINT "informes_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "cliente"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "informes" ADD CONSTRAINT "informes_idDispatcher_fkey" FOREIGN KEY ("idDispatcher") REFERENCES "dispatcher"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol" ADD CONSTRAINT "rol_idAdmin_fkey" FOREIGN KEY ("idAdmin") REFERENCES "administrador"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rutas" ADD CONSTRAINT "rutas_Camionero_fkey" FOREIGN KEY ("Camionero") REFERENCES "camionero"("ID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_reserva" ADD CONSTRAINT "solicitud_reserva_idCamionero_fkey" FOREIGN KEY ("idCamionero") REFERENCES "camionero"("ID") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "solicitud_reserva" ADD CONSTRAINT "solicitud_reserva_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "cliente"("ID") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "solicitud_reserva" ADD CONSTRAINT "solicitud_reserva_idReserva_fkey" FOREIGN KEY ("idReserva") REFERENCES "reservas"("ID") ON DELETE RESTRICT ON UPDATE RESTRICT;
