@echo off
setlocal EnableExtensions
color 0A
title MXCRO :: SecurePass Pro :: Setup
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
echo   MXCRO // SECUREPASS PRO // ENVIRONMENT SETUP
echo ============================================================
echo.
echo  [1/3] Validating Python...
set "PYCMD="
where py >nul 2>nul
if not errorlevel 1 (
    set "PYCMD=py"
) else (
    where python >nul 2>nul
    if not errorlevel 1 (
        set "PYCMD=python"
    )
)
if not defined PYCMD (
    echo  [ERROR] Python 3.10+ not found. Install it first, then rerun.
    echo.
    pause
    exit /b 1
)
echo  [+] Using Python launcher : %PYCMD%
echo.
echo  [2/3] Installing Backend (Python) dependencies...
cd /d "%~dp0backend"
%PYCMD% -m pip install --disable-pip-version-check -r requirements.txt
if errorlevel 1 (
    echo  [ERROR] Backend dependencies failed to install.
    echo.
    pause
    exit /b 1
)
echo  [+] Backend dependencies ready.
echo.
echo  [3/3] Installing Frontend (npm) dependencies...
set "NPORT=%~dp0node-portable\node-v20.11.1-win-x64"
if exist "%NPORT%\node.exe" (
    set "PATH=%NPORT%;%PATH%"
    echo  [+] Using bundled portable Node.js
) else (
    where node >nul 2>nul
    if errorlevel 1 (
        echo  [ERROR] Node.js not found. Install Node.js 18+ or restore the node-portable folder.
        echo.
        pause
        exit /b 1
    )
    echo  [+] Using system Node.js
)
cd /d "%~dp0frontend"
node --version >nul 2>nul
if errorlevel 1 (
    echo  [ERROR] Node.js is not usable. Check your Node.js installation.
    echo.
    pause
    exit /b 1
)
call npm install --no-fund --no-audit
if errorlevel 1 (
    echo  [ERROR] Frontend dependencies failed to install.
    echo.
    pause
    exit /b 1
)
echo  [+] Frontend dependencies ready.
echo.
echo ============================================================
echo   [OK] MXCRO setup complete.
echo   [+] Backend  : dependencies installed
echo   [+] Frontend : dependencies installed
echo   [+] Next     : double-click  start_project.bat  to launch
echo ============================================================
echo.
pause