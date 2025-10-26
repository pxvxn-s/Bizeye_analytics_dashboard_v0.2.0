# BizEye Analytics Dashboard v0.2.0 - PowerShell Setup Script
# This script sets up the complete development environment

Write-Host "🚀 BizEye Analytics Dashboard v0.2.0 - Setup Script" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is installed
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python is not installed. Please install Python 3.8+ first." -ForegroundColor Red
    Write-Host "   Visit: https://www.python.org/downloads/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Navigate to backend directory
Write-Host "📁 Setting up backend environment..." -ForegroundColor Blue
Set-Location back-end

# Create virtual environment
Write-Host "🔧 Creating virtual environment..." -ForegroundColor Blue
python -m venv venv

# Activate virtual environment
Write-Host "⚡ Activating virtual environment..." -ForegroundColor Blue
& ".\venv\Scripts\Activate.ps1"

# Upgrade pip
Write-Host "📦 Upgrading pip..." -ForegroundColor Blue
python -m pip install --upgrade pip

# Install requirements
Write-Host "📥 Installing required packages..." -ForegroundColor Blue
Write-Host "   This may take a few minutes for first-time setup..." -ForegroundColor Yellow
pip install -r requirements.txt

Write-Host ""
Write-Host "✅ Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🎯 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Run: .\start.ps1" -ForegroundColor White
Write-Host "   2. Open: http://localhost:3000 (Frontend)" -ForegroundColor White
Write-Host "   3. Backend API: http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "📚 For detailed instructions, see README.md" -ForegroundColor Yellow
Write-Host "📄 For technical documentation, see BizEye_Complete_Technical_Guide_v0.2.0.pdf" -ForegroundColor Yellow
Write-Host ""
Write-Host "🎉 Welcome to BizEye Analytics Dashboard!" -ForegroundColor Green
Read-Host "Press Enter to continue"
