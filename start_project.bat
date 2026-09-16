@echo off
setlocal EnableExtensions
color 0A
title MXCRO :: SecurePass Pro :: Launcher
cd /d "%~dp0"

echo.
echo ============================================================
echo #     #   #   #     ###     ####      ###
echo ##   ##    # #     #   #    #   #    #   #
echo # # # #     #      #       ####     #   #
echo #  #  #     #      #       #  #     #   #
echo #     #    # #     #   #    #   #    #   #
echo #     #   #   #     ###     #    #    ###
echo ============================================================
echo   MXCRO // SECUREPASS PRO // LOCAL DEPLOY
echo ============================================================
echo.
echo  [CHECK] Validating environment...
if not exist "frontend\node_modules" (
    echo  [ERROR] Frontend dependencies missing. Run SETUP.BAT first.
    echo.
    pause
    exit /b 1
)
cd /d "%~dp0backend"
set "PYCMD=python"
where py >nul 2>nul && set "PYCMD=py"
%PYCMD% -c "import fastapi, uvicorn" >nul 2>nul
if errorlevel 1 (
    cd /d "%~dp0"
    echo  [ERROR] Backend dependencies missing. Run SETUP.BAT first.
    echo.
    pause
    exit /b 1
)
cd /d "%~dp0"

echo  [+] Backend  : http://localhost:8000
echo  [+] Frontend : http://localhost:5173
echo  [+] Launching servers in separate windows...
echo.
start "MXCRO :: Backend Server" cmd /k ""%~dp0backend\start_backend.bat""
start "MXCRO :: Frontend Server" cmd /k ""%~dp0frontend\start_frontend.bat""
echo  [+] Backend window  : MXCRO :: Backend Server
echo  [+] Frontend window : MXCRO :: Frontend Server
echo.
echo  [MXCRO] Scanning for frontend server...
set "attempt=0"
:poll
set /a attempt+=1
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:5173' -UseBasicParsing -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } } catch { } exit 1" >nul 2>nul
if not errorlevel 1 (
    echo  [OK] Frontend detected on http://localhost:5173
    goto :open
)
if %attempt% geq 30 (
    echo  [!] Frontend took too long - opening browser anyway.
    goto :open
)
echo  [*] Attempt %attempt% - frontend still booting, retrying...
ping -n 3 127.0.0.1 >nul
goto :poll

:open
echo  [MXCRO] Opening browser at http://localhost:5173...
start "" "http://localhost:5173"
echo  [MXCRO] SecurePass Pro is live.
echo  [MXCRO] Close the two server windows to stop the project.
echo.
pause