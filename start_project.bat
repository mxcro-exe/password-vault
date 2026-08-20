@echo off
echo ╔══════════════════════════════════════╗
echo ║         SecurePass Pro Starter       ║
echo ╚══════════════════════════════════════╝
echo.
echo Launching both backend and frontend servers...
echo.

:: Start Backend
start "SecurePass Pro - Backend" cmd /c "cd /d %~dp0backend && start_backend.bat"

:: Start Frontend
start "SecurePass Pro - Frontend" cmd /c "cd /d %~dp0frontend && start_frontend.bat"

echo Servers launched! 
echo Frontend: http://localhost:5173
echo Backend API: http://localhost:8000
echo.
pause
