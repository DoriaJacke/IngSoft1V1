# Configuración de EmailJS para Desarrollo

## ¿Por qué EmailJS?

EmailJS permite enviar emails directamente desde el frontend sin necesidad de un backend, lo cual es perfecto para desarrollo y testing. Para producción, se recomienda mover a SendGrid en el backend.

## Pasos de Configuración

### 1. Crear cuenta en EmailJS
1. Ve a https://www.emailjs.com/
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Configurar Email Service
1. En el dashboard, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Conecta tu cuenta de email
5. Guarda el Service ID

### 3. Crear Email Template
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Usa este template HTML para confirmación de compra:

```
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { color: #6366f1; font-size: 24px; font-weight: bold; }
        .ticket-info { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .order-number { background-color: #6366f1; color: white; padding: 10px; border-radius: 5px; text-align: center; font-weight: bold; }
        .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">EventosChile</div>
            <h1>¡Confirmación de Compra!</h1>
        </div>

        <p>Hola {{to_name}},</p>

        <p>¡Gracias por tu compra! Hemos recibido tu pago y confirmamos tu entrada para el siguiente evento:</p>

        <div class="ticket-info">
            <h2>{{event_title}}</h2>
            <p><strong>Artista:</strong> {{event_artist}}</p>
            <p><strong>Fecha:</strong> {{event_date}}</p>
            <p><strong>Hora:</strong> {{event_time}}</p>
            <p><strong>Lugar:</strong> {{event_venue}}, {{event_location}}</p>
            <p><strong>Cantidad de entradas:</strong> {{ticket_quantity}}</p>
        </div>

        <div class="order-number">
            <p>Número de Orden: {{order_number}}</p>
        </div>

        <div style="margin: 20px 0;">
            <h3>Resumen de la compra:</h3>
            <p>Entradas ({{ticket_quantity}}): ${{unit_price}} CLP</p>
            <p>Cargo por servicio: ${{service_charge}} CLP</p>
            <p><strong>Total: ${{total_price}} CLP</strong></p>
            <p>Fecha de compra: {{purchase_date}}</p>
        </div>

        <p><strong>Instrucciones importantes:</strong></p>
        <ul>
            <li>Presenta este email en el evento para validar tu entrada</li>
            <li>Llega con al menos 30 minutos de anticipación</li>
            <li>Recuerda traer un documento de identidad válido</li>
        </ul>

        <div class="footer">
            <p>Si tienes alguna pregunta, contáctanos a {{support_email}}</p>
            <p>¡Te esperamos en el evento!</p>
            <p>Equipo EventosChile</p>
        </div>
    </div>
</body>
</html>
```

4. Configura el "To Email" como `{{to_email}}`
5. Configura el "From Email" con tu email verificado
6. Configura el Subject como: `Confirmación de Compra - {{event_title}}`
7. Guarda el Template ID

### 4. Obtener Public Key
1. Ve a "Account" > "General"
2. Copia tu Public Key

### 5. Actualizar el código
En `src/services/emailService.ts`, reemplaza los placeholders:

```typescript
const EMAILJS_SERVICE_ID = 'tu_service_id_aqui';
const EMAILJS_TEMPLATE_ID = 'tu_template_id_aqui';
const EMAILJS_PUBLIC_KEY = 'tu_public_key_aqui';
```

## Testing

1. Ejecuta la aplicación
2. Realiza una compra de prueba
3. Verifica que el email llegue correctamente

## Notas Importantes

- EmailJS tiene límites gratuitos (200 emails/mes)
- Para producción, implementa SendGrid en el backend
- Los emails pueden llegar a spam inicialmente
- Verifica que tu dominio esté configurado correctamente en EmailJS

## Solución de Problemas

- **Error de CORS**: EmailJS maneja esto automáticamente
- **Emails no llegan**: Verifica tu configuración y límites
- **Template no funciona**: Asegúrate de usar las variables correctas

Para más información, visita la documentación de EmailJS: https://www.emailjs.com/docs/
