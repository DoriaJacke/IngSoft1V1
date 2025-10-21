#!/bin/bash

echo "🐳 Construyendo y ejecutando API de Reportes con Docker..."

# Detener contenedores existentes
echo "📦 Deteniendo contenedores existentes..."
docker-compose down

# Construir imagen
echo "🔨 Construyendo imagen Docker..."
docker-compose build

# Ejecutar contenedores
echo "🚀 Iniciando contenedores..."
docker-compose up -d

# Mostrar logs
echo "📋 Mostrando logs (Ctrl+C para salir)..."
docker-compose logs -f

echo "✅ API disponible en: http://localhost:5001"
echo "📚 Swagger UI: http://localhost:5001/docs/"