import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { PrismaClient } from '@generated/prisma';

const prisma = new PrismaClient();

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
    rutaArchivo: d.RutaArchivo,
    fechaSubida: d.FechaSubida,
  })));
}

const TIPOS_VALIDOS = ['Factura','Contrato','Permiso','Seguro','Licencia','Certificado','Otro'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const idRuta = formData.get('idRuta') as string;
    const tipoRaw = (formData.get('tipo') as string) || 'Otro';
    const tipo = TIPOS_VALIDOS.includes(tipoRaw) ? tipoRaw : 'Otro';

    if (!file || !idRuta) return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'documentos');
    if (!existsSync(uploadsDir)) await mkdir(uploadsDir, { recursive: true });

    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, fileName), buffer);

    const tamano = `${(buffer.length / (1024 * 1024)).toFixed(2)} MB`;
    const rutaArchivo = `/uploads/documentos/${fileName}`;

    const doc = await prisma.documentos.create({
      data: {
        Nombre: file.name,
        Tipo: tipo as any,
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
      rutaArchivo: doc.RutaArchivo,
      fechaSubida: doc.FechaSubida,
    }, { status: 201 });
  } catch (e: any) {
    console.error('Error subiendo documento:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
