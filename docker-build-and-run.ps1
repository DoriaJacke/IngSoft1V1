# Script para construir y ejecutar la aplicación con Docker
# Uso: .\docker-build-and-run.ps1

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Dockerizando Eventos Viña" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Verificar que Docker esté corriendo
Write-Host "`nVerificando Docker..." -ForegroundColor Yellow
try {
    docker version | Out-Null
    Write-Host "✓ Docker está corriendo" -ForegroundColor Green
} catch {
    Write-Host "✗ Error: Docker no está corriendo o no está instalado" -ForegroundColor Red
    Write-Host "Por favor, inicia Docker Desktop y vuelve a intentar" -ForegroundColor Yellow
    exit 1
}

# Detener y eliminar contenedor anterior si existe
Write-Host "`nLimpiando contenedores anteriores..." -ForegroundColor Yellow
docker stop eventos_vina_dashboard 2>$null
docker rm eventos_vina_dashboard 2>$null

# Construir la imagen
Write-Host "`nConstruyendo imagen Docker..." -ForegroundColor Yellow
docker build -t eventos-vina-dashboard .

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n✗ Error al construir la imagen" -ForegroundColor Red
    exit 1
}

Write-Host "`n✓ Imagen construida correctamente" -ForegroundColor Green

# Ejecutar el contenedor
Write-Host "`nIniciando contenedor..." -ForegroundColor Yellow
docker run -d `
    --name eventos_vina_dashboard `
    -p 5001:5001 `
    -p 3000:3000 `
    -v "${PWD}/instance:/app/instance" `
    eventos-vina-dashboard

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n✗ Error al iniciar el contenedor" -ForegroundColor Red
    exit 1
}

Write-Host "`n✓ Contenedor iniciado correctamente" -ForegroundColor Green

# Esperar un momento para que los servicios inicien
Write-Host "`nEsperando que los servicios inicien..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Mostrar logs iniciales
Write-Host "`nLogs del contenedor:" -ForegroundColor Cyan
docker logs eventos_vina_dashboard

Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "✓ Aplicación corriendo" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Frontend:  http://localhost:3000" -ForegroundColor White
Write-Host "API:       http://localhost:5001" -ForegroundColor White
Write-Host "API Docs:  http://localhost:5001/docs" -ForegroundColor White
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "`nComandos útiles:" -ForegroundColor Yellow
Write-Host "  Ver logs:     docker logs -f eventos_vina_dashboard" -ForegroundColor Gray
Write-Host "  Detener:      docker stop eventos_vina_dashboard" -ForegroundColor Gray
Write-Host "  Eliminar:     docker rm -f eventos_vina_dashboard" -ForegroundColor Gray
Write-Host "  Reiniciar:    docker restart eventos_vina_dashboard" -ForegroundColor Gray
Write-Host "==================================" -ForegroundColor Cyan
