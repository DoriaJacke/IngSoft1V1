# 🐳 SUBIR CONTENEDOR A DOCKER HUB - EVENTOS VIÑA DASHBOARD

## 📦 Información de la Imagen

**Repositorio:** `jfuenzalida/eventos-vina-dashboard`  
**Tag:** `latest`  
**URL:** https://hub.docker.com/r/jfuenzalida/eventos-vina-dashboard

## 🚀 Usar la Imagen desde Docker Hub

### Ejecutar directamente desde Docker Hub
```bash
# Descargar y ejecutar la imagen
docker run -d -p 5001:5001 --name eventos-reportes jfuenzalida/eventos-vina-reportes:latest

# Acceder a la API
# http://localhost:5001/docs/
```

### Usar con Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  reportes-api:
    image: jfuenzalida/eventos-vina-reportes:latest
    container_name: eventos_vina_reportes
    ports:
      - "5001:5001"
    volumes:
      - ./instance:/app/instance
      - ./reportes_generados:/app/reportes_generados
    environment:
      - FLASK_ENV=production
      - PYTHONUNBUFFERED=1
    restart: unless-stopped
```

## 🔄 Proceso de Actualización

### Para el desarrollador (actualizar imagen)

1. **Hacer cambios en el código**
2. **Construir nueva imagen:**
   ```bash
   docker build -t jfuenzalida/eventos-vina-reportes:latest .
   ```
3. **Subir a Docker Hub:**
   ```bash
   docker push jfuenzalida/eventos-vina-reportes:latest
   ```

### Para usuarios (obtener última versión)

1. **Descargar última imagen:**
   ```bash
   docker pull jfuenzalida/eventos-vina-reportes:latest
   ```
2. **Reiniciar contenedor:**
   ```bash
   docker-compose down
   docker-compose up -d
   ```

## 🏷️ Tags Disponibles

- `latest` - Última versión estable
- `v1.0` - Versión específica (futura)

## 📋 Comandos Útiles

### Gestión básica
```bash
# Descargar imagen
docker pull jfuenzalida/eventos-vina-reportes:latest

# Ver información de la imagen
docker inspect jfuenzalida/eventos-vina-reportes:latest

# Ejecutar con volúmenes
docker run -d \
  -p 5001:5001 \
  -v $(pwd)/instance:/app/instance \
  -v $(pwd)/reportes_generados:/app/reportes_generados \
  --name eventos-reportes \
  jfuenzalida/eventos-vina-reportes:latest
```

### Para desarrollo
```bash
# Construir imagen local
docker build -t eventos-reportes-local .

# Comparar con imagen de Docker Hub
docker run -d -p 5002:5001 eventos-reportes-local
docker run -d -p 5001:5001 jfuenzalida/eventos-vina-reportes:latest
```

## 🔐 Autenticación para Push

Si necesitas hacer push (solo para desarrolladores):

```bash
# Login en Docker Hub
docker login

# Username: jfuenzalida
# Password: [tu password de Docker Hub]

# Verificar login
docker info | grep Username
```

## 🌐 Acceso a la API

Una vez ejecutando:

- **API Principal:** http://localhost:5001
- **Swagger UI:** http://localhost:5001/docs/
- **Health Check:** http://localhost:5001/hello

## 📊 Información de la Imagen

- **Tamaño:** ~812MB
- **Base:** python:3.11-slim
- **Puerto:** 5001
- **Arquitectura:** linux/amd64

## 🔧 Troubleshooting

### Error "unauthorized: authentication required"
```bash
docker login
# Volver a intentar el push
```

### Error "repository does not exist"
```bash
# Verificar que el nombre del repositorio es correcto
docker tag local-image:tag jfuenzalida/eventos-vina-reportes:latest
docker push jfuenzalida/eventos-vina-reportes:latest
```

### Imagen no actualizada
```bash
# Forzar descarga de nueva versión
docker pull jfuenzalida/eventos-vina-reportes:latest --platform linux/amd64
```

## 📈 Estadísticas de Uso

Puedes ver las estadísticas de descarga en:
https://hub.docker.com/r/jfuenzalida/eventos-vina-reportes

## 🚀 Deploy en Producción

```bash
# Servidor de producción
docker run -d \
  --name eventos-reportes-prod \
  -p 80:5001 \
  --restart unless-stopped \
  -v /data/reportes:/app/instance \
  -v /data/reportes_generados:/app/reportes_generados \
  jfuenzalida/eventos-vina-reportes:latest
```