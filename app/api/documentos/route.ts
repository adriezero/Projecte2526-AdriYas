import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@generated/prisma';

const prisma = new PrismaClient();

// GET - Obtener todos los documentos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tipo = searchParams.get('tipo');
    const desde = searchParams.get('desde');
    const hasta = searchParams.get('hasta');

    const where: Record<string, unknown> = {};

    if (tipo && tipo !== 'Todos') {
      where.Tipo = tipo;
    }

    if (desde) {
      where.FechaSubida = { ...where.FechaSubida, gte: new Date(desde) };
    }

    if (hasta) {
      where.FechaSubida = { ...where.FechaSubida, lte: new Date(hasta) };
    }

    const documentos = await prisma.documentos.findMany({
      where,
      orderBy: { FechaSubida: 'desc' },
    });

    const documentosFormateados = documentos.map(doc => ({
      id: doc.ID,
      nombre: doc.Nombre,
      tipo: doc.Tipo,
      fechaSubida: doc.FechaSubida,
      asociadoA: doc.AsociadoA || 'General',
      tamano: doc.Tamano || 'N/A',
      rutaArchivo: doc.RutaArchivo,
      descripcion: doc.Descripcion,
      estado: doc.Estado,
    }));

    return NextResponse.json(documentosFormateados);
  } catch (error) {
    console.error('Error al obtener documentos:', error);
    return NextResponse.json(
      { error: 'Error al obtener documentos' },
      { status: 500 }
    );
  }
}

// POST - Crear nuevo documento (para cuando se suba un archivo)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, tipo, asociadoA, tamano, rutaArchivo, descripcion, subidoPor, rolSubidor, dispatcher } = body;

    if (!nombre || !tipo || !rutaArchivo) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    const nuevoDocumento = await prisma.documentos.create({
      data: {
        Nombre: nombre,
        Tipo: tipo,
        AsociadoA: asociadoA,
        Tamano: tamano,
        RutaArchivo: rutaArchivo,
        Descripcion: descripcion,
        SubidoPor: subidoPor,
        RolSubidor: rolSubidor,
        Dispatcher: dispatcher,
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
      estado: nuevoDocumento.Estado,
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear documento:', error);
    return NextResponse.json(
      { error: 'Error al crear documento', details: error },
      { status: 500 }
    );
  }
}
