@echo off
echo 🚀 Starting Bizeye Project...

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed!

REM Start backend
echo 🔧 Starting backend...
cd back-end
python app.py
start cmd /k "cd back-end && python app.py"

REM Wait a moment
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🎨 Starting frontend...
cd ..\front-end
start cmd /k "cd front-end && npm start"

echo 🎉 Both services are starting!
echo 📊 Backend: http://localhost:5000
echo 🌐 Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul
