jest.mock('@generated/prisma', () => {
  const mockPrisma = {
    documentos: { findMany: jest.fn(), create: jest.fn() },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

import { GET, POST } from '@/app/api/documentos/route';
import { PrismaClient } from '@generated/prisma';

const db = new (PrismaClient as jest.MockedClass<typeof PrismaClient>)() as unknown as {
  documentos: {
    findMany: jest.Mock;
    create: jest.Mock;
  };
};

const docBase = {
  ID: 1, Nombre: 'contrato.pdf', Tipo: 'Contrato',
  FechaSubida: new Date('2026-01-10'), AsociadoA: 'Ruta 1',
  Tamano: '200KB', RutaArchivo: '/uploads/contrato.pdf',
  Descripcion: 'Contrato principal', Estado: 'Pendiente',
};

beforeEach(() => jest.clearAllMocks());

describe('GET /api/documentos', () => {
  it('devuelve todos los documentos sin filtros', async () => {
    db.documentos.findMany.mockResolvedValue([docBase]);

    const req = new Request('http://localhost/api/documentos');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data[0].nombre).toBe('contrato.pdf');
    expect(data[0].id).toBe(1);
  });

  it('filtra por tipo', async () => {
    db.documentos.findMany.mockResolvedValue([docBase]);

    const req = new Request('http://localhost/api/documentos?tipo=Contrato');
    await GET(req);

    expect(db.documentos.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ Tipo: 'Contrato' }) })
    );
  });

  it('ignora filtro tipo "Todos"', async () => {
    db.documentos.findMany.mockResolvedValue([]);

    const req = new Request('http://localhost/api/documentos?tipo=Todos');
    await GET(req);

    const call = db.documentos.findMany.mock.calls[0][0];
    expect(call.where.Tipo).toBeUndefined();
  });

  it('filtra por rango de fechas', async () => {
    db.documentos.findMany.mockResolvedValue([]);

    const req = new Request('http://localhost/api/documentos?desde=2026-01-01&hasta=2026-12-31');
    await GET(req);

    const call = db.documentos.findMany.mock.calls[0][0];
    expect(call.where.FechaSubida).toBeDefined();
    expect(call.where.FechaSubida.gte).toBeDefined();
    expect(call.where.FechaSubida.lte).toBeDefined();
  });

  it('usa "General" si AsociadoA es null', async () => {
    db.documentos.findMany.mockResolvedValue([{ ...docBase, AsociadoA: null }]);

    const req = new Request('http://localhost/api/documentos');
    const res = await GET(req);
    const data = await res.json();

    expect(data[0].asociadoA).toBe('General');
  });

  it('usa "N/A" si Tamano es null', async () => {
    db.documentos.findMany.mockResolvedValue([{ ...docBase, Tamano: null }]);

    const req = new Request('http://localhost/api/documentos');
    const res = await GET(req);
    const data = await res.json();

    expect(data[0].tamano).toBe('N/A');
  });

  it('devuelve 500 si Prisma falla', async () => {
    db.documentos.findMany.mockRejectedValue(new Error('DB error'));

    const req = new Request('http://localhost/api/documentos');
    const res = await GET(req);

    expect(res.status).toBe(500);
  });
});

describe('POST /api/documentos', () => {
  it('crea documento con campos requeridos', async () => {
    db.documentos.create.mockResolvedValue(docBase);

    const req = new Request('http://localhost/api/documentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'contrato.pdf', tipo: 'Contrato', rutaArchivo: '/uploads/contrato.pdf' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(201);
  });

  it('rechaza si falta nombre', async () => {
    const req = new Request('http://localhost/api/documentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'Contrato', rutaArchivo: '/uploads/x.pdf' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('Faltan campos requeridos');
  });

  it('rechaza si falta tipo', async () => {
    const req = new Request('http://localhost/api/documentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'x.pdf', rutaArchivo: '/uploads/x.pdf' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it('rechaza si falta rutaArchivo', async () => {
    const req = new Request('http://localhost/api/documentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'x.pdf', tipo: 'Contrato' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });

  it('devuelve 500 si Prisma falla', async () => {
    db.documentos.create.mockRejectedValue(new Error('DB error'));

    const req = new Request('http://localhost/api/documentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'x.pdf', tipo: 'Contrato', rutaArchivo: '/uploads/x.pdf' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });
});
