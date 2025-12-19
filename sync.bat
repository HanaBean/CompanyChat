@echo off
echo ================================
echo    GitHub Sync (Download)
echo ================================
echo.

REM 현재 상태 확인
echo Checking current status...
git status

echo.
echo Downloading latest changes from GitHub...
git fetch origin main

REM 변경사항이 있는지 확인
git diff HEAD origin/main --quiet
if %errorlevel% neq 0 (
    echo New changes found on GitHub!
    echo Do you want to download them? 
    pause
    git pull origin main
    echo.
    echo ================================
    echo   Download Complete!
    echo   Your code is now up to date.
    echo ================================
) else (
    echo No new changes found.
    echo Your code is already up to date.
)

pause