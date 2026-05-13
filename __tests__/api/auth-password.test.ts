jest.mock('@lib/prisma', () => ({
  prisma: {
    cliente: { findFirst: jest.fn(), update: jest.fn() },
    dispatcher: { findFirst: jest.fn(), update: jest.fn() },
    administrador: { findFirst: jest.fn(), update: jest.fn() },
  },
}));

jest.mock('@lib/emails', () => ({
  enviarCorreoRecuperacion: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('new_hashed_password'),
}));

jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => ({ toString: () => 'fake-token-abc123' })),
}));

import { POST as forgotPassword } from '@/app/api/auth/forgot-password/route';
import { POST as resetPassword } from '@/app/api/auth/reset-password/route';
import { prisma } from '@lib/prisma';

const db = prisma as jest.Mocked<typeof prisma>;

beforeEach(() => {
  jest.clearAllMocks();
  (db.cliente.findFirst as jest.Mock).mockResolvedValue(null);
  (db.dispatcher.findFirst as jest.Mock).mockResolvedValue(null);
  (db.administrador.findFirst as jest.Mock).mockResolvedValue(null);
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/auth/forgot-password', () => {
  function makeReq(correo: string) {
    return new Request('http://localhost/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo }),
    });
  }

  it('envía correo a cliente existente', async () => {
    (db.cliente.findFirst as jest.Mock).mockResolvedValue({ ID: 1, Nombre: 'Juan', Email: 'juan@test.com' });
    (db.cliente.update as jest.Mock).mockResolvedValue({});

    const res = await forgotPassword(makeReq('juan@test.com'));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe('Correo enviado exitosamente');
    expect(db.cliente.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ resetToken: 'fake-token-abc123' }) })
    );
  });

  it('envía correo a dispatcher existente', async () => {
    (db.dispatcher.findFirst as jest.Mock).mockResolvedValue({ ID: 2, Nombre: 'Ana', Email: 'ana@test.com' });
    (db.dispatcher.update as jest.Mock).mockResolvedValue({});

    const res = await forgotPassword(makeReq('ana@test.com'));

    expect(res.status).toBe(200);
    expect(db.dispatcher.update).toHaveBeenCalled();
  });

  it('envía correo a administrador existente', async () => {
    (db.administrador.findFirst as jest.Mock).mockResolvedValue({ ID: 3, Nombre: 'Admin', Email: 'admin@test.com' });
    (db.administrador.update as jest.Mock).mockResolvedValue({});

    const res = await forgotPassword(makeReq('admin@test.com'));

    expect(res.status).toBe(200);
    expect(db.administrador.update).toHaveBeenCalled();
  });

  it('devuelve 404 si el correo no existe en ninguna tabla', async () => {
    const res = await forgotPassword(makeReq('noexiste@test.com'));
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toBe('No existe una cuenta con ese correo');
  });

  it('devuelve 500 si Prisma falla', async () => {
    (db.cliente.findFirst as jest.Mock).mockRejectedValue(new Error('DB error'));

    const res = await forgotPassword(makeReq('juan@test.com'));

    expect(res.status).toBe(500);
  });

  it('prioriza cliente sobre dispatcher si ambos tienen el mismo email', async () => {
    (db.cliente.findFirst as jest.Mock).mockResolvedValue({ ID: 1, Nombre: 'Juan', Email: 'dup@test.com' });
    (db.cliente.update as jest.Mock).mockResolvedValue({});

    const res = await forgotPassword(makeReq('dup@test.com'));

    expect(res.status).toBe(200);
    expect(db.dispatcher.update).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('POST /api/auth/reset-password', () => {
  function makeReq(token: string, clave: string) {
    return new Request('http://localhost/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, clave }),
    });
  }

  it('restablece contraseña de cliente con token válido', async () => {
    (db.cliente.findFirst as jest.Mock).mockResolvedValue({ ID: 1 });
    (db.cliente.update as jest.Mock).mockResolvedValue({});

    const res = await resetPassword(makeReq('valid-token', 'NuevaPass123!'));
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe('Contraseña restablecida exitosamente');
    expect(db.cliente.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ Contrase_a: 'new_hashed_password', resetToken: null }),
      })
    );
  });

  it('restablece contraseña de dispatcher con token válido', async () => {
    (db.dispatcher.findFirst as jest.Mock).mockResolvedValue({ ID: 2 });
    (db.dispatcher.update as jest.Mock).mockResolvedValue({});

    const res = await resetPassword(makeReq('valid-token', 'NuevaPass123!'));

    expect(res.status).toBe(200);
    expect(db.dispatcher.update).toHaveBeenCalled();
  });

  it('devuelve 400 si el token no existe o está expirado', async () => {
    const res = await resetPassword(makeReq('expired-token', 'NuevaPass123!'));
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe('Token inválido o expirado');
  });

  it('limpia resetToken y resetTokenExpiry tras restablecer', async () => {
    (db.cliente.findFirst as jest.Mock).mockResolvedValue({ ID: 1 });
    (db.cliente.update as jest.Mock).mockResolvedValue({});

    await resetPassword(makeReq('valid-token', 'NuevaPass123!'));

    expect(db.cliente.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ resetToken: null, resetTokenExpiry: null }),
      })
    );
  });

  it('devuelve 500 si Prisma falla', async () => {
    (db.cliente.findFirst as jest.Mock).mockRejectedValue(new Error('DB error'));

    const res = await resetPassword(makeReq('token', 'pass'));

    expect(res.status).toBe(500);
  });
});
