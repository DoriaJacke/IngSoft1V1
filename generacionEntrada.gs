function generarEntradas() {
  const SLIDES_TEMPLATE_ID = '1KDodkirVXvs0wyq5fF30f7JPWub0y8NcQ4z48Hu48pQ';
  const DRIVE_FOLDER_ID = '15PAd0TyBRqvPdsQ_wlwozYjCUT6cGzEk';

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    SpreadsheetApp.getUi().alert("No se detectó ningún spreadsheet activo.");
    return;
  }

  const sheet = ss.getSheetByName('Hoja 1');
  if (!sheet) {
    SpreadsheetApp.getUi().alert("No se encontró la hoja 'Hoja 1'.");
    return;
  }

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    SpreadsheetApp.getUi().alert("La hoja 'Hoja 1' está vacía o no tiene encabezados.");
    return;
  }

  const headers = data[0];
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const template = DriveApp.getFileById(SLIDES_TEMPLATE_ID);

  // Índices de columnas
  const columnaQR = headers.indexOf("codigoGenerado");
  const columnaNombre = headers.indexOf("nombrePersona");
  const columnaFecha = headers.indexOf("fecha");

  for (let i = 1; i < data.length; i++) {
    const fila = data[i];
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
  }

  SpreadsheetApp.getUi().alert("Entradas generadas correctamente en tu carpeta de Drive");
}
