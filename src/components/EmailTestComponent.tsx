import React, { useState } from 'react';
import { 
  sendPurchaseConfirmationEmailWithPDF, 
  generateAndDownloadTicketPDF,
} from '../services/emailService';
import { PurchaseDetails } from '../types/emailTypes';
import { Event, User } from '../types';

interface EmailTestComponentProps {
  purchaseDetails?: PurchaseDetails;
}

const EmailTestComponent: React.FC<EmailTestComponentProps> = ({ purchaseDetails }) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [pdfResult, setPdfResult] = useState<any>(null);
  const [emailResult, setEmailResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Datos de ejemplo si no se proporcionan
  const defaultPurchaseDetails: PurchaseDetails = {
    orderNumber: `ORD-${Date.now()}`,
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
    purchaseDate: new Date().toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    user: {
      id: '1',
      email: 'benja.vallejos0704@gmail.com',
      name: 'Usuario',
      lastName: 'Prueba'
    }
  };

  const details = purchaseDetails || defaultPurchaseDetails;

  // EmailJS eliminado. No se requiere inicialización.

  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
    setError(null);
    setPdfResult(null);

    try {
      const result = await generateAndDownloadTicketPDF(details);
      setPdfResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error generando PDF');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSendEmailWithPDF = async () => {
    setIsSendingEmail(true);
    setError(null);
    setEmailResult(null);

    try {
      const result = await sendPurchaseConfirmationEmailWithPDF(details, true);
      setEmailResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error enviando email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#f8fafc', 
        padding: '20px', 
        borderRadius: '12px', 
        marginBottom: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ margin: '0 0 8px 0', color: '#1a202c', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📧 Test de Generación de Entradas PDF
        </h2>
        <p style={{ margin: 0, color: '#64748b' }}>
          Prueba la generación de PDFs con Google Slides y el envío de emails
        </p>
      </div>

      {/* Información de la orden */}
      <div style={{ 
        backgroundColor: '#f7fafc', 
        padding: '16px', 
        borderRadius: '8px', 
        marginBottom: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 12px 0', color: '#2d3748' }}>Datos de la compra:</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '8px', 
          fontSize: '14px' 
        }}>
          <div><strong>Orden:</strong> {details.orderNumber}</div>
          <div><strong>Evento:</strong> {details.event.title}</div>
          <div><strong>Comprador:</strong> {details.user.name} {details.user.lastName}</div>
          <div><strong>Email:</strong> {details.user.email}</div>
          <div><strong>Cantidad:</strong> {details.quantity}</div>
          <div><strong>Total:</strong> ${details.totalPrice.toLocaleString()} CLP</div>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={handleGeneratePDF}
          disabled={isGeneratingPDF}
          style={{
            backgroundColor: isGeneratingPDF ? '#cbd5e0' : '#ffffff',
            border: '1px solid #d2d6dc',
            borderRadius: '6px',
            padding: '12px 24px',
            cursor: isGeneratingPDF ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '500'
          }}
        >
          📥 {isGeneratingPDF ? 'Generando PDF...' : 'Solo Generar PDF'}
        </button>

        <button
          onClick={handleSendEmailWithPDF}
          disabled={isSendingEmail}
          style={{
            backgroundColor: isSendingEmail ? '#9f7aea' : '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '12px 24px',
            cursor: isSendingEmail ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: '500'
          }}
        >
          📧 {isSendingEmail ? 'Enviando...' : 'Enviar Email + PDF'}
        </button>
      </div>

      {/* Resultados */}
      {error && (
        <div style={{
          backgroundColor: '#fed7d7',
          color: '#9b2c2c',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '16px',
          border: '1px solid #feb2b2'
        }}>
          ❌ {error}
        </div>
      )}

      {pdfResult && (
        <div style={{
          backgroundColor: pdfResult.success ? '#c6f6d5' : '#fed7d7',
          color: pdfResult.success ? '#2f855a' : '#9b2c2c',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '16px',
          border: `1px solid ${pdfResult.success ? '#9ae6b4' : '#feb2b2'}`
        }}>
          {pdfResult.success ? (
            <div>
              <p>✅ {pdfResult.message}</p>
              <p style={{ fontSize: '12px', marginTop: '8px', opacity: 0.8 }}>
                El PDF se descargó automáticamente
              </p>
            </div>
          ) : (
            <p>❌ Error: {pdfResult.message}</p>
          )}
        </div>
      )}

      {emailResult && (
        <div style={{
          backgroundColor: emailResult.success ? '#c6f6d5' : '#fed7d7',
          color: emailResult.success ? '#2f855a' : '#9b2c2c',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '16px',
          border: `1px solid ${emailResult.success ? '#9ae6b4' : '#feb2b2'}`
        }}>
          {emailResult.success ? (
            <div>
              <p>✅ {emailResult.message}</p>
              {emailResult.pdfUrl && (
                <a
                  href={emailResult.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ 
                    color: '#2b6cb0', 
                    textDecoration: 'underline',
                    display: 'block',
                    marginTop: '8px'
                  }}
                >
                  📥 Ver PDF enviado
                </a>
              )}
            </div>
          ) : (
            <p>❌ Error: {emailResult.message}</p>
          )}
        </div>
      )}

      {/* Información de configuración */}
      <div style={{
        backgroundColor: '#ebf8ff',
        padding: '16px',
        borderRadius: '8px',
        border: '1px solid #bee3f8',
        marginTop: '24px'
      }}>
        <h4 style={{ margin: '0 0 12px 0', color: '#2c5282' }}>📋 Nueva implementación sin Google Apps Script:</h4>
        <ul style={{ margin: 0, paddingLeft: '20px', color: '#2c5282' }}>
          <li style={{ marginBottom: '4px' }}>
            ✅ Generación de PDF completamente en el frontend
          </li>
          <li style={{ marginBottom: '4px' }}>
            ✅ No requiere configuración de Google Apps Script
          </li>
          <li style={{ marginBottom: '4px' }}>
            ✅ Códigos QR únicos incluidos automáticamente
          </li>
          <li>
            ✅ Envío por backend SendGrid (configura .env con SENDGRID_API_KEY y SENDGRID_FROM)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EmailTestComponent;