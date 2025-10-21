import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { PurchaseDetails, TicketPDFOptions } from '../types/emailTypes';

// Función para generar PDF de entrada usando solo frontend (optimizado para tamaño)
export const generateTicketPDFLocal = async (
  purchaseDetails: PurchaseDetails,
  options: TicketPDFOptions = {}
): Promise<{ success: boolean; pdfBlob?: Blob; pdfUrl?: string; message: string }> => {
  try {
    console.log('🎫 Generando entrada PDF localmente (optimizado)...');

    // Generar código QR compacto
    const qrCodeData = `ORD:${purchaseDetails.orderNumber}|EMAIL:${purchaseDetails.user.email}|QTY:${purchaseDetails.quantity}`;
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeData, {
      width: 150, // Reducido para menor tamaño
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Crear HTML del ticket compacto
    const ticketHTML = createCompactTicketHTML(purchaseDetails, qrCodeDataURL);
    
    // Crear elemento temporal para renderizar
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = ticketHTML;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.width = '350px'; // Tamaño compacto
    document.body.appendChild(tempDiv);

    // Convertir HTML a canvas con optimización de tamaño
    const canvas = await html2canvas(tempDiv.firstElementChild as HTMLElement, {
      width: 350,
      height: 500,
      scale: 1, // Sin escalado para menor tamaño
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: false
    });

    // Limpiar elemento temporal
    document.body.removeChild(tempDiv);

    // Crear PDF optimizado (formato compacto)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [90, 130], // Formato muy compacto tipo tarjeta
      compress: true
    });

    // Agregar imagen del ticket al PDF con máxima compresión
    const imgData = canvas.toDataURL('image/jpeg', 0.6); // JPEG con 60% calidad
    const imgWidth = 80;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'JPEG', 5, 5, imgWidth, imgHeight);

    // Convertir a Blob
    const pdfBlob = pdf.output('blob');
    
    // Verificar tamaño del PDF
    const pdfSizeKB = pdfBlob.size / 1024;
    console.log(`📊 Tamaño del PDF: ${pdfSizeKB.toFixed(1)} KB`);
    
    if (pdfSizeKB > 40) {
      console.warn('⚠️ PDF aún grande, pero debería funcionar para adjuntos');
    }
    
    // Crear URL para descarga
    const pdfUrl = URL.createObjectURL(pdfBlob);

    console.log('✅ PDF optimizado generado exitosamente');

    return {
      success: true,
      pdfBlob,
      pdfUrl,
      message: `PDF generado exitosamente (${pdfSizeKB.toFixed(1)} KB)`
    };

  } catch (error) {
    console.error('❌ Error generando PDF:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

// Función para crear HTML del ticket compacto y optimizado
const createCompactTicketHTML = (
  purchaseDetails: PurchaseDetails,
  qrCodeDataURL: string
): string => {
  return `
    <div style="
      width: 330px;
      height: 480px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      padding: 15px;
      color: white;
      font-family: Arial, sans-serif;
      font-size: 12px;
    ">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 15px;">
        <h1 style="font-size: 18px; margin: 0; font-weight: bold;">EVENTOS VIÑA</h1>
        <div style="font-size: 10px; opacity: 0.8;">Entrada Digital</div>
      </div>

      <!-- Event Title -->
      <div style="
        background: rgba(255,255,255,0.15);
        padding: 10px;
        border-radius: 8px;
        text-align: center;
        margin-bottom: 15px;
      ">
        <h2 style="font-size: 14px; margin: 0; font-weight: bold;">${purchaseDetails.event.title}</h2>
      </div>

      <!-- Event Details Grid -->
      <div style="
        background: rgba(255,255,255,0.1);
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 15px;
        font-size: 11px;
      ">
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>📅 Fecha:</span>
          <span style="font-weight: bold;">${purchaseDetails.event.date}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>📍 Lugar:</span>
          <span style="font-weight: bold;">${purchaseDetails.event.venue}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
          <span>🎫 Orden:</span>
          <span style="font-weight: bold;">${purchaseDetails.orderNumber}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>👤 Comprador:</span>
          <span style="font-weight: bold;">${purchaseDetails.user.name}</span>
        </div>
      </div>

      <!-- QR Code -->
      <div style="
        text-align: center;
        background: rgba(255,255,255,0.9);
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 10px;
      ">
        <img src="${qrCodeDataURL}" style="width: 80px; height: 80px;" />
        <div style="color: #333; font-size: 9px; margin-top: 5px;">
          Escanea para validar entrada
        </div>
      </div>

      <!-- Footer -->
      <div style="
        text-align: center;
        font-size: 10px;
        opacity: 0.8;
        background: rgba(255,255,255,0.1);
        padding: 8px;
        border-radius: 6px;
      ">
        <div style="font-weight: bold;">Total: $${purchaseDetails.totalPrice.toLocaleString()} CLP</div>
        <div style="margin-top: 3px;">Entrada personal e intransferible</div>
      </div>
    </div>
  `;
};

// Función para descargar el PDF generado
export const downloadTicketPDF = (pdfUrl: string, fileName: string = 'entrada.pdf') => {
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Función para limpiar URLs de blob cuando ya no se necesiten
export const cleanupPDFUrl = (pdfUrl: string) => {
  URL.revokeObjectURL(pdfUrl);
};