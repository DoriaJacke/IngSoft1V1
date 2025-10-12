import emailjs from '@emailjs/browser';
import { Event, User } from '../types';

// Configuración de EmailJS para desarrollo
// NOTA: Para producción, usar SendGrid en backend
const EMAILJS_SERVICE_ID = 'service_6d0t30d'; // Reemplazar con tu Service ID de EmailJS
const EMAILJS_TEMPLATE_ID = 'template_xhzrauo'; // Reemplazar con tu Template ID de EmailJS
const EMAILJS_PUBLIC_KEY = 'RniEeLPIRomqKHotU'; // Reemplazar con tu Public Key de EmailJS

export interface PurchaseDetails {
  orderNumber: string;
  event: Event;
  quantity: number;
  totalPrice: number;
  serviceCharge: number;
  purchaseDate: string;
  user: User;
}

// Inicializar EmailJS
export const initEmailJS = () => {
  emailjs.init(EMAILJS_PUBLIC_KEY);
};

// Función para generar el HTML del email de confirmación
const generateConfirmationEmailHTML = (params: any): string => {
  const ticketDownloadSection = params.ticket_pdf_url ? `
        <div style="margin: 20px 0; padding: 15px; background-color: #f0f9ff; border: 1px solid #0ea5e9; border-radius: 8px;">
            <h3 style="color: #0ea5e9; margin: 0 0 10px 0;">🎫 Tu Entrada Digital</h3>
            <p style="margin: 0 0 15px 0;">Tu entrada ha sido generada exitosamente. Haz clic en el botón para descargarla:</p>
            <a href="${params.ticket_pdf_url}" style="background-color: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">📥 Descargar Entrada</a>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #64748b;">Si el botón no funciona, copia y pega esta URL en tu navegador: ${params.ticket_pdf_url}</p>
        </div>
  ` : '';

  return `
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

        <p>Hola ${params.to_name},</p>

        <p>¡Gracias por tu compra! Hemos recibido tu pago y confirmamos tu entrada para el siguiente evento:</p>

        <div class="ticket-info">
            <h2>${params.event_title}</h2>
            <p><strong>Artista:</strong> ${params.event_artist}</p>
            <p><strong>Fecha:</strong> ${params.event_date}</p>
            <p><strong>Hora:</strong> ${params.event_time}</p>
            <p><strong>Lugar:</strong> ${params.event_venue}, ${params.event_location}</p>
            <p><strong>Cantidad de entradas:</strong> ${params.ticket_quantity}</p>
        </div>

        <div class="order-number">
            <p>Número de Orden: ${params.order_number}</p>
        </div>

        ${ticketDownloadSection}

        <div style="margin: 20px 0;">
            <h3>Resumen de la compra:</h3>
            <p>Entradas (${params.ticket_quantity}): $${params.unit_price} CLP</p>
            <p>Cargo por servicio: $${params.service_charge} CLP</p>
            <p><strong>Total: $${params.total_price} CLP</strong></p>
            <p>Fecha de compra: ${params.purchase_date}</p>
        </div>

        <p><strong>Instrucciones importantes:</strong></p>
        <ul>
            <li>Presenta este email en el evento para validar tu entrada</li>
            <li>Llega con al menos 30 minutos de anticipación</li>
            <li>Recuerda traer un documento de identidad válido</li>
        </ul>

        <div class="footer">
            <p>Si tienes alguna pregunta, contáctanos a ${params.support_email}</p>
            <p>¡Te esperamos en el evento!</p>
            <p>Equipo EventosChile</p>
        </div>
    </div>
</body>
</html>
  `;
};

