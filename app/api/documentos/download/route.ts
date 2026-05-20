import { NextRequest, NextResponse } from 'next/server';
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

    // Si es una URL de Vercel Blob, redirigir con parámetros de descarga
    if (documento.RutaArchivo.startsWith('https://')) {
      const downloadUrl = new URL(documento.RutaArchivo);
      downloadUrl.searchParams.set('download', '1');
      downloadUrl.searchParams.set('filename', documento.Nombre);
      return NextResponse.redirect(downloadUrl.toString());
    }

    // Fallback para archivos locales antiguos (si existen)
    return NextResponse.json(
      { error: 'Archivo no disponible' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    return NextResponse.json(
      { error: 'Error al descargar archivo' },
      { status: 500 }
    );
  }
}
