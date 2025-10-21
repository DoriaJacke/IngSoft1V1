#!/bin/bash

echo "🚀 Configurando entorno Python para SQLAlchemy..."

# Verificar si Python está instalado
if ! command -v python &> /dev/null; then
    echo "❌ Error: Python no está instalado. Por favor instala Python 3.8 o superior."
    exit 1
fi

# Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python -m venv venv
fi

# Activar entorno virtual
echo "🔧 Activando entorno virtual..."
source venv/bin/activate

# Instalar dependencias
echo "📥 Instalando dependencias de Python..."
pip install -r requirements.txt

# Verificar instalación
echo "✅ Verificando instalación..."
python -c "import flask; print(f'Flask version: {flask.__version__}')"
python -c "import flask_sqlalchemy; print('SQLAlchemy instalado correctamente')"

echo "🎯 Configuración completada. Para iniciar el servidor:"
echo "   1. Activa el entorno virtual: source venv/bin/activate"
echo "   2. Inicia el servidor Flask: python api/app.py"
echo "   3. El servidor estará disponible en: http://localhost:5000"