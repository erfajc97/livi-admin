# NönDecants — Admin Dashboard

Panel de administración para gestión de productos, usuarios, órdenes, finanzas y reportes. Construido con **TanStack Start** (SSR) + **TanStack Router** (file-based) + **HeroUI** + **Tailwind CSS v4**.

**Puerto**: `3000` (desarrollo)
**API Base**: `http://localhost:3030/api`

---

## 🚀 Features

- 🔐 **Auth Admin-only** — Login con email/password, JWT token
- 👥 **Gestión Usuarios** — CRUD usuarios, roles (ADMIN/CLIENT), búsqueda
- 📦 **CRUD Productos** — Crear, editar, eliminar productos con variantes
- 🏷️ **Categorías** — Gestión de categorías y subcategorías
- 📊 **Órdenes** — Listar, filtrar, cambiar estado, tracking Servientrega
- 💰 **Finanzas** — Reportes de ventas, ingresos, comisiones
- 📈 **Dashboard** — Estadísticas en tiempo real (ventas, usuarios activos)
- 🎨 **Dark Luxury UI** — HeroUI v2, tema customizado (negro + dorado)
- 📱 **Tablas Avanzadas** — CustomTableNextUi con sorting, filtering, pagination
- 🔄 **Modales & Formularios** — CustomModalNextUI, formularios validados
- 💾 **Estado Persistente** — Zustand + localStorage (localStorage estándar)

---

## 📦 Stack

| Capa | Tecnología |
|------|-----------|
| Meta-framework | **TanStack Start** (SSR/streaming) |
| Router | **TanStack Router** (file-based) |
| UI | **HeroUI v2** + **Tailwind CSS v4** |
| Estado global | **Zustand v5** |
| Data fetching | **TanStack Query v5** |
| HTTP | **Axios** (JWT interceptors) |
| Formularios | **React Hook Form** + **Zod** |
| Notificaciones | **HeroUI Toast** |
| Animaciones | **Framer Motion** |
| Lenguaje | **TypeScript** strict mode |

---

## 🎨 Tema

**Dark Luxury** — consistente con frontend

```
Primary:        #CCB377 (Dorado)
Foreground:     #1B1919 (Negro Carbón)
Surface:        #252222
Text:           #FFFFFF
Text Muted:     #A09A9A
```

Configurado en `src/hero.ts` (HeroUI plugin para Tailwind).

---

## 📐 Arquitectura & Carpetas

```text
src/
├── routes/
│   ├── __root.tsx                   # Root layout + HeroUIProvider + TanStackQueryProvider
│   ├── login.tsx                    # Ruta de login (pública)
│   ├── index.tsx                    # Dashboard home (protegido)
│   ├── _authenticated.tsx           # Guard: redirige a /login si no autenticado
│   └── _authenticated/
│       ├── usuarios.tsx             # CRUD usuarios
│       ├── productos.tsx            # CRUD productos
│       ├── categorias.tsx           # CRUD categorías
│       ├── ordenes.tsx              # Listado y gestión de órdenes
│       ├── finanzas.tsx             # Reportes de ventas
│       └── dashboard.tsx            # Estadísticas
├── app/
│   ├── api/
│   │   └── endpoints.ts             # API_ENDPOINTS centralizados
│   ├── config/
│   │   └── axiosConfig.ts           # Instancia axios + JWT interceptor
│   ├── features/                    # Screaming Architecture
│   │   ├── auth/
│   │   │   ├── components/          # LoginForm
│   │   │   ├── hooks/               # useLoginHook
│   │   │   ├── mutations/           # useLoginMutation
│   │   │   ├── services/            # authService.ts
│   │   │   ├── types.ts
│   │   │   └── Login.tsx            # Componente principal
│   │   ├── users/
│   │   │   ├── components/          # UsersTable, UserModal, UserForm
│   │   │   ├── hooks/               # useUsersHook, useUserForm
│   │   │   ├── mutations/           # useCreateUserMutation, etc.
│   │   │   ├── services/            # usersService.ts
│   │   │   ├── types.ts
│   │   │   └── Users.tsx
│   │   ├── products/
│   │   │   ├── components/          # ProductsTable, ProductModal, ProductForm
│   │   │   ├── hooks/               # useProductsHook, useProductForm
│   │   │   ├── mutations/           # useCreateProductMutation, etc.
│   │   │   ├── services/            # productsService.ts
│   │   │   ├── types.ts
│   │   │   └── Products.tsx
│   │   ├── categories/
│   │   ├── orders/
│   │   ├── finances/
│   │   └── dashboard/
│   ├── components/UI/
│   │   ├── table-nextui/
│   │   │   ├── CustomTableNextUi.tsx        # Tabla reutilizable
│   │   │   └── CustomPagination.tsx         # Paginación
│   │   ├── customModalNextUI/
│   │   │   └── CustomModalNextUI.tsx        # Modal reutilizable
│   │   └── buttons/
│   ├── store/
│   │   └── auth/
│   │       └── authStore.ts         # Zustand (token, user, isLogged)
│   ├── tanstack-queries/
│   │   ├── usersQuery.ts
│   │   ├── productsQuery.ts
│   │   ├── ordersQuery.ts
│   │   └── ...
│   ├── helpers/
│   └── types/
│       └── global.types.ts
├── integrations/tanstack-query/
│   ├── root-provider.tsx            # QueryClientProvider
│   └── devtools.tsx                 # TanStack Query Devtools
├── hero.ts                          # HeroUI plugin (colores personalizados)
└── styles.css                       # Tailwind v4 + @theme + @plugin hero.ts
```

