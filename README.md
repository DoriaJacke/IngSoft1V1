# 📊 API de Reportes - Eventos Viña

**Proyecto:** IngSoft1V1  
**Historia de Usuario:** MFLP-15 - Reportes de ventas por evento, fecha y categoría

## 👥 Integrantes
- Andres Calderon
- Bastian Kramarenko
- Joaquin Fuenzalida
- Benjamin Vallejos

## 🎯 Historia de Usuario Implementada

**"Como administrador quiero ver el reporte de ventas por evento, fecha y categoría para tomar decisiones estratégicas. El sistema otorga los reportes vía PDF y Excel. El sistema puede filtrar mediante el tipo de entrada (sector)"**

## 🚀 Ejecución Rápida

### 🐳 Docker Hub (Más Fácil)
```bash
docker run -d -p 5001:5001 --name eventos-reportes jfuenzalida/eventos-vina-reportes:latest
```
**Acceder a:** http://localhost:5001/docs/

### 🔧 Docker Local
```bash
.\docker-run.ps1     # Windows
./docker-run.sh      # Linux/Mac
```

### 📦 Instalación Local
```bash
pip install -r requirements.txt
python crear_datos_testing.py
python app_reportes.py
```

## 📊 Endpoints Principales

- **Swagger UI:** http://localhost:5001/docs/
- **Reportes JSON:** `/reportes/ventas?formato=json`
- **Reportes PDF:** `/reportes/ventas?formato=pdf`
- **Reportes Excel:** `/reportes/ventas?formato=excel`

### Filtros Disponibles:
- `evento_id` - Por evento específico
- `sector_id` - Por tipo de entrada
- `fecha_inicio` / `fecha_fin` - Por rango de fechas

## 🧪 Datos de Prueba

Incluye **5 eventos** con datos completos:
- 801 entradas vendidas
- 318 transacciones
- 17 sectores diferentes
- $70,470,000 en ventas totales

## 🐳 Docker Hub

**Imagen:** `jfuenzalida/eventos-vina-reportes:latest`  
**URL:** https://hub.docker.com/r/jfuenzalida/eventos-vina-reportes
  
