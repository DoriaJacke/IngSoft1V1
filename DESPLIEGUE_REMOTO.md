# 🚀 Guía de Despliegue en Otro Computador

Esta guía te ayudará a ejecutar el contenedor de Eventos Viña en un computador diferente al que se compiló.

## 📋 Pre-requisitos

- Docker instalado y corriendo
- Acceso a la imagen (via Docker Hub, archivo .tar, o repositorio Git)
- Conexión a la misma red local (para acceso desde otros dispositivos)

---

## 🎯 Método 1: Usando docker-compose (Recomendado)

### Paso 1: Obtener los archivos necesarios

Necesitas estos archivos en tu computador:
- `docker-compose.yml`
- Carpeta `instance/` (para persistencia de base de datos)
- Archivo `.env` (para credenciales de SendGrid)

### Paso 2: Obtener tu IP local

**Windows:**
```powershell
ipconfig
# Busca "Dirección IPv4" - ejemplo: 192.168.1.100
```

**Linux/Mac:**
```bash
ip addr show
# o
ifconfig
```

### Paso 3: Configurar y ejecutar

**Opción A: Usando variable de entorno**
```powershell
# Windows PowerShell
$env:HOST_IP="192.168.1.100"  # Reemplaza con TU IP
docker-compose up -d
```

```bash
# Linux/Mac
HOST_IP=192.168.1.100 docker-compose up -d
```

**Opción B: Usando archivo .env**
```bash
# Crear archivo .env en el mismo directorio que docker-compose.yml
echo "HOST_IP=192.168.1.100" > .env

# Luego ejecutar
docker-compose up -d
```

### Paso 4: Configurar Firewall

**Windows:**
```powershell
# Ejecutar como Administrador
New-NetFirewallRule -DisplayName "Eventos Viña - Frontend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Eventos Viña - API" -Direction Inbound -LocalPort 5001 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Eventos Viña - Email" -Direction Inbound -LocalPort 4000 -Protocol TCP -Action Allow
```

**Linux (Ubuntu/Debian):**
```bash
sudo ufw allow 3000/tcp
sudo ufw allow 5001/tcp
sudo ufw allow 4000/tcp
```

### Paso 5: Verificar que funciona

```powershell
# Ver logs
docker-compose logs -f

# Verificar que los servicios estén corriendo
docker-compose ps
```

Deberías ver:
```
✓ API Flask: http://192.168.1.100:5001
✓ Email Server: http://192.168.1.100:4000
✓ Frontend: http://192.168.1.100:3000
```

### Paso 6: Acceder desde otro dispositivo

En cualquier dispositivo en la misma red:
```
http://192.168.1.100:3000
```

---

## 🐳 Método 2: Docker Run directo

Si solo tienes la imagen Docker (sin docker-compose):

```bash
# Obtener tu IP
ipconfig  # Windows
ip addr   # Linux

# Ejecutar con tu IP
docker run -d \
  --name eventos_vina_dashboard \
  -p 3000:3000 \
  -p 5001:5001 \
  -p 4000:4000 \
  -e HOST_IP=192.168.1.100 \
  -e SENDGRID_API_KEY=tu_api_key \
  -e SENDGRID_FROM=tu_email@ejemplo.com \
  -v $(pwd)/instance:/app/instance \
  eventos-vina-dashboard:latest
```

**PowerShell (Windows):**
```powershell
docker run -d `
  --name eventos_vina_dashboard `
  -p 3000:3000 `
  -p 5001:5001 `
  -p 4000:4000 `
  -e HOST_IP=192.168.1.100 `
  -e SENDGRID_API_KEY=tu_api_key `
  -e SENDGRID_FROM=tu_email@ejemplo.com `
  -v ${PWD}/instance:/app/instance `
  eventos-vina-dashboard:latest
```

---

## 📦 Método 3: Cargar imagen desde archivo .tar

Si te compartieron la imagen en un archivo:

```bash
# Cargar la imagen
docker load -i eventos-vina-dashboard.tar

# Verificar que se cargó
docker images | grep eventos

# Luego usar Método 1 o 2
```

---

## 🔍 Solución de Problemas

### ❌ Error: "Connection refused" o "No se puede conectar"

**Causa**: El firewall está bloqueando las conexiones

**Solución**:
1. Verifica que el contenedor esté corriendo:
   ```bash
   docker ps | grep eventos
   ```

2. Verifica que los puertos estén escuchando:
   ```bash
   netstat -ano | findstr ":3000"
   netstat -ano | findstr ":5001"
   netstat -ano | findstr ":4000"
   ```

3. Configura el firewall (ver Paso 4 arriba)

4. Verifica que HOST_IP sea correcto:
   ```bash
   docker exec eventos_vina_dashboard env | grep HOST_IP
   ```

### ❌ Error: "Las URLs apuntan a localhost"

**Causa**: No se configuró HOST_IP correctamente

**Solución**:
```bash
# Detener el contenedor
docker stop eventos_vina_dashboard
docker rm eventos_vina_dashboard

