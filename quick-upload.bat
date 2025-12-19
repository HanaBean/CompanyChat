@echo off
echo GitHub 빠른 업로드 중...

git add .
git commit -m "자동 업데이트: %date% %time%"
git push origin main

echo 업로드 완료!
echo https://github.com/HanaBean/CompanyChat
pause