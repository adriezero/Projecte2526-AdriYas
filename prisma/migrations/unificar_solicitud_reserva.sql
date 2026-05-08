-- Migración para unificar Solicitud y Reserva
-- Agregar campos de reserva a la tabla Solicitud

ALTER TABLE "Solicitud" ADD COLUMN "idCliente" INTEGER;
ALTER TABLE "Solicitud" ADD COLUMN "idCamionero" INTEGER;
ALTER TABLE "Solicitud" ADD COLUMN "fechaServicio" DATE;
ALTER TABLE "Solicitud" ADD COLUMN "hora" VARCHAR(10);
ALTER TABLE "Solicitud" ADD COLUMN "origen" VARCHAR(255);
ALTER TABLE "Solicitud" ADD COLUMN "destino" VARCHAR(255);
ALTER TABLE "Solicitud" ADD COLUMN "representante" VARCHAR(100);
ALTER TABLE "Solicitud" ADD COLUMN "motivoRechazo" VARCHAR(255);

-- Agregar relaciones
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_idCliente_fkey" 
  FOREIGN KEY ("idCliente") REFERENCES "cliente"("ID") ON DELETE SET NULL;

ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_idCamionero_fkey" 
  FOREIGN KEY ("idCamionero") REFERENCES "camionero"("ID") ON DELETE SET NULL;

-- Índices para mejorar rendimiento
CREATE INDEX "Solicitud_idCliente_idx" ON "Solicitud"("idCliente");
CREATE INDEX "Solicitud_idCamionero_idx" ON "Solicitud"("idCamionero");
CREATE INDEX "Solicitud_estado_idx" ON "Solicitud"("estado");
CREATE INDEX "Solicitud_fechaServicio_idx" ON "Solicitud"("fechaServicio");
