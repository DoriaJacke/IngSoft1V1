import emailjs from '@emailjs/browser';
import { Event, User } from '../types';

// Configuración de EmailJS
// NOTA: Estas claves deben ser configuradas en el panel de EmailJS
const EMAILJS_SERVICE_ID = 'your_service_id'; // Reemplazar con tu Service ID
const EMAILJS_TEMPLATE_ID = 'your_template_id'; // Reemplazar con tu Template ID
const EMAILJS_PUBLIC_KEY = 'your_public_key'; // Reemplazar con tu Public Key

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

// Función para enviar email de confirmación de compra
export const sendPurchaseConfirmationEmail = async (
  purchaseDetails: PurchaseDetails
): Promise<{ success: boolean; message: string }> => {
  try {
    // Preparar los datos del template
    const templateParams = {
      to_email: purchaseDetails.user.email,
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
      event_image: purchaseDetails.event.image,
      support_email: 'soporte@eventoschile.cl',
    };

    // Enviar el email
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Email de confirmación enviado exitosamente'
      };
    } else {
      throw new Error(`Error en el envío: ${response.status}`);
    }
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
      to_email: user.email,
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

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      'reminder_template_id', // Template diferente para recordatorios
      templateParams
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Recordatorio enviado exitosamente'
      };
    } else {
      throw new Error(`Error en el envío: ${response.status}`);
    }
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