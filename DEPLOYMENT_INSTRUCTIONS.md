# 🚀 Instrucciones de Despliegue - Sistema de Entradas Digitales

## Paso 1: Configurar Google Apps Script

### 1.1 Crear Web App
1. Ve a [Google Apps Script](https://script.google.com/)
2. Crea un nuevo proyecto
3. Copia el contenido del archivo `generacionEntrada.gs` al editor
4. **IMPORTANTE**: Actualiza las constantes de configuración:
   ```javascript
   const SLIDES_TEMPLATE_ID = 'TU_SLIDES_TEMPLATE_ID'; // ID de tu plantilla de Slides
   const DRIVE_FOLDER_ID = 'TU_DRIVE_FOLDER_ID'; // ID de tu carpeta de Drive
   const SHEET_NAME = 'Hoja 1'; // Nombre de tu hoja de cálculo
   ```

### 1.2 Configurar Spreadsheet
1. Crea una nueva hoja de cálculo en Google Sheets
2. Comparte la hoja con el email del servicio de Google Apps Script (ver en Configuración del proyecto)
3. Copia el ID de la hoja de cálculo (de la URL) y pégalo en el script si es necesario

### 1.3 Configurar Plantilla de Slides
1. Crea una plantilla de presentación en Google Slides
2. Usa placeholders como `{{eventTitle}}`, `{{eventArtist}}`, etc.
3. Copia el ID de la presentación y actualízalo en el script

### 1.4 Configurar Carpeta de Drive
1. Crea una carpeta en Google Drive para almacenar las entradas generadas
2. Copia el ID de la carpeta y actualízalo en el script

### 1.5 Desplegar como Web App
1. Ve a **Desplegar > Nueva implementación**
2. Selecciona tipo **Aplicación web**
3. Configura:
   - **Ejecutar como**: Tú (tu email)
   - **Quién tiene acceso**: Cualquier persona
4. **Copia la URL de la web app** - la necesitarás para el frontend

## Paso 2: Actualizar URL en el Frontend

### 2.1 Actualizar emailService.ts
1. Abre `src/services/emailService.ts`
2. Actualiza la constante `GOOGLE_APPS_SCRIPT_URL` con la URL de tu web app:
   ```typescript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxU0vyIEqupGSUyPi22cYyFxoM8sAlGI9z22o18G5DxdQ5YZv6m1VeCw9YNI0UNVXjfNQ/exec';
   ```

## Paso 3: Configurar EmailJS (para desarrollo)

### 3.1 Crear cuenta en EmailJS
1. Ve a [EmailJS](https://www.emailjs.com/)
2. Crea una cuenta gratuita
3. Ve a **Email Services** y conecta tu proveedor de email (Gmail, Outlook, etc.)

### 3.2 Configurar Template de Email
1. Ve a **Email Templates**
2. Crea un nuevo template con el contenido del email de confirmación
3. Usa variables como `{{to_name}}`, `{{order_number}}`, etc.
4. Copia el Template ID

### 3.3 Actualizar configuración en emailService.ts
```typescript
const EMAILJS_SERVICE_ID = 'tu_service_id';
const EMAILJS_TEMPLATE_ID = 'tu_template_id';
const EMAILJS_PUBLIC_KEY = 'tu_public_key';
```

## Paso 4: Probar el Sistema

### 4.1 Ejecutar el servidor de desarrollo
```bash
npm run dev
```

### 4.2 Probar flujo completo
1. Ve a `http://localhost:3000`
2. Selecciona un evento
3. Completa el checkout
4. Verifica que:
   - ✅ El pago se procesa
   - ✅ Se genera la entrada PDF
   - ✅ Se envía el email con el PDF adjunto

## Paso 5: Configuración para Producción

### 5.1 Restringir CORS (Recomendado)
Para mayor seguridad, actualiza los headers CORS en `generacionEntrada.gs`:
```javascript
const headers = {
  'Access-Control-Allow-Origin': 'https://tudominio.com', // Cambia por tu dominio
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};
```

### 5.2 Usar SendGrid en Producción
Para producción, considera migrar de EmailJS a SendGrid:
1. Instala SendGrid: `npm install @sendgrid/mail`
2. Configura la API key en variables de entorno
3. Actualiza `emailService.ts` para usar SendGrid

## 🔧 Solución de Problemas

### Error CORS
- Verifica que la web app esté desplegada como "Cualquier persona"
- Confirma que los headers CORS estén configurados correctamente

### PDF no se genera
- Verifica que la plantilla de Slides tenga los placeholders correctos
- Confirma que la carpeta de Drive tenga permisos de escritura
- Revisa los logs en Google Apps Script

### Email no llega
- Verifica la configuración de EmailJS
- Confirma que el template tenga las variables correctas
- Revisa la consola del navegador por errores

## 📋 Checklist de Despliegue

- [ ] Google Apps Script desplegado como web app
- [ ] URL actualizada en `emailService.ts`
- [ ] Spreadsheet compartido con el script
- [ ] Plantilla de Slides creada con placeholders
- [ ] Carpeta de Drive configurada
- [ ] EmailJS configurado (desarrollo)
- [ ] Servidor ejecutándose correctamente
- [ ] Flujo de compra probado completamente

¡El sistema está listo para producción! 🎉
