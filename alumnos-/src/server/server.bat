# Script para iniciar backend y frontend juntos (Windows)
# Guarda este archivo como 'server.bat' en la raíz del proyecto para mayor comodidad
@echo off

start cmd /k "cd /d %~dp0.. & npm start"
start cmd /k "cd /d %~dp0.. & npm run dev"

echo Ambos servidores (backend y frontend) están iniciándose en terminales separadas.
pause
