# 🐳 Guía de Docker - Eventos Viña

## 📚 Documentación Relacionada

- **[DESPLIEGUE_REMOTO.md](./DESPLIEGUE_REMOTO.md)**: Guía completa para ejecutar en otro computador (después de docker pull)
- **README.md**: Documentación general del proyecto

---

## Requisitos Previos

- Docker Desktop instalado y corriendo
- Windows 10/11 con WSL 2 habilitado (para Docker Desktop)

## Opción 1: Script Automatizado (Recomendado) 🚀

### PowerShell (Windows)
```powershell
.\docker-build-and-run.ps1
```

Este script automáticamente:
- ✅ Verifica que Docker esté corriendo
- ✅ Construye la imagen
- ✅ Inicia el contenedor
- ✅ Muestra los logs iniciales

## Opción 2: Docker Compose 🐙

```powershell
# Construir e iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## Opción 3: Comandos Docker Manuales 🔧

### Construir la imagen
```powershell
docker build -t eventos-vina-dashboard .
```

### Ejecutar el contenedor
```powershell
docker run -d `
  --name eventos_vina_dashboard `
  -p 5001:5001 `
  -p 3000:3000 `
  -v ${PWD}/instance:/app/instance `
  eventos-vina-dashboard
```

## Acceder a la Aplicación 🌐

### Acceso Local (mismo computador)

Una vez iniciado el contenedor:

- **Frontend**: http://localhost:3000
- **API**: http://localhost:5001
- **Email Server**: http://localhost:4000
- **API Docs (Swagger)**: http://localhost:5001/docs

### Acceso desde Red Local (otros computadores) 🌍

Para que otros computadores en tu red puedan acceder:

#### Opción 1: Script Automático (Recomendado) ✨
```powershell
# Ejecutar como Administrador
.\configure-network.ps1
```

Este script:
- ✅ Detecta automáticamente tu IP local
- ✅ Configura `.env.production` con tu IP
- ✅ Reconstruye el contenedor
- ✅ Crea reglas de firewall (opcional)

#### Opción 2: Configuración Manual 🔧

**Paso 1**: Obtén tu IP local
```powershell
ipconfig
# Busca "Dirección IPv4" (ejemplo: 192.168.1.100)
```

**Paso 2**: Edita `.env.production`
```bash
# Reemplaza localhost con tu IP
VITE_API_BASE_URL=http://192.168.1.100:5001/api
VITE_EMAIL_API_URL=http://192.168.1.100:4000/api
```

**Paso 3**: Reconstruye el contenedor
```powershell
docker-compose down
docker-compose build
docker-compose up -d
```

**Paso 4**: Configura el Firewall de Windows
```powershell
# Ejecutar como Administrador
New-NetFirewallRule -DisplayName "Eventos Viña - Frontend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Eventos Viña - API" -Direction Inbound -LocalPort 5001 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Eventos Viña - Email" -Direction Inbound -LocalPort 4000 -Protocol TCP -Action Allow
```

O manualmente:
1. Panel de Control → Sistema y Seguridad → Firewall de Windows
2. Configuración avanzada → Reglas de entrada → Nueva regla
3. Puerto → TCP → Puertos específicos: 3000, 4000, 5001
4. Permitir la conexión → Aplicar a todos los perfiles

**Paso 5**: Accede desde otro computador
```
http://192.168.1.100:3000  (reemplaza con tu IP)
```

### Verificar Conectividad de Red 🔍

Desde otro computador en la red:
```powershell
# Probar conexión al Frontend
curl http://192.168.1.100:3000

# Probar conexión a la API
curl http://192.168.1.100:5001/api/events

# En Windows PowerShell:
Invoke-WebRequest -Uri http://192.168.1.100:5001/api/events
```

### Solución: "Se rechaza la conexión" ❌➡️✅

Si recibes el error "Connection refused" desde otro computador:

1. **Verificar que el contenedor esté corriendo**:
   ```powershell
   docker ps | Select-String "eventos"
   ```

2. **Verificar que los puertos estén escuchando**:
   ```powershell
   netstat -ano | findstr ":3000"
   netstat -ano | findstr ":5001"
   netstat -ano | findstr ":4000"
   ```

3. **Verificar la IP correcta**:
   ```powershell
   ipconfig
   # Asegúrate de usar la IP de tu adaptador de red activo
   # NO uses 127.0.0.1 o localhost para acceso remoto
   ```

4. **Verificar Firewall**:
   ```powershell
   Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*Eventos*"}
   # Debe mostrar las 3 reglas (Frontend, API, Email)
   ```

