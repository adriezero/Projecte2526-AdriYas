-- AlterTable documentos: Agregar nuevas columnas
ALTER TABLE "documentos" 
  ADD COLUMN IF NOT EXISTS "Tipo" TEXT,
  ADD COLUMN IF NOT EXISTS "AsociadoA" VARCHAR(255),
  ADD COLUMN IF NOT EXISTS "Tamano" VARCHAR(20),
  ADD COLUMN IF NOT EXISTS "RutaArchivo" VARCHAR(500),
  ADD COLUMN IF NOT EXISTS "Descripcion" VARCHAR(500),
  ADD COLUMN IF NOT EXISTS "SubidoPor" INTEGER,
  ADD COLUMN IF NOT EXISTS "RolSubidor" TEXT,
  ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "Nombre" TYPE VARCHAR(255),
  ALTER COLUMN "FechaSubida" SET DEFAULT CURRENT_TIMESTAMP,
  ALTER COLUMN "FechaSubida" TYPE TIMESTAMP(3),
  ALTER COLUMN "Dispatcher" DROP NOT NULL;

-- Actualizar registros existentes con valores por defecto
UPDATE "documentos" 
SET 
  "Tipo" = 'Otro',
  "RutaArchivo" = '/uploads/documentos/legacy_' || "ID" || '.pdf',
  "updatedAt" = CURRENT_TIMESTAMP,
  "Descripcion" = "Descripción"
WHERE "Tipo" IS NULL;

-- Hacer columnas requeridas después de agregar valores por defecto
ALTER TABLE "documentos" 
  ALTER COLUMN "Tipo" SET NOT NULL,
  ALTER COLUMN "RutaArchivo" SET NOT NULL,
  ALTER COLUMN "updatedAt" SET NOT NULL;

-- Crear índices
CREATE INDEX IF NOT EXISTS "documentos_Tipo_idx" ON "documentos"("Tipo");
CREATE INDEX IF NOT EXISTS "documentos_FechaSubida_idx" ON "documentos"("FechaSubida");
