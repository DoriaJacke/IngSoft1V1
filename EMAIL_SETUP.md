# Configuración del Servicio de Email

Este documento explica cómo configurar el servicio de email automatizado para el envío de confirmaciones de compra.

## Configuración de EmailJS

### 1. Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Regístrate o inicia sesión
3. Una vez dentro, accede al dashboard

### 2. Configurar Servicio de Email
1. En el dashboard, ve a "Email Services"
2. Haz clic en "Add New Service"
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Sigue las instrucciones para conectar tu cuenta
5. Copia el **Service ID** generado

### 3. Crear Template de Email
1. Ve a "Email Templates"
2. Haz clic en "Create New Template"
3. Usa este template HTML:

```html
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

4. Configura las variables del template usando los nombres exactos del código
5. Copia el **Template ID** generado

### 4. Obtener Public Key
1. Ve a "Account" en el menú
2. En "General", encontrarás tu **Public Key**
3. Cópiala

### 5. Configurar las credenciales
Abre el archivo `src/services/emailService.ts` y reemplaza:

```typescript
const EMAILJS_SERVICE_ID = 'tu_service_id_aqui';
const EMAILJS_TEMPLATE_ID = 'tu_template_id_aqui'; 
const EMAILJS_PUBLIC_KEY = 'tu_public_key_aqui';
```

## Variables del Template

El sistema envía las siguientes variables al template:

- `to_email`: Email del comprador
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

## Limitaciones de EmailJS

- Plan gratuito: 200 emails por mes
- Límite de tamaño: 50KB por email
- Para mayor volumen, considera planes pagos

## Alternativas de Servicio

Si necesitas mayor volumen o características avanzadas, considera:

1. **SendGrid**: API robusta, planes escalables
2. **Mailgun**: Buena para desarrolladores
3. **AWS SES**: Económico para grandes volúmenes
4. **Nodemailer**: Para implementación backend

## Seguridad

- Las credenciales de EmailJS son seguras para uso en frontend
- No expongas credenciales de servicios backend en el código cliente
- Para producción, considera implementar el envío desde el backend