# Script para configurar acceso en red local
# =============================================

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Configurador de Red - Eventos Viña" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Obtener la IP del adaptador de red principal
$networkAdapters = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.IPAddress -notlike "127.*" -and 
    $_.IPAddress -notlike "169.254.*" -and
    $_.PrefixOrigin -eq "Dhcp" -or $_.PrefixOrigin -eq "Manual"
}

if ($networkAdapters.Count -eq 0) {
    Write-Host "❌ No se encontró una dirección IP de red local" -ForegroundColor Red
    Write-Host "Verifica tu conexión de red" -ForegroundColor Yellow
    exit 1
}

Write-Host "Interfaces de red disponibles:" -ForegroundColor Green
Write-Host ""

$index = 1
$networkAdapters | ForEach-Object {
    $adapter = Get-NetAdapter -InterfaceIndex $_.InterfaceIndex
    Write-Host "$index. $($adapter.Name) - $($_.IPAddress)" -ForegroundColor White
    $index++
}

Write-Host ""

if ($networkAdapters.Count -eq 1) {
    $selectedIP = $networkAdapters[0].IPAddress
    Write-Host "✓ IP seleccionada automáticamente: $selectedIP" -ForegroundColor Green
} else {
    $selection = Read-Host "Selecciona el número de la interfaz a usar (1-$($networkAdapters.Count))"
    $selectedIP = $networkAdapters[$selection - 1].IPAddress
    Write-Host "✓ IP seleccionada: $selectedIP" -ForegroundColor Green
}

Write-Host ""
Write-Host "Configurando archivo .env.production..." -ForegroundColor Yellow

# Crear contenido del archivo .env.production
$envContent = @"
# Production Environment Variables - Network Configuration
# Generado automáticamente el $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# IP del host: $selectedIP

# URL de la API
VITE_API_BASE_URL=http://${selectedIP}:5001/api

# URL del servicio de email
VITE_EMAIL_API_URL=http://${selectedIP}:4000/api
"@

# Guardar el archivo
$envContent | Out-File -FilePath ".env.production" -Encoding UTF8 -Force

Write-Host "✓ Archivo .env.production actualizado" -ForegroundColor Green
Write-Host ""

# Verificar si Docker está corriendo
$dockerRunning = docker ps 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Docker está corriendo. ¿Deseas reconstruir el contenedor ahora? (S/N)" -ForegroundColor Yellow
    $rebuild = Read-Host
    
    if ($rebuild -eq "S" -or $rebuild -eq "s") {
        Write-Host ""
        Write-Host "Deteniendo contenedores..." -ForegroundColor Yellow
        docker-compose down
        
        Write-Host "Reconstruyendo imagen..." -ForegroundColor Yellow
        docker-compose build
        
        Write-Host "Iniciando contenedores con HOST_IP=$selectedIP..." -ForegroundColor Yellow
        $env:HOST_IP = $selectedIP
        docker-compose up -d
        
        Write-Host ""
        Write-Host "Esperando que los servicios inicien..." -ForegroundColor Yellow
        Start-Sleep -Seconds 8
        
        Write-Host ""
        Write-Host "=========================================" -ForegroundColor Green
        Write-Host "✓ Contenedor reconstruido y ejecutándose" -ForegroundColor Green
        Write-Host "=========================================" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "Verificando logs..." -ForegroundColor Yellow
        docker logs eventos_vina_dashboard --tail 15
    }
} else {
    Write-Host "Docker no está corriendo o no está instalado" -ForegroundColor Red
    Write-Host "Inicia Docker Desktop antes de continuar" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Configuración completada" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Tu aplicación será accesible en:" -ForegroundColor White
Write-Host "  Frontend:  http://${selectedIP}:3000" -ForegroundColor Green
Write-Host "  API:       http://${selectedIP}:5001" -ForegroundColor Green
Write-Host "  Email:     http://${selectedIP}:4000" -ForegroundColor Green
Write-Host ""
Write-Host "Desde otros computadores en la red, usa estas URLs" -ForegroundColor Yellow
Write-Host ""
Write-Host "Nota: Asegúrate de configurar el firewall de Windows:" -ForegroundColor Cyan
Write-Host "  1. Panel de Control > Sistema y Seguridad > Firewall de Windows" -ForegroundColor White
Write-Host "  2. Configuración avanzada > Reglas de entrada" -ForegroundColor White
Write-Host "  3. Permitir puertos: 3000, 4000, 5001" -ForegroundColor White
Write-Host ""

# Crear reglas de firewall automáticamente (requiere admin)
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
    Write-Host "¿Deseas crear reglas de firewall automáticamente? (S/N)" -ForegroundColor Yellow
    $createRules = Read-Host
    
    if ($createRules -eq "S" -or $createRules -eq "s") {
        Write-Host "Creando reglas de firewall..." -ForegroundColor Yellow
        
        # Eliminar reglas existentes si existen
        Remove-NetFirewallRule -DisplayName "Eventos Viña - Frontend" -ErrorAction SilentlyContinue
        Remove-NetFirewallRule -DisplayName "Eventos Viña - API" -ErrorAction SilentlyContinue
        Remove-NetFirewallRule -DisplayName "Eventos Viña - Email" -ErrorAction SilentlyContinue
        
        # Crear nuevas reglas
        New-NetFirewallRule -DisplayName "Eventos Viña - Frontend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow | Out-Null
        New-NetFirewallRule -DisplayName "Eventos Viña - API" -Direction Inbound -LocalPort 5001 -Protocol TCP -Action Allow | Out-Null
        New-NetFirewallRule -DisplayName "Eventos Viña - Email" -Direction Inbound -LocalPort 4000 -Protocol TCP -Action Allow | Out-Null
        
        Write-Host "✓ Reglas de firewall creadas correctamente" -ForegroundColor Green
    }
} else {
    Write-Host "Ejecuta este script como Administrador para crear reglas de firewall automáticamente" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Presiona Enter para salir..."
Read-Host
