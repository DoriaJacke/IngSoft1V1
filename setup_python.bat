@echo off
echo 🚀 Configurando entorno Python para SQLAlchemy...

REM Verificar si Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Python no está instalado. Por favor instala Python 3.8 o superior.
    pause
    exit /b 1
)

REM Crear entorno virtual si no existe
if not exist "venv" (
    echo 📦 Creando entorno virtual...
    python -m venv venv
)

REM Activar entorno virtual
echo 🔧 Activando entorno virtual...
call venv\Scripts\activate

REM Instalar dependencias
echo 📥 Instalando dependencias de Python...
pip install -r requirements.txt

REM Verificar instalación
echo ✅ Verificando instalación...
python -c "import flask; print(f'Flask version: {flask.__version__}')"
python -c "import flask_sqlalchemy; print('SQLAlchemy instalado correctamente')"

echo.
echo 🎯 Configuración completada. Para iniciar el servidor:
echo    1. Activa el entorno virtual: venv\Scripts\activate
echo    2. Inicia el servidor Flask: python api\app.py
echo    3. El servidor estará disponible en: http://localhost:5000
echo.
pause