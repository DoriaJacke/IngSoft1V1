#!/bin/bash

echo "🐳 Ejecutando Contenedor Docker - Eventos Viña"
echo

# Función para verificar comandos
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar si Docker está instalado
if ! command_exists docker; then
    echo "❌ Error: Docker no está instalado"
    echo "Por favor, instala Docker y vuelve a intentar"
    exit 1
fi

# Verificar si Docker daemon está ejecutándose
if ! docker info >/dev/null 2>&1; then
    echo "❌ Error: Docker daemon no está ejecutándose"
    echo "Por favor, inicia Docker y vuelve a intentar"
    exit 1
fi

echo "✅ Docker detectado y funcionando"

# Verificar si estamos en el directorio correcto
if [ ! -f "app_reportes.py" ]; then
    echo "❌ Error: No se encontró app_reportes.py"
    echo "Asegúrate de estar en el directorio correcto del proyecto"
    exit 1
fi

echo "✅ Proyecto encontrado"

# Detener contenedor anterior si existe
echo "🛑 Deteniendo contenedor anterior (si existe)..."
docker rm -f eventos_vina_dashboard >/dev/null 2>&1

# Verificar puertos
echo "🔍 Verificando puertos..."
if lsof -ti:5001 >/dev/null 2>&1; then
    echo "⚠️ Puerto 5001 está en uso. Intentando liberar..."
    sudo lsof -ti:5001 | xargs kill -9 >/dev/null 2>&1
fi

if lsof -ti:3000 >/dev/null 2>&1; then
    echo "⚠️ Puerto 3000 está en uso. Intentando liberar..."
    sudo lsof -ti:3000 | xargs kill -9 >/dev/null 2>&1
fi

echo "✅ Puertos liberados"

# Construir imagen
echo "🔨 Construyendo imagen Docker..."
if ! docker build -t eventos-vina-dashboard .; then
    echo "❌ Error al construir la imagen Docker"
    exit 1
fi

echo "✅ Imagen construida exitosamente"

# Ejecutar contenedor
echo "🚀 Iniciando contenedor..."
if ! docker run -d --name eventos_vina_dashboard -p 5001:5001 -p 3000:3000 -v "$(pwd)/instance:/app/instance" eventos-vina-dashboard; then
    echo "❌ Error al iniciar el contenedor"
    exit 1
fi

echo "✅ Contenedor iniciado"

# Esperar a que los servicios estén disponibles
echo "⏳ Esperando a que los servicios inicien..."
sleep 10

# Verificar servicios
echo "🔍 Verificando servicios..."
if curl -s http://localhost:5001/eventos/logs >/dev/null 2>&1; then
    echo "✅ API funcionando en puerto 5001"
else
    echo "⚠️ API aún no responde, puede necesitar más tiempo"
fi

if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Frontend funcionando en puerto 3000"
else
    echo "⚠️ Frontend aún no responde, puede necesitar más tiempo"
fi

echo
echo "🎉 ¡Contenedor ejecutándose!"
echo
echo "🌐 URLs disponibles:"
echo "   Frontend: http://localhost:3000"
echo "   API: http://localhost:5001"
echo "   Swagger: http://localhost:5001/docs"
echo
echo "📋 Comandos útiles:"
echo "   Ver logs: docker logs eventos_vina_dashboard"
echo "   Detener: docker stop eventos_vina_dashboard"
echo "   Eliminar: docker rm -f eventos_vina_dashboard"
echo

# Preguntar si abrir en navegador (solo en macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    read -p "¿Abrir la aplicación en el navegador? (s/n): " respuesta
    if [[ "$respuesta" == "s" || "$respuesta" == "S" ]]; then
        open http://localhost:3000
        open http://localhost:5001/docs
    fi
elif command_exists xdg-open; then
    read -p "¿Abrir la aplicación en el navegador? (s/n): " respuesta
    if [[ "$respuesta" == "s" || "$respuesta" == "S" ]]; then
        xdg-open http://localhost:3000 >/dev/null 2>&1 &
        xdg-open http://localhost:5001/docs >/dev/null 2>&1 &
    fi
fi

echo
echo "✅ Script completado. ¡Disfruta tu aplicación!"