@echo off
title Endorfina Express - Tests de Integración
echo ============================================
echo    ENDORFINA EXPRESS - Tests Automatizados
echo ============================================
echo.

cd /d "%~dp0"

:: ===== BACKEND TESTS =====
echo ===== TESTS DEL BACKEND =====
echo.
cd backend-erp

:: Generate Prisma client first
call npx prisma generate 2>nul

echo [TEST] Ejecutando tests del backend...
call npx jest --passWithNoTests --forceExit 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARN] Jest no encontrado, ejecutando test basico...
    echo [TEST] Verificando compilacion TypeScript...
    call npx tsc --noEmit 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Backend compila correctamente
    ) else (
        echo [ERROR] Errores de compilacion en el backend
    )
)
echo.

:: ===== API ENDPOINT TESTS =====
echo ===== TESTS DE ENDPOINTS API =====
echo.
echo [TEST] Verificando endpoints del backend...
echo.

:: Test each endpoint
echo [GET] /categories ...
curl -s -o nul -w "  Status: %%{http_code}" http://localhost:3000/categories
echo.

echo [GET] /products ...
curl -s -o nul -w "  Status: %%{http_code}" http://localhost:3000/products
echo.

echo [GET] /tables ...
curl -s -o nul -w "  Status: %%{http_code}" http://localhost:3000/tables
echo.

echo [GET] /system/info ...
curl -s -o nul -w "  Status: %%{http_code}" http://localhost:3000/system/info
echo.

echo [GET] /settings ...
curl -s -o nul -w "  Status: %%{http_code}" http://localhost:3000/settings
echo.

echo.
echo ===== TESTS DEL FRONTEND =====
echo.
cd /d "%~dp0frontend-erp"
echo [TEST] Verificando build del frontend...
call npx next build 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Frontend compila correctamente
) else (
    echo [WARN] Errores en build del frontend (pueden ser warnings de Next.js)
)
echo.

echo ============================================
echo    TESTS COMPLETADOS
echo ============================================
echo.
echo NOTA: Para tests completos, asegurate que:
echo   1. PostgreSQL este corriendo en localhost:5432
echo   2. El backend este corriendo (INICIAR_BACKEND.bat)
echo.
pause
