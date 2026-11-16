@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Es necesario instalar Node.js 20.19 o superior.
  pause
  exit /b 1
)
echo Abre http://localhost:4173 en tu navegador.
node scripts\server.mjs
pause
