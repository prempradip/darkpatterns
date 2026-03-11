@echo off
echo ========================================
echo Dark Pattern Detector - GitHub Push
echo ========================================
echo.

REM Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo.
    echo Please install Git from: https://git-scm.com/download/win
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

echo Git is installed. Proceeding with push...
echo.

REM Initialize git repository if not already initialized
if not exist .git (
    echo Initializing Git repository...
    git init
    echo.
)

REM Add all files
echo Adding files to Git...
git add .
echo.

REM Commit changes
echo Committing changes...
git commit -m "Initial commit: Dark Pattern Detector with PES system"
echo.

REM Add remote if not exists
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo Adding remote repository...
    git remote add origin https://github.com/prempradip/darkpatterns.git
    echo.
)

REM Set main branch
echo Setting main branch...
git branch -M main
echo.

REM Push to GitHub
echo Pushing to GitHub...
echo.
echo You may be prompted for your GitHub credentials.
echo If using a Personal Access Token, use it as the password.
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo SUCCESS! Code pushed to GitHub!
    echo ========================================
    echo.
    echo View your repository at:
    echo https://github.com/prempradip/darkpatterns
    echo.
) else (
    echo.
    echo ========================================
    echo Push failed. Common solutions:
    echo ========================================
    echo.
    echo 1. If repository already exists with content:
    echo    git pull origin main --allow-unrelated-histories
    echo    git push origin main
    echo.
    echo 2. To force push (overwrites remote):
    echo    git push -f origin main
    echo.
    echo 3. Check your GitHub credentials
    echo.
)

pause
