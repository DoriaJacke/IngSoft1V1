# 🎫 Sistema de Envío de Entradas por Email - EventosViña

Sistema completo para generar entradas PDF personalizadas y enviarlas por email usando un backend con SendGrid.

## 👥 Integrantes
- Andres Calderon
- Bastian Kramarenko  
- Joaquin Fuenzalida
- Benjamin Vallejos

## 🎯 Problema
**Eventos Viña**: Sistema de venta de entradas y verificación de entradas, evitando la duplicación y falsificación de entradas para eventos.

## ✨ Características Principales

- 📧 **Envío automático de emails** usando SendGrid (backend)
- 🎨 **Template HTML profesional** con diseño moderno
- 📄 **Generación de PDFs** usando Google Apps Script y Google Slides
- 🔗 **Códigos QR únicos** para cada entrada
- 📱 **Diseño responsive** en emails y aplicación
- 🎯 **Integración completa** con React/TypeScript
- 🔐 **Sistema de verificación** anti-duplicación

## 🚀 Vista Previa y Testing

### Template de Email
- Abre `preview-email-template.html` en tu navegador
- Diseño profesional inspirado en plataformas modernas de ticketing

### Componente de Test
- `src/components/EmailTestComponent.tsx` incluye interfaz para testing completo
- Prueba generación de PDFs y envío de emails

## 📁 Estructura del Proyecto

```
src/
  ├── services/
  │   └── emailService.ts              # Servicio principal de email y PDF
  ├── components/
  │   ├── EmailTestComponent.tsx       # Componente para testing
  │   ├── Checkout.tsx                 # Proceso de compra
  │   ├── Confirmation.tsx             # Confirmación de compra
  │   └── ...
  ├── templates/
  │   └── email-confirmation-template.html  # Template HTML
  ├── examples/
  │   └── emailExample.ts              # Ejemplos de uso
  └── types/
      └── index.ts                     # Tipos TypeScript

docs/
  ├── GOOGLE_SLIDES_SETUP.md          # Setup de Google Apps Script
  ├── GOOGLE_APPS_SCRIPT_INTEGRATION.md # Guía de integración completa
  ├── EMAILJS_CONFIG.md                # Configuración de EmailJS
  └── preview-email-template.html      # Preview del template
```

## 🔧 Instalación y Configuración

### 1. **Instalar dependencias**
```bash
npm install
npm install jspdf qrcode
npm install --save-dev @types/qrcode
```

### 2. **Configurar SendGrid (backend)**
```bash
Lee `README_SENDGRID.md` para la guía completa del backend SendGrid
Configura tu cuenta en https://sendgrid.com/ y verifica tu remitente.
# Actualiza credenciales en src/services/emailService.ts
```

### 3. **Configurar Google Apps Script (Para PDFs)**
```bash
# Sigue la guía en GOOGLE_APPS_SCRIPT_INTEGRATION.md
# Crea plantilla en Google Slides
# Despliega Web App
# Actualiza GOOGLE_APPS_SCRIPT_URL
```

### 4. **Ejecutar proyecto**
```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build para producción
npm run preview  # Preview del build
```

## 📧 Uso del Sistema

### Envío completo (Email + PDF):
```typescript
import { sendPurchaseConfirmationEmailWithPDF } from './src/services/emailService';

const result = await sendPurchaseConfirmationEmailWithPDF(purchaseDetails, true);
console.log(result); // { success: boolean, message: string, pdfUrl?: string }
```

### Solo generación de PDF:
```typescript
import { generateTicketPDFWithSlides } from './src/services/emailService';

const pdfResult = await generateTicketPDFWithSlides(purchaseDetails);
if (pdfResult.success) {
  console.log('PDF generado:', pdfResult.pdfUrl);
}
```

### Solo envío de email:
```typescript
import { sendPurchaseConfirmationEmail } from './src/services/emailService';

const result = await sendPurchaseConfirmationEmail(purchaseDetails);
```

## 🎨 Características del Template

### Email Template:
- ✅ Header con gradiente profesional
- ✅ Logo "Eventos Viña"
- ✅ Información completa del evento
- ✅ Número de orden destacado
- ✅ Sección de descarga de entrada digital
- ✅ Resumen detallado de compra
- ✅ Instrucciones importantes
- ✅ Footer con contacto
- ✅ Diseño 100% responsive

