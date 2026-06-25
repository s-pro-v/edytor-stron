@echo off
cd /d "%~dp0"
title Edytor Stron
echo.
echo  ========================================
echo   EDYTOR STRON - szybkie uruchomienie
echo  ========================================
echo.

if not exist "node_modules\" (
  echo [1/3] Instalacja...
  call npm run setup
) else (
  echo [1/3] Zaleznosci OK
)

echo [2/3] Budowanie...
call npm run build
if errorlevel 1 (
  echo BLAD buildu! Sprawdz powyzej.
  pause
  exit /b 1
)

echo [3/3] Start serwera...
echo.
echo  Lokalnie:  http://localhost:3001
echo  Publiczny link pojawi sie za chwile (Cloudflare Tunnel)
echo  Zamknij okno = wylacz serwer
echo.

start "Edytor - serwer" cmd /k "cd /d %~dp0 && set NODE_ENV=production && node backend/dist/index.js"

timeout /t 3 /nobreak >nul

echo Otwieram tunel publiczny...
npx --yes cloudflared tunnel --url http://localhost:3001

pause
