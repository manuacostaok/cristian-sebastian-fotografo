# Christian Sebastián — Plataforma de Fotógrafo

Plataforma web para Christian Sebastián: portfolio editorial, disponibilidad,
consulta de fecha, wizard de presupuesto, y panel administrativo (CRM, leads,
clientes, eventos, contenido). Ver arquitectura completa en
[`prisma/schema.prisma`](./prisma/schema.prisma).

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · Prisma + PostgreSQL ·
Auth.js (NextAuth v5) · Cloudinary · Motion.

## Setup

1. **Instalar dependencias**

   ```bash
   npm install
   ```

2. **Variables de entorno** — copiá `.env.example` a `.env` y completá:
   - `DATABASE_URL`: connection string de Postgres (Neon, Supabase, Railway o local).
   - `AUTH_SECRET`: generar con `npx auth secret`.
   - `CLOUDINARY_*` / `NEXT_PUBLIC_CLOUDINARY_*`: credenciales de tu cuenta Cloudinary.
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: número real (código de país + número, sin `+`).

3. **Base de datos**

   ```bash
   npx prisma migrate dev --name init
   npm run db:seed
   ```

   El seed crea categorías, servicios/extras de ejemplo, y un usuario admin.
   Las credenciales se imprimen en consola (`SEED_ADMIN_EMAIL` /
   `SEED_ADMIN_PASSWORD` para elegirlas vos mismo) — **cambiá la contraseña
   después del primer login**.

4. **Levantar el proyecto**

   ```bash
   npm run dev
   ```

   Sitio público en `/`, panel administrativo en `/admin`.

## Notas de arquitectura

- `lib/data/*` son las funciones que leen contenido: intentan Prisma primero
  y caen a contenido curado (`lib/data/content.ts`) si la base todavía no
  está conectada o está vacía — así el sitio nunca se ve roto antes del
  lanzamiento.
- `components/ui/PhotoFrame.tsx` decide entre una foto real (Cloudinary) o
  un placeholder de marca (gradiente) — todo el sitio pasa por acá, así que
  subir fotos reales desde `/admin/portfolio/fotos` alcanza para reemplazar
  los placeholders sin tocar código.
- El calendario público (`/disponibilidad`) nunca expone el cliente o
  nombre real de un evento — solo el estado (disponible/consultar/ocupado).
