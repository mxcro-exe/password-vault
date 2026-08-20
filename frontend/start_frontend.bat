@echo off
echo ╔══════════════════════════════════════╗
echo ║   SecurePass Pro - Frontend Dev      ║
echo ╚══════════════════════════════════════╝
echo.
echo Starting React frontend at http://localhost:5173
echo.
cd /d "%~dp0"
set "PATH=%~dp0..\node-portable\node-v20.11.1-win-x64;%PATH%"
npm run dev
pause
