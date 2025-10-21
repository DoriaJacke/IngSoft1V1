# Configuración de EmailJS para Envío de Entradas

## 📧 Pasos para configurar EmailJS

### 1. Crear cuenta en EmailJS
1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Verifica tu email

### 2. Configurar el servicio de email
1. En el dashboard, ve a **Email Services**
2. Haz clic en **Add New Service**
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Configura las credenciales
5. Copia el **Service ID**

### 3. Crear template de email
1. Ve a **Email Templates**
2. Haz clic en **Create New Template**
3. Usa este template ID: `template_confirmation_ticket`
4. Configura las siguientes variables en el template:

```html
Subject: ¡Confirmación de Compra! - {{event_title}}

From Name: Eventos Viña
Reply To: {{reply_to}}

Template Content: 
{{{html_content}}}
```

### 4. Variables del template
El template debe incluir estas variables:
- `{{to_name}}` - Nombre del comprador
- `{{to_email}}` - Email del comprador  
- `{{event_title}}` - Título del evento
- `{{event_artist}}` - Artista del evento
- `{{event_date}}` - Fecha del evento
- `{{event_time}}` - Hora del evento
- `{{event_venue}}` - Lugar del evento
- `{{event_location}}` - Ubicación del evento
- `{{ticket_quantity}}` - Cantidad de entradas
- `{{unit_price}}` - Precio unitario
- `{{service_charge}}` - Cargo por servicio
- `{{total_price}}` - Precio total
- `{{purchase_date}}` - Fecha de compra
- `{{order_number}}` - Número de orden
- `{{ticket_pdf_url}}` - URL del PDF de la entrada (opcional)
- `{{html_content}}` - Contenido HTML del email

### 5. Actualizar configuración en el código

En `src/services/emailService.ts`, actualiza estas constantes:

```typescript
const EMAILJS_SERVICE_ID = 'tu_service_id_aqui';
const EMAILJS_TEMPLATE_ID = 'template_confirmation_ticket';
const EMAILJS_PUBLIC_KEY = 'tu_public_key_aqui';
```

### 6. Configurar las claves
1. En EmailJS, ve a **Account** > **API Keys**
2. Copia tu **Public Key**
3. Actualiza `EMAILJS_PUBLIC_KEY` en el código

## 🎨 Personalización del Template

### Colores principales:
- **Header**: Gradiente púrpura (#667eea a #764ba2)
- **Botón descarga**: Gradiente azul (#4facfe a #00f2fe)
- **Orden**: Gradiente púrpura
- **Texto principal**: #2d3748
- **Texto secundario**: #4a5568

### Elementos incluidos:
✅ Logo de "Eventos Viña"
✅ Información completa del evento
✅ Número de orden destacado
✅ Sección de descarga de entrada digital
✅ Resumen detallado de compra
✅ Instrucciones importantes
✅ Footer con contacto
✅ Diseño responsive

## 🚀 Uso del servicio

```typescript
import { sendPurchaseConfirmationEmail, PurchaseDetails } from '../services/emailService';

const purchaseDetails: PurchaseDetails = {
  orderNumber: 'ORD-123456789',
  event: eventData,
  quantity: 2,
  totalPrice: 70000,
  serviceCharge: 8000,
  purchaseDate: '12 de octubre de 2025, 19:30',
  user: userData
};

// Enviar email de confirmación
const result = await sendPurchaseConfirmationEmail(purchaseDetails);
console.log(result);
```

## 📱 Preview del Template

Para ver cómo se ve el template, abre el archivo:
`preview-email-template.html` en tu navegador

## ⚡ Límites de EmailJS (Plan Gratuito)
- **200 emails por mes**
- **1 usuario**
- **2 templates**
- **1 servicio de email**

## 🔧 Testing

1. Usa datos de prueba con tu email personal
2. Verifica que el email llegue correctamente
3. Comprueba que todas las variables se muestran bien
4. Testa en diferentes clientes de email (Gmail, Outlook, etc.)

## 🔐 Seguridad

⚠️ **IMPORTANTE**: Para producción, considera usar un servicio backend con SendGrid o similar para mayor seguridad y control.

EmailJS es perfecto para desarrollo y prototipos, pero para aplicaciones en producción se recomienda un backend que maneje el envío de emails.

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en la consola del navegador
2. Verifica que las claves API estén correctas
3. Comprueba que el servicio de email esté activo en EmailJS
4. Revisa la documentación oficial: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)