---

## 🚀 Quick Start

### Instalación

```bash
# Clonar y entrar
git clone <repo-url>
cd nondecants-admin

# Instalar dependencias
npm install

# Copiar .env
cp .env.example .env
```

### Variables de Entorno

```env
# API
VITE_API_BASE_URL=http://localhost:3030/api

# JWT
VITE_JWT_EXPIRATION=24h

# App
VITE_APP_NAME=NönDecants Admin
NODE_ENV=development
```

### Desarrollo

```bash
npm run dev
# 🌐 Acceder a http://localhost:3000
# Login: admin@example.com / password123
```

### Build

```bash
npm run build      # Build SSR
npm run preview    # Preview
```

---

## 🔐 Autenticación

**Solo Admin** — emails con rol `ADMIN` en BD

```typescript
// src/app/store/auth/authStore.ts
const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setToken: (token, user) => { },
      removeToken: () => { },
      isLogged: () => Boolean(token),
    }),
    {
      name: 'auth-store',
      storage: localStorage, // localStorage estándar (sin encriptación)
    }
  )
);
```

**Flujo:**
1. Usuario ingresa email + password en `/login`
2. Backend valida (solo ADMIN permitido)
3. Responde con JWT token + user data
4. Se guarda en Zustand + localStorage
5. Guard `_authenticated.tsx` valida token antes de rutas protegidas

---

## 📊 Componentes UI Personalizados

### CustomTableNextUi

Tabla reutilizable con sorting, filtering, pagination:

```typescript
<CustomTableNextUi
  columns={columns}
  rows={data}
  isLoading={isLoading}
  pagination={{ page, pageSize, total }}
  onPageChange={setPage}
  onSort={handleSort}
/>
```

### CustomModalNextUI

Modal reutilizable para create/edit:

```typescript
<CustomModalNextUI
  isOpen={isOpen}
  onClose={onClose}
  title="Crear Producto"
  children={<ProductForm onSubmit={handleSubmit} />}
/>
```

### CustomPagination

Paginación customizada:

```typescript
<CustomPagination
  page={currentPage}
  pageSize={pageSize}
  total={totalItems}
  onChange={setCurrentPage}
/>
```

---

## 🎯 Features Principales

### 1. Usuarios (`/usuarios`)

- **Tabla**: Listar todos los usuarios (email, role, createdAt)
- **Crear**: Modal con formulario (email, password, role)
- **Editar**: Cambiar rol o email
- **Eliminar**: Soft delete o hard delete
- **Búsqueda**: Filtro por email, role

**Archivo**: `src/app/features/users/`

### 2. Productos (`/productos`)

- **Tabla**: Listar productos (nombre, precio, categoría, stock)
- **Crear**: Modal con formulario (nombre, descripción, precio, imágenes)
- **Editar**: Cambiar datos de producto
- **Eliminar**: Marcar como inactivo
- **Variantes**: Gesionar variantes por ML (30ml, 50ml, etc.)

**Archivo**: `src/app/features/products/`

### 3. Categorías (`/categorias`)

