# 📊 API de Reportes - Eventos Viña

**Proyecto:** IngSoft1V1  
**Historia de Usuario:** MFLP-15 - Reportes de ventas por evento, fecha y categoría

## 👥 Integrantes
- Andres Calderon
- Bastian Kramarenko
- Joaquin Fuenzalida
- Benjamin Vallejos

# Problema
Eventos viña: venta de entradas y verificación de entradas, evitando la duplicación y falsificación de entradas para eventos.

# Página de Selección de Eventos

Esta es una aplicación web para la venta de entradas de eventos que incluye un sistema automatizado de envío de emails de confirmación.

## Nuevas Funcionalidades

### 🔥 Sistema de Email Automatizado
- **Confirmación automática**: Envío de email al completar una compra
- **Templates personalizados**: Emails con diseño profesional y toda la información del evento
- **Estado de envío**: Seguimiento del estado del email en tiempo real
- **Manejo de errores**: Notificación al usuario si hay problemas con el envío

### 📧 Características del Email
- Información completa del evento (título, artista, fecha, hora, lugar)
- Número de orden único para cada compra
- Resumen detallado de la compra con precios
- Instrucciones para el día del evento
- Diseño responsive y profesional
- Contacto de soporte incluido

## Configuración del Sistema de Email (SendGrid)

1. Crea un archivo `.env` en la raíz con:
   - `SENDGRID_API_KEY` (tu API key de SendGrid)
   - `SENDGRID_FROM` (tu remitente verificado)
   - `PORT=4000` (opcional)

2. Instala dependencias y levanta los servidores:
   - Backend (SendGrid): `npm run server`
   - Frontend (Vite): `npm run dev`

3. Ver ejemplo de email:
   - Abre `email-template-example.html` para visualizar el diseño base del correo

4. Documentación completa de SendGrid en el proyecto:
   - Lee `README_SENDGRID.md`

## Ejecutar el proyecto

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. Envío de emails: ver `README_SENDGRID.md` para configuración completa

## Estructura del Proyecto

```
src/
├── components/
│   ├── Checkout.tsx          # Proceso de compra con integración de email
│   ├── Confirmation.tsx      # Confirmación con estado del email
│   └── ...
├── services/
│   └── emailService.ts       # Servicio de envío de emails
├── types/
│   └── index.ts             # Interfaces TypeScript actualizadas
└── ...
```

## Tecnologías Utilizadas

- **React 18** - Framework de interfaz
- **TypeScript** - Tipado estático
- **Vite** - Bundler y servidor de desarrollo
- **Tailwind CSS** - Estilos
- **Radix UI** - Componentes de UI
- **SendGrid (backend)** - Envío de emails con adjuntos
- **Lucide React** - Iconos

## Flujo de Compra con Email

1. **Selección**: Usuario selecciona evento y cantidad de entradas
2. **Checkout**: Formulario de pago con información del comprador
3. **Procesamiento**: Al confirmar pago:
   - Se genera número de orden único
   - Se envía email de confirmación automáticamente
   - Se muestra estado del envío en tiempo real
4. **Confirmación**: Pantalla final con estado del email y detalles de la compra

## Próximas Mejoras

- [ ] Sistema de códigos QR en los emails
- [ ] Recordatorios automáticos antes del evento
- [ ] Integración con pasarelas de pago reales
- [ ] Dashboard administrativo para gestión de emails
- [ ] Métricas de entrega de emails

---

Para más información sobre el envío con SendGrid, consulta `README_SENDGRID.md`.
  
