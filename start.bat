@echo off
REM BizEye Analytics Dashboard v0.2.0 - Windows Start Script
REM This script starts both frontend and backend servers

echo 🚀 Starting BizEye Analytics Dashboard v0.2.0
echo ==============================================
echo.

REM Check if setup was completed
if not exist "back-end\venv" (
    echo ❌ Setup not completed. Please run setup.bat first.
    pause
    exit /b 1
)

REM Start backend server
echo 🔧 Starting backend server...
cd back-end
call venv\Scripts\activate.bat
start "BizEye Backend" cmd /k "python app.py"
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server
echo 🎨 Starting frontend server...
cd front-end

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

start "BizEye Frontend" cmd /k "npm start"
cd ..

echo.
echo ✅ Servers started successfully!
echo.
echo 🌐 Access your dashboard:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000
echo.
echo 📊 Available API endpoints:
echo    • Data Management: /api/data/*
echo    • Sentiment Analysis: /api/sentiment/*
echo    • Sales Analysis: /api/sales/*
echo    • Unified Analysis: /api/unified-analysis
echo    • Intelligent Analysis: /api/intelligent/*
echo.
echo 🛑 Close the terminal windows to stop servers
echo.
pause
