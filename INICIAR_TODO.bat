@echo off
title Endorfina Express - Iniciar Todo
echo ============================================
echo    ENDORFINA EXPRESS - INICIAR TODO
echo ============================================
echo.
echo Este script inicia el Backend y Frontend al mismo tiempo.
echo.

:: Start backend in a new window
start "Backend NestJS" cmd /c "%~dp0INICIAR_BACKEND.bat"

:: Wait 5 seconds for backend to start
echo [INFO] Esperando 5 segundos para que inicie el backend...
timeout /t 5 /nobreak >nul

:: Start frontend in a new window
start "Frontend Next.js" cmd /c "%~dp0INICIAR_FRONTEND.bat"

echo.
echo [OK] Ambos servidores se estan iniciando en ventanas separadas.
echo.
echo   Backend: http://localhost:3000
echo   Frontend: http://localhost:3001
echo.
echo Cierra esta ventana cuando quieras.
pause
