# BIZEYE Startup Script for Windows PowerShell
# This script starts both the backend and frontend servers

Write-Host "🚀 Starting BIZEYE Application..." -ForegroundColor Green
Write-Host ""

# Start Backend Server
Write-Host "📦 Starting Backend Server..." -ForegroundColor Yellow
Set-Location "back-end"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python app.py"
Set-Location ".."

# Wait for backend to start
Write-Host "⏳ Waiting for backend to start..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Start Frontend Application
Write-Host "📦 Starting Frontend Application..." -ForegroundColor Yellow
Set-Location "front-end"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm start"
Set-Location ".."

Write-Host ""
Write-Host "✅ BIZEYE Application Started!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Backend: http://localhost:5000" -ForegroundColor Blue
Write-Host "🌐 Frontend: http://localhost:3000" -ForegroundColor Blue
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
