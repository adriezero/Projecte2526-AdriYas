import { POST } from '@/app/api/auth/register/route';

// Mock de dependencias externas
jest.mock('@lib/prisma', () => ({
  prisma: {
    cliente: { findFirst: jest.fn(), create: jest.fn() },
    camionero: { findFirst: jest.fn(), create: jest.fn() },
    dispatcher: { findFirst: jest.fn(), create: jest.fn() },
    administrador: { findFirst: jest.fn(), create: jest.fn() },
    turnos: { findFirst: jest.fn() },
  },
}));

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: jest.fn().mockResolvedValue({ id: 'email-id' }) },
  })),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed_password'),
}));

jest.mock('@lib/email-templates', () => ({
  templateBienvenida: jest.fn().mockReturnValue('<html>Bienvenido</html>'),
}));

import { prisma } from '@lib/prisma';

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

function makeRequest(body: object) {
  return new Request('http://localhost/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  // Por defecto: email no existe en ninguna tabla
  (mockPrisma.cliente.findFirst as jest.Mock).mockResolvedValue(null);
  (mockPrisma.camionero.findFirst as jest.Mock).mockResolvedValue(null);
  (mockPrisma.dispatcher.findFirst as jest.Mock).mockResolvedValue(null);
  (mockPrisma.administrador.findFirst as jest.Mock).mockResolvedValue(null);
});

describe('POST /api/auth/register', () => {
  // ── Happy paths ──────────────────────────────────────────────────────────
  describe('Happy path', () => {
    it('registra un Cliente correctamente', async () => {
      (mockPrisma.cliente.create as jest.Mock).mockResolvedValue({ ID: 1 });

      const res = await POST(makeRequest({ username: 'Juan', email: 'juan@test.com', password: 'Pass123!', rol: 'Cliente' }));
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.message).toBe('Usuario registrado exitosamente');
      expect(mockPrisma.cliente.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ Email: 'juan@test.com' }) })
      );
    });

    it('registra un Dispatcher correctamente', async () => {
      (mockPrisma.dispatcher.create as jest.Mock).mockResolvedValue({ ID: 2 });

      const res = await POST(makeRequest({ username: 'Ana', email: 'ana@test.com', password: 'Pass123!', rol: 'Dispatcher' }));

      expect(res.status).toBe(201);
      expect(mockPrisma.dispatcher.create).toHaveBeenCalled();
    });

    it('registra un Camionero con turno disponible', async () => {
      (mockPrisma.turnos.findFirst as jest.Mock).mockResolvedValue({ ID: 1, Descripci_n: 'Mañana' });
      (mockPrisma.camionero.create as jest.Mock).mockResolvedValue({ ID: 3 });

      const res = await POST(makeRequest({ username: 'Pedro', email: 'pedro@test.com', password: 'Pass123!', rol: 'Camionero' }));

      expect(res.status).toBe(201);
      expect(mockPrisma.camionero.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ idTurno: 1 }) })
      );
    });

    it('registra un Administrador correctamente', async () => {
      (mockPrisma.administrador.create as jest.Mock).mockResolvedValue({ ID: 4 });

      const res = await POST(makeRequest({ username: 'Admin', email: 'admin@test.com', password: 'Pass123!', rol: 'Administrador' }));

      expect(res.status).toBe(201);
    });
  });

  // ── Errores esperados ────────────────────────────────────────────────────
  describe('Errores esperados', () => {
    it('rechaza rol inválido', async () => {
      const res = await POST(makeRequest({ username: 'X', email: 'x@test.com', password: '123', rol: 'Hacker' }));
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe('Rol no válido');
    });

    it('rechaza email ya registrado como cliente', async () => {
      (mockPrisma.cliente.findFirst as jest.Mock).mockResolvedValue({ ID: 1, Email: 'dup@test.com' });

      const res = await POST(makeRequest({ username: 'Dup', email: 'dup@test.com', password: '123', rol: 'Cliente' }));
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe('El correo ya está registrado');
    });

    it('rechaza email ya registrado como camionero', async () => {
      (mockPrisma.camionero.findFirst as jest.Mock).mockResolvedValue({ ID: 2, Email: 'dup@test.com' });

      const res = await POST(makeRequest({ username: 'Dup', email: 'dup@test.com', password: '123', rol: 'Cliente' }));

      expect(res.status).toBe(400);
    });

    it('devuelve 400 si no hay turnos para Camionero', async () => {
      (mockPrisma.turnos.findFirst as jest.Mock).mockResolvedValue(null);

      const res = await POST(makeRequest({ username: 'P', email: 'p@test.com', password: '123', rol: 'Camionero' }));
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toBe('No hay turnos disponibles');
    });

    it('devuelve 500 si Prisma lanza excepción', async () => {
      (mockPrisma.cliente.create as jest.Mock).mockRejectedValue(new Error('DB error'));

      const res = await POST(makeRequest({ username: 'E', email: 'e@test.com', password: '123', rol: 'Cliente' }));

      expect(res.status).toBe(500);
    });
  });

  // ── Edge cases ───────────────────────────────────────────────────────────
  describe('Edge cases', () => {
    it('rol con capitalización incorrecta es rechazado', async () => {
      const res = await POST(makeRequest({ username: 'X', email: 'x@test.com', password: '123', rol: 'cliente' }));
      expect(res.status).toBe(400);
    });

    it('email vacío no bloquea la búsqueda de duplicados', async () => {
      (mockPrisma.cliente.create as jest.Mock).mockResolvedValue({ ID: 1 });

      const res = await POST(makeRequest({ username: 'X', email: '', password: '123', rol: 'Cliente' }));
      // No debe lanzar excepción no controlada
      expect([201, 400, 500]).toContain(res.status);
    });

    it('contraseña muy larga es hasheada sin error', async () => {
      (mockPrisma.cliente.create as jest.Mock).mockResolvedValue({ ID: 1 });
      const longPass = 'a'.repeat(1000);

      const res = await POST(makeRequest({ username: 'X', email: 'x@test.com', password: longPass, rol: 'Cliente' }));
      expect(res.status).toBe(201);
    });
  });
});
