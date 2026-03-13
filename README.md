# TruckWave

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Descripción

TruckWave es una plataforma de gestión logística para el transporte de mercancías que conecta clientes, camioneros, dispatchers y administradores en un sistema integral.

## Características

- **Gestión de usuarios**: Sistema multi-rol (Admin, Dispatcher, Camionero, Cliente)
- **Autenticación**: NextAuth con registro y login
- **Rutas y seguimiento**: Gestión de rutas en tiempo real
- **Reservas**: Sistema de solicitudes y reservas
- **Documentación**: Gestión de documentos y reportes
- **Comentarios y reseñas**: Sistema de feedback de clientes
- **Horarios y turnos**: Gestión de disponibilidad de camioneros

## Tecnologías

- **Framework**: Next.js 15 (App Router)
- **Base de datos**: PostgreSQL con Prisma ORM
- **Autenticación**: NextAuth.js
- **Estilos**: Tailwind CSS
- **UI Components**: Headless UI, Heroicons
- **Formularios**: React Hook Form
- **Email**: Resend
- **Lenguaje**: TypeScript

## Requisitos previos

- Node.js 20+
- PostgreSQL
- npm/yarn/pnpm/bun

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno en `.env`:
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

4. Ejecutar migraciones de Prisma:
```bash
npx prisma migrate dev
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Estructura del proyecto

```
truckwave/
├── app/
│   ├── admin/          # Panel de administración
│   ├── camionero/      # Panel de camioneros
│   ├── dispatcher/     # Panel de dispatchers
│   ├── auth/           # Autenticación
│   ├── api/            # API Routes
│   └── componentes/    # Componentes reutilizables
├── prisma/
│   └── schema.prisma   # Esquema de base de datos
├── lib/                # Utilidades y configuración
└── public/             # Archivos estáticos
```

## Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