5. **Probar desde el mismo computador con la IP**:
   ```powershell
   # Si esto falla, el problema es la configuración, no el firewall
   curl http://192.168.1.100:3000  (usa tu IP real)
   ```

6. **Verificar que ambos computadores estén en la misma red**:
   - Deben estar conectados al mismo router/red WiFi
   - No usar VPN que aísle la conexión
   - Verificar que no haya restricciones de red corporativa

## Comandos Útiles 📝

### Ver logs en tiempo real
```powershell
docker logs -f eventos_vina_dashboard
```

### Detener el contenedor
```powershell
docker stop eventos_vina_dashboard
```

### Iniciar el contenedor detenido
```powershell
docker start eventos_vina_dashboard
```

### Reiniciar el contenedor
```powershell
docker restart eventos_vina_dashboard
```

### Eliminar el contenedor
```powershell
docker rm -f eventos_vina_dashboard
```

### Entrar al contenedor (para debugging)
```powershell
docker exec -it eventos_vina_dashboard /bin/bash
```

### Ver estado del contenedor
```powershell
docker ps -a | Select-String "eventos"
```

### Eliminar la imagen
```powershell
docker rmi eventos-vina-dashboard
```

## Solución de Problemas 🔍

### Docker no está corriendo
```powershell
# Error: Cannot connect to the Docker daemon
```
**Solución**: Inicia Docker Desktop y espera que diga "Docker Desktop is running"

### Puerto en uso
```powershell
# Error: Bind for 0.0.0.0:3000 failed: port is already allocated
```
**Solución**: Detén el proceso que usa el puerto o cambia el puerto en docker-compose.yml:
```yaml
ports:
  - "3001:3000"  # Usar puerto 3001 en vez de 3000
```

### Ver qué está usando un puerto
```powershell
netstat -ano | findstr :3000
```

### Reconstruir desde cero
```powershell
# Eliminar todo y reconstruir
docker rm -f eventos_vina_dashboard
docker rmi eventos-vina-dashboard
docker build --no-cache -t eventos-vina-dashboard .
docker run -d --name eventos_vina_dashboard -p 5001:5001 -p 3000:3000 eventos-vina-dashboard
```

### Ver uso de recursos
```powershell
docker stats eventos_vina_dashboard
```

## Persistencia de Datos 💾

La base de datos SQLite se persiste en el volumen:
- **Local**: `./instance/entradas.db`
- **Container**: `/app/instance/entradas.db`

Los datos se mantienen incluso si eliminas el contenedor (siempre que no elimines la carpeta `instance`).

## Variables de Entorno 🔐

Puedes modificar las variables de entorno en `docker-compose.yml`:

```yaml
environment:
  - FLASK_ENV=production
  - NODE_ENV=production
  - PYTHONUNBUFFERED=1
```

## Desarrollo vs Producción 🏗️

### Desarrollo (sin Docker)
```powershell
# Terminal 1 - API
python -m api.app

# Terminal 2 - Frontend
npm run dev
```

### Producción (con Docker)
```powershell
docker-compose up -d
```

## Actualizar la Aplicación 🔄

Después de hacer cambios en el código:

```powershell
# Opción 1: Docker Compose
docker-compose down
docker-compose build
docker-compose up -d

# Opción 2: Docker manual
docker stop eventos_vina_dashboard
docker rm eventos_vina_dashboard
docker build -t eventos-vina-dashboard .
docker run -d --name eventos_vina_dashboard -p 5001:5001 -p 3000:3000 eventos-vina-dashboard
```

## Health Check 🏥

El contenedor tiene un health check configurado que verifica cada 30 segundos que ambos servicios estén respondiendo.

Ver estado de salud:
```powershell
docker inspect eventos_vina_dashboard | Select-String "Health"
```

## Limpieza Completa 🧹

Para eliminar todo (contenedores, imágenes, volúmenes):

```powershell
docker-compose down -v
docker rmi eventos-vina-dashboard
Remove-Item -Recurse -Force ./instance/*.db  # ⚠️ Elimina la base de datos
```

## Exportar/Importar la Imagen 📦

### Exportar
```powershell
docker save eventos-vina-dashboard > eventos-vina-dashboard.tar
```

### Importar
```powershell
docker load < eventos-vina-dashboard.tar
```

## Soporte 💬

Si encuentras problemas:
1. Verifica los logs: `docker logs eventos_vina_dashboard`
2. Verifica que Docker Desktop esté corriendo
3. Asegúrate de que los puertos 3000 y 5001 estén libres
4. Reconstruye desde cero con `--no-cache`
