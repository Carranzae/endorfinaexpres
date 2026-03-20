@echo off
title Endorfina Express - Frontend (Next.js)
echo ============================================
echo    ENDORFINA EXPRESS - Frontend Next.js
echo ============================================
echo.
echo [INFO] Iniciando servidor frontend Next.js...
echo [INFO] Puerto: 3001
echo [INFO] API Backend: http://localhost:3000
echo.

cd /d "%~dp0frontend-erp"

:: Check if node_modules exists
if not exist "node_modules" (
    echo [SETUP] Instalando dependencias del frontend...
    call npm install
    echo.
)

echo [START] Iniciando en http://localhost:3001
echo.
call npm run dev

pause
