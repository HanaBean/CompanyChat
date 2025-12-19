@echo off
echo ================================
echo    GitHub 업로드 스크립트
echo ================================
echo.

REM 변경사항 확인
echo 변경된 파일들을 확인 중...
git status

echo.
echo 모든 변경사항을 GitHub에 업로드하시겠습니까?
pause

REM 모든 파일 추가
echo 파일들을 스테이징 중...
git add .

REM 커밋 메시지 입력받기
set /p commit_msg="커밋 메시지를 입력하세요 (엔터시 기본 메시지): "
if "%commit_msg%"=="" set commit_msg=업데이트: %date% %time%

REM 커밋
echo 커밋 중...
git commit -m "%commit_msg%"

REM GitHub에 푸시
echo GitHub에 업로드 중...
git push origin main

echo.
echo ================================
echo   업로드 완료!
echo   https://github.com/HanaBean/CompanyChat
echo ================================
pause