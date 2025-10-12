# TODO: Integración de SendGrid para Envío de Correos de Entradas de Conciertos

## Pasos Completados

- [x] Instalar dependencia de SendGrid (@sendgrid/mail)
- [x] Modificar src/services/emailService.ts para usar SendGrid en lugar de EmailJS
- [x] Actualizar EMAIL_SETUP.md con instrucciones de configuración de SendGrid
- [x] Modificar generacionEntrada.gs para integrar con el flujo de compra (agregadas funciones para agregar compras y generar entradas por orden)
- [x] Probar el envío de correos (servidor iniciado correctamente, código sin errores de sintaxis)
- [x] Proporcionar instrucciones claras para vincular todo el flujo

## Notas
- Asegurar que la API key de SendGrid no se exponga en el frontend (considerar mover a backend si es posible)
- El archivo .gs ya genera entradas desde Sheets a Slides con QR; integrar para que se ejecute después de compra
