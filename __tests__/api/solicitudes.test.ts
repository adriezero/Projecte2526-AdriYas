/**
 * Tests para /api/solicitudes y /api/solicitudes/[id]
 */

jest.mock('@generated/prisma', () => {
  const mockPrisma = {
    solicitud: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    cliente: { findFirst: jest.fn() },
    camionero: { findUnique: jest.fn() },
    reservas: { create: jest.fn() },
    solicitud_reserva: { create: jest.fn() },
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

import { GET, POST } from '@/app/api/solicitudes/route';
import { GET as GET_ID, PATCH, DELETE } from '@/app/api/solicitudes/[id]/route';
import { PrismaClient } from '@generated/prisma';

const db = new (PrismaClient as jest.MockedClass<typeof PrismaClient>)() as any;

const solicitudBase = {
  id: 1, cliente: 'Juan', tipo: 'Transporte', asunto: 'Envío urgente',
  descripcion: 'Descripción', fecha: new Date(), estado: 'Pendiente',
  createdAt: new Date(), idCliente: 1, idCamionero: null,
  fechaServicio: new Date('2026-06-01'), fechaFin: new Date('2026-06-02'),
  hora: '09:00', origen: 'Madrid', destino: 'Barcelona',
  representante: 'Juan', motivoRechazo: null,
};

function makeReq(body?: object, url = 'http://localhost/api/solicitudes') {
  return new Request(url, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
}

beforeEach(() => jest.clearAllMocks());

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/solicitudes', () => {
  it('devuelve lista de solicitudes mapeando estado', async () => {
    db.solicitud.findMany.mockResolvedValue([{ ...solicitudBase, estado: 'En_Proceso' }]);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data[0].estado).toBe('En Proceso');
  });

  it('devuelve array vacío si no hay solicitudes', async () => {
    db.solicitud.findMany.mockResolvedValue([]);

    const res = await GET();
    const data = await res.json();

    expect(data).toEqual([]);
  });

  it('devuelve 500 si Prisma falla', async () => {
    db.solicitud.findMany.mockRejectedValue(new Error('DB error'));

    const res = await GET();
    expect(res.status).toBe(500);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/solicitudes', () => {
  it('crea solicitud con cliente existente', async () => {
    db.cliente.findFirst.mockResolvedValue({ ID: 1 });
    db.solicitud.create.mockResolvedValue({ ...solicitudBase, estado: 'Pendiente' });

    const res = await POST(makeReq({ cliente: 'Juan', tipo: 'Transporte', asunto: 'Test' }));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.estado).toBe('Pendiente');
    expect(db.solicitud.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ idCliente: 1 }) })
    );
  });

  it('crea solicitud sin cliente registrado (idCliente null)', async () => {
    db.cliente.findFirst.mockResolvedValue(null);
    db.solicitud.create.mockResolvedValue({ ...solicitudBase, idCliente: null, estado: 'Pendiente' });

    const res = await POST(makeReq({ cliente: 'Desconocido', tipo: 'Transporte', asunto: 'Test' }));

    expect(res.status).toBe(200);
    expect(db.solicitud.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ idCliente: null }) })
    );
  });

  it('usa estado Pendiente por defecto', async () => {
    db.cliente.findFirst.mockResolvedValue(null);
    db.solicitud.create.mockResolvedValue({ ...solicitudBase, estado: 'Pendiente' });

    await POST(makeReq({ cliente: 'X', tipo: 'T', asunto: 'A' }));

    expect(db.solicitud.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ estado: 'Pendiente' }) })
    );
  });

  it('devuelve 500 si Prisma falla', async () => {
    db.cliente.findFirst.mockResolvedValue(null);
    db.solicitud.create.mockRejectedValue(new Error('DB error'));

    const res = await POST(makeReq({ cliente: 'X', tipo: 'T', asunto: 'A' }));
    expect(res.status).toBe(500);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('GET /api/solicitudes/[id]', () => {
  const params = Promise.resolve({ id: '1' });

  it('devuelve solicitud por ID', async () => {
    db.solicitud.findUnique.mockResolvedValue({ ...solicitudBase, estado: 'Aceptada' });

    const res = await GET_ID(makeReq(), { params });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.estado).toBe('Aceptada');
  });

  it('devuelve 404 si no existe', async () => {
    db.solicitud.findUnique.mockResolvedValue(null);

    const res = await GET_ID(makeReq(), { params });
    expect(res.status).toBe(404);
  });

  it('devuelve 500 si Prisma falla', async () => {
    db.solicitud.findUnique.mockRejectedValue(new Error('DB error'));

    const res = await GET_ID(makeReq(), { params });
    expect(res.status).toBe(500);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('PATCH /api/solicitudes/[id]', () => {
  const params = Promise.resolve({ id: '1' });

  it('acepta solicitud con camionero disponible y crea reservas', async () => {
    db.camionero.findUnique.mockResolvedValue({ ID: 5, Disponible: true });
    db.solicitud.findUnique.mockResolvedValue(solicitudBase);
    db.reservas.create.mockResolvedValue({ ID: 10 });
    db.solicitud_reserva.create.mockResolvedValue({});
    db.solicitud.update.mockResolvedValue({ ...solicitudBase, estado: 'Aceptada', idCamionero: 5, clienteRel: null, camioneroRel: null });

    const req = new Request('http://localhost', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'Aceptada', idCamionero: 5 }) });
    const res = await PATCH(req, { params });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.estado).toBe('Aceptada');
    expect(db.reservas.create).toHaveBeenCalled();
  });

  it('rechaza aceptar sin idCamionero', async () => {
    const req = new Request('http://localhost', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'Aceptada' }) });
    const res = await PATCH(req, { params });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('camionero');
  });

  it('rechaza aceptar con camionero no disponible', async () => {
    db.camionero.findUnique.mockResolvedValue({ ID: 5, Disponible: false });

    const req = new Request('http://localhost', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'Aceptada', idCamionero: 5 }) });
    const res = await PATCH(req, { params });

    expect(res.status).toBe(400);
  });

  it('rechaza solicitud con motivo', async () => {
    db.solicitud.update.mockResolvedValue({ ...solicitudBase, estado: 'Rechazada', motivoRechazo: 'Sin capacidad' });

    const req = new Request('http://localhost', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'Rechazada', motivoRechazo: 'Sin capacidad' }) });
    const res = await PATCH(req, { params });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.estado).toBe('Rechazada');
  });

  it('rechaza sin motivo usa "Sin especificar"', async () => {
    db.solicitud.update.mockResolvedValue({ ...solicitudBase, estado: 'Rechazada', motivoRechazo: 'Sin especificar' });

    const req = new Request('http://localhost', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'Rechazada' }) });
    await PATCH(req, { params });

    expect(db.solicitud.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ motivoRechazo: 'Sin especificar' }) })
    );
  });

  it('actualización normal de campos', async () => {
    db.solicitud.update.mockResolvedValue({ ...solicitudBase, asunto: 'Nuevo asunto', estado: 'Pendiente' });

    const req = new Request('http://localhost', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ asunto: 'Nuevo asunto' }) });
    const res = await PATCH(req, { params });

    expect(res.status).toBe(200);
  });

  it('devuelve 404 al aceptar si solicitud no existe', async () => {
    db.camionero.findUnique.mockResolvedValue({ ID: 5, Disponible: true });
    db.solicitud.findUnique.mockResolvedValue(null);

    const req = new Request('http://localhost', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ estado: 'Aceptada', idCamionero: 5 }) });
    const res = await PATCH(req, { params });

    expect(res.status).toBe(404);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('DELETE /api/solicitudes/[id]', () => {
  const params = Promise.resolve({ id: '1' });

  it('elimina solicitud existente', async () => {
    db.solicitud.delete.mockResolvedValue({});

    const req = new Request('http://localhost', { method: 'DELETE' });
    const res = await DELETE(req, { params });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
  });

  it('devuelve 500 si Prisma falla al eliminar', async () => {
    db.solicitud.delete.mockRejectedValue(new Error('Record not found'));

    const req = new Request('http://localhost', { method: 'DELETE' });
    const res = await DELETE(req, { params });

    expect(res.status).toBe(500);
  });
});
