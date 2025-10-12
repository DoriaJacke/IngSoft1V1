# TODO: Integración Completa de Sistema de Entradas Digitales

## Pasos Completados

- [x] Instalar dependencia de SendGrid (@sendgrid/mail)
- [x] Modificar src/services/emailService.ts para usar SendGrid en lugar de EmailJS
- [x] Actualizar EMAIL_SETUP.md con instrucciones de configuración de SendGrid
- [x] Modificar generacionEntrada.gs para integrar con el flujo de compra (agregadas funciones para agregar compras y generar entradas por orden)
- [x] Probar el envío de correos (servidor iniciado correctamente, código sin errores de sintaxis)
- [x] Proporcionar instrucciones claras para vincular todo el flujo
- [x] Integrar generación de PDF con envío de email
- [x] Modificar template de email para incluir enlace de descarga del PDF
- [x] Actualizar flujo de checkout para generar PDF antes de enviar email
- [x] Crear URL de descarga desde base64 del PDF generado

## Flujo Actual Implementado

1. **Compra**: Usuario completa checkout en Checkout.tsx
2. **Generación PDF**: Se llama a generateTicketPDF() que usa Google Apps Script
3. **Adjunto Email**: Si PDF se genera exitosamente, se adjunta directamente al email
4. **Envío Email**: Se envía email con entrada PDF adjunta
5. **Confirmación**: Usuario recibe confirmación con entrada adjunta

## Notas
- Asegurar que la API key de SendGrid no se exponga en el frontend (considerar mover a backend si es posible)
- El archivo .gs ya genera entradas desde Sheets a Slides con QR; integrar para que se ejecute después de compra
- CORS configurado en Google Apps Script para permitir peticiones desde cualquier origen
- Ahora el PDF se genera y devuelve en base64 directamente desde Google Apps Script
- Para producción, considerar restringir CORS a dominios específicos por seguridad
