# 🎉 Eventos Viña - Dashboard Integrado

Esta guía explica cómo ejecutar el dashboard completo (API + Frontend) usando Docker.

## 📋 Prerrequisitos

- Docker instalado
- Docker Compose instalado

## 🚀 Ejecución Rápida

### Windows (PowerShell)
```powershell
.\docker-run.ps1
```

### Linux/Mac
```bash
chmod +x docker-run.sh
./docker-run.sh
```

### Ejecución Manual
```bash
# Construir y ejecutar
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## 🔗 Acceso a la API

- **API Principal:** http://localhost:5001
- **Swagger UI:** http://localhost:5001/docs/
- **Health Check:** http://localhost:5001/hello

## 📁 Estructura Docker

```
reportes/
├── Dockerfile              # Imagen de la aplicación
├── docker-compose.yml      # Orquestación de servicios
├── .dockerignore           # Archivos a ignorar
├── docker-run.ps1          # Script Windows
└── docker-run.sh           # Script Linux/Mac
```

## 🔧 Configuración

### Variables de Entorno
- `FLASK_ENV=production`
- `PYTHONUNBUFFERED=1`

### Puertos
- **5001:5001** - API de reportes

### Volúmenes
- `./instance:/app/instance` - Base de datos persistente
- `./reportes_generados:/app/reportes_generados` - Reportes generados

## 📊 Comandos Útiles

```bash
# Ver estado de contenedores
docker-compose ps

# Ver logs en tiempo real
docker-compose logs -f

# Reiniciar servicios
docker-compose restart

# Ejecutar comando dentro del contenedor
docker-compose exec reportes-api bash

# Ver recursos utilizados
docker stats

# Eliminar todo (contenedores, redes, volúmenes)
docker-compose down -v
```

## 🧪 Testing con Docker

Una vez ejecutado el contenedor:

1. **Verificar API:** http://localhost:5001/hello
2. **Acceder a Swagger:** http://localhost:5001/docs/
3. **Probar reportes:**
   - JSON: `GET /reportes/ventas?formato=json`
   - PDF: `GET /reportes/ventas?formato=pdf`
   - Excel: `GET /reportes/ventas?formato=excel`

## 🔍 Troubleshooting

### Puerto ocupado
```bash
# Ver qué proceso usa el puerto 5001
netstat -tlnp | grep :5001

# Cambiar puerto en docker-compose.yml
ports:
  - "5002:5001"  # Puerto local 5002
```

### Problemas de permisos
```bash
# Linux: Dar permisos a scripts
chmod +x docker-run.sh

# Windows: Ejecutar PowerShell como administrador
```

### Base de datos no persiste
Verificar que el directorio `instance/` existe y tiene permisos de escritura.

### Ver logs detallados
```bash
docker-compose logs -f reportes-api
```

## 🐳 Información del Contenedor

- **Imagen base:** python:3.11-slim
- **Directorio de trabajo:** /app
- **Puerto expuesto:** 5001
- **Comando de inicio:** python app_reportes.py

## 📈 Monitoreo

### Health Check
Docker incluye un health check que verifica cada 30 segundos:
```bash
curl -f http://localhost:5001/hello
```

### Logs estructurados
```bash
# Seguir logs con timestamp
docker-compose logs -f -t reportes-api
```