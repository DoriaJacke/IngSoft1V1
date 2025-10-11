# 🎫 Eventos Viña - Sistema Integrado

Sistema completo de gestión de eventos con API de reportes y aplicación web frontend.

## 🚀 Inicio Rápido

### Prerequisitos
- Python 3.11+
- Node.js 18+
- npm o yarn

### Instalación

1. **Instalar dependencias Python**:
```bash
pip install -r requirements.txt
```

2. **Instalar dependencias Node.js**:
```bash
npm install
```

### Ejecución

**Opción 1: Ejecutar ambos servicios**
```bash
# Terminal 1: API (Puerto 5001)
python app_reportes.py

# Terminal 2: Frontend (Puerto 3000)
npm run dev
```

**Opción 2: Usando Docker**
```bash
# Solo API
docker run -d -p 5001:5001 --name eventos-reportes jfuenzalida/eventos-vina-reportes:latest

# Frontend
npm run dev
```

## 🌐 URLs de Acceso

- **🎨 Frontend**: http://localhost:3000
- **🔧 API**: http://localhost:5001
- **📚 Swagger/Docs**: http://localhost:5001/docs/

## ✨ Características

### 📊 API de Reportes
- **Gestión de eventos**: Agregar, eliminar, listar eventos
- **Reportes de ventas**: Filtros por evento, fecha, sector
- **Formatos de descarga**: PDF, Excel, JSON
- **Análisis estratégico**: Resumen ejecutivo, análisis por sector

### 🎯 Aplicación Web
- **Interfaz moderna**: React + TypeScript + Tailwind
- **Gestión visual**: Formularios intuitivos para eventos
- **Dashboard de reportes**: Métricas visuales y descarga
- **Tiempo real**: Actualizaciones automáticas
- **Responsive**: Compatible con móviles

## 🔌 Endpoints API

### Gestión de Eventos
- `POST /eventos/add` - Agregar evento
- `DELETE /eventos/delete` - Eliminar evento  
- `GET /eventos/logs` - Listar logs de eventos

### Reportes
- `GET /reportes/ventas` - Obtener reporte
- `GET /reportes/ventas?formato=pdf` - Descargar PDF
- `GET /reportes/ventas?formato=excel` - Descargar Excel

## 🛠️ Desarrollo

### Estructura del Proyecto
```
REPORTESPRINT2/
├── app_reportes.py          # API Flask principal
├── src/                     # Frontend React
│   ├── components/         
│   │   ├── EventManagement.tsx  # Gestión de eventos
│   │   ├── Reports.tsx          # Dashboard reportes
│   │   └── ...
│   ├── services/
│   │   └── apiClient.ts         # Cliente HTTP
│   └── ...
├── instance/               # Base de datos SQLite
├── package.json           # Dependencias Node.js
├── requirements.txt       # Dependencias Python
└── README.md
```

### Scripts Disponibles
```bash
npm run dev          # Desarrollo frontend
npm run build        # Build producción
python app_reportes.py    # Ejecutar API
```

## 📖 Documentación

- **[📋 Integración API-Frontend](./INTEGRACION_API_FRONTEND.md)** - Documentación técnica completa
- **[🐳 Docker](./DOCKER_README.md)** - Configuración Docker
- **[📊 API Docs](http://localhost:5001/docs/)** - Swagger interactivo

## 🔧 Configuración

### Variables de Entorno
```bash
# API
FLASK_ENV=development
FLASK_PORT=5001

# Frontend  
VITE_API_URL=http://localhost:5001
```

### Configuración de Base de Datos
La API usa SQLite por defecto. La base de datos se crea automáticamente en `instance/reportes_eventos.db`.

## 🐛 Resolución de Problemas

### Error de Conexión API
1. Verificar que la API esté ejecutándose en puerto 5001
2. Comprobar logs en la consola del navegador
3. Verificar configuración CORS

### Error de Dependencias
```bash
# Python
pip install --upgrade pip
pip install -r requirements.txt

# Node.js
rm -rf node_modules package-lock.json
npm install
```

### Error de CORS
Verificar que Flask-CORS esté instalado:
```bash
pip install flask-cors
```

## 🤝 Equipo

- **Andres Calderon**
- **Bastian Kramarenko** 
- **Joaquin Fuenzalida**
- **Benjamin Vallejos**

## 📝 Notas de Desarrollo

- La aplicación usa proxy de Vite para desarrollo
- Los tipos TypeScript están completamente definidos
- La API incluye validación de datos con Flask-RESTX
- El frontend maneja estados de error y loading
- Ambos servicios incluyen logging para debugging

---

> **✅ Sistema Listo**: La integración entre API y frontend está completa. Inicia ambos servicios y accede a http://localhost:3000 para usar la aplicación.