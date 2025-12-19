@echo off
echo ================================
echo    Git Status Check
echo ================================
echo.

echo Current branch and status:
git status

echo.
echo Recent commits:
git log --oneline -5

echo.
echo Remote repository:
git remote -v

pause