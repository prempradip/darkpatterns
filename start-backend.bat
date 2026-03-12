@echo off
echo ========================================
echo Dark Pattern Detector - Backend Setup
echo ========================================
echo.

cd backend

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    echo This may take a few minutes on first run...
    echo.
    call npm install
    echo.
)

echo Starting backend server...
echo.
echo Backend will run on: http://localhost:3000
echo.
echo Keep this window open while using the app!
echo.
echo ========================================
echo.

call npm start

pause
