#!/bin/bash
# Script de configuración en runtime para Docker
# Este script reemplaza las URLs compiladas con variables de entorno

echo "========================================="
echo "Configurando URLs de runtime..."
echo "========================================="

# Obtener IP del host o usar localhost por defecto
HOST_IP=${HOST_IP:-localhost}

echo "HOST_IP configurado a: $HOST_IP"

# Archivos JavaScript del build que contienen las URLs
ASSETS_DIR="/app/dist/assets"

if [ -d "$ASSETS_DIR" ]; then
    echo "Buscando archivos JavaScript en $ASSETS_DIR..."
    
    # Buscar todos los archivos .js en el directorio de assets
    for js_file in "$ASSETS_DIR"/*.js; do
        if [ -f "$js_file" ]; then
            echo "Procesando: $(basename $js_file)"
            
            # Reemplazar localhost:5001 con HOST_IP:5001
            sed -i "s|http://localhost:5001|http://$HOST_IP:5001|g" "$js_file"
            
            # Reemplazar localhost:4000 con HOST_IP:4000
            sed -i "s|http://localhost:4000|http://$HOST_IP:4000|g" "$js_file"
            
            echo "  ✓ URLs actualizadas en $(basename $js_file)"
        fi
    done
    
    echo "✓ Configuración de runtime completada"
else
    echo "⚠ Directorio $ASSETS_DIR no encontrado"
fi

echo "========================================="
echo ""
