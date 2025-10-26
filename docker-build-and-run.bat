@echo off
REM Script para construir y ejecutar la aplicación con Docker

echo ==================================
echo Dockerizando Eventos Viña
echo ==================================

REM Verificar que Docker esté corriendo
echo.
echo Verificando Docker...
docker version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Docker no está corriendo o no está instalado
    echo Por favor, inicia Docker Desktop y vuelve a intentar
    pause
    exit /b 1
)
echo OK: Docker está corriendo

REM Detener y eliminar contenedor anterior si existe
echo.
echo Limpiando contenedores anteriores...
docker stop eventos_vina_dashboard 2>nul
docker rm eventos_vina_dashboard 2>nul

REM Construir la imagen
echo.
echo Construyendo imagen Docker...
docker build -t eventos-vina-dashboard .
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR al construir la imagen
    pause
    exit /b 1
)

echo.
echo OK: Imagen construida correctamente

REM Ejecutar el contenedor
echo.
echo Iniciando contenedor...
docker run -d --name eventos_vina_dashboard -p 5001:5001 -p 3000:3000 -v "%CD%\instance:/app/instance" eventos-vina-dashboard
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR al iniciar el contenedor
    pause
    exit /b 1
)

echo.
echo OK: Contenedor iniciado correctamente

REM Esperar un momento
echo.
echo Esperando que los servicios inicien...
timeout /t 5 /nobreak >nul

REM Mostrar logs
echo.
echo Logs del contenedor:
docker logs eventos_vina_dashboard

echo.
echo ==================================
echo Aplicación corriendo
echo ==================================
echo Frontend:  http://localhost:3000
echo API:       http://localhost:5001
echo API Docs:  http://localhost:5001/docs
echo ==================================
echo.
echo Comandos útiles:
echo   Ver logs:     docker logs -f eventos_vina_dashboard
echo   Detener:      docker stop eventos_vina_dashboard
echo   Eliminar:     docker rm -f eventos_vina_dashboard
echo   Reiniciar:    docker restart eventos_vina_dashboard
echo ==================================

pause
