@echo off
echo === BY HOOK - GitHub Push ===
cd /d "C:\Users\Administrator\REPO"
echo.
echo [1] Dosyalar ekleniyor...
git add byhook.html byhook.webmanifest byhook_icon.svg byhook_news.js byhook_market.js byhook_robots.js start_server.py start_byhook.bat CLAUDE.md .gitignore
git rm --cached telegram_config.json 2>nul
echo.
echo [2] Commit...
git commit -m "By Hook guncelleme - %date% %time%"
echo.
echo [3] GitHub'a gonderiliyor (serezlio/byhook)...
git push origin main
echo.
echo === TAMAMLANDI ===
echo iPhone'dan erisim: https://serezlio.github.io/byhook/byhook.html
echo.
pause