### PDF Template (Google Slides):
- ✅ Diseño personalizable de entrada
- ✅ Código QR único por entrada
- ✅ Información del evento y comprador
- ✅ Diseño anti-falsificación
- ✅ Generación automática

## 🔐 Variables de Configuración

### EmailJS (src/services/emailService.ts):
```typescript
const EMAILJS_SERVICE_ID = 'tu_service_id';
const EMAILJS_TEMPLATE_ID = 'tu_template_id';
const EMAILJS_PUBLIC_KEY = 'tu_public_key';
```

### Google Apps Script:
```typescript
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/.../exec';
```

## 📊 Flujo Completo del Sistema

```
1. 🛒 Usuario selecciona evento y completa compra
2. 💳 Sistema procesa el pago
3. 📧 Se llama a sendPurchaseConfirmationEmailWithPDF()
4. 📄 Google Apps Script genera PDF personalizado + QR único
5. ☁️ PDF se guarda en Google Drive con enlace público
6. 📬 Sistema envía email con template HTML + link PDF
7. ✅ Usuario recibe confirmación con entrada descargable
8. 🎫 Usuario presenta entrada con QR en el evento
```

## 🧪 Testing y Desarrollo

### Componente de Test:
```tsx
import EmailTestComponent from './src/components/EmailTestComponent';

// En tu aplicación React
<EmailTestComponent />
```

### Ejemplos de uso:
```typescript
// Test completo con PDF
import { emailExampleWithPDF } from './src/examples/emailExample';
emailExampleWithPDF();

// Solo PDF
import { generatePDFExample } from './src/examples/emailExample';
generatePDFExample();

// Solo Email
import { emailExample } from './src/examples/emailExample';
emailExample();
```

## 📋 Requisitos del Sistema

- **Node.js** 16+ 
- **React** 18+
- **TypeScript** 4+
- **Cuenta Google** (Apps Script, Slides, Drive)
- **Cuenta EmailJS** (plan gratuito disponible)

## 🚨 Limitaciones y Consideraciones

### EmailJS (Plan Gratuito):
- ⚠️ 200 emails/mes
- ⚠️ 1 usuario
- ⚠️ 2 templates
- ⚠️ Envío desde cliente (menos seguro)

### Google Apps Script:
- ⚠️ 6 minutos máximo por ejecución
- ⚠️ 20,000 llamadas/día  
- ⚠️ 100 MB límite de memoria

### Para Producción:
- 🔒 **SendGrid/Mailgun** + Backend
- 🔒 **Nodemailer** + SMTP
- 🔒 **AWS SES** + Lambda
- 🔒 **Puppeteer/React-PDF** para PDFs

## 🔧 Troubleshooting

### Error: "Script function not found"
- ✅ Verifica código guardado en Apps Script
- ✅ Asegúrate que función `doPost` existe

### Error: "Insufficient permissions"  
- ✅ Re-autoriza permisos en Apps Script
- ✅ Verifica APIs habilitadas en Cloud Console

### Error: "Email not sent"
- ✅ Verifica credenciales EmailJS
- ✅ Chequea template ID correcto
- ✅ Revisa consola del navegador

### Error: "PDF generation failed"
- ✅ Verifica GOOGLE_APPS_SCRIPT_URL
- ✅ Comprueba plantilla Slides accesible
- ✅ Revisa permisos de carpeta Drive

## 📖 Documentación Adicional

- **[EMAILJS_CONFIG.md](./EMAILJS_CONFIG.md)** - Configuración completa de EmailJS
- **[GOOGLE_APPS_SCRIPT_INTEGRATION.md](./GOOGLE_APPS_SCRIPT_INTEGRATION.md)** - Integración con Google Apps Script
- **[GOOGLE_SLIDES_SETUP.md](./GOOGLE_SLIDES_SETUP.md)** - Setup de plantillas en Slides
- **[TESTING.md](./TESTING.md)** - Guías de testing
- **[DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md)** - Instrucciones de despliegue

## 🤝 Contribuir

1. Fork el proyecto
2. Crea rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

## 📞 Soporte

Para soporte técnico:
- 📧 Email: soporte@eventosviña.cl
- 📱 WhatsApp: +56 9 XXXX XXXX
- 🌐 Web: [eventosviña.cl](https://eventosviña.cl)

---

**Desarrollado con ❤️ para EventosViña - Universidad de Valparaíso**