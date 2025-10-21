// Configuración
const SPREADSHEET_ID = '108W3oHaMevCwH_Jzde5cAeRhHhRRIj5IfaE-kIWq664'; // Tu spreadsheet existente
const SLIDES_TEMPLATE_ID = '1KDodkirVXvs0wyq5fF30f7JPWub0y8NcQ4z48Hu48pQ'; // Tu plantilla de Slides
const DRIVE_FOLDER_ID = '15PAd0TyBRqvPdsQ_wlwozYjCUT6cGzEk'; // Tu carpeta de entradas
const SHEET_NAME = 'Hoja 1';

// Función doPost para manejar peticiones HTTP desde el frontend
function doPost(e) {
  // Configurar headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  };

  // Manejar preflight request (OPTIONS)
  if (e && e.parameter && e.parameter.method === 'OPTIONS') {
    return ContentService
      .createTextOutput('')
      .setMimeType(ContentService.MimeType.TEXT)
      .setHeaders(headers);
  }

  // Si no hay parámetro 'e', devolver error
  if (!e) {
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Parámetros no válidos'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }

  try {

    // Procesar datos de compra
    if (e.postData && e.postData.contents) {
      const datosCompra = JSON.parse(e.postData.contents);

      // Agregar compra al spreadsheet
      const compraAgregada = agregarCompra(datosCompra);

      if (compraAgregada) {
        // Generar entrada inmediatamente
        generarEntradaPorOrden(datosCompra.orderNumber);

        // Obtener la URL pública del PDF generado
        const pdfUrl = obtenerPdfUrl(datosCompra.orderNumber);

        if (pdfUrl) {
          return ContentService
            .createTextOutput(JSON.stringify({
              success: true,
              pdfUrl: pdfUrl,
              message: 'Entrada generada exitosamente'
            }))
            .setMimeType(ContentService.MimeType.JSON)
            .setHeaders(headers);
        } else {
          return ContentService
            .createTextOutput(JSON.stringify({
              success: false,
              error: 'Error al obtener la URL del PDF generado'
            }))
            .setMimeType(ContentService.MimeType.JSON)
            .setHeaders(headers);
        }
      } else {
        return ContentService
          .createTextOutput(JSON.stringify({
            success: false,
            error: 'Error al agregar la compra'
          }))
          .setMimeType(ContentService.MimeType.JSON)
          .setHeaders(headers);
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Datos no válidos'
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);

  } catch (error) {
    Logger.log('Error en doPost: ' + error.toString());

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };

    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}

// Función para obtener URL pública del PDF por número de orden
function obtenerPdfUrl(orderNumber) {
  try {
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const files = folder.getFiles();

    while (files.hasNext()) {
      const file = files.next();
      const fileName = file.getName();

      // Buscar archivo que contenga el orderNumber
      if (fileName.includes(orderNumber) && fileName.endsWith('.pdf')) {
        // Hacer el archivo público y obtener URL de descarga
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        const fileId = file.getId();
        const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        return downloadUrl;
      }
    }

    Logger.log('PDF no encontrado para orden: ' + orderNumber);
    return null;

  } catch (error) {
    Logger.log('Error obteniendo URL del PDF: ' + error.toString());
    return null;
  }
}

// Función para agregar una nueva compra al spreadsheet
function agregarCompra(datosCompra) {
  /*
  Parámetros esperados en datosCompra:
  {
    nombrePersona: string,
    email: string,
    orderNumber: string,
    eventTitle: string,
    eventArtist: string,
    eventDate: string,
    eventTime: string,
    eventVenue: string,
    eventLocation: string,
    ticketQuantity: number,
    totalPrice: number,
    purchaseDate: string,
    codigoGenerado: string (QR code data)
  }
  */

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    Logger.log("No se detectó ningún spreadsheet activo.");
    return false;
  }

  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log("No se encontró la hoja '" + SHEET_NAME + "'.");
    return false;
  }

  // Verificar si los encabezados existen, si no, crearlos
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (headers.length === 0 || headers[0] === "") {
    // Crear encabezados si no existen
    const defaultHeaders = [
      'nombrePersona', 'email', 'orderNumber', 'eventTitle', 'eventArtist',
      'eventDate', 'eventTime', 'eventVenue', 'eventLocation', 'ticketQuantity',
      'totalPrice', 'purchaseDate', 'codigoGenerado', 'fecha'
    ];
    sheet.getRange(1, 1, 1, defaultHeaders.length).setValues([defaultHeaders]);
  }

  // Preparar fila de datos
  const filaDatos = [
    datosCompra.nombrePersona || '',
    datosCompra.email || '',
    datosCompra.orderNumber || '',
    datosCompra.eventTitle || '',
    datosCompra.eventArtist || '',
    datosCompra.eventDate || '',
    datosCompra.eventTime || '',
    datosCompra.eventVenue || '',
    datosCompra.eventLocation || '',
    datosCompra.ticketQuantity || 1,
    datosCompra.totalPrice || 0,
    datosCompra.purchaseDate || new Date(),
    datosCompra.codigoGenerado || '',
    new Date() // fecha de procesamiento
  ];

  // Agregar fila al final
  sheet.appendRow(filaDatos);

  Logger.log("Compra agregada exitosamente: " + datosCompra.orderNumber);
  return true;
}

