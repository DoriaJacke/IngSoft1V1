# 🐳 Guía de Instalación de Docker

## 📦 Instalación de Docker

### Windows

1. **Descargar Docker Desktop:**
   - Ir a: https://www.docker.com/products/docker-desktop/
   - Descargar "Docker Desktop for Windows"

2. **Instalar Docker Desktop:**
   - Ejecutar el instalador descargado
   - Seguir las instrucciones del asistente
   - Reiniciar el equipo si es necesario

3. **Verificar instalación:**
   ```powershell
   docker --version
   docker-compose --version
   ```

### Linux (Ubuntu/Debian)

```bash
# Actualizar paquetes
sudo apt update

# Instalar Docker
sudo apt install docker.io docker-compose

# Agregar usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión o ejecutar:
newgrp docker

# Verificar instalación
docker --version
docker-compose --version
```

### macOS

1. **Descargar Docker Desktop:**
   - Ir a: https://www.docker.com/products/docker-desktop/
   - Descargar "Docker Desktop for Mac"

2. **Instalar:**
   - Arrastrar Docker.app a la carpeta Applications
   - Ejecutar Docker desde Applications

3. **Verificar:**
   ```bash
   docker --version
   docker-compose --version
   ```

## 🚀 Ejecución Después de Instalación

Una vez instalado Docker:

```bash
# Navegar al directorio del proyecto
cd reportes/

# Ejecutar con script (recomendado)
.\docker-run.ps1     # Windows
./docker-run.sh      # Linux/Mac

# O manualmente
docker-compose up --build -d
```

## 🔧 Configuración Inicial

### Windows - Configurar WSL2 (si es necesario)

Docker Desktop puede requerir WSL2:

1. Abrir PowerShell como administrador
2. Ejecutar:
   ```powershell
   wsl --install
   ```
3. Reiniciar el sistema
4. Configurar Docker para usar WSL2

### Recursos Mínimos Recomendados

- **RAM:** 4GB mínimo, 8GB recomendado
- **Disco:** 2GB de espacio libre
- **CPU:** Soporte para virtualización habilitado

## 🛠️ Troubleshooting Común

### "Docker no está ejecutándose"
```bash
# Windows - Iniciar Docker Desktop
# Buscar "Docker Desktop" en el menú inicio y ejecutar

# Linux - Iniciar servicio Docker
sudo systemctl start docker
sudo systemctl enable docker
```

### "Cannot connect to Docker daemon"
```bash
# Verificar que Docker está ejecutándose
docker info

# Linux - Verificar permisos
sudo usermod -aG docker $USER
newgrp docker
```

### "Puerto 5001 ocupado"
Cambiar puerto en `docker-compose.yml`:
```yaml
ports:
  - "5002:5001"  # Usar puerto 5002 en lugar de 5001
```

## 📋 Verificación Post-Instalación

```bash
# Probar Docker
docker run hello-world

# Probar Docker Compose
cd reportes/
docker-compose config
```

## 🔗 Enlaces Útiles

- **Docker Desktop:** https://www.docker.com/products/docker-desktop/
- **Documentación Docker:** https://docs.docker.com/
- **Docker Compose:** https://docs.docker.com/compose/
- **WSL2 (Windows):** https://docs.microsoft.com/en-us/windows/wsl/install