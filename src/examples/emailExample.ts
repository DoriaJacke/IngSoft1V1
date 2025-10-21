import { 
  sendPurchaseConfirmationEmail, 
  sendPurchaseConfirmationEmailWithPDF,
  generateAndDownloadTicketPDF
} from '../services/emailService';
import { generateTicketPDFLocal } from '../services/pdfService';
import { PurchaseDetails } from '../types/emailTypes';
import { Event, User } from '../types';

// Ejemplo de uso del servicio de email con PDF LOCAL (RECOMENDADO)
export const emailExampleWithPDF = async () => {
  // Datos de ejemplo para el evento
  const exampleEvent: Event = {
    id: '1',
    title: 'Rock en el Valle 2024',
    artist: 'Varios Artistas',
    date: '29 de marzo, 2024',
    time: '19:00 hrs',
    venue: 'Parque Valle del Sol',
    location: 'Valparaíso, Chile',
    price: 35000,
    description: 'El mejor festival de rock del año',
    image: '/images/rock-valle-2024.jpg',
    category: 'Rock',
    availableTickets: 4999
  };

  // Datos de ejemplo para el usuario
  const exampleUser: User = {
    id: '1',
    email: 'benjamin.lara@example.com',
    name: 'Benjamín',
    lastName: 'Lara'
  };

  // Datos de ejemplo para la compra
  const examplePurchase: PurchaseDetails = {
    orderNumber: 'ORD-17829518372F425',
    event: exampleEvent,
    quantity: 1,
    totalPrice: 39500,
    serviceCharge: 4500,
    purchaseDate: '12 de octubre de 2025, 07:46 p. m.',
    user: exampleUser
  };

  try {
    // Opción 1: Enviar email con PDF generado localmente (NUEVA IMPLEMENTACIÓN)
    console.log('🚀 Enviando email con PDF usando generación local...');
    const result = await sendPurchaseConfirmationEmailWithPDF(examplePurchase, true);
    console.log('Resultado:', result);
    return result;
    
  } catch (error) {
    console.error('Error enviando email:', error);
    throw error;
  }
};

// Ejemplo de uso solo para generar PDF localmente (sin enviar email)
export const generatePDFExample = async () => {
  const examplePurchase: PurchaseDetails = {
    orderNumber: 'ORD-TEST123456',
    event: {
      id: '1',
      title: 'Rock en el Valle 2024',
      artist: 'Varios Artistas',
      date: '29 de marzo, 2024',
      time: '19:00 hrs',
      venue: 'Parque Valle del Sol',
      location: 'Valparaíso, Chile',
      price: 35000,
      description: 'El mejor festival de rock del año',
      image: '/images/rock-valle-2024.jpg',
      category: 'Rock',
      availableTickets: 4999
    },
    quantity: 2,
    totalPrice: 78000,
    serviceCharge: 9000,
    purchaseDate: '12 de octubre de 2025, 19:30 p. m.',
    user: {
      id: '1',
      email: 'test@example.com',
      name: 'Juan',
      lastName: 'Pérez'
    }
  };

  try {
    console.log('📄 Generando PDF localmente...');
    const pdfResult = await generateTicketPDFLocal(examplePurchase);
    console.log('Resultado PDF:', pdfResult);
    return pdfResult;
    
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  }
};

// Ejemplo para generar y descargar PDF automáticamente
export const generateAndDownloadPDFExample = async () => {
  const examplePurchase: PurchaseDetails = {
    orderNumber: 'ORD-DOWNLOAD123',
    event: {
      id: '1',
      title: 'Rock en el Valle 2024',
      artist: 'Varios Artistas',
      date: '29 de marzo, 2024',
      time: '19:00 hrs',
      venue: 'Parque Valle del Sol',
      location: 'Valparaíso, Chile',
      price: 35000,
      description: 'El mejor festival de rock del año',
      image: '/images/rock-valle-2024.jpg',
      category: 'Rock',
      availableTickets: 4999
    },
    quantity: 1,
    totalPrice: 39500,
    serviceCharge: 4500,
    purchaseDate: '12 de octubre de 2025, 19:30 p. m.',
    user: {
      id: '1',
      email: 'test@example.com',
      name: 'Ana',
      lastName: 'García'
    }
  };

  try {
    console.log('📄 Generando y descargando PDF...');
    const result = await generateAndDownloadTicketPDF(examplePurchase);
    console.log('Resultado:', result);
    return result;
    
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  }
};

// Ejemplo de uso del servicio original (sin PDF)
export const emailExample = async () => {
  // Datos de ejemplo para el evento
  const exampleEvent: Event = {
    id: '1',
    title: 'Rock en el Valle 2024',
    artist: 'Varios Artistas',
    date: '29 de marzo, 2024',
    time: '19:00 hrs',
    venue: 'Parque Valle del Sol',
    location: 'Valparaíso, Chile',
    price: 35000,
    description: 'El mejor festival de rock del año',
    image: '/images/rock-valle-2024.jpg',
    category: 'Rock',
    availableTickets: 4999
  };

  // Datos de ejemplo para el usuario
  const exampleUser: User = {
    id: '1',
    email: 'benjamin.lara@example.com',
    name: 'Benjamín',
    lastName: 'Lara'
  };

  // Datos de ejemplo para la compra
  const examplePurchase: PurchaseDetails = {
    orderNumber: 'ORD-17829518372F425',
    event: exampleEvent,
    quantity: 1,
    totalPrice: 39500,
    serviceCharge: 4500,
    purchaseDate: '12 de octubre de 2025, 07:46 p. m.',
    user: exampleUser
  };

  try {
    const result = await sendPurchaseConfirmationEmail(examplePurchase);
    console.log('Email enviado:', result);
    return result;
  } catch (error) {
    console.error('Error enviando email:', error);
    throw error;
  }
};

