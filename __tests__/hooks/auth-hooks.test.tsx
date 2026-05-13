import { renderHook, act } from '@testing-library/react';
import { useRegister } from '@/app/hooks/useRegister';
import { useAuth, useLoginForm } from '@/app/hooks/useLogin';

// Mocks configurados en __mocks__/
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => ({ get: () => null }),
}));

const mockSignIn = jest.fn();
jest.mock('next-auth/react', () => ({
  signIn: (...args: any[]) => mockSignIn(...args),
}));

// Mock de fetch global
global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  mockPush.mockClear();
});

// ─────────────────────────────────────────────────────────────────────────────
describe('useRegister', () => {
  it('estado inicial correcto', () => {
    const { result } = renderHook(() => useRegister());

    expect(result.current.username).toBe('');
    expect(result.current.email).toBe('');
    expect(result.current.password).toBe('');
    expect(result.current.error).toBe('');
    expect(result.current.mostrarClave).toBe(false);
  });

  it('actualiza campos correctamente', () => {
    const { result } = renderHook(() => useRegister());

    act(() => { result.current.setUsername('Juan'); });
    act(() => { result.current.setEmail('juan@test.com'); });
    act(() => { result.current.setRol('Cliente'); });

    expect(result.current.username).toBe('Juan');
    expect(result.current.email).toBe('juan@test.com');
    expect(result.current.rol).toBe('Cliente');
  });

  it('muestra error si las contraseñas no coinciden', async () => {
    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setPassword('Pass123!');
      result.current.setConfirmarContraseña('OtraPass!');
    });

    await act(async () => {
      await result.current.manejarEnvio({ preventDefault: jest.fn() } as any);
    });

    expect(result.current.error).toBe('Las contraseñas no coinciden.');
    expect(fetch).not.toHaveBeenCalled();
  });

  it('llama a la API y redirige si el registro es exitoso', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setUsername('Juan');
      result.current.setEmail('juan@test.com');
      result.current.setPassword('Pass123!');
      result.current.setConfirmarContraseña('Pass123!');
      result.current.setRol('Cliente');
    });

    await act(async () => {
      await result.current.manejarEnvio({ preventDefault: jest.fn() } as any);
    });

    expect(fetch).toHaveBeenCalledWith('/api/auth/register', expect.objectContaining({ method: 'POST' }));
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });

  it('muestra error si la API devuelve error', async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: false });

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setPassword('Pass123!');
      result.current.setConfirmarContraseña('Pass123!');
    });

    await act(async () => {
      await result.current.manejarEnvio({ preventDefault: jest.fn() } as any);
    });

    expect(result.current.error).toBe('Error al registrarse. Inténtelo de nuevo.');
  });

  it('muestra error de conexión si fetch lanza excepción', async () => {
    (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useRegister());

    act(() => {
      result.current.setPassword('Pass123!');
      result.current.setConfirmarContraseña('Pass123!');
    });

    await act(async () => {
      await result.current.manejarEnvio({ preventDefault: jest.fn() } as any);
    });

    expect(result.current.error).toBe('Error de conexión.');
  });

  it('toggle mostrarClave funciona', () => {
    const { result } = renderHook(() => useRegister());

    act(() => { result.current.setMostrarClave(true); });
    expect(result.current.mostrarClave).toBe(true);

    act(() => { result.current.setMostrarClave(false); });
    expect(result.current.mostrarClave).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('useLoginForm', () => {
  it('estado inicial correcto', () => {
    const { result } = renderHook(() => useLoginForm());

    expect(result.current.correo).toBe('');
    expect(result.current.clave).toBe('');
    expect(result.current.mostrarClave).toBe(false);
  });

  it('actualiza correo y clave', () => {
    const { result } = renderHook(() => useLoginForm());

    act(() => { result.current.setCorreo('test@test.com'); });
    act(() => { result.current.setClave('pass123'); });

    expect(result.current.correo).toBe('test@test.com');
    expect(result.current.clave).toBe('pass123');
  });
});

describe('useAuth', () => {
  it('muestra error si signIn devuelve error', async () => {
    mockSignIn.mockResolvedValue({ error: 'CredentialsSignin', ok: false });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('wrong@test.com', 'wrongpass');
    });

    expect(result.current.error).toBe('Correo o contraseña incorrectos.');
  });

  it('redirige según rol tras login exitoso', async () => {
    mockSignIn.mockResolvedValue({ error: null, ok: true });
    (fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ user: { role: 'dispatcher' } }),
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('ana@test.com', 'pass');
    });

    expect(mockPush).toHaveBeenCalledWith('/dispatcher/tareas');
  });

  it('redirige a /home si el rol no está mapeado', async () => {
    mockSignIn.mockResolvedValue({ error: null, ok: true });
    (fetch as jest.Mock).mockResolvedValue({
      json: jest.fn().mockResolvedValue({ user: { role: 'unknown' } }),
    });

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('x@test.com', 'pass');
    });

    expect(mockPush).toHaveBeenCalledWith('/home');
  });

  it('error inicial es string vacío', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.error).toBe('');
  });
});
