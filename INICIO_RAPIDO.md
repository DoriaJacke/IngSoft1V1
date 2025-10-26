# 🎯 Inicio Rápido - Eventos Viña Dashboard

## Para Usar en el Mismo Computador (Localhost)

```powershell
# Opción 1: Script automático
.\docker-build-and-run.ps1

# Opción 2: Docker Compose
docker-compose up -d

# Acceder a:
http://localhost:3000
```

---

## Para Usar en Otro Computador (Después de Docker Pull)

### 📖 Lee la guía completa: [DESPLIEGUE_REMOTO.md](./DESPLIEGUE_REMOTO.md)

### ⚡ Inicio Rápido:

**Opción 1: Script Automático (Windows PowerShell - Como Administrador)**
```powershell
.\configure-network.ps1
```

**Opción 2: Script CMD (Windows)**
```cmd
run-network.bat
```

**Opción 3: Manual**
```powershell
# 1. Obtener tu IP
ipconfig  # Busca "Dirección IPv4" (ej: 192.168.1.100)

# 2. Configurar variable de entorno y ejecutar
$env:HOST_IP = "192.168.1.100"  # Reemplaza con TU IP
docker-compose up -d

# 3. Configurar Firewall (como Administrador)
New-NetFirewallRule -DisplayName "Eventos Viña - Frontend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Eventos Viña - API" -Direction Inbound -LocalPort 5001 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Eventos Viña - Email" -Direction Inbound -LocalPort 4000 -Protocol TCP -Action Allow

# 4. Acceder desde otro dispositivo:
http://192.168.1.100:3000
```

---

## 🔍 Verificar que Funciona

```powershell
# Ver logs
docker logs eventos_vina_dashboard

# Debería mostrar:
# ✓ API Flask: http://localhost:5001 (o tu IP)
# ✓ Email Server: http://localhost:4000 (o tu IP)
# ✓ Frontend: http://localhost:3000 (o tu IP)

# Ver estado
docker ps
```

---

## 📱 Acceder desde Móvil

1. Conéctate a la **misma red WiFi** que el servidor
2. Abre el navegador en tu móvil
3. Accede a: `http://192.168.1.100:3000` (reemplaza con la IP del servidor)

---

## 🛠️ Comandos Útiles

```powershell
# Detener
docker-compose down

# Ver logs en tiempo real
docker logs -f eventos_vina_dashboard

# Reiniciar
docker-compose restart

# Reconstruir después de cambios
docker-compose down
docker-compose build
docker-compose up -d
```

---

## 📚 Documentación Completa

- **[DOCKER_README.md](./DOCKER_README.md)**: Guía completa de Docker
- **[DESPLIEGUE_REMOTO.md](./DESPLIEGUE_REMOTO.md)**: Despliegue en red local / otro computador
- **[README.md](./README.md)**: Documentación general del proyecto

---

## ❓ Problemas Comunes

### "Connection refused" desde otro computador

1. Verifica que usaste la variable `HOST_IP` al ejecutar:
   ```powershell
   docker exec eventos_vina_dashboard env | grep HOST_IP
   # Debe mostrar: HOST_IP=192.168.1.100 (tu IP real)
   ```

2. Verifica el firewall:
   ```powershell
   Get-NetFirewallRule | Where-Object {$_.DisplayName -like "*Eventos*"}
   ```

3. Prueba acceso local primero:
   ```powershell
   curl http://192.168.1.100:3000  # Reemplaza con tu IP
   # Si falla, el problema es la configuración
   # Si funciona, el problema es el firewall del otro dispositivo
   ```

### Los emails no llegan

Verifica las credenciales de SendGrid en `.env`:
```bash
SENDGRID_API_KEY=SG.xxx...
SENDGRID_FROM=tu_email@ejemplo.com
```

Reinicia el contenedor:
```powershell
docker-compose restart
```

### El contenedor no inicia

```powershell
# Ver logs de error
docker logs eventos_vina_dashboard

# Ver qué está usando los puertos
netstat -ano | findstr ":3000"
netstat -ano | findstr ":5001"
```

---

## 🆘 Soporte

Si nada funciona:

1. **Limpieza completa**:
   ```powershell
   docker-compose down
   docker system prune -f
   docker-compose build --no-cache
   docker-compose up -d
   ```

2. **Verifica requisitos**:
   - Docker Desktop corriendo
   - WSL 2 habilitado (Windows)
   - Puertos 3000, 4000, 5001 libres

3. **Revisa logs detallados**:
   ```powershell
   docker logs eventos_vina_dashboard --tail 100
   ```
