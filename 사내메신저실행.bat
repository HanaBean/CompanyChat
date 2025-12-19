@echo off
title 사내메신저
echo ================================
echo        사내메신저 시작 중...
echo ================================
echo.

REM 현재 디렉토리를 스크립트 위치로 변경
cd /d "%~dp0"

REM React 개발 서버 시작 (백그라운드)
echo [1/2] 서버를 시작하는 중...
start /min "React Server" cmd /c "set PORT=3001 && npm start"

REM 5초 대기
echo [2/2] 앱을 준비하는 중...
timeout /t 8 /nobreak > nul

REM Electron 앱 시작
echo 사내메신저를 실행합니다...
start "사내메신저" cmd /c "set PORT=3001 && npm run electron-dev"

echo.
echo 사내메신저가 시작되었습니다!
echo 이 창을 닫지 마세요.
echo.
pause