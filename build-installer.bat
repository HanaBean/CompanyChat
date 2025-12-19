@echo off
echo 사내메신저 설치파일 생성 중...

REM 환경변수 설정
set CSC_IDENTITY_AUTO_DISCOVERY=false
set ELECTRON_BUILDER_CACHE=%TEMP%\electron-builder-cache

REM 캐시 삭제
if exist "%LOCALAPPDATA%\electron-builder\Cache" (
    echo 캐시 삭제 중...
    rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache"
)

REM React 빌드
echo React 앱 빌드 중...
call npm run build
if %errorlevel% neq 0 (
    echo React 빌드 실패!
    pause
    exit /b 1
)

REM Electron 빌드
echo Electron 설치파일 생성 중...
call npx electron-builder --win --publish=never
if %errorlevel% neq 0 (
    echo Electron 빌드 실패!
    pause
    exit /b 1
)

echo.
echo 설치파일 생성 완료!
echo 파일 위치: dist\사내메신저 Setup 1.0.0.exe
pause