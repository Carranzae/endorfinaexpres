@echo off
title Endorfina Express - Backend (NestJS)
echo ============================================
echo    ENDORFINA EXPRESS - Backend API Server
echo ============================================
echo.
echo [INFO] Iniciando servidor backend NestJS...
echo [INFO] Puerto: 3000
echo [INFO] Base de datos: PostgreSQL (localhost:5432)
echo.

cd /d "%~dp0backend-erp"

:: Check if node_modules exists
if not exist "node_modules" (
    echo [SETUP] Instalando dependencias del backend...
    call npm install
    echo.
)

:: Generate Prisma client
echo [PRISMA] Generando Prisma Client...
call npx prisma generate 2>nul
echo.

:: Sync database
echo [PRISMA] Sincronizando base de datos...
call npx prisma db push 2>nul
echo.

echo [START] Iniciando servidor en http://localhost:3000
echo.
call npm run start:dev

pause
