import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { documentos_Tipo, documentos_RolSubidor } from '@prisma/client';
import { prisma } from '@lib/prisma';

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

    const tiposValidos: Record<string, documentos_Tipo> = {
      'Factura': documentos_Tipo.Factura,
      'Contrato': documentos_Tipo.Contrato,
      'Permiso': documentos_Tipo.Permiso,
      'Seguro': documentos_Tipo.Seguro,
      'Licencia': documentos_Tipo.Licencia,
      'Certificado': documentos_Tipo.Certificado,
      'Otro': documentos_Tipo.Otro
    };
    const tipoFinal = tiposValidos[tipo] || documentos_Tipo.Otro;

    const rolesValidos: Record<string, documentos_RolSubidor> = {
      'Administrador': documentos_RolSubidor.Administrador,
      'Dispatcher': documentos_RolSubidor.Dispatcher,
      'Camionero': documentos_RolSubidor.Camionero,
      'Cliente': documentos_RolSubidor.Cliente
    };
    const rolFinal = rolSubidor ? rolesValidos[rolSubidor] || null : null;

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;

    const blob = await put(fileName, buffer, {
      access: 'public',
      multipart: true,
    });

    const tamanoMB = (buffer.length / (1024 * 1024)).toFixed(2);
    const tamano = `${tamanoMB} MB`;

    const rutaArchivo = blob.url;
    
    const nuevoDocumento = await prisma.documentos.create({
      data: {
        Nombre: file.name,
        Tipo: tipoFinal,
        AsociadoA: asociadoA || 'General',
        Tamano: tamano,
        RutaArchivo: rutaArchivo,
        Descripcion: descripcion,
        SubidoPor: subidoPor ? parseInt(subidoPor) : null,
        RolSubidor: rolFinal,
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
