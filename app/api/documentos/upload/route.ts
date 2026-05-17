import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { PrismaClient } from '@generated/prisma';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const tipo = formData.get('tipo') as string;
    const asociadoA = formData.get('asociadoA') as string;
    const descripcion = formData.get('descripcion') as string;
    const subidoPor = formData.get('subidoPor') as string;
    const rolSubidor = formData.get('rolSubidor') as string;
    const dispatcher = formData.get('dispatcher') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    const tiposValidos = ['Factura', 'Contrato', 'Permiso', 'Seguro', 'Licencia', 'Certificado', 'Otro'];
    const tipoFinal = tiposValidos.includes(tipo) ? tipo : 'Otro';

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'documentos');
    
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = path.join(uploadsDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const tamanoMB = (buffer.length / (1024 * 1024)).toFixed(2);
    const tamano = `${tamanoMB} MB`;

    const rutaArchivo = `/uploads/documentos/${fileName}`;
    
    const nuevoDocumento = await prisma.documentos.create({
      data: {
        Nombre: file.name,
        Tipo: tipoFinal,
        AsociadoA: asociadoA || 'General',
        Tamano: tamano,
        RutaArchivo: rutaArchivo,
        Descripcion: descripcion,
        SubidoPor: subidoPor ? parseInt(subidoPor) : null,
        RolSubidor: rolSubidor || null,
        Dispatcher: dispatcher ? parseInt(dispatcher) : null,
      },
    });

    return NextResponse.json({
      id: nuevoDocumento.ID,
      nombre: nuevoDocumento.Nombre,
      tipo: nuevoDocumento.Tipo,
      fechaSubida: nuevoDocumento.FechaSubida,
      asociadoA: nuevoDocumento.AsociadoA || 'General',
      tamano: nuevoDocumento.Tamano || 'N/A',
      rutaArchivo: nuevoDocumento.RutaArchivo,
      descripcion: nuevoDocumento.Descripcion,
      message: 'Archivo subido correctamente',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Error al subir archivo', 
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
