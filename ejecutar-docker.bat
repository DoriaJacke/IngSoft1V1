@echo off
echo 🐳 Ejecutando Contenedor Docker - Eventos Viña
echo.

REM Verificar si Docker está ejecutándose
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Docker no está instalado o no está ejecutándose
    echo Por favor, inicia Docker Desktop y vuelve a intentar
    pause
    exit /b 1
)

echo ✅ Docker detectado

REM Verificar si el repositorio está clonado
if not exist "app_reportes.py" (
    echo ❌ Error: No se encontró app_reportes.py
    echo Asegúrate de estar en el directorio correcto del proyecto
    pause
    exit /b 1
)

echo ✅ Proyecto encontrado

REM Detener contenedor anterior si existe
echo 🛑 Deteniendo contenedor anterior (si existe)...
docker rm -f eventos_vina_dashboard >nul 2>&1

REM Verificar puertos
echo 🔍 Verificando puertos...
netstat -ano | findstr ":5001" >nul
if %errorlevel% equ 0 (
    echo ⚠️ Puerto 5001 está en uso. Intentando liberar...
    for /f "tokens=5" %%i in ('netstat -ano ^| findstr ":5001"') do (
        taskkill /PID %%i /F >nul 2>&1
    )
)

netstat -ano | findstr ":3000" >nul
if %errorlevel% equ 0 (
    echo ⚠️ Puerto 3000 está en uso. Intentando liberar...
    for /f "tokens=5" %%i in ('netstat -ano ^| findstr ":3000"') do (
        taskkill /PID %%i /F >nul 2>&1
    )
)

echo ✅ Puertos liberados

REM Construir imagen
echo 🔨 Construyendo imagen Docker...
docker build -t eventos-vina-dashboard .
if %errorlevel% neq 0 (
    echo ❌ Error al construir la imagen Docker
    pause
    exit /b 1
)

echo ✅ Imagen construida exitosamente

REM Ejecutar contenedor
echo 🚀 Iniciando contenedor...
docker run -d --name eventos_vina_dashboard -p 5001:5001 -p 3000:3000 -v "%cd%\instance:/app/instance" eventos-vina-dashboard
if %errorlevel% neq 0 (
    echo ❌ Error al iniciar el contenedor
    pause
    exit /b 1
)

echo ✅ Contenedor iniciado

REM Esperar a que los servicios estén disponibles
echo ⏳ Esperando a que los servicios inicien...
timeout /t 10 /nobreak >nul

REM Verificar servicios
echo 🔍 Verificando servicios...
curl -s http://localhost:5001/eventos/logs >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ API funcionando en puerto 5001
) else (
    echo ⚠️ API aún no responde, puede necesitar más tiempo
)

curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend funcionando en puerto 3000
) else (
    echo ⚠️ Frontend aún no responde, puede necesitar más tiempo
)

echo.
echo 🎉 ¡Contenedor ejecutándose!
echo.
echo 🌐 URLs disponibles:
echo    Frontend: http://localhost:3000
echo    API: http://localhost:5001
echo    Swagger: http://localhost:5001/docs
echo.
echo 📋 Comandos útiles:
echo    Ver logs: docker logs eventos_vina_dashboard
echo    Detener: docker stop eventos_vina_dashboard
echo    Eliminar: docker rm -f eventos_vina_dashboard
echo.

REM Preguntar si abrir en navegador
set /p respuesta="¿Abrir la aplicación en el navegador? (s/n): "
if /i "%respuesta%"=="s" (
    start http://localhost:3000
    start http://localhost:5001/docs
)

echo.
echo ✅ Script completado. ¡Disfruta tu aplicación!
pause