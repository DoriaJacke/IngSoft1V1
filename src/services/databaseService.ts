import { PurchaseDetails, EmailResult } from '../types/emailTypes';

const API_BASE_URL = 'http://localhost:5000/api';
const NODE_API_URL = 'http://localhost:4000/api';

// Servicio para manejar usuarios
export const userService = {
  async createOrGetUser(userData: { email: string; name: string; lastName: string }) {
    try {
      // Primero intentar obtener el usuario por email
      const response = await fetch(`${API_BASE_URL}/users/email/${encodeURIComponent(userData.email)}`);
      
      if (response.ok) {
        const result = await response.json();
        return result.user;
      }
      
      // Si no existe, crear nuevo usuario
      const createResponse = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!createResponse.ok) {
        throw new Error('Error creando usuario');
      }
      
      const createResult = await createResponse.json();
      return createResult.user;
    } catch (error) {
      console.error('Error en userService:', error);
      throw error;
    }
  },

  async getUserPurchases(userId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/purchases/user/${userId}`);
      
      if (!response.ok) {
        throw new Error('Error obteniendo compras del usuario');
      }
      
      const result = await response.json();
      return result.purchases;
    } catch (error) {
      console.error('Error obteniendo compras:', error);
      throw error;
    }
  }
};

// Servicio para manejar compras
export const purchaseService = {
  async createPurchase(purchaseData: {
    userId: number;
    eventId: string;
    quantity: number;
    unitPrice: number;
    serviceCharge: number;
    totalPrice: number;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/purchases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(purchaseData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creando compra');
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error creando compra:', error);
      throw error;
    }
  },

  async getPurchaseByOrder(orderNumber: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/purchases/order/${orderNumber}`);
      
      if (!response.ok) {
        throw new Error('Compra no encontrada');
      }
      
      const result = await response.json();
      return result.purchase;
    } catch (error) {
      console.error('Error obteniendo compra:', error);
      throw error;
    }
  },

  async updateEmailStatus(purchaseId: number, emailData: {
    emailSent: boolean;
    subject?: string;
    messageId?: string;
    errorMessage?: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/purchases/${purchaseId}/email-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });
      
      if (!response.ok) {
        throw new Error('Error actualizando estado de email');
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error actualizando email status:', error);
      throw error;
    }
  }
};

// Servicio para manejar tickets
export const ticketService = {
  async getPurchaseTickets(purchaseId: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/purchase/${purchaseId}`);
      
      if (!response.ok) {
        throw new Error('Error obteniendo tickets');
      }
      
      const result = await response.json();
      return result.tickets;
    } catch (error) {
      console.error('Error obteniendo tickets:', error);
      throw error;
    }
  },

  async validateTicket(ticketNumber: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${ticketNumber}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error validando ticket');
      }
      
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error validando ticket:', error);
      throw error;
    }
  }
};

// Función principal para procesar compra completa con persistencia
export const processCompletePurchase = async (purchaseDetails: PurchaseDetails): Promise<{
  success: boolean;
  message: string;
  purchaseId?: number;
  orderNumber?: string;
}> => {
  try {
    console.log('🛒 Procesando compra completa con SQLAlchemy...');
    
    // 1. Crear o obtener usuario
    const user = await userService.createOrGetUser({
      email: purchaseDetails.user.email,
      name: purchaseDetails.user.name,
      lastName: purchaseDetails.user.lastName
    });
    
    console.log('👤 Usuario obtenido/creado:', user.id);
    
    // 2. Crear compra en la base de datos
    const purchaseResult = await purchaseService.createPurchase({
      userId: user.id,
      eventId: purchaseDetails.event.id,
      quantity: purchaseDetails.quantity,
      unitPrice: purchaseDetails.event.price,
      serviceCharge: purchaseDetails.serviceCharge,
      totalPrice: purchaseDetails.totalPrice
    });
    
    console.log('💾 Compra creada en BD:', purchaseResult.purchase.orderNumber);
    
    // 3. Enviar email de confirmación usando el servidor Node.js existente
    try {
      const emailResult = await sendPurchaseConfirmationEmailViaNodeAPI({
        ...purchaseDetails,
        orderNumber: purchaseResult.purchase.orderNumber
      });
      
      // 4. Actualizar estado del email en la base de datos
      await purchaseService.updateEmailStatus(purchaseResult.purchase.id, {
        emailSent: emailResult.success,
        subject: 'Confirmación de compra - Eventos Viña',
        messageId: emailResult.messageId,
        errorMessage: emailResult.success ? undefined : emailResult.message
      });
      
      console.log('📧 Email enviado y estado actualizado');
    } catch (emailError) {
      console.warn('⚠️ Error enviando email, pero compra guardada:', emailError);
      
      // Actualizar estado de error en la base de datos
      await purchaseService.updateEmailStatus(purchaseResult.purchase.id, {
        emailSent: false,
        subject: 'Confirmación de compra - Eventos Viña',
        errorMessage: emailError instanceof Error ? emailError.message : 'Error desconocido'
      });
    }
    
    return {
      success: true,
      message: 'Compra procesada exitosamente',
      purchaseId: purchaseResult.purchase.id,
      orderNumber: purchaseResult.purchase.orderNumber
    };
    
  } catch (error) {
    console.error('❌ Error procesando compra completa:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error procesando compra'
    };
  }
};

// Función para enviar email usando el servidor Node.js existente
const sendPurchaseConfirmationEmailViaNodeAPI = async (
  purchaseDetails: PurchaseDetails
): Promise<EmailResult & { messageId?: string }> => {
  try {
    // Generar HTML del email (usando la función existente)
    const emailHTML = generateEmailHTML({
      user_name: purchaseDetails.user.name,
      user_email: purchaseDetails.user.email,
      event_title: purchaseDetails.event.title,
      event_artist: purchaseDetails.event.artist,
      event_date: purchaseDetails.event.date,
      event_time: purchaseDetails.event.time || 'TBD',
      event_venue: purchaseDetails.event.venue,
      event_location: purchaseDetails.event.location,
      ticket_quantity: purchaseDetails.quantity.toString(),
      order_number: purchaseDetails.orderNumber,
      unit_price: purchaseDetails.event.price.toLocaleString('es-CL'),
      service_charge: purchaseDetails.serviceCharge.toLocaleString('es-CL'),
      total_price: purchaseDetails.totalPrice.toLocaleString('es-CL'),
      purchase_date: purchaseDetails.purchaseDate
    });
    
    // Enviar email usando la API de Node.js existente
    const response = await fetch(`${NODE_API_URL}/send-confirmation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        toEmail: purchaseDetails.user.email,
        toName: purchaseDetails.user.name,
        subject: 'Confirmación de compra - Eventos Viña',
        html: emailHTML
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error enviando email');
    }
    
    const result = await response.json();
    
    return {
      success: true,
      message: `Email enviado exitosamente a ${purchaseDetails.user.email}`,
      messageId: result.messageId
    };
    
  } catch (error) {
    console.error('❌ Error enviando email via Node API:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido al enviar email'
    };
  }
};

