@echo off
echo 🐳 Subiendo Eventos Viña Dashboard a Docker Hub...
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

REM Verificar si la imagen local existe
docker images | findstr "eventos-vina-dashboard" >nul
if %errorlevel% neq 0 (
    echo ❌ Error: Imagen 'eventos-vina-dashboard' no encontrada
    echo Construye la imagen primero con: docker build -t eventos-vina-dashboard .
    pause
    exit /b 1
)

echo ✅ Imagen local encontrada

REM Login en Docker Hub
echo 🔐 Iniciando sesión en Docker Hub...
docker login
if %errorlevel% neq 0 (
    echo ❌ Error en el login de Docker Hub
    pause
    exit /b 1
)

echo ✅ Login exitoso

REM Etiquetar imagen
echo 🏷️ Etiquetando imagen...
docker tag eventos-vina-dashboard jfuenzalida/eventos-vina-dashboard:latest
if %errorlevel% neq 0 (
    echo ❌ Error al etiquetar la imagen
    pause
    exit /b 1
)

echo ✅ Imagen etiquetada

REM Etiquetar con versión específica
echo 🏷️ Etiquetando con versión v1.0...
docker tag eventos-vina-dashboard jfuenzalida/eventos-vina-dashboard:v1.0
if %errorlevel% neq 0 (
    echo ⚠️ Advertencia: No se pudo etiquetar con v1.0
)

REM Subir imagen principal
echo 📤 Subiendo imagen a Docker Hub...
docker push jfuenzalida/eventos-vina-dashboard:latest
if %errorlevel% neq 0 (
    echo ❌ Error al subir la imagen
    pause
    exit /b 1
)

echo ✅ Imagen 'latest' subida exitosamente

REM Subir versión específica
echo 📤 Subiendo versión v1.0...
docker push jfuenzalida/eventos-vina-dashboard:v1.0
if %errorlevel% neq 0 (
    echo ⚠️ Advertencia: No se pudo subir la versión v1.0
) else (
    echo ✅ Versión v1.0 subida exitosamente
)

echo.
echo 🎉 ¡Proceso completado!
echo.
echo 🌐 Tu imagen está disponible en:
echo    Repository: https://hub.docker.com/r/jfuenzalida/eventos-vina-dashboard
echo    Pull command: docker pull jfuenzalida/eventos-vina-dashboard:latest
echo.
echo 🚀 Cualquier persona puede ejecutar tu aplicación con:
echo    docker run -d --name eventos_dashboard -p 5001:5001 -p 3000:3000 jfuenzalida/eventos-vina-dashboard:latest
echo.
echo 🔗 URLs de acceso:
echo    Frontend: http://localhost:3000
echo    API: http://localhost:5001
echo    Swagger: http://localhost:5001/docs
echo.

REM Preguntar si abrir Docker Hub
set /p respuesta="¿Abrir Docker Hub en el navegador? (s/n): "
if /i "%respuesta%"=="s" (
    start https://hub.docker.com/r/jfuenzalida/eventos-vina-dashboard
)

echo.
echo ✅ ¡Tu contenedor Docker está ahora disponible globalmente!
pause