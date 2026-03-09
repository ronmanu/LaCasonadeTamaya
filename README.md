# La Casona de Tamaya - Web Hotel 2026

Este proyecto es la web oficial del Hotel Rural La Casona de Tamaya, situada en Tamajón, Guadalajara. Desarrollada con React, Vite y Tailwind CSS, enfocada en ofrecer una experiencia premium y rústica.

## 🚀 Tecnologías

- **Core:** React 18, Vite
- **Estilos:** Tailwind CSS (diseño responsivo y personalizado)
- **Iconografía:** Lucide React
- **Despliegue Recomendado:** Vercel / Netlify

## 📁 Estructura del proyecto

- `/components`: Componentes modulares (Navbar, Hero, RoomList, etc.)
- `/public`: Imágenes y assets estáticos.
- `App.tsx`: Lógica principal de navegación (SPA) y ensamblaje de páginas.
- `constants.ts`: "Cerebro" de datos. Aquí se cambian precios, servicios y textos del menú.
- `types.ts`: Definiciones de tipos para TypeScript.

## 🛠️ Desarrollo Local

1. Instalar dependencias: `npm install`
2. Iniciar servidor: `npm run dev`
3. Construir para producción: `npm run build`

---

## 📅 Hoja de Ruta e Integraciones Futuras

### 1. Integración del PMS (Gestión de Reservas)

Se recomienda **AvaiBook (by idealista)** por su madurez en el mercado español y sus herramientas para desarrolladores.

**Pasos para integrar AvaiBook:**

- **Widget de Reserva:** Se puede insertar el widget oficial en el componente `BookingModal`.
- **API Pro:** Si se desea una integración 100% personalizada (que el calendario de esta web se actualice solo), se debe usar la API de AvaiBook.
- **Sincronización:** Configurar el Channel Manager de AvaiBook para que los precios dinámicos se reflejen en esta web, Booking y Airbnb simultáneamente.

### 2. Legal y Administración

- **Guardia Civil / Policía:** El PMS (AvaiBook) permite automatizar el envío de los partes de entrada de viajeros, cumpliendo con la normativa española de forma automática tras el check-in online.
- **Pagos:** Configurar la pasarela de pagos (AvaiBook Pay o Stripe) para gestionar depósitos y fianzas de forma segura.

### 3. Mejoras en la Web

- **Optimización de Imágenes:** Usar formatos `.webp` para todas las fotos (ya implementado en su mayoría).
- **SEO:** Actualizar los meta-tags en `index.html` con palabras clave como "Hotel Rural Guadalajara", "Pueblos Negros", "Tamajón".

---

## ✍️ Notas de Mantenimiento

Para cambiar un precio o añadir una habitación, simplemente edita el array `ROOMS` en `constants.ts`. El diseño se adaptará automáticamente.
