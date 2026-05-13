import { ROLES_SISTEMA, ROLE_ROUTES, ROLES_NOMBRES, ROLES_FILTRO } from '@lib/roles';

describe('roles.ts', () => {
  describe('ROLES_SISTEMA', () => {
    it('contiene exactamente 4 roles', () => {
      expect(ROLES_SISTEMA).toHaveLength(4);
    });

    it('contiene los roles esperados', () => {
      const nombres = ROLES_SISTEMA.map(r => r.Nombre);
      expect(nombres).toContain('Cliente');
      expect(nombres).toContain('Camionero');
      expect(nombres).toContain('Dispatcher');
      expect(nombres).toContain('Administrador');
    });

    it('cada rol tiene ID único', () => {
      const ids = ROLES_SISTEMA.map(r => r.ID);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('ROLE_ROUTES', () => {
    it('mapea administrador a /admin/gestionUsers', () => {
      expect(ROLE_ROUTES['administrador']).toBe('/admin/gestionUsers');
    });

    it('mapea dispatcher a /dispatcher/tareas', () => {
      expect(ROLE_ROUTES['dispatcher']).toBe('/dispatcher/tareas');
    });

    it('mapea camionero a /camionero/horario', () => {
      expect(ROLE_ROUTES['camionero']).toBe('/camionero/horario');
    });

    it('mapea cliente a /home', () => {
      expect(ROLE_ROUTES['cliente']).toBe('/home');
    });

    it('devuelve undefined para rol inexistente', () => {
      expect(ROLE_ROUTES['hacker']).toBeUndefined();
    });
  });

  describe('ROLES_NOMBRES', () => {
    it('es un array de strings', () => {
      expect(Array.isArray(ROLES_NOMBRES)).toBe(true);
      ROLES_NOMBRES.forEach(n => expect(typeof n).toBe('string'));
    });

    it('incluye todos los nombres de ROLES_SISTEMA', () => {
      ROLES_SISTEMA.forEach(r => expect(ROLES_NOMBRES).toContain(r.Nombre));
    });
  });

  describe('ROLES_FILTRO', () => {
    it('incluye "Todos" como primera opción', () => {
      expect(ROLES_FILTRO[0]).toBe('Todos');
    });

    it('incluye todos los roles en minúsculas', () => {
      expect(ROLES_FILTRO).toContain('administrador');
      expect(ROLES_FILTRO).toContain('cliente');
      expect(ROLES_FILTRO).toContain('camionero');
      expect(ROLES_FILTRO).toContain('dispatcher');
    });
  });
});

// ─── Middleware logic (unit) ──────────────────────────────────────────────────
describe('Middleware - lógica de redirección', () => {
  // Testea la lógica pura sin montar el middleware completo
  const roleRoutes: Record<string, string> = {
    administrador: '/admin',
    dispatcher: '/dispatcher',
    camionero: '/camionero',
    cliente: '/cliente',
  };

  function getRedirectForRole(pathname: string, userRole: string | undefined, hasToken: boolean) {
    for (const [role, prefix] of Object.entries(roleRoutes)) {
      if (pathname.startsWith(prefix)) {
        if (!hasToken) return '/auth/login';
        if (userRole !== role) return ROLE_ROUTES[userRole!] || '/home';
      }
    }
    return null; // sin redirección
  }

  it('redirige a login si no hay token en ruta protegida', () => {
    expect(getRedirectForRole('/admin/gestionUsers', undefined, false)).toBe('/auth/login');
  });

  it('redirige a su ruta si el rol no coincide', () => {
    expect(getRedirectForRole('/admin/gestionUsers', 'cliente', true)).toBe('/home');
  });

  it('no redirige si el rol coincide con la ruta', () => {
    expect(getRedirectForRole('/admin/gestionUsers', 'administrador', true)).toBeNull();
  });

  it('no redirige en rutas públicas', () => {
    expect(getRedirectForRole('/home', undefined, false)).toBeNull();
    expect(getRedirectForRole('/contacto', undefined, false)).toBeNull();
  });

  it('dispatcher sin token en /dispatcher redirige a login', () => {
    expect(getRedirectForRole('/dispatcher/tareas', undefined, false)).toBe('/auth/login');
  });

  it('camionero accediendo a /dispatcher redirige a su ruta', () => {
    expect(getRedirectForRole('/dispatcher/tareas', 'camionero', true)).toBe('/camionero/horario');
  });
});
