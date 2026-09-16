@echo off
color 0A
title MXCRO :: SecurePass Pro :: Frontend :: http://localhost:5173
cd /d "%~dp0"
if exist "%~dp0..\node-portable\node-v20.11.1-win-x64\node.exe" (
    set "PATH=%~dp0..\node-portable\node-v20.11.1-win-x64;%PATH%"
)
echo.
echo ============================================================
echo #     #   #   #     ###     ####      ###
echo ##   ##    # #     #   #    #   #    #   #
echo # # # #     #      #       ####     #   #
echo #  #  #     #      #       #  #     #   #
echo #     #    # #     #   #    #   #    #   #
echo #     #   #   #     ###     #    #    ###
echo ============================================================
echo   MXCRO // SECUREPASS PRO // FRONTEND SERVER
echo ============================================================
echo.
echo  [MXCRO] React/Vite dev server starting...
echo  [+] App : http://localhost:5173
echo.
if not exist "node_modules\.vite" goto okcache
echo  [MXCRO] Refreshing stale Vite cache...
for /l %%i in (1,1,5) do (
    rmdir /s /q "node_modules\.vite" 2>nul
    if not exist "node_modules\.vite" goto okcache
    ping -n 2 127.0.0.1 >nul
)
:okcache
echo  [+] Cache ready - launching Vite...
echo.
call npm run dev
pause