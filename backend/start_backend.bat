@echo off
color 0A
title MXCRO :: SecurePass Pro :: Backend :: http://localhost:8000
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
echo   MXCRO // SECUREPASS PRO // BACKEND SERVER
echo ============================================================
echo.
echo  [MXCRO] FastAPI server starting...
echo  [+] API  : http://localhost:8000
echo  [+] Docs : http://localhost:8000/docs
echo.
py -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause