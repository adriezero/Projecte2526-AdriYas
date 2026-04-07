export const ROLES_SISTEMA = [
  { ID: 1, Nombre: 'Cliente' },
  { ID: 2, Nombre: 'Camionero' },
  { ID: 3, Nombre: 'Dispatcher' },
  { ID: 4, Nombre: 'Administrador' },
] as const;

export type RolNombre = typeof ROLES_SISTEMA[number]['Nombre'];

// Mapeo de roles a rutas
export const ROLE_ROUTES: Record<string, string> = {
  administrador: '/admin/gestionUsers',
  dispatcher: '/dispatcher/tareas',
  camionero: '/camionero/horario',
  cliente: '/home'
};

// Nombres de roles en minúsculas para comparaciones
export const ROLES_NOMBRES = ROLES_SISTEMA.map(r => r.Nombre);
export const ROLES_FILTRO = ['Todos', 'administrador', 'cliente', 'camionero', 'dispatcher'] as const;
