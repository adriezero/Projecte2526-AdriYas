# TruckWave

TruckWave es una plataforma de gestión logística para el transporte de mercancías que conecta clientes, camioneros, dispatchers y administradores en un sistema integrado. Ofrece seguimiento de rutas en tiempo real, gestión de reservas, manejo de documentos y control de acceso multi-rol.

## Tech Stack

- **Framework**: Next.js 15.3.5 (App Router)
- **Runtime**: React 19.0.0
- **Lenguaje**: TypeScript 5
- **Base de datos**: PostgreSQL (via Neon)
- **ORM**: Prisma 5.22.0
- **Autenticación**: NextAuth.js 4.24.13
- **Estilos**: Tailwind CSS 4.1.18
- **Componentes UI**: Headless UI 2.2.9, Heroicons 2.2.0, Lucide React 1.8.0
- **Formularios**: React Hook Form 7.71.1
- **Email**: Resend 6.9.2
- **Almacenamiento de archivos**: Vercel Blob 2.4.0
- **Generación de PDF**: jsPDF 4.2.1 + jsPDF AutoTable 5.0.7
- **Internacionalización**: next-intl 4.11.0
- **Testing**: Jest 30.4.2, React Testing Library 16.3.2

## Requisitos previos

- Node.js 20+
- Base de datos PostgreSQL (o cuenta en Neon)
- npm/yarn/pnpm/bun
- API key de Resend (para emails)
- Token de Vercel Blob (para subida de archivos)

## Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd truckwave
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno (ver sección más abajo)

4. Genera el cliente de Prisma y ejecuta las migraciones:
```bash
npx prisma generate
npx prisma migrate deploy
```

5. Arranca el servidor de desarrollo:
```bash
npm run dev
```

