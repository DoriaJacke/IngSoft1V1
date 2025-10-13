# 🚀 Comandos de Ejecución - Eventos Viña Dashboard

## 📦 **Imágenes Disponibles en Docker Hub**

### **🔹 API Independiente**
- **Repositorio**: `jfuenzalida/eventos-vina-reportes:latest`
- **Tamaño**: 845MB
- **Funcionalidad**: Solo API Flask con Swagger
- **Puerto**: 5001

### **🔹 Proyecto Completo (API + Frontend)**
- **Repositorio**: `jfuenzalida/eventos-vina-dashboard:latest`
- **Tamaño**: 2.27GB
- **Funcionalidad**: API + React Frontend + Panel Admin
- **Puertos**: 5001 (API) + 3000 (Frontend)

## 🚀 **Comandos de Ejecución**

### **Solo API (Backend)**
```bash
docker run -d -p 5001:5001 --name eventos-api jfuenzalida/eventos-vina-reportes:latest
```
**Acceso**: http://localhost:5001/swagger

### **Aplicación Completa (Recomendado)**
```bash
docker run -d -p 5001:5001 -p 3000:3000 --name eventos-dashboard jfuenzalida/eventos-vina-dashboard:latest
```
**Accesos**:
- Frontend: http://localhost:3000
- API: http://localhost:5001/swagger

## 🔧 **Comandos de Gestión**

### **Ver contenedores activos**
```bash
docker ps
```

### **Parar contenedores**
```bash
docker stop eventos-api eventos-dashboard
```

### **Eliminar contenedores**
```bash
docker rm eventos-api eventos-dashboard
```

### **Ver logs**
```bash
docker logs eventos-dashboard
```

## 🎯 **Funcionalidades Incluidas**

### **✅ Para Usuarios:**
- 🎫 Catálogo de eventos con detalles completos
- 💳 Sistema de compra de entradas
- 👤 Registro automático de usuarios
- 🔄 Actualización en tiempo real

### **✅ Para Administradores:**
- 🔑 Acceso mediante botón "Administrador" en login
- ⚙️ Panel de gestión de eventos
- 📊 Reportes y estadísticas en tiempo real
- 🔗 Integración API-Frontend sincronizada

## 🌍 **URLs de Docker Hub**
- **API**: https://hub.docker.com/r/jfuenzalida/eventos-vina-reportes
- **Dashboard**: https://hub.docker.com/r/jfuenzalida/eventos-vina-dashboard

## 📋 **Versión Actual**
- **Dashboard**: v1.3 (con corrección de comunicación API)
- **API**: v1.1 (optimizada y estable)
- **Estado**: ✅ Completamente funcional y probado

---
*Desarrollado para gestión de eventos con tecnologías modernas: Flask, React, TypeScript, Docker*