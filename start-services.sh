#!/bin/bash

# Script para iniciar todos los servicios (API Flask, Email Server y Frontend)

echo "==================================="
echo "Iniciando Eventos Viña Dashboard"
echo "==================================="

# Ejecutar configuración de runtime si existe HOST_IP
if [ ! -z "$HOST_IP" ]; then
    echo "Configurando URLs con HOST_IP=$HOST_IP..."
    bash /app/runtime-config.sh
fi

# Iniciar la API Flask en segundo plano
echo "Iniciando API Flask en puerto 5001..."
FLASK_PORT=5001 python -m api.app &
FLASK_PID=$!

# Esperar a que Flask esté listo
echo "Esperando que la API Flask esté lista..."
sleep 5

# Verificar que Flask esté corriendo
if ! kill -0 $FLASK_PID 2>/dev/null; then
    echo "Error: La API Flask no pudo iniciar"
    exit 1
fi

echo "API Flask iniciada correctamente (PID: $FLASK_PID)"

# Iniciar el servidor de email Node.js en segundo plano
echo "Iniciando servidor de email en puerto 4000..."
PORT=4000 node server/index.js &
EMAIL_PID=$!

# Esperar a que el servidor de email esté listo
echo "Esperando que el servidor de email esté listo..."
sleep 3

# Verificar que el servidor de email esté corriendo
if ! kill -0 $EMAIL_PID 2>/dev/null; then
    echo "Error: El servidor de email no pudo iniciar"
    kill $FLASK_PID
    exit 1
fi

echo "Servidor de email iniciado correctamente (PID: $EMAIL_PID)"

# Servir el frontend construido con un servidor simple
echo "Iniciando servidor frontend en puerto 3000..."
npx serve dist -l 3000 --single &
FRONTEND_PID=$!

# Esperar a que el frontend esté listo
echo "Esperando que el frontend esté listo..."
sleep 3

# Verificar que el frontend esté corriendo
if ! kill -0 $FRONTEND_PID 2>/dev/null; then
    echo "Error: El servidor frontend no pudo iniciar"
    kill $FLASK_PID $EMAIL_PID
    exit 1
fi

echo "Frontend iniciado correctamente (PID: $FRONTEND_PID)"
echo "==================================="
echo "✓ API Flask: http://localhost:5001"
echo "✓ Email Server: http://localhost:4000"
echo "✓ Frontend: http://localhost:3000"
echo "✓ API Docs: http://localhost:5001/docs"
echo "==================================="

# Función para manejar la señal de terminación
cleanup() {
    echo ""
    echo "Deteniendo servicios..."
    kill $FLASK_PID $EMAIL_PID $FRONTEND_PID 2>/dev/null
    echo "Servicios detenidos"
    exit 0
}

# Capturar señales de terminación
trap cleanup SIGTERM SIGINT

# Mantener el script corriendo y esperar a que los procesos terminen
wait $FLASK_PID $EMAIL_PID $FRONTEND_PID
