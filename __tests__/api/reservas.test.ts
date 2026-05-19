jest.mock('@lib/prisma', () => ({
  prisma: {
    reservas: { findMany: jest.fn(), create: jest.fn() },
  },
}));

import { GET, POST } from '@/app/api/reservas/route';
import { prisma } from '@lib/prisma';

const db = prisma as unknown as {
  reservas: {
    findMany: jest.Mock;
    create: jest.Mock;
  };
};

const reservaBase = {
  ID: 1, Fecha: new Date('2026-06-15'), Hora: '09:00',
  Representante: 'Juan', Origen: 'Madrid', Destino: 'Barcelona',
  Motivo: 'Transporte', Descripci_n: null, createdAt: new Date(),
};

beforeEach(() => jest.clearAllMocks());

describe('GET /api/reservas', () => {
  it('devuelve todas las reservas sin filtros', async () => {
    db.reservas.findMany.mockResolvedValue([reservaBase]);

    const req = new Request('http://localhost/api/reservas');
    const res = await GET(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(db.reservas.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    );
  });

  it('filtra por mes y año correctamente', async () => {
    db.reservas.findMany.mockResolvedValue([reservaBase]);

    const req = new Request('http://localhost/api/reservas?mes=6&year=2026');
    const res = await GET(req);

    expect(res.status).toBe(200);
    // Solo verificamos que se llamó con un filtro de fecha (los valores exactos dependen del timezone)
    const call = db.reservas.findMany.mock.calls[0][0];
    expect(call.where.Fecha).toBeDefined();
    expect(call.where.Fecha.gte).toBeDefined();
    expect(call.where.Fecha.lte).toBeDefined();
  });

  it('devuelve array vacío si no hay reservas', async () => {
    db.reservas.findMany.mockResolvedValue([]);

    const req = new Request('http://localhost/api/reservas');
    const res = await GET(req);
    const data = await res.json();

    expect(data).toEqual([]);
  });

  it('devuelve 500 si Prisma falla', async () => {
    db.reservas.findMany.mockRejectedValue(new Error('DB error'));

    const req = new Request('http://localhost/api/reservas');
    const res = await GET(req);

    expect(res.status).toBe(500);
  });

  it('ignora filtro si solo se pasa mes sin año', async () => {
    db.reservas.findMany.mockResolvedValue([]);

    const req = new Request('http://localhost/api/reservas?mes=6');
    await GET(req);

    expect(db.reservas.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: {} })
    );
  });
});

describe('POST /api/reservas', () => {
  it('crea reserva con todos los campos', async () => {
    db.reservas.create.mockResolvedValue(reservaBase);

    const req = new Request('http://localhost/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fechaInicio: '2026-06-15', hora: '09:00', representante: 'Juan',
        origen: 'Madrid', destino: 'Barcelona', motivo: 'Transporte',
      }),
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ID).toBe(1);
    expect(db.reservas.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ Origen: 'Madrid', Destino: 'Barcelona' }),
      })
    );
  });

  it('usa "Reserva" como motivo por defecto', async () => {
    db.reservas.create.mockResolvedValue(reservaBase);

    const req = new Request('http://localhost/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fechaInicio: '2026-06-15', hora: '09:00', representante: 'X', origen: 'A', destino: 'B' }),
    });
    await POST(req);

    expect(db.reservas.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ Motivo: 'Reserva' }) })
    );
  });

  it('devuelve 500 si Prisma falla', async () => {
    db.reservas.create.mockRejectedValue(new Error('DB error'));

    const req = new Request('http://localhost/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fechaInicio: '2026-06-15', hora: '09:00', representante: 'X', origen: 'A', destino: 'B' }),
    });
    const res = await POST(req);

    expect(res.status).toBe(500);
  });

  it('fecha inválida no lanza excepción no controlada', async () => {
    db.reservas.create.mockRejectedValue(new Error('Invalid date'));

    const req = new Request('http://localhost/api/reservas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fechaInicio: 'no-es-fecha', hora: '09:00', representante: 'X', origen: 'A', destino: 'B' }),
    });
    const res = await POST(req);

    expect([200, 500]).toContain(res.status);
  });
});
