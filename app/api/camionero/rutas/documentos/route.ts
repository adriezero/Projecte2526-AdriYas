import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { documentos_Tipo } from '@prisma/client';
import { prisma } from '@lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idRuta = searchParams.get('idRuta');
  if (!idRuta) return NextResponse.json({ error: 'idRuta requerido' }, { status: 400 });

  const docs = await prisma.documentos.findMany({
    where: { idRuta: parseInt(idRuta) },
    orderBy: { FechaSubida: 'desc' },
  });

  return NextResponse.json(docs.map(d => ({
    id: d.ID,
    nombre: d.Nombre,
    tipo: d.Tipo,
    tamano: d.Tamano,
    url: d.RutaArchivo,
    fechaSubida: d.FechaSubida,
  })));
}

const TIPOS_VALIDOS: Record<string, documentos_Tipo> = {
  'Factura': documentos_Tipo.Factura,
  'Contrato': documentos_Tipo.Contrato,
  'Permiso': documentos_Tipo.Permiso,
  'Seguro': documentos_Tipo.Seguro,
  'Licencia': documentos_Tipo.Licencia,
  'Certificado': documentos_Tipo.Certificado,
  'Otro': documentos_Tipo.Otro
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const idRuta = formData.get('idRuta') as string;
    const tipoRaw = (formData.get('tipo') as string) || 'Otro';
    const tipo = TIPOS_VALIDOS[tipoRaw] || documentos_Tipo.Otro;

    if (!file || !idRuta) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });

    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    const blob = await put(fileName, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    const tamano = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    const rutaArchivo = blob.url;

    const doc = await prisma.documentos.create({
      data: {
        Nombre: file.name,
        Tipo: tipo,
        Tamano: tamano,
        RutaArchivo: rutaArchivo,
        idRuta: parseInt(idRuta),
      },
    });

    return NextResponse.json({
      id: doc.ID,
      nombre: doc.Nombre,
      tipo: doc.Tipo,
      tamano: doc.Tamano,
      url: doc.RutaArchivo,
      fechaSubida: doc.FechaSubida,
    }, { status: 201 });
  } catch (e: unknown) {
    console.error('Error subiendo documento:', e);
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 });
  }
}
