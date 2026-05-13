jest.mock('@lib/prisma', () => ({
  prisma: {
    tarea: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { GET, POST } from '@/app/api/tareas/route';
import { PATCH, DELETE } from '@/app/api/tareas/[id]/route';
import { prisma } from '@lib/prisma';

const db = prisma as jest.Mocked<typeof prisma>;

const tareaBase = {
  id: 1, titulo: 'Revisar ruta', descripcion: 'Descripción',
  estado: 'Pendiente', prioridad: 'Alta', asignadoA: 2,
  creadoPor: 1, createdAt: new Date(), updatedAt: new Date(),
};

beforeEach(() => jest.clearAllMocks());

describe('GET /api/tareas', () => {
  it('devuelve lista de tareas ordenadas por id desc', async () => {
    (db.tarea.findMany as jest.Mock).mockResolvedValue([tareaBase]);

    const res = await GET();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(db.tarea.findMany).toHaveBeenCalledWith({ orderBy: { id: 'desc' } });
  });

  it('devuelve array vacío si no hay tareas', async () => {
    (db.tarea.findMany as jest.Mock).mockResolvedValue([]);

    const res = await GET();
    const data = await res.json();

    expect(data).toEqual([]);
  });
});

describe('POST /api/tareas', () => {
  it('crea tarea con campo titulo', async () => {
    (db.tarea.create as jest.Mock).mockResolvedValue(tareaBase);

    const req = new Request('http://localhost/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Revisar ruta', prioridad: 'Alta', asignadoA: 2 }),
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.titulo).toBe('Revisar ruta');
  });

  it('acepta campo "nombre" como alias de titulo', async () => {
    (db.tarea.create as jest.Mock).mockResolvedValue({ ...tareaBase, titulo: 'Tarea por nombre' });

    const req = new Request('http://localhost/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: 'Tarea por nombre' }),
    });
    await POST(req);

    expect(db.tarea.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ titulo: 'Tarea por nombre' }) })
    );
  });

  it('acepta campo "usuario" como alias de asignadoA', async () => {
    (db.tarea.create as jest.Mock).mockResolvedValue(tareaBase);

    const req = new Request('http://localhost/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'T', usuario: 3 }),
    });
    await POST(req);

    expect(db.tarea.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ asignadoA: 3 }) })
    );
  });

  it('usa estado "Pendiente" por defecto', async () => {
    (db.tarea.create as jest.Mock).mockResolvedValue(tareaBase);

    const req = new Request('http://localhost/api/tareas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'T' }),
    });
    await POST(req);

    expect(db.tarea.create).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ estado: 'Pendiente' }) })
    );
  });
});

describe('PATCH /api/tareas/[id]', () => {
  const params = Promise.resolve({ id: '1' });

  it('actualiza estado de tarea', async () => {
    (db.tarea.update as jest.Mock).mockResolvedValue({ ...tareaBase, estado: 'Completada' });

    const req = new Request('http://localhost', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: 'Completada' }),
    });
    const res = await PATCH(req, { params });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.estado).toBe('Completada');
    expect(db.tarea.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { estado: 'Completada' } });
  });

  it('actualiza múltiples campos a la vez', async () => {
    (db.tarea.update as jest.Mock).mockResolvedValue({ ...tareaBase, titulo: 'Nuevo', prioridad: 'Baja' });

    const req = new Request('http://localhost', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo: 'Nuevo', prioridad: 'Baja' }),
    });
    const res = await PATCH(req, { params });

    expect(res.status).toBe(200);
  });
});

describe('DELETE /api/tareas/[id]', () => {
  const params = Promise.resolve({ id: '1' });

  it('elimina tarea existente', async () => {
    (db.tarea.delete as jest.Mock).mockResolvedValue({});

    const req = new Request('http://localhost', { method: 'DELETE' });
    const res = await DELETE(req, { params });
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(db.tarea.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });
});
