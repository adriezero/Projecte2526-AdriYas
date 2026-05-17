// ─── Reviews ─────────────────────────────────────────────────────────────────
jest.mock('@lib/prisma', () => ({
  prisma: {
    comentarios: { findMany: jest.fn(), create: jest.fn() },
    reportes: { findMany: jest.fn(), count: jest.fn(), create: jest.fn() },
    administrador: { findUnique: jest.fn() },
    camionero: { findUnique: jest.fn() },
    cliente: { findUnique: jest.fn() },
    dispatcher: { findUnique: jest.fn() },
  },
}));

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@lib/auth', () => ({ authOptions: {} }));

import { GET as getReviews, POST as postReview } from '@/app/api/reviews/route';
import { GET as getReportes, POST as postReporte } from '@/app/api/reportes/route';
import { prisma } from '@lib/prisma';
import { getServerSession } from 'next-auth';

const db = prisma as jest.Mocked<typeof prisma>;
const mockSession = getServerSession as jest.Mock;

beforeEach(() => jest.clearAllMocks());

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/reviews', () => {
  it('devuelve reviews moderadas formateadas', async () => {
    (db.comentarios.findMany as jest.Mock).mockResolvedValue([{
      ID: 1, Contenido: 'Excelente servicio', EsPositivo: true, Fecha: new Date(),
      cliente: { Nombre: 'Juan' },
      rutas: { Origen: 'Madrid', Destino: 'Barcelona' },
    }]);

    const res = await getReviews();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data[0].name).toBe('Juan');
    expect(data[0].route).toBe('Madrid → Barcelona');
    expect(data[0].isPositive).toBe(true);
  });

  it('devuelve array vacío si Prisma falla (no lanza 500)', async () => {
    (db.comentarios.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

    const res = await getReviews();
    const data = await res.json();

    expect(data).toEqual([]);
  });

  it('solo devuelve reviews moderadas (where: Moderado true)', async () => {
    (db.comentarios.findMany as jest.Mock).mockResolvedValue([]);

    await getReviews();

    expect(db.comentarios.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { Moderado: true } })
    );
  });

  it('limita a 10 resultados', async () => {
    (db.comentarios.findMany as jest.Mock).mockResolvedValue([]);

    await getReviews();

    expect(db.comentarios.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 10 })
    );
  });
});

describe('POST /api/reviews', () => {
  it('crea review si usuario es cliente autenticado', async () => {
    mockSession.mockResolvedValue({ user: { id: '1', role: 'cliente' } });
    (db.comentarios.create as jest.Mock).mockResolvedValue({ ID: 1, Contenido: 'Bien', EsPositivo: true });

    const req = new Request('http://localhost/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenido: 'Bien', esPositivo: true, idRuta: 1 }),
    });
    const res = await postReview(req);

    expect(res.status).toBe(200);
    expect(db.comentarios.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ Cliente: 1, Ruta: 1 }) })
    );
  });

  it('rechaza si no hay sesión', async () => {
    mockSession.mockResolvedValue(null);

    const req = new Request('http://localhost/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenido: 'Bien', idRuta: 1 }),
    });
    const res = await postReview(req);

    expect(res.status).toBe(401);
  });

  it('rechaza si el rol no es cliente', async () => {
    mockSession.mockResolvedValue({ user: { id: '1', role: 'dispatcher' } });

    const req = new Request('http://localhost/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenido: 'Bien', idRuta: 1 }),
    });
    const res = await postReview(req);

    expect(res.status).toBe(401);
  });

  it('rechaza si falta contenido', async () => {
    mockSession.mockResolvedValue({ user: { id: '1', role: 'cliente' } });

    const req = new Request('http://localhost/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idRuta: 1 }),
    });
    const res = await postReview(req);

    expect(res.status).toBe(400);
  });

  it('usa esPositivo=true por defecto si no se envía', async () => {
    mockSession.mockResolvedValue({ user: { id: '1', role: 'cliente' } });
    (db.comentarios.create as jest.Mock).mockResolvedValue({ ID: 1 });

    const req = new Request('http://localhost/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenido: 'Ok', idRuta: 1 }),
    });
    await postReview(req);

    expect(db.comentarios.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ EsPositivo: true }) })
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/reportes', () => {
  it('devuelve reportes paginados', async () => {
    (db.reportes.findMany as jest.Mock).mockResolvedValue([{
      ID: 1, Tipo: 'Incidencia', FechaHora: new Date(),
      Estado: 'Pendiente', idReportante: 1, rolReportante: 'Cliente', Descripcion: null,
    }]);
    (db.reportes.count as jest.Mock).mockResolvedValue(1);
    (db.cliente.findUnique as jest.Mock).mockResolvedValue({ Nombre: 'Juan' });

    const req = { nextUrl: { searchParams: new URLSearchParams() } } as unknown as Request & { nextUrl: { searchParams: URLSearchParams } };
    const res = await getReportes(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.total).toBe(1);
    expect(data.reportes[0].nombreReportante).toBe('Juan');
  });

  it('filtra por tipo', async () => {
    (db.reportes.findMany as jest.Mock).mockResolvedValue([]);
    (db.reportes.count as jest.Mock).mockResolvedValue(0);

    const req = { nextUrl: { searchParams: new URLSearchParams('tipo=Incidencia') } } as unknown as Request & { nextUrl: { searchParams: URLSearchParams } };
    await getReportes(req);

    expect(db.reportes.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: expect.objectContaining({ Tipo: 'Incidencia' }) })
    );
  });

  it('usa orden desc por defecto', async () => {
    (db.reportes.findMany as jest.Mock).mockResolvedValue([]);
    (db.reportes.count as jest.Mock).mockResolvedValue(0);

    const req = { nextUrl: { searchParams: new URLSearchParams() } } as unknown as Request & { nextUrl: { searchParams: URLSearchParams } };
    await getReportes(req);

    expect(db.reportes.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { FechaHora: 'desc' } })
    );
  });
});

describe('POST /api/reportes', () => {
  it('crea reporte con sesión válida', async () => {
    mockSession.mockResolvedValue({ user: { id: '1', role: 'camionero' } });
    (db.reportes.create as jest.Mock).mockResolvedValue({ ID: 1, Tipo: 'Incidencia' });

    const req = {
      nextUrl: { searchParams: new URLSearchParams() },
      json: jest.fn().mockResolvedValue({ Tipo: 'Incidencia', Descripcion: 'Accidente leve' }),
    } as unknown as Request & { nextUrl: { searchParams: URLSearchParams }; json: jest.Mock };
    const res = await postReporte(req);

    expect(res.status).toBe(201);
  });

  it('rechaza sin sesión', async () => {
    mockSession.mockResolvedValue(null);

    const req = { json: jest.fn().mockResolvedValue({ Tipo: 'Incidencia' }) } as unknown as Request & { json: jest.Mock };
    const res = await postReporte(req);

    expect(res.status).toBe(401);
  });

  it('rechaza si falta Tipo', async () => {
    mockSession.mockResolvedValue({ user: { id: '1', role: 'camionero' } });

    const req = { json: jest.fn().mockResolvedValue({}) } as unknown as Request & { json: jest.Mock };
    const res = await postReporte(req);

    expect(res.status).toBe(400);
  });

  it('rechaza tipo inválido', async () => {
    mockSession.mockResolvedValue({ user: { id: '1', role: 'camionero' } });

    const req = { json: jest.fn().mockResolvedValue({ Tipo: 'TipoInexistente' }) } as unknown as Request & { json: jest.Mock };
    const res = await postReporte(req);

    expect(res.status).toBe(400);
  });
});
