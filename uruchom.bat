@echo off
cd /d "%~dp0"
echo === Edytor Stron - uruchamianie ===
echo.

if not exist "node_modules\" (
  echo Instalacja zaleznosci...
  call npm run setup
)

echo Tryb deweloperski: http://localhost:5173
echo.
call npm run dev
