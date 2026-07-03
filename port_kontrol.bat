@echo off
echo === PORT 9222 KONTROL ===
netstat -ano | findstr :9222
echo.
echo === CHROME ISLEMLERI ===
tasklist | findstr /i "chrome"
echo.
pause
