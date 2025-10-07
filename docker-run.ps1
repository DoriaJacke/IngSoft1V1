# Script PowerShell para ejecutar con Docker

Write-Host "🐳 Construyendo y ejecutando API de Reportes con Docker..." -ForegroundColor Cyan

# Detener contenedores existentes
Write-Host "📦 Deteniendo contenedores existentes..." -ForegroundColor Yellow
docker-compose down

# Construir imagen
Write-Host "🔨 Construyendo imagen Docker..." -ForegroundColor Yellow
docker-compose build

# Ejecutar contenedores
Write-Host "🚀 Iniciando contenedores..." -ForegroundColor Green
docker-compose up -d

# Mostrar estado
Write-Host "📊 Estado de contenedores:" -ForegroundColor Yellow
docker-compose ps

# Información de acceso
Write-Host ""
Write-Host "✅ API disponible en: http://localhost:5001" -ForegroundColor Green
Write-Host "📚 Swagger UI: http://localhost:5001/docs/" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Para ver logs: docker-compose logs -f" -ForegroundColor Cyan
Write-Host "🛑 Para detener: docker-compose down" -ForegroundColor Red