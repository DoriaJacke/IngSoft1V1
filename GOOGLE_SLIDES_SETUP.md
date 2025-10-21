# ⚠️ DEPRECATED - Generación de PDFs con Google Slides

## 🚨 **ESTA IMPLEMENTACIÓN YA NO ES NECESARIA**

**Este archivo está deprecado.** Ahora usamos una solución mucho más simple que genera PDFs directamente en el frontend sin necesidad de Google Apps Script.

### 🎯 **Nueva solución recomendada:**
- 📄 Lee `SIMPLE_PDF_SOLUTION.md` para la implementación actual
- ⚡ Configuración de 5 minutos (solo EmailJS)
- 🔧 Sin Google Apps Script
- 💯 PDFs hermosos generados localmente

---

## 📋 Pasos para implementar la generación de entradas PDF (DEPRECATED)

### 1. 🎨 Crear plantilla en Google Slides

1. **Crea una nueva presentación en Google Slides**
2. **Diseña tu entrada** con estos elementos:
   ```
   - Logo del evento
   - Título del evento
   - Nombre del comprador
   - Fecha y hora
   - Lugar del evento
   - Número de orden
   - Código QR
   - Instrucciones importantes
   ```

3. **Usa placeholders** para los datos dinámicos:
   ```
   {{EVENT_TITLE}}
   {{BUYER_NAME}}
   {{EVENT_DATE}}
   {{EVENT_TIME}}
   {{EVENT_VENUE}}
   {{ORDER_NUMBER}}
   {{QR_CODE_URL}}
   ```

### 2. 🔧 Configurar Google Apps Script

1. **Abrir Apps Script:**
   - Ve a [script.google.com](https://script.google.com)
   - Crea un nuevo proyecto
   - Nómbralo "GeneradorEntradas"

2. **Obtener IDs necesarios:**
   - **Slides Template ID**: URL de tu slides → `1ABC123...XYZ`
   - **Drive Folder ID**: Carpeta donde guardar PDFs → `1DEF456...ABC`

### 3. 📝 Código de Apps Script

Reemplaza el contenido de `Code.gs` con el siguiente código:

```javascript
// IDs de configuración (reemplazar con los tuyos)
const TEMPLATE_SLIDE_ID = 'TU_TEMPLATE_SLIDE_ID_AQUI';
const OUTPUT_FOLDER_ID = 'TU_FOLDER_ID_AQUI';

/**
 * Función principal para generar entrada PDF
 */
function generateTicketPDF(ticketData) {
  try {
    // 1. Hacer copia del template
    const templateFile = DriveApp.getFileById(TEMPLATE_SLIDE_ID);
    const tempCopy = templateFile.makeCopy('Temp_Ticket_' + ticketData.orderNumber);
    const tempSlide = SlidesApp.openById(tempCopy.getId());
    
    // 2. Generar código QR
    const qrCodeUrl = generateQRCode(ticketData);
    
    // 3. Reemplazar placeholders
    const replacements = {
      '{{EVENT_TITLE}}': ticketData.eventTitle,
      '{{BUYER_NAME}}': ticketData.buyerName,
      '{{EVENT_DATE}}': ticketData.eventDate,
      '{{EVENT_TIME}}': ticketData.eventTime,
      '{{EVENT_VENUE}}': ticketData.eventVenue,
      '{{EVENT_LOCATION}}': ticketData.eventLocation,
      '{{ORDER_NUMBER}}': ticketData.orderNumber,
      '{{TICKET_QUANTITY}}': ticketData.quantity,
      '{{QR_CODE_URL}}': qrCodeUrl
    };
    
    replaceTextInSlides(tempSlide, replacements);
    
    // 4. Insertar código QR como imagen
    insertQRCodeImage(tempSlide, qrCodeUrl);
    
    // 5. Convertir a PDF
    const pdfBlob = convertSlidesToPDF(tempSlide);
    
    // 6. Guardar en Drive
    const outputFolder = DriveApp.getFolderById(OUTPUT_FOLDER_ID);
    const pdfFile = outputFolder.createFile(pdfBlob);
    pdfFile.setName(`Entrada_${ticketData.orderNumber}.pdf`);
    
    // 7. Hacer público el archivo
    pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // 8. Limpiar archivo temporal
    DriveApp.getFileById(tempCopy.getId()).setTrashed(true);
    
    // 9. Retornar URL del PDF
    return {
      success: true,
      pdfUrl: pdfFile.getDownloadUrl(),
      fileId: pdfFile.getId(),
      fileName: pdfFile.getName()
    };
    
  } catch (error) {
    console.error('Error generando PDF:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * Generar código QR usando API externa
 */
function generateQRCode(ticketData) {
  const qrData = `ORDER:${ticketData.orderNumber}|EMAIL:${ticketData.buyerEmail}|EVENT:${ticketData.eventTitle}|QTY:${ticketData.quantity}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;
  return qrApiUrl;
}

