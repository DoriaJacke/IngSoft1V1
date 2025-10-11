#!/bin/bash

# Script para iniciar ambos servicios en el contenedor Docker
echo "🚀 Iniciando Eventos Viña Dashboard..."

# Crear directorio para logs
mkdir -p /app/logs

# Función para logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a /app/logs/startup.log
}

log "📊 Iniciando API Flask..."
# Iniciar la API Flask en background y redirigir output a log
python app_reportes.py > /app/logs/flask.log 2>&1 &
FLASK_PID=$!

log "⏳ Esperando a que Flask inicie completamente..."
# Esperar a que Flask esté disponible
for i in {1..30}; do
    if curl -s http://localhost:5001/eventos/logs > /dev/null 2>&1; then
        log "✅ API Flask está respondiendo en puerto 5001"
        break
    fi
    if [ $i -eq 30 ]; then
        log "❌ Error: Flask no pudo iniciar después de 30 intentos"
        exit 1
    fi
    sleep 2
done

log "🌐 Iniciando servidor React..."
# Servir la aplicación React construida desde el directorio build (configurado en vite.config.ts)
npx serve -s build -l 3000 > /app/logs/react.log 2>&1 &
REACT_PID=$!

log "⏳ Esperando a que React inicie completamente..."
# Esperar a que React esté disponible
for i in {1..15}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        log "✅ Frontend React está disponible en puerto 3000"
        break
    fi
    if [ $i -eq 15 ]; then
        log "❌ Error: React no pudo iniciar después de 15 intentos"
        exit 1
    fi
    sleep 2
done

log "🎉 Ambos servicios iniciados exitosamente!"
log "🔗 API disponible en: http://localhost:5001"
log "🔗 Frontend disponible en: http://localhost:3000"
log "📚 Documentación API: http://localhost:5001/docs"

# Función para manejar señales de cierre
cleanup() {
    log "🛑 Cerrando servicios..."
    kill $FLASK_PID $REACT_PID 2>/dev/null
    wait $FLASK_PID $REACT_PID 2>/dev/null
    log "✅ Servicios cerrados correctamente"
    exit 0
}

# Configurar manejo de señales
trap cleanup SIGTERM SIGINT

# Monitorear los procesos
while true; do
    if ! kill -0 $FLASK_PID 2>/dev/null; then
        log "❌ Flask se detuvo inesperadamente"
        exit 1
    fi
    if ! kill -0 $REACT_PID 2>/dev/null; then
        log "❌ React se detuvo inesperadamente"
        exit 1
    fi
    sleep 5
done