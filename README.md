# La Casona de Tamaya — Web Hotel 2026

Web oficial del Hotel Rural La Casona de Tamaya, Tamajón (Guadalajara).  
SPA desarrollada con React + Vite + TailwindCSS. Incluye chat de IA para huéspedes y panel de gestión privado para el personal.

---

## 🚀 Tecnologías

| Capa            | Tecnología                                 |
| :-------------- | :----------------------------------------- |
| **Frontend**    | React 19, TypeScript, Vite 7               |
| **Estilos**     | Tailwind CSS (CDN en dev, bundle en prod)  |
| **Iconos**      | Lucide React                               |
| **Base de Datos**| Supabase (PostgreSQL + Auth + Realtime)   |
| **IA Chat**     | Google Gemini API + Groq API (fallback)    |
| **Despliegue**  | Vercel                                     |

---

## 📁 Estructura del Proyecto

```
web-hotel/
├── components/          # Componentes React (Navbar, Hero, StaffArea, AIChat, etc.)
├── services/
│   └── aiService.ts     # Lógica de IA: Gemini → Groq → fallback estático
├── public/
│   └── hotel_knowledge.md  # Base de conocimiento para el chat de IA
├── App.tsx              # Componente raíz, gestión de páginas (SPA sin router)
├── constants.ts         # Datos del hotel: habitaciones, precios, menús, rutas
├── types.ts             # Interfaces TypeScript (Room, Activity, PageState, etc.)
├── supabase.ts          # Cliente Supabase (inicialización)
├── index.html           # Punto de entrada HTML
├── index.css            # Estilos globales
├── vite.config.ts       # Configuración de Vite
└── .env                 # Variables de entorno (NO SE SUBE A GIT)
```

---

## 🛠️ Desarrollo Local

### Requisitos previos
- Node.js >= 18
- npm

### Instalación
```bash
npm install
```

### Configuración de variables de entorno
Crea un archivo `.env` en la raíz del proyecto con estas variables:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_GEMINI_API_KEY=AIzaSy...
VITE_GROQ_API_KEY=gsk_...
```

> ⚠️ **IMPORTANTE**: El archivo `.env` está en `.gitignore`. Nunca subas claves al repositorio.

### Ejecutar en local
```bash
npm run dev        # Servidor de desarrollo en http://localhost:5173
npm run build      # Construir para producción (carpeta /dist)
npm run preview    # Previsualizar el build de producción
```

---

## 🔐 Seguridad y Autenticación

### Supabase Auth (Área Staff)
El acceso al panel de gestión (`/staff`) está protegido por **Supabase Auth** con email y contraseña.

**Usuarios autorizados** (creados en Supabase Dashboard → Authentication → Users):

| Email                          | Rol              |
| :----------------------------- | :--------------- |
| `staff@lacasonadetamaya.es`    | Staff operativo  |
| `admin@lacasonadetamaya.es`    | Administración   |

**Crear un nuevo usuario staff:**
1. Ir a [Supabase Dashboard](https://supabase.com/dashboard) → Tu proyecto → Authentication → Users
2. Click "Add user" → "Create new user"
3. Rellenar email y contraseña
4. Marcar ✅ "Auto Confirm User"

### Row Level Security (RLS)
Las tablas de gestión (`room_charges`, `cleaning_status`, `room_details`) están protegidas con políticas RLS:

- **Lectura**: Solo usuarios autenticados (staff logueado)
- **Escritura**: Solo usuarios autenticados
- **Anónimos**: Sin acceso a datos de gestión

**Script SQL para aplicar las políticas RLS** (ejecutar en Supabase → SQL Editor):

```sql
-- Activar RLS
ALTER TABLE room_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_details ENABLE ROW LEVEL SECURITY;

-- Políticas: Solo usuarios autenticados pueden leer y escribir
CREATE POLICY "staff_select" ON room_charges FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "staff_insert" ON room_charges FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "staff_update" ON room_charges FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "staff_delete" ON room_charges FOR DELETE USING (auth.role() = 'authenticated');

-- Repetir para cleaning_status y room_details (ver docs/supabase-rls.sql)
```

> 📝 El script completo está en `docs/supabase-rls.sql`

### Claves de API
Las claves de IA (Gemini, Groq) se cargan desde variables de entorno con prefijo `VITE_`.  
**⚠️ Nota de seguridad**: El prefijo `VITE_` las expone en el bundle del cliente. En producción, deberían moverse a Edge Functions.

---

## 🤖 Chat de IA (Guía del Huésped)

El chat utiliza una estrategia de **fallback en cascada**:

1. **Gemini 1.5 Flash** → Intento principal (Google)
2. **Groq (Llama 3.3 70B)** → Si Gemini falla (error 404, cuota, etc.)
3. **Gemini 1.0 Pro** → Último recurso (modelo más antiguo pero estable)
4. **Mensaje estático** → Si todo falla, muestra mensaje con teléfono de contacto

La base de conocimiento se carga desde `/public/hotel_knowledge.md`.

---

## 🏨 Panel de Gestión (Staff Area)

Funcionalidades disponibles tras autenticarse:

- **Estado de limpieza** por habitación (limpia / en progreso / pendiente)
- **Ocupación** de habitaciones (ocupada / libre)
- **Cargos al consumo** (cafés, cenas, extras) con selector de productos
- **Precio por noche** editable por habitación
- **Notas internas** por habitación
- **Checkout** con confirmación en 3 pasos y archivado de cargos
- **Actualización en tiempo real** vía Supabase Realtime

---

## 🌐 Despliegue en Vercel

El proyecto se despliega automáticamente desde GitHub (`ronmanu/casonadetamaya`).

**Variables de entorno en Vercel** (Settings → Environment Variables):
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_GEMINI_API_KEY
VITE_GROQ_API_KEY
```

**Dominio personalizado** (pendiente de configurar):
- `lacasonadetamaya.es` (principal)
- `lacasonadetamaya.com` (redirección)

---

## 📅 Hoja de Ruta

### Próximas mejoras de seguridad
- [ ] Mover claves de IA a Edge Functions (server-side)
- [ ] Implementar roles diferenciados (admin vs staff)

### Integraciones futuras
- [ ] PMS AvaiBook para gestión de reservas
- [ ] Pasarela de pagos (Stripe o AvaiBook Pay)
- [ ] Envío automático de partes de viajeros (Guardia Civil)
- [ ] Check-in online para huéspedes

---

## ✍️ Notas de Mantenimiento

- **Cambiar precios o habitaciones**: Editar el array `ROOMS` en `constants.ts`
- **Actualizar menú del restaurante**: Editar `RESTAURANT_MENU` en `constants.ts`
- **Añadir productos al bar (Staff)**: Editar el array `BAR_PRODUCTS` en `components/StaffArea.tsx`
- **Actualizar base de conocimiento IA**: Editar `public/hotel_knowledge.md`
- **Correo de contacto**: Definido en `components/Footer.tsx` → `info@lacasonadetamaya.es`
