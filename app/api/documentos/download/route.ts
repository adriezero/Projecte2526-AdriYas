import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID de documento no proporcionado' },
        { status: 400 }
      );
    }

    const documento = await prisma.documentos.findUnique({
      where: { ID: parseInt(id) },
    });

    if (!documento) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    const filePath = path.join(process.cwd(), 'public', documento.RutaArchivo);
    const fileBuffer = await readFile(filePath);

    // Determinar el tipo MIME basado en la extensión
    const ext = path.extname(documento.Nombre).toLowerCase();
    const mimeTypes: { [key: string]: string } = {
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.txt': 'text/plain',
    };

    const mimeType = mimeTypes[ext] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${documento.Nombre}"`,
      },
    });
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    return NextResponse.json(
      { error: 'Error al descargar archivo' },
      { status: 500 }
    );
  }
}