6. Abre [http://localhost:3000](http://localhost:3000)

## Variables de entorno

Hay dos opciones para configurar las variables de entorno:

1. En la terminal con la cuenta de vercel ya conectada (```npx vercel link```):
- Entorno de producción:
```bash 
npx vercel env pull .env --environment=production
```
- Entorno de desarrollo:
```bash
npx vercel env pull .env.local --environment=development
```

2. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos
DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
DATABASE_URL_UNPOOLED="postgresql://user:password@host:port/database?sslmode=require"

# Parámetros de conexión PostgreSQL (opcional, para Vercel Postgres)
PGHOST="your-postgres-host"
PGHOST_UNPOOLED="your-postgres-host-unpooled"
PGUSER="your-postgres-user"
PGDATABASE="your-database-name"
PGPASSWORD="your-postgres-password"
POSTGRES_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."
POSTGRES_PRISMA_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Servicio de email (Resend)
RESEND_API_KEY="your-resend-api-key"

# Almacenamiento de archivos (Vercel Blob)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
BLOB_WEBHOOK_PUBLIC_KEY="your-blob-webhook-public-key"
BLOB_STORE_ID="your-blob-store-id"
```

**Descripción de variables:**
- `DATABASE_URL`: Cadena de conexión PostgreSQL principal (con pooling)
- `DATABASE_URL_UNPOOLED`: Conexión directa sin pooling
- `NEXTAUTH_URL`: URL base de la aplicación
- `NEXTAUTH_SECRET`: Clave secreta para cifrado de sesiones (genera una con `openssl rand -base64 32`)
- `RESEND_API_KEY`: API key de Resend para emails transaccionales
- `BLOB_READ_WRITE_TOKEN`: Token de Vercel Blob para subida de archivos

## Estructura del proyecto

```
truckwave/
├── app/
│   ├── admin/              # Panel de administración (usuarios, reportes)
│   ├── camionero/          # Panel del camionero (rutas, horarios, documentos)
│   ├── dispatcher/         # Panel del dispatcher (tareas, reservas, documentación)
│   ├── home/               # Inicio y reservas del cliente
│   ├── auth/               # Páginas de autenticación (login, registro, recuperación)
│   ├── api/                # Rutas de API para todas las entidades y operaciones
│   ├── componentes/        # Componentes React reutilizables
│   ├── hooks/              # Hooks personalizados (auth, formularios)
│   ├── interfaces/         # Interfaces y tipos TypeScript
│   └── css/                # Estilos globales
├── prisma/
│   ├── schema.prisma       # Definición del esquema de base de datos
│   └── migrations/         # Archivos de migración
├── lib/
│   ├── auth.ts             # Configuración de NextAuth y redirección por rol
│   ├── prisma.ts           # Singleton del cliente Prisma
│   ├── roles.ts            # Utilidades de control de acceso por rol
│   ├── emails.ts           # Utilidades para envío de emails
│   └── email-templates/    # Plantillas de email (bienvenida, recuperación, contacto)
├── public/
│   ├── img/                # Imágenes estáticas
│   ├── video/              # Assets de vídeo
│   └── uploads/            # Archivos subidos por usuarios (documentos)
├── lang/                   # Archivos de internacionalización (en, es, ca)
├── types/                  # Definiciones de tipos TypeScript
├── __tests__/              # Suites de tests con Jest
├── __mocks__/              # Mocks para Next.js y NextAuth
└── middleware.ts           # Protección de rutas y redirecciones por rol
```

## Roles y acceso

La plataforma soporta cuatro roles de usuario con permisos diferenciados:

### Administrador (`administrador`)
- Gestión de usuarios (crear, editar, eliminar)
- Reportes y analíticas del sistema
- Moderación de comentarios
- Acceso completo al sistema
- **Ruta por defecto**: `/admin/gestionUsers`

### Dispatcher
- Gestión y asignación de tareas
- Gestión de reservas
- Gestión de documentos (subir, revisar, aprobar)
- Generación de reportes
- **Ruta por defecto**: `/dispatcher/tareas`

### Camionero (`camionero`)
- Ver rutas y horarios asignados
- Gestionar disponibilidad y turnos
- Subir documentos (licencias, permisos)
- Ver recordatorios y notificaciones
- **Ruta por defecto**: `/camionero/horario`

### Cliente (`cliente`)
- Enviar solicitudes de servicio y reservas
- Seguimiento de envíos en tiempo real
- Ver y descargar documentos
- Dejar reseñas y comentarios
- **Ruta por defecto**: `/home`

## Scripts disponibles

- `npm run dev` — Arranca el servidor de desarrollo (incluye generación de Prisma)
- `npm run build` — Compila el bundle de producción (incluye generación de Prisma)
- `npm start` — Arranca el servidor en producción
- `npm run lint` — Ejecuta ESLint
- `npm test` — Ejecuta la suite de tests con Jest
- `npm run test:watch` — Tests en modo watch
- `npm run test:coverage` — Genera reporte de cobertura

## Base de datos

### Ejecutar migraciones

Aplica las migraciones pendientes:
```bash
npx prisma migrate deploy
```

Crea una nueva migración tras cambios en el esquema:
```bash
npx prisma migrate dev --name nombre_migracion
```

### Esquema

Las entidades principales de la base de datos son:
- `administrador` — Administradores del sistema
- `dispatcher` — Dispatchers que gestionan operaciones
- `camionero` — Camioneros con licencias y turnos
- `cliente` — Clientes que solicitan servicios
- `rutas` — Rutas con seguimiento en tiempo real
- `solicitud_reserva` — Reservas que vinculan clientes, camioneros y reservas
- `Solicitud` — Solicitudes de servicio con seguimiento de estado
- `documentos` — Gestión de documentos con subida por rol
- `comentarios` — Reseñas y valoraciones de clientes
- `reportes` — Reportes e incidencias del sistema
- `tarea` — Tareas asignadas a dispatchers
- `turnos` — Horarios de turnos de los camioneros

## Flujo de autenticación

1. Los usuarios se registran en `/auth/register` con campos según su rol
2. Las contraseñas se hashean con bcrypt antes de guardarse
3. El login en `/auth/login` autentica contra todas las tablas de usuario
4. NextAuth crea una sesión JWT con el ID y rol del usuario
5. El middleware protege las rutas y redirige según el rol
6. Recuperación de contraseña disponible en `/auth/forgot-password` mediante tokens por email

## Despliegue

La aplicación está configurada para desplegarse en Vercel:

1. Sube el código a GitHub/GitLab
2. Conecta el repositorio en Vercel
3. Configura las variables de entorno en el dashboard de Vercel
4. El despliegue es automático en cada push a la rama main

Asegúrate de que `NEXTAUTH_URL` apunte a tu dominio de producción y de que `NEXTAUTH_SECRET` esté configurado de forma segura.
