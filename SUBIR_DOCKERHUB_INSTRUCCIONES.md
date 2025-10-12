# 🌍 COMANDOS PARA SUBIR A DOCKER HUB

## 📝 INSTRUCCIONES PASO A PASO

### 1. **Reiniciar Docker Desktop**
- Cierra Docker Desktop completamente
- Abre Docker Desktop nuevamente
- Espera a que esté funcionando (icono verde)

### 2. **Verificar que Docker funcione**
```bash
docker --version
docker images
```

### 3. **Ejecutar comandos para subir a Docker Hub**
```bash
# Login (ya hecho, pero por si acaso)
docker login

# Etiquetar imagen
docker tag eventos-vina-dashboard jfuenzalida/eventos-vina-dashboard:latest

# Subir a Docker Hub
docker push jfuenzalida/eventos-vina-dashboard:latest
```

---

## 🤖 SCRIPT AUTOMÁTICO

**Usa el script:** `subir-dockerhub.bat`
1. Haz doble clic en el archivo
2. Sigue las instrucciones en pantalla
3. ¡Listo!

---

## 🌐 DESPUÉS DE SUBIR

### Tu imagen estará disponible en:
- **URL**: https://hub.docker.com/r/jfuenzalida/eventos-vina-dashboard

### Cualquier persona podrá usar:
```bash
docker pull jfuenzalida/eventos-vina-dashboard:latest
docker run -d --name eventos_dashboard -p 5001:5001 -p 3000:3000 jfuenzalida/eventos-vina-dashboard:latest
```

---

## 🎯 RESULTADO FINAL

✅ **Imagen en GitHub**: MFLP-17-Dashboard  
✅ **Imagen en Docker Hub**: jfuenzalida/eventos-vina-dashboard  
✅ **Aplicación Completa**: API + Frontend + Auto-actualización  

**¡Tu aplicación estará disponible globalmente!** 🚀