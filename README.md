# 📊 API de Reportes - Eventos Viña

**Proyecto:** IngSoft1V1  
**Historia de Usuario:** MFLP-15 - Reportes de ventas por evento, fecha y categoría

## 👥 Integrantes
- Andres Calderon
- Bastian Kramarenko
- Joaquin Fuenzalida
- Benjamin Vallejos

# Problema
Eventos viña: venta de entradas y verificación de entradas, evitando la duplicación y falsificación de entradas para eventos.

# Página de Selección de Eventos

Esta es una aplicación web para la venta de entradas de eventos que incluye un sistema automatizado de envío de emails de confirmación.

## 🎯 Historias de Usuario Implementadas

### Sistema de Email con SendGrid
**"Como comprador quiero recibir un email de confirmación con mi entrada en PDF para tener comprobante de mi compra"**

### Sistema de Reportes
**"Como administrador quiero ver el reporte de ventas por evento, fecha y categoría para tomar decisiones estratégicas. El sistema otorga los reportes vía PDF y Excel. El sistema puede filtrar mediante el tipo de entrada (sector)"**

## 🚀 Ejecución Rápida

### Frontend (Venta de Entradas + Email)
```bash
npm install
npm run dev        # Frontend en http://localhost:5173
npm run server     # Backend SendGrid en http://localhost:4000
```

### Backend (Reportes - Docker Hub)
```bash
docker run -d -p 5001:5001 --name eventos-reportes jfuenzalida/eventos-vina-reportes:latest
```
**Acceder a:** http://localhost:5001/docs/

### Backend (Reportes - Docker Local)
```bash
.\docker-run.ps1     # Windows
./docker-run.sh      # Linux/Mac
```

### Backend (Reportes - Instalación Local)
```bash
pip install -r requirements.txt
python crear_datos_testing.py
python app_reportes.py
```

## 📧 Sistema de Email con SendGrid

### Funcionalidades
- **Confirmación automática**: Envío de email al completar una compra
- **PDF adjunto**: Entrada digital con código QR único
- **Templates personalizados**: Emails con diseño profesional
- **Estado de envío**: Seguimiento del estado del email en tiempo real
<<<<<<< Updated upstream
- **Manejo de errores**: Notificación al usuario si hay problemas con el envío

### 📧 Características del Email
- Información completa del evento (título, artista, fecha, hora, lugar)
- Número de orden único para cada compra
- Resumen detallado de la compra con precios
- Instrucciones para el día del evento
- Diseño responsive y profesional
- Contacto de soporte incluido

## Configuración del Sistema de Email

1. **Instalar dependencias**:
   ```bash
   npm install @emailjs/browser
   ```

2. **Configurar EmailJS**:
   - Lee las instrucciones detalladas en `EMAIL_SETUP.md`
   - Configura tu cuenta en [EmailJS](https://www.emailjs.com/)
   - Actualiza las credenciales en `src/services/emailService.ts`

3. **Ver ejemplo de email**:
   - Abre `email-template-example.html` en tu navegador para ver cómo se ve el email

## Ejecutar el proyecto

1. **Instalar dependencias**:
   ```bash
   npm install
=======

### Configuración
1. Crea un archivo `.env` en la raíz con:
   ```
   SENDGRID_API_KEY=tu_api_key
   SENDGRID_FROM=tu_email_verificado@ejemplo.com
   PORT=4000
>>>>>>> Stashed changes
   ```

2. Documentación completa: `README_SENDGRID.md`

<<<<<<< Updated upstream
3. **Configurar EmailJS** (ver `EMAIL_SETUP.md` para instrucciones detalladas)
=======
## 📊 Sistema de Reportes (API)
>>>>>>> Stashed changes

### Endpoints Principales
- **Swagger UI:** http://localhost:5001/docs/
- **Reportes JSON:** `/reportes/ventas?formato=json`
- **Reportes PDF:** `/reportes/ventas?formato=pdf`
- **Reportes Excel:** `/reportes/ventas?formato=excel`

### Filtros Disponibles:
- `evento_id` - Por evento específico
- `sector_id` - Por tipo de entrada
- `fecha_inicio` / `fecha_fin` - Por rango de fechas

### Datos de Prueba
- 801 entradas vendidas
- 318 transacciones
- 17 sectores diferentes
- $70,470,000 en ventas totales

## 🛠 Tecnologías Utilizadas

### Frontend
- **React 18** - Framework de interfaz
- **TypeScript** - Tipado estático
- **Vite** - Bundler y servidor de desarrollo
- **Tailwind CSS** - Estilos
- **Radix UI** - Componentes de UI
<<<<<<< Updated upstream
- **EmailJS** - Servicio de envío de emails
=======
>>>>>>> Stashed changes
- **Lucide React** - Iconos

### Backend Email
- **Node.js + Express** - Servidor backend
- **SendGrid** - Envío de emails con adjuntos
- **jsPDF** - Generación de PDFs
- **QRCode** - Códigos QR únicos

### Backend Reportes
- **Python + Flask** - API REST
- **SQLite** - Base de datos
- **ReportLab** - Generación de PDFs
- **OpenPyXL** - Exportación a Excel
- **Docker** - Containerización

## 🐳 Docker Hub

**Imagen Reportes:** `jfuenzalida/eventos-vina-reportes:latest`  
**URL:** https://hub.docker.com/r/jfuenzalida/eventos-vina-reportes

---

<<<<<<< Updated upstream
*Para más información sobre la configuración del sistema de email, consulta `EMAIL_SETUP.md`*
=======
**Documentación detallada:**
- Email con SendGrid: `README_SENDGRID.md`
- Reportes API: `RESUMEN_PROYECTO.md`
>>>>>>> Stashed changes
  