# Volver a ejecutar con HOST_IP correcto
HOST_IP=192.168.1.100 docker-compose up -d
```

### ❌ Error: "No llegan los emails"

**Causa**: Falta configurar SENDGRID_API_KEY

**Solución**:
1. Verifica que el archivo `.env` tenga las credenciales:
   ```bash
   cat .env
   # Debe contener:
   # SENDGRID_API_KEY=SG.xxx...
   # SENDGRID_FROM=tu_email@ejemplo.com
   ```

2. Reinicia el contenedor:
   ```bash
   docker-compose restart
   ```

### 🔎 Verificar configuración de runtime

```bash
# Ver logs de inicio para verificar que se configuró HOST_IP
docker logs eventos_vina_dashboard | grep "HOST_IP"

# Debería mostrar:
# HOST_IP configurado a: 192.168.1.100
# ✓ URLs actualizadas en index-[hash].js
```

### 🌐 Probar conectividad de red

Desde otro computador:

```bash
# Probar API
curl http://192.168.1.100:5001/api/events

# Probar Frontend (PowerShell en Windows)
Invoke-WebRequest -Uri http://192.168.1.100:3000
```

Si obtienes respuesta, el firewall está bien configurado.

---

## 📱 Acceso desde Dispositivos Móviles

Una vez configurado, puedes acceder desde tu teléfono/tablet:

1. Asegúrate de estar conectado a la **misma red WiFi**
2. Abre el navegador
3. Accede a: `http://192.168.1.100:3000` (reemplaza con tu IP)

---

## 🔄 Actualizar la Aplicación

Si recibes una nueva versión de la imagen:

```bash
# Detener y eliminar contenedor actual
docker-compose down

# Cargar nueva imagen (si es .tar)
docker load -i nueva-version.tar

# O hacer pull (si está en Docker Hub)
docker pull tu-usuario/eventos-vina-dashboard:latest

# Volver a ejecutar con HOST_IP
HOST_IP=192.168.1.100 docker-compose up -d
```

---

## 📊 Comandos Útiles

```bash
# Ver logs en tiempo real
docker-compose logs -f

# Ver solo logs del último minuto
docker-compose logs --tail=50 -f

# Reiniciar servicios
docker-compose restart

# Detener sin eliminar
docker-compose stop

# Iniciar contenedores detenidos
docker-compose start

# Ver uso de recursos
docker stats eventos_vina_dashboard

# Entrar al contenedor para debugging
docker exec -it eventos_vina_dashboard bash
```

---

## ✅ Checklist de Despliegue

- [ ] Docker instalado y corriendo
- [ ] Archivos `docker-compose.yml` y `.env` en el directorio
- [ ] IP local obtenida (192.168.1.X)
- [ ] Variable HOST_IP configurada
- [ ] Firewall configurado para puertos 3000, 4000, 5001
- [ ] Contenedor ejecutándose (`docker ps`)
- [ ] Logs muestran "HOST_IP configurado a: X.X.X.X"
- [ ] Acceso desde navegador local funciona
- [ ] Acceso desde otro dispositivo en la red funciona

---

## 🆘 Soporte

Si encuentras problemas:

1. **Revisa los logs**:
   ```bash
   docker logs eventos_vina_dashboard
   ```

2. **Verifica la configuración**:
   ```bash
   docker exec eventos_vina_dashboard env | grep HOST_IP
   ```

3. **Prueba localhost primero**:
   - Si `http://localhost:3000` no funciona, el problema es el contenedor
   - Si funciona pero `http://192.168.1.100:3000` no, el problema es el firewall

4. **Revisa la red**:
   - Ambos dispositivos deben estar en la **misma red**
   - No usar VPN que aísle el tráfico
   - Verificar que el router no tenga "aislamiento de cliente"

---

## 📝 Notas Importantes

- **HOST_IP** debe ser la IP **del computador que ejecuta Docker**, no del que accede
- Las URLs se reemplazan **en runtime** cada vez que el contenedor inicia
- Si cambias de red (nueva IP), debes reiniciar con nuevo HOST_IP
- La base de datos se persiste en `./instance/entradas.db`
- Los reportes se guardan en `./reportes_generados/`
