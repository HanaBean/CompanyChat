@echo off
echo 사내 메신저 시작 중...
echo.

REM React 개발 서버 시작
echo React 개발 서버를 시작합니다...
start "React Server" cmd /k "npm start"

REM 5초 대기 후 Electron 앱 시작
echo 5초 후 Electron 앱을 시작합니다...
timeout /t 5 /nobreak > nul

echo Electron 앱을 시작합니다...
start "Electron App" cmd /k "npm run electron-dev"

echo.
echo 사내 메신저가 시작되었습니다!
echo React 서버와 Electron 앱이 각각 별도 창에서 실행됩니다.
echo.
pause