/**
 * Reemplazar texto en todas las slides
 */
function replaceTextInSlides(presentation, replacements) {
  const slides = presentation.getSlides();
  
  slides.forEach(slide => {
    const textElements = slide.getShapes();
    
    textElements.forEach(element => {
      const textRange = element.getText();
      if (textRange) {
        let text = textRange.asString();
        
        Object.keys(replacements).forEach(placeholder => {
          text = text.replace(new RegExp(placeholder, 'g'), replacements[placeholder]);
        });
        
        textRange.setText(text);
      }
    });
  });
}

/**
 * Insertar imagen del código QR
 */
function insertQRCodeImage(presentation, qrCodeUrl) {
  const slides = presentation.getSlides();
  const firstSlide = slides[0];
  
  // Buscar placeholder para QR (puedes ajustar las coordenadas)
  const qrBlob = UrlFetchApp.fetch(qrCodeUrl).getBlob();
  
  // Insertar imagen en posición específica (ajustar según tu diseño)
  firstSlide.insertImage(qrBlob)
    .setLeft(400)  // Ajustar posición X
    .setTop(300)   // Ajustar posición Y
    .setWidth(150) // Ajustar tamaño
    .setHeight(150);
}

/**
 * Convertir slides a PDF
 */
function convertSlidesToPDF(presentation) {
  const url = `https://docs.google.com/presentation/d/${presentation.getId()}/export/pdf`;
  const response = UrlFetchApp.fetch(url, {
    headers: {
      'Authorization': 'Bearer ' + ScriptApp.getOAuthToken()
    }
  });
  
  return response.getBlob().setName('ticket.pdf');
}

/**
 * Función para testing (usar desde el editor)
 */
function testGenerateTicket() {
  const testData = {
    orderNumber: 'ORD-TEST123',
    eventTitle: 'Rock en el Valle 2024',
    buyerName: 'Juan Pérez',
    buyerEmail: 'juan@example.com',
    eventDate: '29 de marzo, 2024',
    eventTime: '19:00 hrs',
    eventVenue: 'Parque Valle del Sol',
    eventLocation: 'Valparaíso, Chile',
    quantity: '2'
  };
  
  const result = generateTicketPDF(testData);
  console.log(result);
}

/**
 * Función web app para llamar desde tu aplicación
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const result = generateTicketPDF(data);
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 4. 🚀 Desplegar como Web App

1. **En Apps Script:**
   - Haz clic en "Desplegar" > "Nueva implementación"
   - Tipo: "Aplicación web"
   - Ejecutar como: "Yo"
   - Acceso: "Cualquier persona"
   - Copia la URL de la aplicación web

### 5. 🔐 Configurar permisos

1. **Autorizar permisos:**
   - Slides API
   - Drive API
   - URL Fetch

2. **Habilitar APIs:**
   - Ve a Google Cloud Console
   - Habilita Slides API y Drive API

### 6. 📁 Estructura de carpetas en Drive

Crea esta estructura:
```
📁 EventosVina/
  📁 Templates/
    📄 Plantilla_Entrada.slides
  📁 Generated_Tickets/
    📄 (aquí se guardarán los PDFs)
```

## 🎨 Diseño sugerido para la entrada

```
┌─────────────────────────────────────┐
│  EVENTOS VIÑA        [LOGO]         │
├─────────────────────────────────────┤
│                                     │
│        {{EVENT_TITLE}}              │
│                                     │
│  Comprador: {{BUYER_NAME}}          │
│  Fecha: {{EVENT_DATE}}              │
│  Hora: {{EVENT_TIME}}               │
│  Lugar: {{EVENT_VENUE}}             │
│  {{EVENT_LOCATION}}                 │
│                                     │
│  Orden: {{ORDER_NUMBER}}            │
│  Entradas: {{TICKET_QUANTITY}}      │
│                                     │
│           [QR CODE]                 │
│                                     │
│  Presentar en el evento             │
│  Válido para 1 persona              │
└─────────────────────────────────────┘
```

## 🔗 Próximo paso

Una vez configurado esto, necesitarás integrar el servicio en tu aplicación. ¿Quieres que te ayude con esa parte?