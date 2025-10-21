# Envío de Emails con SendGrid (Backend)

Este proyecto envía los correos de confirmación desde un backend Node.js usando SendGrid e incluye el PDF de la entrada como adjunto.

## Requisitos

- Cuenta SendGrid (gratuita) y API Key
- Un remitente verificado en SendGrid (Single Sender o dominio verificado)
- Node.js 18+

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (junto a `package.json`) con:

```
SENDGRID_API_KEY=SG.xxxxx_tu_api_key_xxxxx
SENDGRID_FROM=tu-remitente-verificado@tu-dominio.com
PORT=4000
```

Notas:
- `SENDGRID_API_KEY` debe comenzar con `SG.`
- `SENDGRID_FROM` debe coincidir con un remitente verificado en tu cuenta SendGrid

## Instalación y ejecución

1) Instala dependencias:

```powershell
npm install
```

2) Arranca el backend (SendGrid server):

```powershell
npm run server
```

Verás en consola: `SendGrid email server running on http://localhost:4000`

3) Arranca el frontend (Vite):

```powershell
npm run dev
```

La app usará el endpoint `POST http://localhost:4000/api/send-confirmation` para enviar correos.

## ¿Qué hace el backend?

Archivo: `server/index.js`
- Expone `POST /api/send-confirmation` con el cuerpo:
  - `toEmail` (string): destinatario
  - `toName` (string): nombre del destinatario (opcional para el saludo)
  - `subject` (string)
  - `html` (string): contenido HTML completo del email
  - `pdfBase64` (string, opcional): el PDF en Base64 (sin prefijo data URI)
  - `pdfFilename` (string, opcional): nombre del archivo adjunto
- Si `pdfBase64` y `pdfFilename` vienen presentes, adjunta el PDF y envía el correo con SendGrid.

## ¿Qué hace el frontend?

Archivo: `src/services/emailService.ts`
- Genera el PDF de la entrada en el navegador.
- Construye el HTML del correo (con detalles de la compra).
- Envía una solicitud `fetch` al backend con el PDF en Base64 para adjuntarlo.

Funciones relevantes:
- `sendPurchaseConfirmationEmailWithPDF(details, generatePDF=true)`
- `sendPurchaseConfirmationEmail(details, ticketPdfBlob?)`
- `generateAndDownloadTicketPDF(details)` para descarga local inmediata.

## Prueba rápida

1) Crea una compra de prueba en el flujo normal (Checkout) y completa el pago simulado.
2) Debes recibir un email con la confirmación y el PDF adjunto.
3) Si no recibes el email:
   - Verifica `.env` (API key válida, remitente verificado)
   - Revisa la carpeta de spam
   - Mira los logs del servidor para ver errores de SendGrid

## Errores comunes

- `API key does not start with "SG."`: Estás usando un valor inválido en `SENDGRID_API_KEY`.
- `The from address does not match a verified Sender Identity`: Verifica tu Single Sender o dominio en SendGrid y usa ese `SENDGRID_FROM`.
- CORS: El backend permite `cors({ origin: true })` por defecto. Ajusta si necesitas restringir orígenes.

## Migración desde EmailJS

- EmailJS fue eliminado del código. Todo el envío ocurre en el backend con SendGrid.
- Si ves referencias a EmailJS en la UI o documentación, han sido deprecadas.

---

Troubleshooting extra:
- Usa `GET /api/health` para validar que el servidor está levantado: `http://localhost:4000/api/health` -> `{ ok: true }`.
- Si quieres cambiar el host/puerto, ajusta `PORT` en `.env` y revisa `API_BASE` en `emailService.ts`.