// Función para preview del HTML sin enviar email
export const previewEmailHTML = (purchaseDetails: PurchaseDetails): string => {
  const params = {
    to_name: `${purchaseDetails.user.name} ${purchaseDetails.user.lastName}`,
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
    order_number: purchaseDetails.orderNumber,
    ticket_pdf_url: null // Para preview sin PDF
  };

  return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmación de Compra - Eventos Viña</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f8fafc;
            padding: 20px;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            padding: 30px 20px;
        }
        
        .logo {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: -0.5px;
        }
        
        .header h1 {
            font-size: 24px;
            font-weight: 600;
            margin-top: 10px;
        }
        
        .content {
            padding: 30px;
        }
        
        .greeting {
            font-size: 16px;
            margin-bottom: 20px;
            color: #4a5568;
        }
        
        .thank-you {
            font-size: 16px;
            margin-bottom: 30px;
            color: #4a5568;
            line-height: 1.6;
        }
        
        .event-card {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
        }
        
        .event-title {
            font-size: 22px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .event-details {
            display: grid;
            gap: 12px;
        }
        
        .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-label {
            font-weight: 600;
            color: #4a5568;
            min-width: 140px;
        }
        
        .detail-value {
            color: #2d3748;
            text-align: right;
            flex: 1;
        }
        
        .order-number-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            margin: 25px 0;
            font-size: 18px;
            font-weight: 700;
        }
        
        .purchase-summary {
            background-color: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
        }
        
        .summary-title {
            font-size: 18px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 20px;
        }
        
        .summary-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .summary-row:last-child {
            border-bottom: 2px solid #667eea;
            font-weight: 700;
            font-size: 16px;
            color: #2d3748;
            margin-top: 10px;
            padding-top: 15px;
        }
        
        .summary-row:nth-last-child(2) {
            border-bottom: none;
            margin-bottom: 10px;
        }
        
        .instructions {
            background-color: #fef5e7;
            border: 1px solid #f6e05e;
            border-radius: 10px;
            padding: 20px;
            margin: 25px 0;
        }
        
        .instructions h4 {
            color: #744210;
            font-size: 16px;
            margin-bottom: 15px;
        }
        
        .instructions ul {
            list-style: none;
            padding-left: 0;
        }
        
        .instructions li {
            color: #744210;
            margin-bottom: 8px;
            padding-left: 20px;
            position: relative;
        }
        
        .instructions li:before {
            content: "•";
            color: #d69e2e;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        
        .footer {
            background-color: #f7fafc;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .footer p {
            color: #718096;
            margin-bottom: 10px;
        }
        
        .contact-info {
            color: #4299e1;
            text-decoration: none;
        }
        
        .team-name {
            color: #2d3748;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">Eventos Viña</div>
            <h1>¡Confirmación de Compra!</h1>
        </div>

        <!-- Content -->
        <div class="content">
            <p class="greeting">Hola ${params.to_name},</p>
            
            <p class="thank-you">
                ¡Gracias por tu compra! Hemos recibido tu pago y confirmamos tu entrada para el siguiente evento:
            </p>

            <!-- Event Details Card -->
            <div class="event-card">
                <h2 class="event-title">${params.event_title}</h2>
                <div class="event-details">
                    <div class="detail-row">
                        <span class="detail-label">Artista:</span>
                        <span class="detail-value">${params.event_artist}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Fecha:</span>
                        <span class="detail-value">${params.event_date}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Hora:</span>
                        <span class="detail-value">${params.event_time}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Lugar:</span>
                        <span class="detail-value">${params.event_venue}, ${params.event_location}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Cantidad de entradas:</span>
                        <span class="detail-value">${params.ticket_quantity}</span>
                    </div>
                </div>
            </div>

            <!-- Order Number -->
            <div class="order-number-section">
                Número de Orden: ${params.order_number}
            </div>

            <!-- Purchase Summary -->
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

            <!-- Instructions -->
            <div class="instructions">
                <h4>Instrucciones importantes:</h4>
                <ul>
                    <li>Presenta tu entrada digital o impresa para validar tu entrada</li>
                    <li>Llega con al menos 30 minutos de anticipación</li>
                    <li>Recuerda traer un documento de identidad válido</li>
                </ul>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Si tienes alguna pregunta, contáctanos a <a href="mailto:soporte@eventosviña.cl" class="contact-info">soporte@eventosviña.cl</a></p>
            <p>¡Te esperamos en el evento!</p>
            <p class="team-name">Equipo Eventos Viña</p>
        </div>
    </div>
</body>
</html>
  `;
};