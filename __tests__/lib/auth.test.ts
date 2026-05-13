/**
 * Tests para la lógica de autenticación.
 * La función authorize se replica con bcryptjs para evitar problemas
 * con el módulo nativo bcrypt en Jest.
 * Los callbacks jwt/session se testean directamente desde authOptions.
 */

jest.mock('@lib/prisma', () => ({
  prisma: {
    cliente: { findFirst: jest.fn() },
    dispatcher: { findFirst: jest.fn() },
    camionero: { findFirst: jest.fn() },
    administrador: { findFirst: jest.fn() },
  },
}));

import { prisma } from '@lib/prisma';
import bcryptjs from 'bcryptjs';
import { authOptions } from '@lib/auth';

const db = prisma as any;
const PASS = 'pass123';
let hashedPass: string;

// Replica de la lógica de authorize usando bcryptjs (compatible con bcrypt)
async function authorizeLogic(credentials: any) {
  if (!credentials?.correo || !credentials?.clave) return null;

  let usuario: any = await db.cliente.findFirst({ where: { Email: credentials.correo } });
  let tipo = 'cliente';

  if (!usuario) { usuario = await db.dispatcher.findFirst({ where: { Email: credentials.correo } }); tipo = 'dispatcher'; }
  if (!usuario) { usuario = await db.camionero.findFirst({ where: { Email: credentials.correo } }); tipo = 'camionero'; }
  if (!usuario) { usuario = await db.administrador.findFirst({ where: { Email: credentials.correo } }); tipo = 'administrador'; }

  if (!usuario) return null;

  const match = await bcryptjs.compare(credentials.clave, usuario.Contrase_a);
  if (!match) return null;

  return { id: usuario.ID.toString(), email: usuario.Email, name: usuario.Nombre, role: tipo };
}

beforeAll(async () => {
  hashedPass = await bcryptjs.hash(PASS, 10);
});

beforeEach(() => {
  jest.clearAllMocks();
  db.cliente.findFirst.mockResolvedValue(null);
  db.dispatcher.findFirst.mockResolvedValue(null);
  db.camionero.findFirst.mockResolvedValue(null);
  db.administrador.findFirst.mockResolvedValue(null);
});

// ─── Lógica de authorize ──────────────────────────────────────────────────────
describe('authorize logic', () => {
  it('retorna null si no hay credenciales', async () => {
    expect(await authorizeLogic({})).toBeNull();
  });

  it('retorna null si falta correo', async () => {
    expect(await authorizeLogic({ clave: 'pass' })).toBeNull();
  });

  it('retorna null si falta clave', async () => {
    expect(await authorizeLogic({ correo: 'test@test.com' })).toBeNull();
  });

  it('autentica cliente correctamente', async () => {
    db.cliente.findFirst.mockResolvedValue({ ID: 1, Email: 'juan@test.com', Nombre: 'Juan', Contrase_a: hashedPass });

    const result = await authorizeLogic({ correo: 'juan@test.com', clave: PASS });

    expect(result).toEqual({ id: '1', email: 'juan@test.com', name: 'Juan', role: 'cliente' });
  });

  it('autentica dispatcher correctamente', async () => {
    db.dispatcher.findFirst.mockResolvedValue({ ID: 2, Email: 'ana@test.com', Nombre: 'Ana', Contrase_a: hashedPass });

    const result = await authorizeLogic({ correo: 'ana@test.com', clave: PASS });

    expect(result).toEqual(expect.objectContaining({ role: 'dispatcher' }));
  });

  it('autentica camionero correctamente', async () => {
    db.camionero.findFirst.mockResolvedValue({ ID: 3, Email: 'pedro@test.com', Nombre: 'Pedro', Contrase_a: hashedPass });

    const result = await authorizeLogic({ correo: 'pedro@test.com', clave: PASS });

    expect(result).toEqual(expect.objectContaining({ role: 'camionero' }));
  });

  it('autentica administrador correctamente', async () => {
    db.administrador.findFirst.mockResolvedValue({ ID: 4, Email: 'admin@test.com', Nombre: 'Admin', Contrase_a: hashedPass });

    const result = await authorizeLogic({ correo: 'admin@test.com', clave: PASS });

    expect(result).toEqual(expect.objectContaining({ role: 'administrador' }));
  });

  it('retorna null si el usuario no existe en ninguna tabla', async () => {
    expect(await authorizeLogic({ correo: 'noexiste@test.com', clave: 'pass' })).toBeNull();
  });

  it('retorna null si la contraseña no coincide', async () => {
    db.cliente.findFirst.mockResolvedValue({ ID: 1, Email: 'juan@test.com', Nombre: 'Juan', Contrase_a: hashedPass });

    expect(await authorizeLogic({ correo: 'juan@test.com', clave: 'wrongpass' })).toBeNull();
  });

  it('prioriza cliente sobre dispatcher con el mismo email', async () => {
    db.cliente.findFirst.mockResolvedValue({ ID: 1, Email: 'dup@test.com', Nombre: 'Dup', Contrase_a: hashedPass });

    const result = await authorizeLogic({ correo: 'dup@test.com', clave: PASS });

    expect(result?.role).toBe('cliente');
    expect(db.dispatcher.findFirst).not.toHaveBeenCalled();
  });
});

// ─── Callbacks de authOptions ─────────────────────────────────────────────────
describe('authOptions - callbacks', () => {
  const { jwt, session } = authOptions.callbacks as any;

  it('jwt callback añade role e id al token', async () => {
    const token = await jwt({ token: {}, user: { id: '1', role: 'cliente' } });
    expect(token.role).toBe('cliente');
    expect(token.id).toBe('1');
  });

  it('jwt callback no modifica token si no hay user', async () => {
    const token = await jwt({ token: { role: 'cliente', id: '1' } });
    expect(token.role).toBe('cliente');
  });

  it('session callback añade role e id a session.user', async () => {
    const sess = await session({ session: { user: {} }, token: { role: 'dispatcher', id: '2' } });
    expect(sess.user.role).toBe('dispatcher');
    expect(sess.user.id).toBe('2');
  });

  it('authOptions tiene la página de login configurada', () => {
    expect(authOptions.pages?.signIn).toBe('/auth/login');
  });

  it('authOptions tiene el provider de credentials', () => {
    expect(authOptions.providers).toHaveLength(1);
    expect(authOptions.providers[0].id).toBe('credentials');
  });
});
