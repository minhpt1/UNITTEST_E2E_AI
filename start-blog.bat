@echo off
echo Starting Personal Blog Application...
echo.

if not exist "node_modules" (
    echo Installing Backend Dependencies...
    call npm i --force
) else (
    echo Backend dependencies already installed.
)

echo Starting Backend Server...
start "Backend Server" cmd /k "npm run dev"

echo Waiting for backend to initialize...
timeout /t 3 /nobreak > nul

echo Checking Frontend Dependencies...
cd client
if not exist "node_modules" (
    echo Installing Frontend Dependencies...
    call npm i --force
) else (
    echo Frontend dependencies already installed.
)
cd ..

echo Starting Frontend Client...
start "Frontend Client" cmd /k "cd client && npm start"

echo.
echo Both servers are starting up...
echo Backend will run on: http://localhost:3002
echo Frontend will run on: http://localhost:3001
echo.
echo Press any key to exit this launcher...
pause > nul