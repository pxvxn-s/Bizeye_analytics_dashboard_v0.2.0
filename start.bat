@echo off
echo Starting BIZEYE Application...
echo.

echo Starting Backend Server...
cd back-end
start "BIZEYE Backend" cmd /k "python app.py"
cd ..

echo Waiting for backend to start...
timeout /t 5 /nobreak > nul

echo Starting Frontend Application...
cd front-end
start "BIZEYE Frontend" cmd /k "npm start"
cd ..

echo.
echo BIZEYE Application Started!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul