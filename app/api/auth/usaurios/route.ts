import { NextResponse } from 'next/server';
import { prisma } from '@lib/prisma';

export async function GET() {
  try {
    const [administradores, camioneros, clientes, dispatchers] = await Promise.all([
      prisma.administrador.findMany({
        select: { ID: true, Nombre: true, Email: true, Estado: true, Permisos: true },
      }),
      prisma.camionero.findMany({
        select: { ID: true, Nombre: true, Email: true, Disponible: true, Licencia: true, Telf: true },
      }),
      prisma.cliente.findMany({
        select: { ID: true, Nombre: true, Email: true, NombreEmpresa: true, EstadoCuenta: true, Telf: true },
      }),
      prisma.dispatcher.findMany({
        select: { ID: true, Nombre: true, Email: true, CentroOperacion: true },
      }),
    ]);

    const usuarios = [
      ...administradores.map(u => ({ ...u, tipo: 'administrador' })),
      ...camioneros.map(u => ({ ...u, tipo: 'camionero' })),
      ...clientes.map(u => ({ ...u, tipo: 'cliente' })),
      ...dispatchers.map(u => ({ ...u, tipo: 'dispatcher' })),
    ];

    return NextResponse.json(usuarios);
  } catch (error: unknown) {
    console.error('Error en API usuarios:', error);
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: 'Error al obtener usuarios', details: message }, { status: 500 });
  }
}