- **Tabla**: Listar categorías (nombre, slug, activo)
- **Crear/Editar**: Formulario simple
- **Subcategorías**: Agregar bajo categoría padre

**Archivo**: `src/app/features/categories/`

### 4. Órdenes (`/ordenes`)

- **Tabla**: Listar órdenes (ID, cliente, monto, estado, fecha)
- **Detalle**: Ver resumen completo, items, dirección de envío
- **Cambiar estado**: De PENDING → PAID → SHIPPED → DELIVERED
- **Tracking**: Ver datos Servientrega
- **Filtros**: Por estado, por rango de fechas

**Archivo**: `src/app/features/orders/`

### 5. Finanzas (`/finanzas`)

- **Gráficos**: Ventas por día/semana/mes (Recharts)
- **Estadísticas**: Ingresos totales, comisiones, recargos
- **Reportes**: Descargables en CSV
- **Filtros**: Por rango de fechas, por categoría

**Archivo**: `src/app/features/finances/`

### 6. Dashboard (`/`)

- **Cards**: Ventas hoy, usuarios activos, órdenes pendientes
- **Gráfico**: Trending (últimos 30 días)
- **Tabla**: Últimas órdenes
- **Alertas**: Stocks bajos, órdenes sin confirmar

**Archivo**: `src/app/features/dashboard/`

---

## 🔄 Queries & Mutations

### Queries Compartidas

```typescript
// src/app/tanstack-queries/usersQuery.ts
export const useUsersQuery = (filters) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersService.getAll(filters),
    staleTime: 5 * 60 * 1000,
  });
};
```

### Mutations

```typescript
// src/app/features/users/mutations/useCreateUserMutation.ts
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto) => usersService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      addToast({ title: 'Usuario creado' });
    },
    onError: (error) => {
      addToast({ title: error.message, color: 'danger' });
    },
  });
};
```

---

## 📝 Scripts

| Script | Descripción |
|--------|-----------|
| `npm run dev` | Desarrollo (SSR + HMR) |
| `npm run build` | Build SSR |
| `npm run preview` | Preview del build |
| `npm run test` | Tests con Vitest |
| `npm run test:watch` | Tests en watch mode |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run check` | Prettier + ESLint + TypeScript |

---

## 🐳 Docker

```bash
# Build imagen
docker build -t nondecants-admin .

# Ejecutar
docker run -p 3000:3000 \
  -e VITE_API_BASE_URL=http://api:3030/api \
  nondecants-admin
```

Ver `DOCKER.md` para detalles.

---

## 📚 Patrones de Código

### Componente → Hook → Mutation/Query → Service

```typescript
// Componente (UI only)
function UsersTable() {
  const { users, isLoading, page } = useUsersHook();
  return <CustomTableNextUi ... />;
}

// Hook (lógica)
function useUsersHook(filters) {
  const { data } = useUsersQuery(filters);
  const { mutate: deleteUser } = useDeleteUserMutation();
  return { users: data?.content, isLoading, ... };
}

// Query (data fetching)
function useUsersQuery(filters) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersService.getAll(filters),
  });
}

// Service (axios)
const usersService = {
  getAll: (filters) => axiosInstance.get('/users', { params: filters }),
  create: (dto) => axiosInstance.post('/users', dto),
  update: (id, dto) => axiosInstance.patch(`/users/${id}`, dto),
  delete: (id) => axiosInstance.delete(`/users/${id}`),
};
```

### Componentes de formulario

```typescript
// Form con React Hook Form + Zod
function UserForm({ onSubmit, defaultValues }) {
  const form = useForm({ resolver: zodResolver(userSchema), defaultValues });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        label="Email"
        {...form.register('email')}
        errorMessage={form.formState.errors.email?.message}
      />
      <Button type="submit">Guardar</Button>
    </form>
  );
}
```

---

## 🌐 Integración Frontend

Admin y Frontend **comparten**:
- Backend API (mismo servidor 3030)
- Zustand stores (auth store)
- TanStack Query config
- Tailwind theme

---

## 📞 Soporte

- 📖 Docs: `common-skills/skills/front/`
- 🏗️ Arquitectura: `common-skills/skills/front/arquitectura-front/`
- 🔌 API: `common-skills/skills/front/logica-negocio-back/`
- 🎨 HeroUI: https://heroui.com/docs