// Función para generar entrada para una orden específica
function generarEntradaPorOrden(orderNumber) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    Logger.log("No se detectó ningún spreadsheet activo.");
    return;
  }

  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    Logger.log("No se encontró la hoja '" + SHEET_NAME + "'.");
    return;
  }

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    Logger.log("La hoja '" + SHEET_NAME + "' está vacía o no tiene encabezados.");
    return;
  }

  const headers = data[0];
  const columnaOrderNumber = headers.indexOf("orderNumber");

  if (columnaOrderNumber < 0) {
    Logger.log("No se encontró la columna 'orderNumber'.");
    return;
  }

  // Buscar la fila con el orderNumber
  let filaIndex = -1;
  for (let i = 1; i < data.length; i++) {
    if (data[i][columnaOrderNumber] === orderNumber) {
      filaIndex = i;
      break;
    }
  }

  if (filaIndex === -1) {
    Logger.log("No se encontró la orden: " + orderNumber);
    return;
  }

  // Generar entrada solo para esta fila
  generarEntradasDesdeFilas([filaIndex + 1]); // +1 porque data incluye headers
}

// Función auxiliar para generar entradas desde filas específicas
function generarEntradasDesdeFilas(filasIndices) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const template = DriveApp.getFileById(SLIDES_TEMPLATE_ID);

  // Índices de columnas
  const columnaQR = headers.indexOf("codigoGenerado");
  const columnaNombre = headers.indexOf("nombrePersona");
  const columnaFecha = headers.indexOf("fecha");

  filasIndices.forEach(i => {
    const fila = data[i - 1]; // Ajustar índice
    const nombre = columnaNombre >= 0 ? fila[columnaNombre] || "SinNombre" : "SinNombre";

    // Crear copia de la plantilla
    const copia = template.makeCopy(`${nombre} - Entrada`, folder);
    const presentation = SlidesApp.openById(copia.getId());
    const slide = presentation.getSlides()[0];

    // Reemplazar placeholders de texto
    for (let j = 0; j < headers.length; j++) {
      const placeholder = `{{${headers[j]}}}`;
      const valor = fila[j] || "";
      slide.replaceAllText(placeholder, valor);
    }

    // Formatear fecha si existe
    let fechaFormateada = "";
    if (columnaFecha >= 0 && fila[columnaFecha]) {
      const fechaCol = fila[columnaFecha];
      let fechaObj = fechaCol instanceof Date ? fechaCol : new Date(fechaCol);
      fechaFormateada = Utilities.formatDate(fechaObj, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm");
    }
    slide.replaceAllText("{{fechaHora}}", fechaFormateada);

    // Generar e insertar QR desde api.qrserver.com
    if (columnaQR >= 0 && fila[columnaQR]) {
      try {
        const codigoGenerado = fila[columnaQR];
        const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="
                      + encodeURIComponent(codigoGenerado);

        const response = UrlFetchApp.fetch(qrUrl);
        const blob = response.getBlob().setContentType("image/png");
        const slideImage = slide.insertImage(blob);

        // Posicionar QR en esquina superior derecha
        const slideWidth = presentation.getPageWidth();
        const qrSize = 150;
        const margin = 20;

        slideImage.setWidth(qrSize)
                  .setHeight(qrSize)
                  .setLeft(slideWidth - qrSize - margin)
                  .setTop(margin);

      } catch (e) {
        Logger.log("Error generando QR para " + nombre + ": " + e);
      }
    }

    presentation.saveAndClose();

    // Exportar como PDF
    const pdf = DriveApp.getFileById(copia.getId()).getAs('application/pdf');
    folder.createFile(pdf).setName(`${nombre}_entrada.pdf`);

    // Eliminar archivo PPT original
    DriveApp.getFileById(copia.getId()).setTrashed(true);
  });
}

// Función original para generar todas las entradas
function generarEntradas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    SpreadsheetApp.getUi().alert("No se detectó ningún spreadsheet activo.");
    return;
  }

  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    SpreadsheetApp.getUi().alert("No se encontró la hoja '" + SHEET_NAME + "'.");
    return;
  }

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    SpreadsheetApp.getUi().alert("La hoja '" + SHEET_NAME + "' está vacía o no tiene encabezados.");
    return;
  }

  const filasIndices = [];
  for (let i = 1; i < data.length; i++) {
    filasIndices.push(i + 1); // +1 porque generarEntradasDesdeFilas espera índices 1-based
  }

  generarEntradasDesdeFilas(filasIndices);

  SpreadsheetApp.getUi().alert("Entradas generadas correctamente en tu carpeta de Drive");
}
