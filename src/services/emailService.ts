import sgMail from '@sendgrid/mail';
import { Event, User } from '../types';

// Configuración de SendGrid
// NOTA: La API Key debe ser configurada en el panel de SendGrid
const SENDGRID_API_KEY = 'your_sendgrid_api_key'; // Reemplazar con tu API Key de SendGrid
const FROM_EMAIL = 'noreply@eventoschile.cl'; // Email verificado en SendGrid

export interface PurchaseDetails {
  orderNumber: string;
  event: Event;
  quantity: number;
  totalPrice: number;
  serviceCharge: number;
  purchaseDate: string;
  user: User;
}

// Inicializar SendGrid
export const initSendGrid = () => {
  sgMail.setApiKey(SENDGRID_API_KEY);
};

// Función para generar el HTML del email de confirmación
const generateConfirmationEmailHTML = (params: any): string => {
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
  purchaseDetails: PurchaseDetails
): Promise<{ success: boolean; message: string }> => {
  try {
    // Preparar los datos del template
    const templateParams = {
      to_name: `${purchaseDetails.user.name} ${purchaseDetails.user.lastName}`,
      order_number: purchaseDetails.orderNumber,
      event_title: purchaseDetails.event.title,
      event_artist: purchaseDetails.event.artist,
      event_date: purchaseDetails.event.date,
      event_time: purchaseDetails.event.time,
      event_venue: purchaseDetails.event.venue,
      event_location: purchaseDetails.event.location,
      ticket_quantity: purchaseDetails.quantity,
      unit_price: purchaseDetails.event.price.toLocaleString('es-CL'),
      service_charge: purchaseDetails.serviceCharge.toLocaleString('es-CL'),
      total_price: purchaseDetails.totalPrice.toLocaleString('es-CL'),
      purchase_date: purchaseDetails.purchaseDate,
      support_email: 'soporte@eventoschile.cl',
    };

    // Generar HTML
    const htmlContent = generateConfirmationEmailHTML(templateParams);

    // Configurar el mensaje
    const msg = {
      to: purchaseDetails.user.email,
      from: FROM_EMAIL,
      subject: `Confirmación de Compra - ${purchaseDetails.event.title}`,
      html: htmlContent,
    };

    // Enviar el email
    await sgMail.send(msg);

    return {
      success: true,
      message: 'Email de confirmación enviado exitosamente'
    };
  } catch (error) {
    console.error('Error al enviar email de confirmación:', error);
    return {
      success: false,
      message: 'Error al enviar el email de confirmación'
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
    const templateParams = {
      to_name: `${user.name} ${user.lastName}`,
      order_number: orderNumber,
      event_title: event.title,
      event_artist: event.artist,
      event_date: event.date,
      event_time: event.time,
      event_venue: event.venue,
      event_location: event.location,
      support_email: 'soporte@eventoschile.cl',
    };

    // Generar HTML simple para recordatorio
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { color: #6366f1; font-size: 24px; font-weight: bold; }
        .event-info { background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { margin-top: 30px; text-align: center; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">EventosChile</div>
            <h1>Recordatorio de Evento</h1>
        </div>
        
        <p>Hola ${templateParams.to_name},</p>
        
        <p>Te recordamos que tienes una entrada para el siguiente evento:</p>
        
        <div class="event-info">
            <h2>${templateParams.event_title}</h2>
            <p><strong>Artista:</strong> ${templateParams.event_artist}</p>
            <p><strong>Fecha:</strong> ${templateParams.event_date}</p>
            <p><strong>Hora:</strong> ${templateParams.event_time}</p>
            <p><strong>Lugar:</strong> ${templateParams.event_venue}, ${templateParams.event_location}</p>
            <p><strong>Número de Orden:</strong> ${templateParams.order_number}</p>
        </div>
        
        <p>¡No olvides llegar con anticipación!</p>
        
        <div class="footer">
            <p>Si tienes alguna pregunta, contáctanos a ${templateParams.support_email}</p>
            <p>¡Te esperamos!</p>
            <p>Equipo EventosChile</p>
        </div>
    </div>
</body>
</html>
    `;

    // Configurar el mensaje
    const msg = {
      to: user.email,
      from: FROM_EMAIL,
      subject: `Recordatorio - ${event.title}`,
      html: htmlContent,
    };

    // Enviar el email
    await sgMail.send(msg);

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