# 🐳 Comandos para Ejecutar el Contenedor Docker - Eventos Viña

## 📋 Prerrequisitos

1. **Docker Desktop** instalado y ejecutándose
2. **Git** instalado (opcional, para clonar el repositorio)

---

## 🚀 Opción 1: Desde GitHub (Recomendado)

### 1. Clonar el repositorio
```bash
git clone https://github.com/DoriaJacke/IngSoft1V1.git
cd IngSoft1V1
git checkout MFLP-17-Dashboard
```

### 2. Construir y ejecutar el contenedor
```bash
# Construir la imagen Docker
docker build -t eventos-vina-dashboard .

# Ejecutar el contenedor
docker run -d \
  --name eventos_vina_dashboard \
  -p 5001:5001 \
  -p 3000:3000 \
  -v "$(pwd)/instance:/app/instance" \
  eventos-vina-dashboard
```

### 3. Verificar que está funcionando
```bash
# Ver logs del contenedor
docker logs eventos_vina_dashboard

# Verificar que los servicios responden
curl http://localhost:5001/eventos/logs
curl http://localhost:3000
```

### 4. Acceder a la aplicación
- **Frontend**: http://localhost:3000
- **API**: http://localhost:5001
- **Documentación Swagger**: http://localhost:5001/docs

---

## 🔧 Opción 2: Con Docker Compose

### 1. Clonar y navegar al directorio
```bash
git clone https://github.com/DoriaJacke/IngSoft1V1.git
cd IngSoft1V1
git checkout MFLP-17-Dashboard
```

### 2. Ejecutar con Docker Compose
```bash
# Iniciar los servicios
docker-compose up -d

# Ver logs en tiempo real
docker-compose logs -f

# Detener los servicios
docker-compose down
```

---

## 🛠️ Comandos de Gestión del Contenedor

### Ver estado del contenedor
```bash
docker ps
```

### Ver logs del contenedor
```bash
docker logs eventos_vina_dashboard
```

### Acceder al contenedor (terminal)
```bash
docker exec -it eventos_vina_dashboard bash
```

### Reiniciar el contenedor
```bash
docker restart eventos_vina_dashboard
```

### Detener el contenedor
```bash
docker stop eventos_vina_dashboard
```

### Eliminar el contenedor
```bash
docker rm -f eventos_vina_dashboard
```

### Eliminar la imagen
```bash
docker rmi eventos-vina-dashboard
```

---

## 🔍 Comandos de Verificación

### Verificar que Docker está funcionando
```bash
docker --version
docker info
```

### Verificar puertos en uso
```bash
# Windows
netstat -ano | findstr ":5001\|:3000"

# Linux/Mac
netstat -tulpn | grep ":5001\|:3000"
```

### Verificar que los servicios responden
```bash
# Verificar API
curl -X GET http://localhost:5001/eventos/logs

# Verificar Frontend (debe devolver HTML)
curl http://localhost:3000

# Verificar Swagger
curl http://localhost:5001/docs
```

---

## 🚨 Solución de Problemas

### Si los puertos están en uso
```bash
# Windows - Encontrar y terminar procesos
netstat -ano | findstr :5001
netstat -ano | findstr :3000
Stop-Process -Id [PID] -Force

# Linux/Mac - Encontrar y terminar procesos
sudo lsof -ti:5001 | xargs kill -9
sudo lsof -ti:3000 | xargs kill -9
```

### Si Docker no responde
```bash
# Reiniciar Docker Desktop
# En Windows: Reiniciar desde el icono en la bandeja del sistema
# En Linux: sudo systemctl restart docker
```

### Limpiar todo y empezar de nuevo
```bash
# Detener y eliminar el contenedor
docker rm -f eventos_vina_dashboard

# Eliminar la imagen
docker rmi eventos-vina-dashboard

# Limpiar volúmenes huérfanos
docker volume prune

# Construir y ejecutar de nuevo
docker build -t eventos-vina-dashboard .
docker run -d --name eventos_vina_dashboard -p 5001:5001 -p 3000:3000 eventos-vina-dashboard
```

---

## 📱 Comandos de Prueba de la Aplicación

### Probar API desde línea de comandos
```bash
# Listar eventos
curl -X GET http://localhost:5001/eventos/logs

# Agregar un evento
curl -X POST http://localhost:5001/eventos/add \
  -H "Content-Type: application/json" \
  -d '{
    "evento_id": 1,
    "nombre": "Concierto de Prueba",
    "fecha": "2025-12-31",
    "hora": "20:00:00",
    "ubicacion": "Quinta Vergara"
  }'

# Generar reporte
curl -X GET "http://localhost:5001/reportes/ventas?formato=json"
```

### Probar integración Frontend-API
1. Abre http://localhost:3000 en tu navegador
2. Ve a "Gestión de Eventos"
3. Activa la auto-actualización
4. Abre http://localhost:5001/docs en otra pestaña
5. Agrega un evento usando Swagger
6. Verifica que aparece automáticamente en el frontend

---

## 🏷️ Comandos para Diferentes Sistemas Operativos

### Windows (PowerShell)
```powershell
# Clonar repositorio
git clone https://github.com/DoriaJacke/IngSoft1V1.git
cd IngSoft1V1
git checkout MFLP-17-Dashboard

# Construir y ejecutar
docker build -t eventos-vina-dashboard .
docker run -d --name eventos_vina_dashboard -p 5001:5001 -p 3000:3000 -v "${PWD}\instance:/app/instance" eventos-vina-dashboard

# Verificar
docker logs eventos_vina_dashboard
```

### Linux/Mac (Bash)
```bash
# Clonar repositorio
git clone https://github.com/DoriaJacke/IngSoft1V1.git
cd IngSoft1V1
git checkout MFLP-17-Dashboard

# Construir y ejecutar
docker build -t eventos-vina-dashboard .
docker run -d --name eventos_vina_dashboard -p 5001:5001 -p 3000:3000 -v "$(pwd)/instance:/app/instance" eventos-vina-dashboard

# Verificar
docker logs eventos_vina_dashboard
```

---

## 📊 Verificación Final

Una vez ejecutado, deberías poder acceder a:

✅ **Frontend**: http://localhost:3000  
✅ **API**: http://localhost:5001  
✅ **Swagger**: http://localhost:5001/docs  

Y el contenedor debería mostrar logs similares a:
```
🚀 Iniciando Eventos Viña Dashboard...
📊 Iniciando API Flask...
✅ API Flask está respondiendo en puerto 5001
🌐 Iniciando servidor React...
✅ Frontend React está disponible en puerto 3000
🎉 Ambos servicios iniciados exitosamente!
```

---

**¡Listo! Tu aplicación Docker está funcionando.** 🎊