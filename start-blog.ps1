# Personal Blog Launcher Script
Write-Host "Starting Personal Blog Application..." -ForegroundColor Cyan
Write-Host ""

# Install Backend Dependencies
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing Backend Dependencies..." -ForegroundColor Magenta
    npm i --force
} else {
    Write-Host "Backend dependencies already installed." -ForegroundColor Green
}

# Start Backend Server
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev" -WindowStyle Normal

# Wait for backend to initialize
Write-Host "Waiting for backend to initialize..." -ForegroundColor Green
Start-Sleep -Seconds 3

# Install Frontend Dependencies
Set-Location client
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing Frontend Dependencies..." -ForegroundColor Magenta
    npm i --force
} else {
    Write-Host "Frontend dependencies already installed." -ForegroundColor Green
}
Set-Location ..

# Start Frontend Client
Write-Host "Starting Frontend Client..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location client; npm start" -WindowStyle Normal

Write-Host ""
Write-Host "Both servers are starting up..." -ForegroundColor Green
Write-Host "Backend will run on: http://localhost:3002" -ForegroundColor Blue
Write-Host "Frontend will run on: http://localhost:3001" -ForegroundColor Blue
Write-Host ""
Write-Host "Press any key to close this launcher..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")