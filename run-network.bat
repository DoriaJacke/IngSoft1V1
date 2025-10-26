@echo off
REM Script para configurar y ejecutar con acceso de red
REM =====================================================

echo ========================================
echo Configurador de Red - Eventos Vina
echo ========================================
echo.

REM Verificar si Docker esta corriendo
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker no esta corriendo
    echo Por favor inicia Docker Desktop
    pause
    exit /b 1
)

echo [OK] Docker esta corriendo
echo.

REM Obtener la IP local (primera interfaz Ethernet/WiFi activa)
echo Detectando direccion IP local...
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /r "IPv4.*192.168"') do (
    set IP_TEMP=%%a
    goto :found_ip
)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /r "IPv4.*10\."') do (
    set IP_TEMP=%%a
    goto :found_ip
)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /r "IPv4.*172\."') do (
    set IP_TEMP=%%a
    goto :found_ip
)

:found_ip
REM Limpiar espacios de la IP
for /f "tokens=* delims= " %%a in ("%IP_TEMP%") do set HOST_IP=%%a

if "%HOST_IP%"=="" (
    echo [ADVERTENCIA] No se detecto una IP de red local
    echo Usando localhost como fallback
    set HOST_IP=localhost
) else (
    echo [OK] IP detectada: %HOST_IP%
)

echo.
echo ========================================
echo Configuracion:
echo   HOST_IP=%HOST_IP%
echo ========================================
echo.

REM Preguntar si quiere continuar
set /p CONTINUE="Continuar con esta IP? (S/N): "
if /i not "%CONTINUE%"=="S" (
    set /p HOST_IP="Ingresa la IP manualmente: "
)

echo.
echo Deteniendo contenedores existentes...
docker-compose down >nul 2>&1

echo Iniciando contenedor con HOST_IP=%HOST_IP%...
set HOST_IP=%HOST_IP%
docker-compose up -d

if errorlevel 1 (
    echo [ERROR] Fallo al iniciar el contenedor
    pause
    exit /b 1
)

echo.
echo ========================================
echo [OK] Contenedor iniciado correctamente
echo ========================================
echo.
echo Esperando que los servicios esten listos...
timeout /t 8 /nobreak >nul

echo.
echo Tu aplicacion esta accesible en:
echo   Frontend:  http://%HOST_IP%:3000
echo   API:       http://%HOST_IP%:5001
echo   Email:     http://%HOST_IP%:4000
echo.
echo Desde otros computadores en la red, usa:
echo   http://%HOST_IP%:3000
echo.
echo ========================================
echo Configuracion del Firewall
echo ========================================
echo.
echo Para permitir acceso desde otros dispositivos,
echo necesitas abrir los puertos en el firewall.
echo.
set /p FIREWALL="Deseas configurar el firewall automaticamente? (S/N): "

if /i "%FIREWALL%"=="S" (
    echo.
    echo Configurando firewall...
    echo Nota: Esto requiere permisos de Administrador
    
    netsh advfirewall firewall delete rule name="Eventos Vina - Frontend" >nul 2>&1
    netsh advfirewall firewall delete rule name="Eventos Vina - API" >nul 2>&1
    netsh advfirewall firewall delete rule name="Eventos Vina - Email" >nul 2>&1
    
    netsh advfirewall firewall add rule name="Eventos Vina - Frontend" dir=in action=allow protocol=TCP localport=3000
    netsh advfirewall firewall add rule name="Eventos Vina - API" dir=in action=allow protocol=TCP localport=5001
    netsh advfirewall firewall add rule name="Eventos Vina - Email" dir=in action=allow protocol=TCP localport=4000
    
    if errorlevel 1 (
        echo [ADVERTENCIA] Fallo la configuracion del firewall
        echo Ejecuta este script como Administrador o configura manualmente
    ) else (
        echo [OK] Firewall configurado correctamente
    )
) else (
    echo.
    echo Configuracion manual del firewall:
    echo 1. Panel de Control ^> Firewall de Windows
    echo 2. Configuracion avanzada ^> Reglas de entrada
    echo 3. Nueva regla ^> Puerto ^> TCP ^> 3000, 4000, 5001
    echo 4. Permitir la conexion
)

echo.
echo ========================================
echo.
set /p LOGS="Deseas ver los logs del contenedor? (S/N): "
if /i "%LOGS%"=="S" (
    docker logs eventos_vina_dashboard
)

echo.
echo Presiona cualquier tecla para salir...
pause >nul
