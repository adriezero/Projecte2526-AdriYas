import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@generated/prisma';

const prisma = new PrismaClient();

// GET - Obtener un documento específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const documento = await prisma.documentos.findUnique({
      where: { ID: id },
    });

    if (!documento) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: documento.ID,
      nombre: documento.Nombre,
      tipo: documento.Tipo,
      fechaSubida: documento.FechaSubida,
      asociadoA: documento.AsociadoA || 'General',
      tamano: documento.Tamano || 'N/A',
      rutaArchivo: documento.RutaArchivo,
      descripcion: documento.Descripcion,
    });
  } catch (error) {
    console.error('Error al obtener documento:', error);
    return NextResponse.json(
      { error: 'Error al obtener documento' },
      { status: 500 }
    );
  }
}

// PATCH - Actualizar un documento
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { nombre, tipo, fechaSubida, asociadoA } = body;

    const documentoActualizado = await prisma.documentos.update({
      where: { ID: id },
      data: {
        ...(nombre && { Nombre: nombre }),
        ...(tipo && { Tipo: tipo }),
        ...(fechaSubida && { FechaSubida: new Date(fechaSubida) }),
        ...(asociadoA !== undefined && { AsociadoA: asociadoA }),
      },
    });

    return NextResponse.json({
      id: documentoActualizado.ID,
      nombre: documentoActualizado.Nombre,
      tipo: documentoActualizado.Tipo,
      fechaSubida: documentoActualizado.FechaSubida,
      asociadoA: documentoActualizado.AsociadoA || 'General',
      tamano: documentoActualizado.Tamano || 'N/A',
      rutaArchivo: documentoActualizado.RutaArchivo,
      descripcion: documentoActualizado.Descripcion,
    });
  } catch (error) {
    console.error('Error al actualizar documento:', error);
    return NextResponse.json(
      { error: 'Error al actualizar documento' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar un documento
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Aquí también deberías eliminar el archivo físico del servidor
    // const documento = await prisma.documentos.findUnique({ where: { ID: id } });
    // if (documento?.RutaArchivo) {
    //   await fs.unlink(documento.RutaArchivo);
    // }

    await prisma.documentos.delete({
      where: { ID: id },
    });

    return NextResponse.json({ message: 'Documento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    return NextResponse.json(
      { error: 'Error al eliminar documento' },
      { status: 500 }
    );
  }
}
