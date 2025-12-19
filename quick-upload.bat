@echo off
chcp 65001 >nul
echo GitHub Quick Upload...

git add .
git commit -m "Auto update: %date% %time%"
git push origin main

echo Upload Complete!
echo https://github.com/HanaBean/CompanyChat
pause