// Función para enviar email de confirmación de compra
export const sendPurchaseConfirmationEmail = async (
  purchaseDetails: PurchaseDetails,
  ticketPdfBase64?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Generar código QR único para la entrada
    const qrCodeData = `ORD:${purchaseDetails.orderNumber}:USER:${purchaseDetails.user.email}:QTY:${purchaseDetails.quantity}`;

    // Para desarrollo, usar EmailJS
    const templateParams: any = {
      to_name: `${purchaseDetails.user.name} ${purchaseDetails.user.lastName}`,
      to_email: purchaseDetails.user.email,
      order_number: purchaseDetails.orderNumber,
      event_title: purchaseDetails.event.title,
      event_artist: purchaseDetails.event.artist,
      event_date: purchaseDetails.event.date,
      event_time: purchaseDetails.event.time || 'TBD',
      event_venue: purchaseDetails.event.venue,
      event_location: purchaseDetails.event.location || 'Santiago, Chile',
      ticket_quantity: purchaseDetails.quantity.toString(),
      unit_price: purchaseDetails.event.price.toLocaleString('es-CL'),
      service_charge: purchaseDetails.serviceCharge.toLocaleString('es-CL'),
      total_price: purchaseDetails.totalPrice.toLocaleString('es-CL'),
      purchase_date: purchaseDetails.purchaseDate,
      support_email: 'soporte@eventoschile.cl',
      qr_code_data: qrCodeData, // Agregar datos del QR para el template
    };

    // Agregar adjunto PDF si está disponible
    if (ticketPdfBase64) {
      templateParams.attachments = [{
        name: `Entrada_${purchaseDetails.orderNumber}.pdf`,
        type: 'application/pdf',
        data: ticketPdfBase64
      }];
    }

    // Enviar usando EmailJS
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    // Aquí podrías agregar lógica para guardar en Google Sheets
    // pero por ahora solo enviamos el email
    console.log('Email enviado exitosamente. Código QR generado:', qrCodeData);
    if (ticketPdfBase64) {
      console.log('PDF adjuntado al email');
    }

    return {
      success: true,
      message: ticketPdfBase64
        ? 'Email de confirmación con entrada adjunta enviado exitosamente'
        : 'Email de confirmación enviado exitosamente'
    };
  } catch (error) {
    console.error('Error al enviar email de confirmación:', error);
    // Log detallado del error para debugging
    if (error instanceof Error) {
      console.error('Detalles del error:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
    return {
      success: false,
      message: `Error al enviar el email de confirmación: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};

// Función para enviar recordatorio del evento (puede ser utilizada posteriormente)
export const sendEventReminderEmail = async (
  user: User,
  event: Event,
  orderNumber: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Para desarrollo, usar EmailJS
    const templateParams = {
      to_name: `${user.name} ${user.lastName}`,
      to_email: user.email,
      order_number: orderNumber,
      event_title: event.title,
      event_artist: event.artist,
      event_date: event.date,
      event_time: event.time || 'TBD',
      event_venue: event.venue,
      event_location: event.location || 'Santiago, Chile',
      support_email: 'soporte@eventoschile.cl',
    };

    // Enviar usando EmailJS (usando el mismo template por simplicidad)
    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    return {
      success: true,
      message: 'Recordatorio enviado exitosamente'
    };
  } catch (error) {
    console.error('Error al enviar recordatorio:', error);
    return {
      success: false,
      message: 'Error al enviar el recordatorio'
    };
  }
};

// Función para generar número de orden único
export const generateOrderNumber = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `ORD-${timestamp}-${random}`;
};

// Función para formatear fecha de compra
export const formatPurchaseDate = (): string => {
  const now = new Date();
  return now.toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// URL de la web app de Google Apps Script para generar entradas
// ⚠️ IMPORTANTE: Reemplaza esta URL con la URL de TU web app desplegada
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxGMNXvDk4RaqunlVScPLlSWqXjureP0ZcMUlxIgJ_65MnjeKuYbRfqzAfHUL_jEv02xA/exec';

// Función para generar entrada usando Google Apps Script
export const generateTicketPDF = async (purchaseDetails: PurchaseDetails): Promise<{ success: boolean; pdfBase64?: string; pdfUrl?: string; message: string }> => {
  try {
    // Preparar datos para enviar a Google Apps Script
    const ticketData = {
      nombrePersona: `${purchaseDetails.user.name} ${purchaseDetails.user.lastName}`,
      email: purchaseDetails.user.email,
      orderNumber: purchaseDetails.orderNumber,
      eventTitle: purchaseDetails.event.title,
      eventArtist: purchaseDetails.event.artist,
      eventDate: purchaseDetails.event.date,
      eventTime: purchaseDetails.event.time || 'TBD',
      eventVenue: purchaseDetails.event.venue,
      eventLocation: purchaseDetails.event.location || 'Santiago, Chile',
      ticketQuantity: purchaseDetails.quantity.toString(),
      unitPrice: purchaseDetails.event.price.toLocaleString('es-CL'),
      serviceCharge: purchaseDetails.serviceCharge.toLocaleString('es-CL'),
      totalPrice: purchaseDetails.totalPrice.toLocaleString('es-CL'),
      purchaseDate: purchaseDetails.purchaseDate,
      codigoGenerado: `ORD:${purchaseDetails.orderNumber}:USER:${purchaseDetails.user.email}:QTY:${purchaseDetails.quantity}`,
      fecha: new Date().toISOString()
    };

    // Hacer la llamada a Google Apps Script
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ticketData)
    });

    if (!response.ok) {
      throw new Error(`Error en la respuesta: ${response.status}`);
    }

    const result = await response.json();

    if (result.success && result.pdfBase64) {
      // Crear blob URL para descarga desde base64
      const pdfBlob = new Blob(
        [Uint8Array.from(atob(result.pdfBase64), c => c.charCodeAt(0))],
        { type: 'application/pdf' }
      );
      const pdfUrl = URL.createObjectURL(pdfBlob);

      return {
        success: true,
        pdfBase64: result.pdfBase64,
        pdfUrl: pdfUrl,
        message: 'Entrada generada exitosamente'
      };
    } else {
      throw new Error(result.error || 'Error desconocido en Google Apps Script');
    }

  } catch (error) {
    console.error('Error generando entrada:', error);
    return {
      success: false,
      message: `Error al generar la entrada: ${error instanceof Error ? error.message : 'Error desconocido'}`
    };
  }
};
