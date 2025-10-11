## IngSoft1V1

# Integrantes
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

## Configuración del Sistema de Email

1. **Instalar dependencias**:
   ```bash
   npm install @emailjs/browser
   ```

2. **Configurar EmailJS**:
   - Lee las instrucciones detalladas en `EMAIL_SETUP.md`
   - Configura tu cuenta en [EmailJS](https://www.emailjs.com/)
   - Actualiza las credenciales en `src/services/emailService.ts`

3. **Ver ejemplo de email**:
   - Abre `email-template-example.html` en tu navegador para ver cómo se ve el email

## Ejecutar el proyecto

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

3. **Configurar EmailJS** (ver `EMAIL_SETUP.md` para instrucciones detalladas)

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
- **EmailJS** - Servicio de envío de emails
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

*Para más información sobre la configuración del sistema de email, consulta `EMAIL_SETUP.md`*
  