// Función para generar HTML del email (reutilizada del emailService original)
const generateEmailHTML = (params: {
  user_name: string;
  user_email: string;
  event_title: string;
  event_artist: string;
  event_date: string;
  event_time: string;
  event_venue: string;
  event_location: string;
  ticket_quantity: string;
  order_number: string;
  unit_price: string;
  service_charge: string;
  total_price: string;
  purchase_date: string;
}): string => {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Compra</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .ticket-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .order-number-section { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; text-align: center; margin: 20px 0; border-radius: 8px; font-weight: bold; font-size: 16px; }
        .purchase-summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .summary-title { color: #333; margin-bottom: 15px; font-size: 18px; font-weight: bold; }
        .summary-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
        .instructions { background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; border-top: 1px solid #eee; }
        .detail-row { margin-bottom: 10px; }
        .detail-label { font-weight: bold; color: #555; }
        .detail-value { color: #333; }
        .contact-info { color: #667eea; text-decoration: none; }
        .contact-info:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: white; margin: 0;">¡Confirmación de Compra!</h1>
        </div>
        
        <div class="content">
            <p style="font-size: 16px;">Hola <strong>${params.user_name}</strong>,</p>
            
            <p>¡Gracias por tu compra! Hemos recibido tu pago y confirmamos tu entrada para el siguiente evento:</p>
            
            <div class="ticket-info">
                <h2 style="margin-top: 0; color: #333;">${params.event_title}</h2>
                <div class="detail-row">
                    <span class="detail-label">🎤 Artista:</span>
                    <span class="detail-value">${params.event_artist}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">📅 Fecha:</span>
                    <span class="detail-value">${params.event_date}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🕐 Hora:</span>
                    <span class="detail-value">${params.event_time}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">📍 Lugar:</span>
                    <span class="detail-value">${params.event_venue}, ${params.event_location}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">🎫 Cantidad de entradas:</span>
                    <span class="detail-value">${params.ticket_quantity}</span>
                </div>
            </div>

            <div class="order-number-section">
                Número de Orden: ${params.order_number}
            </div>

            <div class="purchase-summary">
                <h3 class="summary-title">Resumen de la compra:</h3>
                <div class="summary-row">
                    <span>Entradas (${params.ticket_quantity}):</span>
                    <span>$${params.unit_price} CLP</span>
                </div>
                <div class="summary-row">
                    <span>Cargo por servicio:</span>
                    <span>$${params.service_charge} CLP</span>
                </div>
                <div class="summary-row">
                    <span><strong>Total:</strong></span>
                    <span><strong>$${params.total_price} CLP</strong></span>
                </div>
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e2e8f0; color: #718096; font-size: 14px;">
                    Fecha de compra: ${params.purchase_date}
                </div>
            </div>

            <div class="instructions">
                <h4>Instrucciones importantes:</h4>
                <ul>
                    <li>Presenta tu entrada digital o impresa para validar tu entrada</li>
                    <li>Llega con al menos 30 minutos de anticipación</li>
                    <li>Recuerda traer un documento de identidad válido</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p>Si tienes alguna pregunta, contáctanos a <a href="mailto:soporte@eventosviña.cl" class="contact-info">soporte@eventosviña.cl</a></p>
            <p style="margin: 5px 0; font-size: 14px;">© 2024 Eventos Viña. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>`;
};

// Exportar también las funciones originales para mantener compatibilidad
export * from './emailService';