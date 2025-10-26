@echo off
REM BizEye Analytics Dashboard v0.2.0 - Windows Setup Script
REM This script sets up the complete development environment

echo 🚀 BizEye Analytics Dashboard v0.2.0 - Setup Script
echo ==================================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    echo    Visit: https://www.python.org/downloads/
    pause
    exit /b 1
)

echo ✅ Python found
python --version
echo.

REM Navigate to backend directory
echo 📁 Setting up backend environment...
cd back-end

REM Create virtual environment
echo 🔧 Creating virtual environment...
python -m venv venv

REM Activate virtual environment
echo ⚡ Activating virtual environment...
call venv\Scripts\activate.bat

REM Upgrade pip
echo 📦 Upgrading pip...
python -m pip install --upgrade pip

REM Install requirements
echo 📥 Installing required packages...
echo    This may take a few minutes for first-time setup...
pip install -r requirements.txt

echo.
echo ✅ Setup completed successfully!
echo.
echo 🎯 Next steps:
echo    1. Run: start.bat
echo    2. Open: http://localhost:3000 (Frontend)
echo    3. Backend API: http://localhost:5000
echo.
echo 📚 For detailed instructions, see README.md
echo 📄 For technical documentation, see BizEye_Complete_Technical_Guide_v0.2.0.pdf
echo.
echo 🎉 Welcome to BizEye Analytics Dashboard!
pause
