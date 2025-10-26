# BizEye Analytics Dashboard v0.2.0 - PowerShell Start Script
# This script starts both frontend and backend servers

Write-Host "🚀 Starting BizEye Analytics Dashboard v0.2.0" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check if setup was completed
if (-not (Test-Path "back-end\venv")) {
    Write-Host "❌ Setup not completed. Please run .\setup.ps1 first." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Start backend server
Write-Host "🔧 Starting backend server..." -ForegroundColor Blue
Set-Location back-end
& ".\venv\Scripts\Activate.ps1"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python app.py" -WindowStyle Normal
Set-Location ..

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server
Write-Host "🎨 Starting frontend server..." -ForegroundColor Blue
Set-Location front-end

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Blue
    npm install
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start" -WindowStyle Normal
Set-Location ..

Write-Host ""
Write-Host "✅ Servers started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access your dashboard:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "📊 Available API endpoints:" -ForegroundColor Cyan
Write-Host "   • Data Management: /api/data/*" -ForegroundColor White
Write-Host "   • Sentiment Analysis: /api/sentiment/*" -ForegroundColor White
Write-Host "   • Sales Analysis: /api/sales/*" -ForegroundColor White
Write-Host "   • Unified Analysis: /api/unified-analysis" -ForegroundColor White
Write-Host "   • Intelligent Analysis: /api/intelligent/*" -ForegroundColor White
Write-Host ""
Write-Host "🛑 Close the PowerShell windows to stop servers" -ForegroundColor Yellow
Write-Host ""
Read-Host "Press Enter to continue"
