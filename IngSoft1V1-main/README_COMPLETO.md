# 🎫 Sistema de Venta de Entradas - IngSoft1V1

Sistema completo de gestión y venta de entradas para eventos con backend Flask y frontend React.

## 📋 Descripción

Aplicación web full-stack para la gestión de eventos y venta de entradas con:
- Sistema de autenticación de usuarios
- Catálogo de eventos
- Compra de entradas con procesamiento de pago
- Validación de entradas mediante QR
- Sistema de reportes de ventas (JSON, PDF, Excel)
- Panel de administración de eventos

## 🚀 Stack Tecnológico

### Backend
- **Flask** - Framework web de Python
- **SQLAlchemy** - ORM para base de datos
- **Flask-RESTX** - API REST con Swagger
- **SQLite** - Base de datos
- **reportlab** - Generación de PDFs
- **openpyxl** - Generación de Excel

### Frontend
- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **shadcn/ui** - Componentes de UI
- **html5-qrcode** - Escaneo de códigos QR

## 📦 Instalación

### Prerrequisitos
- Python 3.9+
- Node.js 18+
- Git

### Backend

```bash
# Crear entorno virtual
python -m venv venv

# Activar entorno virtual (Windows)
.\venv\Scripts\Activate.ps1

# Instalar dependencias
pip install -r requirements.txt

# Iniciar API
python -m api.app
```

La API estará disponible en: `http://localhost:5001`

### Frontend

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev
```

El frontend estará disponible en: `http://localhost:3000`

### Servidor de Email (Opcional)

```bash
npm run server
```

Servidor Node.js para envío de emails en: `http://localhost:4000`

## 🗂️ Estructura del Proyecto

```
IngSoft1V1-main/
├── api/                      # Backend Flask
│   ├── routes/              # Endpoints de la API
│   │   ├── events.py        # Gestión de eventos
│   │   ├── purchases.py     # Compras
│   │   ├── tickets.py       # Tickets
│   │   ├── users.py         # Usuarios
│   │   └── reports.py       # Reportes
│   ├── models.py            # Modelos de base de datos
│   ├── app.py               # Aplicación principal
│   └── utils/
│       └── seed_data.py     # Datos iniciales
├── src/                     # Frontend React
│   ├── components/          # Componentes React
│   ├── services/            # Servicios API
│   ├── hooks/               # React Hooks
│   └── types/               # Tipos TypeScript
├── server/                  # Servidor Node.js para emails
├── requirements.txt         # Dependencias Python
├── package.json            # Dependencias Node.js
└── README.md
```

## 📚 Funcionalidades

### 👥 Gestión de Usuarios
- Registro de usuarios
- Autenticación
- Perfil de usuario

### 🎭 Gestión de Eventos
- Listado de eventos disponibles
- Detalles de eventos
- Creación/edición/eliminación (Admin)
- Control de inventario de entradas

### 🛒 Sistema de Compras
- Carrito de compras
- Procesamiento de pagos
- Generación de tickets con QR
- Confirmación por email
- Descuento automático de entradas

### ✅ Validación de Entradas
- Escaneo de código QR
- Verificación de RUT chileno
- Registro de entradas usadas
- Estadísticas de validación

### 📊 Sistema de Reportes
- Reporte de ventas en JSON
- Exportación a PDF profesional
- Exportación a Excel
- Filtros por evento, fecha, sector
- Análisis por sector y evento

## 🔧 Comandos Útiles

### Verificación del Sistema

```bash
# Verificar compras en la base de datos
python verificar_compras.py

# Verificar descuento de entradas
python verificar_entradas.py

# Probar generación de PDF/Excel
python test_pdf_generation.py
```

### API Flask

```bash
# Iniciar API
python -m api.app

# Crear datos de prueba
python -m api.utils.seed_data
```

### Frontend

```bash
# Desarrollo
npm run dev

# Build
npm run build

# Preview
npm run preview
```

## 🌐 API Endpoints

### Eventos
- `GET /api/events` - Listar eventos
- `GET /api/events/{id}` - Obtener evento
- `POST /api/events` - Crear evento
- `DELETE /api/events/{id}` - Eliminar evento

### Compras
- `POST /api/purchases` - Crear compra
- `GET /api/purchases` - Listar compras
- `GET /api/purchases/{id}` - Obtener compra
- `PUT /api/purchases/{id}/status` - Actualizar estado

### Reportes
- `GET /api/reportes/ventas` - Obtener reporte JSON
- `GET /api/reportes/ventas?formato=pdf` - Descargar PDF
- `GET /api/reportes/ventas?formato=excel` - Descargar Excel

### Documentación API
Swagger UI disponible en: `http://localhost:5001/docs/`

## 🔐 Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Flask
FLASK_PORT=5001
FLASK_DEBUG=True
SECRET_KEY=tu-clave-secreta

# Base de datos
DATABASE_URL=sqlite:///entradas.db

# Email (opcional)
SENDGRID_API_KEY=tu-api-key
```

## 📝 Modelos de Datos

### User
- id, email, name, last_name
- password_hash, is_admin
- created_at, updated_at

### Event
- id, title, artist, date, time
- venue, location, price, image
- available_tickets, total_tickets
- category, description, is_active

### Purchase
- id, order_number, user_id, event_id
- quantity, unit_price, service_charge, total_price
- purchase_date, status, email_sent
- qr_code_data

### Ticket
- id, purchase_id, ticket_number
- qr_code_data, is_used, used_at
- seat_info

## 🧪 Testing

```bash
# Backend
python -m pytest

# Frontend
npm run test
```

## 📱 Características Destacadas

✅ **Descuento Automático de Entradas** - Las entradas se descuentan automáticamente al comprar  
✅ **Validación QR con RUT** - Sistema de validación seguro  
✅ **Reportes Profesionales** - PDFs y Excel con formato profesional  
✅ **Responsive Design** - Funciona en móviles y desktop  
✅ **API RESTful** - Documentada con Swagger  
✅ **TypeScript** - Código con tipado estático  
✅ **Estadísticas en Tiempo Real** - Panel de reportes actualizado  

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es para uso educativo - Ver archivo LICENSE para más detalles

## 👥 Autores

- DoriaJacke - [GitHub](https://github.com/DoriaJacke)

## 🐛 Reportar Bugs

Para reportar bugs, abre un issue en GitHub con:
- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado
- Screenshots (si aplica)

## 📞 Soporte

Para preguntas o soporte:
- Abrir un issue en GitHub
- Email: soporte@eventosviña.cl (ejemplo)

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
