# Configuración del Servicio de Email

Este documento explica cómo configurar el servicio de email automatizado para el envío de confirmaciones de compra usando SendGrid.

## Configuración de SendGrid

### 1. Crear cuenta en SendGrid
1. Ve a [https://sendgrid.com/](https://sendgrid.com/)
2. Regístrate o inicia sesión
3. Una vez dentro, accede al dashboard

### 2. Verificar tu dominio o email
1. En el dashboard, ve a "Settings" > "Sender Authentication"
2. Elige entre:
   - **Single Sender Verification**: Para verificar un email individual (recomendado para pruebas)
   - **Domain Authentication**: Para verificar un dominio completo (recomendado para producción)
3. Sigue las instrucciones para verificar tu email o dominio
4. El email verificado será usado como `FROM_EMAIL` en el código

### 3. Generar API Key
1. Ve a "Settings" > "API Keys"
2. Haz clic en "Create API Key"
3. Elige "Full Access" o "Restricted Access" (asegúrate de incluir permisos de envío de email)
4. Copia la API Key generada (solo se muestra una vez)

### 4. Configurar las credenciales
Abre el archivo `src/services/emailService.ts` y reemplaza:

```typescript
const SENDGRID_API_KEY = 'tu_api_key_de_sendgrid_aqui';
const FROM_EMAIL = 'tu_email_verificado@ejemplo.com';
```

### 5. Inicializar SendGrid
En tu aplicación, llama a `initSendGrid()` al inicio:

```typescript
import { initSendGrid } from './services/emailService';

// Al iniciar la app
initSendGrid();
```

## Templates de Email

Los emails se generan dinámicamente en el código usando HTML inline. Los templates incluyen:

### Email de Confirmación de Compra
- Diseño responsivo con información del evento
- Detalles de la compra
- Instrucciones para el usuario

### Email de Recordatorio
- Recordatorio simple del evento
- Información básica del evento

## Variables del Template

El sistema envía las siguientes variables:

- `to_name`: Nombre completo del comprador
- `order_number`: Número de orden único
- `event_title`: Título del evento
- `event_artist`: Artista del evento
- `event_date`: Fecha del evento
- `event_time`: Hora del evento
- `event_venue`: Venue del evento
- `event_location`: Ubicación del evento
- `ticket_quantity`: Cantidad de entradas
- `unit_price`: Precio unitario (formateado)
- `service_charge`: Cargo por servicio (formateado)
- `total_price`: Precio total (formateado)
- `purchase_date`: Fecha de compra
- `support_email`: Email de soporte

## Planes y Límites de SendGrid

- **Free**: 100 emails por día
- **Essentials**: $19.95/mes - 50,000 emails
- **Pro**: $89.95/mes - 100,000 emails
- **Premium**: Planes personalizados

## Seguridad

⚠️ **Importante**: La API Key de SendGrid no debe exponerse en el frontend para producción.

- Para desarrollo/pruebas: Puedes usar la API Key directamente
- Para producción: Implementa el envío de emails desde el backend
- Considera usar variables de entorno para las credenciales

## Alternativas de Servicio

Si necesitas otras opciones:

1. **Mailgun**: Buena alternativa con API similar
2. **AWS SES**: Económico para grandes volúmenes
3. **Postmark**: Excelente deliverability
4. **Nodemailer**: Para implementación backend personalizada

## Testing

Para probar el envío de emails:

1. Configura una API Key de SendGrid
2. Verifica un email remitente
3. Llama a las funciones `sendPurchaseConfirmationEmail` o `sendEventReminderEmail`
4. Revisa la consola para errores y el inbox del destinatario
